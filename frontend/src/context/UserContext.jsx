
// import React , {createContext , useState} from 'react'

// export const UserDataContext = createContext();

// const UserContext = ({children}) => {
//     const [user , setUser] =  useState({
//         email:'',
//         fullname:{
//             firstname: '',
//             lastname: ''
//         }
//     })
//   return (
//     <div>
//         <UserDataContext.Provider value={[user , setUser]}>
//            {children}
//         </UserDataContext.Provider>
//     </div>
//   )
// }

// export default UserContext

import React , {createContext , useState} from 'react'

export const UserDataContext = createContext();

const UserContext = ({children}) => {
    const [user , setUser] =  useState({
        email:'',
        fullname:{
            firstname: '',
            lastname: ''
        }
    })
  return (
    <UserDataContext.Provider value={{ user , setUser }}>
       {children}
    </UserDataContext.Provider>
  )
}

export default UserContext
