// import React from 'react'
// import { useState } from 'react';
// import { Link , useNavigate} from 'react-router-dom'
// import axios from 'axios';
// import {UserDataContext} from '../context/userContext';

// const UserSignup = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [userData, setUserData] = useState({});

//   const navigate = useNavigate();

//   const {user , setUser} = React.useContext(UserDataContext);

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     const newUser = {
//       fullname:{
//       firstname: firstName,
//       lastname: lastName,
//       },
//       email: email,
//       password: password
//     }

//     const responce = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

//     if(responce.status === 201){
//       const data = responce.data;

//       setUser(data.user);
//       navigate('/home');
//     }

//     setEmail('');
//     setFirstName('');
//     setLastName('');
//     setPassword('');
//   }

//   return (
//     <div className='p-7 h-screen flex flex-col justify-between '>
//       <div>
//        <img
//           className='w-16 mb-10'
//           src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
//           alt='Uber Logo'
//         /> 
//       <form onSubmit={(e)=>{submitHandler(e)}}>

//        <h3 className='text-base font-medium mb-2'>What's your name</h3>
//        <div className='flex gap-4 mb-6'>
//            <input 
//              required 
//              className='bg-[#eeeeee] w-1/2  rounded px-4 py-2 border text-base placeholder:text-sm'
//              type='text' 
//              placeholder='first name'
//              value={firstName}
//              onChange={(e)=>{ setFirstName(e.target.value) }}
//           />
//            <input
//              required 
//              className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-base placeholder:text-sm'
//              type='text' 
//              placeholder='last name'
//              value={lastName}
//              onChange={(e)=>{ setLastName(e.target.value) }}
//            />  
//         </div>   
//           <h3 className='text-base font-medium mb-2'>What's your email</h3>
//           <input 
//              required 
//              className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
//              type='email' 
//              placeholder='email@example.com'
//              value={email}
//              onChange={(e) => setEmail(e.target.value)}
//           />

//           <h3 className='text-base font-medium mb-2'>Enter Password</h3>

//           <input 
//              className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'

//              required type='password'
//              placeholder='password'/>
//              value={password}
//              onChange={(e) => setPassword(e.target.value)}
//           <button 
//             className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full text-lg placeholder:text-base'
//           >Create account</button>

//           <p className='text-center'>Already have a account? <Link to='/login' className='text-blue-600'>Login here</Link></p>
//       </form>
//       </div>
//       <div>
//         <p className='text-[10px] leading-tight'>By proceeding, you consent to get calls, WhatsApp or SMS messages , including by automated means , from Uber and its affiliates to the number provided.</p>
//       </div>
//     </div>
//   )
// }

// export default UserSignup




import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/userContext';

const UserSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();
 const [user, setUser] = useContext(UserDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    // Optional password length validation before sending to server
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    const newUser = {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      );

      if (response.status === 201) {
        const data = response.data;
        setUser(data.user);
        localStorage.setItem('token', data.token);
        navigate('/home');
      }

      // Reset form
      setEmail('');
      setFirstName('');
      setLastName('');
      setPassword('');
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      alert(error.response?.data?.errors?.[0]?.msg || "Signup failed");
    }
  };

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        <img
          className='w-16 mb-10'
          src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png'
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
            required
            className='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
            type='password'
            placeholder='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'
          >
            Create account
          </button>

          <p className='text-center'>
            Already have an account?{' '}
            <Link to='/login' className='text-blue-600'>
              Login here
            </Link>
          </p>
        </form>
      </div>

      <div>
        <p className='text-[10px] leading-tight'>
          By proceeding, you consent to get calls, WhatsApp or SMS messages,
          including by automated means, from Uber and its affiliates to the
          number provided.
        </p>
      </div>
    </div>
  );
};

export default UserSignup;
