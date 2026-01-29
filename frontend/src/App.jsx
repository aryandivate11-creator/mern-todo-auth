// import { useState } from "react";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Todos from "./pages/Todos";

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
//   const [showSignup, setShowSignup] = useState(false);

//   if (isLoggedIn) return <Todos />;

//   return showSignup ? (
//     <Signup onSwitchToLogin={() => setShowSignup(false)}  onLoginSuccess={() => setIsLoggedIn(true)} />
//   ) : (
//     <Login
//       onLoginSuccess={() => setIsLoggedIn(true)}
//       onSwitchToSignup={() => setShowSignup(true)}
//     />
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Todos from "./pages/Todos";
import Profile from "./pages/Profile";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("accessToken")
  );

  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn) return <Navigate to="/login" />;
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />}
        />

        <Route
          path="/signup"
          element={<Signup onLoginSuccess={() => setIsLoggedIn(true)} />}
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Todos />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
