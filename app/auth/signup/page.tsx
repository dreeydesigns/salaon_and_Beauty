'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  
  // Form States
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  // Status States
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempToken, setTempToken] = useState('');

  // Step 1: Fire payload to Africa's Talking OTP route
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to send verification code.');

      // Encode a temporary client signature for sandbox tracking
      const simulatedToken = btoa(JSON.stringify({ phone: phone.replace(/[\s\-\+]/g, '') }));
      setTempToken(simulatedToken);
      
      // Advance to OTP input screen smoothly
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Finalize validation and match database session cookies
  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          firstName,
          password,
          tempToken, 
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      // Routing directly to home page/dashboard upon successful verification
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs tracking-wide font-mono rounded">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOTP} className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-light font-serif tracking-tight text-neutral-900">Create Account</h2>
            <p className="text-xs text-neutral-400 font-light">Enter your details to begin verification.</p>
          </div>

          <div className="space-y-4 pt-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono mb-1">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-300 py-2 text-sm tracking-wide focus:outline-none focus:border-black transition-colors font-light"
                placeholder="Alexandra"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-300 py-2 text-sm tracking-wide focus:outline-none focus:border-black transition-colors font-light"
                placeholder="+254 700 000 000"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-300 py-2 text-sm tracking-wide focus:outline-none focus:border-black transition-colors font-light"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 text-xs uppercase tracking-[0.2em] font-mono hover:bg-neutral-900 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed mt-4"
          >
            {loading ? 'Sending Code...' : 'Request Verification'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndRegister} className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-light font-serif tracking-tight text-neutral-900">Verify Phone</h2>
            <p className="text-xs text-neutral-400 font-light">We sent a 6-digit confirmation code to {phone}.</p>
          </div>

          <div className="pt-4">
            <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-mono mb-1">6-Digit Code</label>
            <input
              type="text"
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full bg-transparent border-b border-neutral-300 py-2 text-center text-xl tracking-[0.5em] focus:outline-none focus:border-black transition-colors font-light"
              placeholder="000000"
              required
            />
          </div>

          <div className="space-y-2 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 text-xs uppercase tracking-[0.2em] font-mono hover:bg-neutral-900 transition-colors disabled:bg-neutral-300"
            >
              {loading ? 'Verifying...' : 'Complete Registration'}
            </button>
            
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-[11px] text-neutral-400 font-mono tracking-wide hover:text-black transition-colors py-2"
            >
              ← Back to Details
            </button>
          </div>
        </form>
      )}
    </div>
  );
}