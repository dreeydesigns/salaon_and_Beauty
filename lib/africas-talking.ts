import AfricasTalking from 'africastalking';

/**
 * Lazily initialise the AT SDK so Joi validation only runs at request time
 * (when env vars are populated), not at build time (when they are empty).
 */
function getSmsSdk() {
  const AT = AfricasTalking({
    apiKey:   process.env.AT_API_KEY  ?? '',
    username: process.env.AT_USERNAME ?? '',
  });
  return AT.SMS;
}

/**
 * Send SMS via Africa's Talking
 */
export async function sendSMS(phoneNumber: string, message: string) {
  const sms = getSmsSdk();

  // In sandbox mode use "Sandbox"; in production use your registered short code
  // configured via AT_SENDER_ID env var (e.g. "MobileSalon")
  const from = process.env.AT_SENDER_ID ?? "Sandbox";

  try {
    const result = await sms.send({
      to: [phoneNumber],
      from,
      message,
    });

    console.log('SMS sent:', result);
    return result;
  } catch (error) {
    console.error('SMS error:', error);
    throw error;
  }
}

/**
 * Send OTP for phone verification
 */
export async function sendOTP(phoneNumber: string, otp: string) {
  const message = `Your verification code is: ${otp}. Valid for 10 minutes.`;
  return sendSMS(phoneNumber, message);
}

/**
 * Send booking confirmation SMS
 */
export async function sendBookingConfirmation(
  phoneNumber: string,
  bookingDetails: {
    serviceName: string;
    date: string;
    time: string;
    price: number;
  }
) {
  const message = `Booking Confirmed! ${bookingDetails.serviceName} on ${bookingDetails.date} at ${bookingDetails.time}. Price: Ksh ${bookingDetails.price}`;
  return sendSMS(phoneNumber, message);
}

/**
 * Send promotional/marketing SMS
 */
export async function sendPromotionalSMS(phoneNumber: string, message: string) {
  return sendSMS(phoneNumber, message);
}
