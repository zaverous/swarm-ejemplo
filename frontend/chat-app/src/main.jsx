import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '/home/adrian-cimsi/CIMSI/frontend/chat-app/src/App.jsx'
import '/home/adrian-cimsi/CIMSI/frontend/chat-app/src/index.css'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
