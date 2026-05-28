'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';

// 1. Firebase Initialization
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

declare global { interface Window { recaptchaVerifier: any; confirmationResult: ConfirmationResult; } }

export default function SignupPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 2. Initialize Firebase's built-in Recaptcha without the manual Enterprise sitekey
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      'size': 'invisible',
    });
  }, []);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      window.confirmationResult = confirmation;
      setStep(2);
    } catch (err: any) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await window.confirmationResult.confirm(otpCode);
      router.push('/dashboard');
    } catch (err: any) {
      setError('Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* 3. Container required by Firebase */}
      <div id="recaptcha-container"></div>
      
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      {step === 1 ? (
        <form onSubmit={handleRequestOTP} className="space-y-4">
          <input 
            type="tel" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            placeholder="+254XXXXXXXXX" 
            required 
            className="w-full border p-2 text-black"
          />
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-2">
            {loading ? 'Sending...' : 'Request Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <input 
            type="text" 
            value={otpCode} 
            onChange={(e) => setOtpCode(e.target.value)} 
            placeholder="000000" 
            required 
            className="w-full border p-2 text-black"
          />
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-2">
            {loading ? 'Verifying...' : 'Verify & Register'}
          </button>
        </form>
      )}
    </div>
  );
}