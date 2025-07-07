import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={ <ProtectedRoute>
      <Home />
    </ProtectedRoute> } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
              {/* add more routes to your pages here  */}
          
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
