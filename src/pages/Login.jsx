import React, { useState } from 'react'
import { supabase } from '../supabase/client'
import { useNavigate } from 'react-router-dom'

export default function Login() {

  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      })
      
      if (error) {
        setError(error.message)
        setSuccess(false)
      } else {
        setSuccess(true)
        console.log('Login successful:', data)
        navigate("/dashboard")
        // Optionally redirect user or update app state
        // Example: window.location.href = '/dashboard'
      }
    } catch (error) {
      setError('An unexpected error occurred')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-50 p-4'>
      <div className='w-full max-w-md'>
        <form 
          className='bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-6'
          onSubmit={handleSubmit}
        >
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-800'>Welcome Back</h1>
            <p className='text-gray-600 mt-2'>Sign in to your account</p>
          </div>

          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
              {error}
            </div>
          )}

          {success && (
            <div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm'>
              Login successful! Redirecting...
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
                Email Address
              </label>
              <input
                id='email'
                type="email"
                name='email'
                value={email}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
                placeholder='youremail@example.com'
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            
            <div>
              <div className='flex items-center justify-between mb-1'>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                  Password
                </label>
                <a 
                  href="/forgot-password" 
                  className='text-sm text-blue-600 hover:text-blue-800 hover:underline'
                >
                  Forgot password?
                </a>
              </div>
              <input
                id='password'
                type="password"
                name='password'
                value={password}
                required
                minLength={6}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition'
                placeholder='Enter your password'
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
              loading 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {loading ? (
              <span className='flex items-center justify-center'>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>

          <div className='text-center text-sm text-gray-600'>
            <p>
              Don't have an account?{' '}
              <a 
                href="/signup" 
                className='font-medium text-blue-600 hover:text-blue-800 hover:underline'
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}