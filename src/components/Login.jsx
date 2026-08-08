import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input, Logo } from './index';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (data) => {
    setError('');
    try {
      await login(data);
      navigate('/');
    } catch (err) {
      setError(err?.message || 'Failed to sign in. Please check your credentials.');
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
          Welcome Back
        </h2>
        <p className="text-center text-sm text-[#5a4138]">
          Don&apos;t have an account?&nbsp;
          <Link
            to="/signup"
            className="font-semibold text-[#ea580c] hover:underline transition-all duration-200"
          >
            Sign Up
          </Link>
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs font-semibold text-center font-['JetBrains_Mono',monospace]">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(handleLogin)} className="mt-8">
          <div className="space-y-5">
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
              placeholder="••••••••"
              type="password"
              {...register('password', { required: true })}
            />

            <button
              type="submit"
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold rounded-lg px-6 py-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer text-sm"
            >
              Sign In to Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;