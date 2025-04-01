import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './styles/App.css'
import Client from './pages/Client'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Profile from './pages/Profile'

const router = createBrowserRouter(
  [
    { path: '/', element: < SignUp /> },
    { path: 'login', element: < Login /> },
    { path: 'client', element: < Client /> },
    { path: '/profile', element: < Profile /> }
  ]
);

function App() {

  return (
    <>
      {/* < Client /> */}
      {/* < Login /> */}
      {/* < SignUp /> */}

      < RouterProvider router={router} />
    </>
  )
};

export default App;
