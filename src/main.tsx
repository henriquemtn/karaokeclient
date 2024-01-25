import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RouterManager from './routes/router'
import { Toaster } from 'react-hot-toast'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <RouterManager />
  </React.StrictMode>,
)
