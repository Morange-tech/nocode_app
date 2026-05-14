'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-xl">
        <h1 className="text-xl font-bold mb-4">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border p-2 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white p-2 rounded"
          onClick={() => console.log('send reset email')}
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
}