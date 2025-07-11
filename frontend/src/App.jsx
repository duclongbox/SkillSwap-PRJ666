import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ServiceDetail from './pages/ServiceDetail'; 
import CreateSkill from './pages/CreateSkill'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/*route for CreateSkill */}
            <Route
              path="/create-skill"
              element={
                <ProtectedRoute>
                  <CreateSkill />
                </ProtectedRoute>
              }
            />

            <Route
              path="/service/:id"
              element={
                <ProtectedRoute>
                  <ServiceDetail />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
