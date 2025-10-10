// import React, { useContext, useEffect } from 'react';
// import { UserDataContext } from '../context/UserContext';
// import { useNavigate } from 'react-router-dom';

// const UserProtectWrapper = ({ children }) => {
//   const navigate = useNavigate();
//   const [user] = useContext(UserDataContext); // if needed

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       navigate('/login');
//     }
//   }, [navigate]);

//   return <>{children}</>;
// };

// export default UserProtectWrapper;

// import React, { useContext, useEffect, useState } from 'react'
// import { UserDataContext } from '../context/UserContext'
// import { useNavigate } from 'react-router-dom'
// import axios from 'axios'

// const UserProtectWrapper = ({
//     children
// }) => {
//     const token = localStorage.getItem('token')
//     const navigate = useNavigate()
//     const { user, setUser } = useContext(UserDataContext)
//     const [ isLoading, setIsLoading ] = useState(true)

//     useEffect(() => {
//         if (!token) {
//             navigate('/login')
//         }

//         axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
//             headers: {
//                 Authorization: `Bearer ${token}`
//             }
//         }).then(response => {
//             if (response.status === 200) {
//                 setUser(response.data)
//                 setIsLoading(false)
//             }
//         })
//             .catch(err => {
//                 console.log(err)
//                 localStorage.removeItem('token')
//                 navigate('/login')
//             })
//     }, [ token ])

//     if (isLoading) {
//         return (
//             <div>Loading...</div>
//         )
//     }

//     return (
//         <>
//             {children}
//         </>
//     )
// }

// export default UserProtectWrapper


import React, { useContext, useEffect, useState } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const UserProtectWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const { user, setUser } = useContext(UserDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!token) {
            navigate('/login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 200) {
                setUser(response.data)
                setIsLoading(false)
            }
        })
            .catch(err => {
                console.log(err)
                localStorage.removeItem('token')
                navigate('/login')
            })
    }, [ token ])

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper