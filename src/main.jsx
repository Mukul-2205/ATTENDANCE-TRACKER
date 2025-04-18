import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Landing from './components/Landing/Landing.jsx'
import Protected from './components/Protected.jsx'
import Login from './components/Login/Login.jsx'
import Signup from './components/Signup/Signup.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'


const router=createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children:[
      {
        path:"/",
        element: <Landing/>
      },

      {
        path:"/login",
        element: (
                <Protected authentication={false}>
                  <Login/>
                </Protected>
        )
      },

      {
        path:"/signup",
        element:(
          <Protected authentication={false}>
            <Signup/>
          </Protected>
        )
      },

      {
        path:"/dashboard",
        element:(
          <Protected authentication={true}>
            <Dashboard/>
          </Protected>
        )
      }
    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>,
  </StrictMode>
)
