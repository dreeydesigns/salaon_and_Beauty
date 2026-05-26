'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  
  const [step, setStep] = useState<1 | 2>(1);
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempToken, setTempToken] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Clean phone input to pure numbers only
    const cleanPhone = phone.replace(/\D/g, '');
    
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send verification code.');

      setTempToken(btoa(JSON.stringify({ phone: cleanPhone })));
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.replace(/\D/g, ''), firstName, password, tempToken }),
      });
      if (!res.ok) throw new Error('Registration failed.');
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs rounded">{error}</div>}

      {step === 1 ? (
        <form onSubmit={handleRequestOTP} className="space-y-6">
          <h2 className="text-2xl font-light font-serif">Create Account</h2>
          
          <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full border-b py-2 text-sm" required />
          
          <input 
            type="tel" 
            maxLength={10} 
            placeholder="07XXXXXXXX" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
            className="w-full border-b py-2 text-sm" 
            required 
          />
          
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-b py-2 text-sm" required />
          
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3">
            {loading ? 'Sending...' : 'Request Verification'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndRegister} className="space-y-6">
          <h2 className="text-2xl font-light font-serif">Verify Phone</h2>
          <p className="text-xs text-neutral-400">Code sent to: {phone}</p>
          <input type="text" maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} className="w-full border-b py-2 text-center text-xl tracking-[0.5em]" placeholder="000000" required />
          <button type="submit" disabled={loading} className="w-full bg-black text-white py-3">Complete Registration</button>
        </form>
      )}
    </div>
  );
}