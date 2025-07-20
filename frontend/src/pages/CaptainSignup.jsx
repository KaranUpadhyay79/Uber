import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainSignup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log({
      firstName,
      lastName,
      email,
      password
    });
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img
          className='w-20 mb-2'
          src="https://www.svgrepo.com/show/505031/uber-driver.svg"
          alt='Uber Logo'
        />
        <form onSubmit={submitHandler}>
          <h3 className='text-base font-medium mb-2'>What's your name</h3>
          <div className='flex gap-4 mb-6'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm'
              type='text'
              placeholder='first name'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm'
              type='text'
              placeholder='last name'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <h3 className='text-base font-medium mb-2'>What's your email</h3>
          <input
            required
            className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type='email'
            placeholder='email@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h3 className='text-base font-medium mb-2'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            required
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'
            type='submit'
          >
            Sign Up
          </button>

          <p className='text-center'>
            Already have an account?{' '}
            <Link to='/captain-login' className='text-blue-600'>
              Login here
            </Link>
          </p>
        </form>
      </div>
      <div>
        <p className='text-[10px] leading-tight'>
          This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and Terms of Service apply.
        </p>
      </div>
    </div>
  );
};

export default CaptainSignup;
