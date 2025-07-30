import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CaptainSignup = () => {
const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});

  const [vehicleColor, setVehicleColor] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleCapacity, setVehicleCapacity] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const {captain , setCaptain} = React.useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();
    const captainData= {
      fullname: {
        firstname: firstName,
        lastname: lastName,
      },
      email: email,
      password: password,
      vehicle:{
        color: vehicleColor,
        plate: vehiclePlate,
        capacity: vehicleCapacity,
        vehicleType: vehicleType
      }
    };

    const responce = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData);
   
    if (responce.status === 201) {
      const data = responce.data;
      setCaptain(data.captain);
      localStorage.setItem('token', data.token);
      navigate('/captain-home');
    }

    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setVehicleColor('');
    setVehiclePlate('');
    setVehicleCapacity('');
    setVehicleType('');
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
          <h3 className='text-base font-medium mb-2'>What's our Captain's name</h3>
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
          <h3 className='text-base font-medium mb-2'>What's our Captain's email</h3>
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
            <h3 className="text-lg font-medium mb-2">Vehicle Information</h3>
      <div className="flex gap-4 mb-7">
        <input
          required
          className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-gray-500"
          type="text"
          placeholder="Vehicle Color"
          value={vehicleColor}
          onChange={(e) => setVehicleColor(e.target.value)}
        />
        <input
          required
          className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-gray-500"
          type="text"
          placeholder="Vehicle Plate"
          value={vehiclePlate}
          onChange={(e) => setVehiclePlate(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <input
          required
          className="bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-gray-500"
          type="number"
          placeholder="Vehicle Capacity"
          value={vehicleCapacity}
          onChange={(e) => setVehicleCapacity(e.target.value)}
        />
        <select
          required
          className="bg-[#eeeeee] w-1/2 rounded-lg  px-4 py-2 border text-lg text-gray-700"
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="">Select Vehicle</option>
          <option value="car">Car</option>
          <option value="Auto">Auto</option>
          <option value="moto">Moto</option>
        </select>
      </div>

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2 w-full text-lg'
            type='submit'
          >
            Create Captain Account
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


