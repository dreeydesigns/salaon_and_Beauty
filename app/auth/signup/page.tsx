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

    const cleanPhone = phone.replace(/\D/g, '');
    
    setLoading(true);
    setError(null);

    // DIAGNOSTIC: Log the URL to the browser console
    console.log("Attempting to fetch:", window.location.origin + '/api/auth/otp');

    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification code.');
      }

      setTempToken(btoa(JSON.stringify({ phone: cleanPhone })));
      setStep(2);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: phone.replace(/\D/g, ''), 
          firstName, 
          password, 
          tempToken 
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed.');
      }
      
      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-xs font-mono rounded">
          {error}
        </div>
      )}

      {step === 1 ? (
        <form onSubmit={handleRequestOTP} className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif">Create Account</h2>
          </div>
          
          <input 
            type="text" 
            placeholder="First Name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            className="w-full border-b py-2 text-sm focus:outline-none focus:border-black" 
            required 
          />
          
          <input 
            type="tel" 
            maxLength={10} 
            placeholder="07XXXXXXXX" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
            className="w-full border-b py-2 text-sm focus:outline-none focus:border-black" 
            required 
          />
          
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full border-b py-2 text-sm focus:outline-none focus:border-black" 
            required 
          />
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 disabled:bg-neutral-300"
          >
            {loading ? 'Sending...' : 'Request Verification'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyAndRegister} className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-serif">Verify Phone</h2>
            <p className="text-xs text-neutral-400">Code sent to: 0{phone.slice(-9)}</p>
          </div>
          
          <input 
            type="text" 
            maxLength={6} 
            value={otpCode} 
            onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} 
            className="w-full border-b py-2 text-center text-xl tracking-[0.5em] focus:outline-none focus:border-black" 
            placeholder="000000" 
            required 
          />
          
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black text-white py-3 text-xs uppercase tracking-widest"
          >
            {loading ? 'Verifying...' : 'Complete Registration'}
          </button>
        </form>
      )}
    </div>
  );
}