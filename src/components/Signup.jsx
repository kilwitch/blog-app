import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Logo } from './index';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const { register, handleSubmit } = useForm();

  const create = async (data) => {
    setError('');
    try {
      await signup(data);
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Failed to create account. Please try again.');
    }
  };

  return (
    <div className="w-full bg-[#f8f9ff] min-h-[calc(100vh-160px)] flex items-center justify-center py-12 px-4 font-['Geist',sans-serif]">
      <div className="mx-auto w-full max-w-md bg-white border border-[#e1e2e9] rounded-2xl p-8 md:p-10 shadow-sm">
        {/* Brand Logo Header */}
        <div className="mb-6 flex justify-center">
          <Link to="/">
            <Logo width="150px" />
          </Link>
        </div>

        {/* Headline */}
        <h2 className="text-center text-3xl font-bold text-[#191c21] tracking-tight mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-sm text-[#5a4138]">
          Already have an account?&nbsp;
          <Link
            to="/login"
            className="font-semibold text-[#ea580c] hover:underline transition-all duration-200"
          >
            Sign In
          </Link>
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-semibold text-center font-['JetBrains_Mono',monospace]">
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit(create)} className="mt-8">
          <div className="space-y-5">
            <Input
              label="Full Name"
              placeholder="Wahid"
              {...register('name', {
                required: true,
              })}
            />

            <Input
              label="Email Address"
              placeholder="name@company.com"
              type="email"
              {...register('email', {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                    'Email address must be a valid address',
                },
              })}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              {...register('password', {
                required: true,
                validate: {
                  matchPatern: (value) =>
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value) ||
                    'Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character',
                },
              })}
            />

            <button
              type="submit"
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded-lg px-6 py-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-sm"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;