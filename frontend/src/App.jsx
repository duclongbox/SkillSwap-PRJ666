import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Skills from './pages/Skills'
import ServiceDetail from './pages/ServiceDetail';
import CreateSkill from './pages/CreateSkill';
import Connections from './pages/Connection';
import Profile from './pages/Profile';
import ChatPage from './pages/Chat';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/skills" element={<Skills/>}/>
            
            {/* Profile Route */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            
            {/* Connection Routes */}
            <Route
              path="/connections"
              element={
                <ProtectedRoute>
                  <Connections />
                </ProtectedRoute>
              }
            />
            
            {/* Other protected routes */}
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

            <Route
              path="/chat/:userId?"
              element={
                <ProtectedRoute>
                  <ChatPage />
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
