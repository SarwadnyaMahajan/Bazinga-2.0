import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Dashboard from "@/pages/Dashboard";
import TestLoader from "@/pages/TestLoader";
import TestResult from "@/pages/TestResult";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/test-loader" element={<TestLoader />} />
        <Route path="/test-result" element={<TestResult />} />
      </Routes>
    </Router>
  );
}

export default App;
