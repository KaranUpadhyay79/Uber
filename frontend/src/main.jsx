// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'
// import UserContext from './context/userContext.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//    <UserContext>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//    </UserContext>
//   </StrictMode>,
// )


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './context/UserContext.jsx'
import CaptainContext from './context/CaptainContext.jsx'
import SocketProvider from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <SocketProvider>
      <CaptainContext>
      <UserContext>
        <App />
      </UserContext>
      </CaptainContext>
     </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
)
