/**
 * lib/phone-auth.ts
 *
 * Firebase Phone Authentication helpers.
 * All OTP logic lives here — no server routes needed.
 * Firebase delivers the SMS directly via Google infrastructure.
 *
 * Flow:
 *  1. Call setupRecaptcha(containerId) once when the sign-up/sign-in
 *     component mounts. Pass the id of a <div> in the DOM.
 *  2. Call sendOTP(phone) when the user submits their number.
 *     Firebase sends an SMS with a 6-digit code.
 *  3. Call verifyOTP(code) when the user submits the code.
 *     Returns { ok: true, uid } on success.
 */

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "./firebase-client";

// Module-level singletons — one active verification per browser session
let confirmationResult: ConfirmationResult | null = null;
let recaptchaVerifier: RecaptchaVerifier | null = null;

/**
 * Set up the invisible reCAPTCHA verifier.
 * Must be called inside useEffect (browser-only) before sendOTP.
 * Safe to call multiple times — clears the old verifier first.
 */
export function setupRecaptcha(containerId: string): void {
  if (recaptchaVerifier) {
    recaptchaVerifier.clear();
    recaptchaVerifier = null;
  }

  recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      // reCAPTCHA solved silently — nothing to do here
    },
  });
}

/**
 * Send a 6-digit OTP to the given phone number.
 * phone must be E.164 format, e.g. "+254743817931"
 */
export async function sendOTP(
  phone: string,
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!recaptchaVerifier) {
      return {
        ok: false,
        error: "Verification not ready. Refresh the page and try again.",
      };
    }

    confirmationResult = await signInWithPhoneNumber(
      auth,
      phone,
      recaptchaVerifier,
    );
    return { ok: true };
  } catch (err: unknown) {
    console.error("[Firebase] sendOTP error:", err);

    const code = (err as { code?: string })?.code ?? "";
    if (code === "auth/invalid-phone-number") {
      return { ok: false, error: "Invalid phone number. Check and try again." };
    }
    if (code === "auth/too-many-requests") {
      return { ok: false, error: "Too many attempts. Wait a few minutes and try again." };
    }
    if (code === "auth/quota-exceeded") {
      return { ok: false, error: "SMS quota exceeded. Try again later." };
    }
    if (code === "auth/captcha-check-failed") {
      // Recaptcha expired — rebuild it
      if (recaptchaVerifier) {
        recaptchaVerifier.clear();
        recaptchaVerifier = null;
      }
      return { ok: false, error: "Verification expired. Refresh and try again." };
    }
    return { ok: false, error: "Could not send code. Try again." };
  }
}

/**
 * Verify the 6-digit code the user entered.
 * Must be called after a successful sendOTP().
 * Returns { ok: true, uid } on success.
 */
export async function verifyOTP(
  code: string,
): Promise<{ ok: boolean; uid?: string; error?: string }> {
  try {
    if (!confirmationResult) {
      return {
        ok: false,
        error: "No verification in progress. Request a new code.",
      };
    }

    const result = await confirmationResult.confirm(code);
    const uid = result.user.uid;

    // Reset for next use
    confirmationResult = null;

    return { ok: true, uid };
  } catch (err: unknown) {
    console.error("[Firebase] verifyOTP error:", err);

    const errCode = (err as { code?: string })?.code ?? "";
    if (errCode === "auth/invalid-verification-code") {
      return { ok: false, error: "Incorrect code. Try again." };
    }
    if (errCode === "auth/code-expired") {
      return { ok: false, error: "Code has expired. Request a new one." };
    }
    return { ok: false, error: "Verification failed. Try again." };
  }
}
