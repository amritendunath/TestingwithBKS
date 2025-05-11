import Auth from "./Components/Auth";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Get";



const App = () => {

  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/dashboard" exact element={<Home/>}/>
          <Route path="/login" exact element={<Auth/>} />
          <Route path="/signUp" exact element={<Auth/>} />
        </Routes>
      </Router>
    </div>

  );
}
const Root = () => {
  // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");
  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/login" />
  );
};

export default App;