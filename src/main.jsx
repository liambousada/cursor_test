import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChoreProvider } from './context/ChoreContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChoreProvider>
      <App />
    </ChoreProvider>
  </React.StrictMode>,
)
