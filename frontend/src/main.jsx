import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./store/store";


createRoot(document.getElementById('root')).render(
 <GoogleOAuthProvider clientId="865764799747-jsvpmu1ume2r57eq0835lsr0v7nna48a.apps.googleusercontent.com">
  <Provider store = {store}>
    <App />
  </Provider>
</GoogleOAuthProvider>

)
