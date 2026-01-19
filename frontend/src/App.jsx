import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Todos from "./pages/Todos";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showSignup, setShowSignup] = useState(false);

  if (isLoggedIn) return <Todos />;

  return showSignup ? (
    <Signup onSwitchToLogin={() => setShowSignup(false)}  onLoginSuccess={() => setIsLoggedIn(true)} />
  ) : (
    <Login
      onLoginSuccess={() => setIsLoggedIn(true)}
      onSwitchToSignup={() => setShowSignup(true)}
    />
  );
}

export default App;
