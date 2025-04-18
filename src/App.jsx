import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import ProductManagement from './components/ProductManagement';
import ProductList from './components/ProductList';
import ProcessManager from './components/ProcessManager';
import ProcessDashboard from './components/ProcessDashboard';
import UserTable from './components/UserTable';
import Login from './components/Login';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import CategoryManagement from './components/CategoryManagement';

// Animation variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3
};

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleSignupSuccess = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Motion wrapper component
  const MotionWrapper = ({ children }) => (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated && <Navbar onLogout={handleLogout} />}
      <div className={isAuthenticated ? "pt- px-4" : "px-4"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {isAuthenticated ? (
              // Authenticated routes
              <>
                <Route path="/" element={<MotionWrapper><ProductManagement /></MotionWrapper>} />
                <Route path="/product-management" element={<MotionWrapper><ProductManagement /></MotionWrapper>} />
                <Route path="/product-list" element={<MotionWrapper><ProductList /></MotionWrapper>} />
                <Route path="/process-management" element={<MotionWrapper><ProcessManager /></MotionWrapper>} />
                <Route path="/dashboard" element={<MotionWrapper><ProcessDashboard /></MotionWrapper>} />
                <Route path="/users" element={<MotionWrapper><UserTable /></MotionWrapper>} />
                <Route path="/add-category" element={<MotionWrapper><CategoryManagement /></MotionWrapper>} />
                <Route path="*" element={<MotionWrapper><ProductManagement /></MotionWrapper>} />
              </>
            ) : (
              // Unauthenticated routes
              <>
                <Route path="/login" element={
                  <MotionWrapper>
                    <Login
                      onLoginSuccess={handleLoginSuccess}
                      onSwitchToSignup={() => navigate('/signup')}
                      onForgotPassword={() => navigate('/forgot-password')}
                    />
                  </MotionWrapper>
                } />
                <Route path="/signup" element={
                  <MotionWrapper>
                    <Signup
                      onSwitchToLogin={() => navigate('/login')}
                      onSignupSuccess={handleSignupSuccess}
                    />
                  </MotionWrapper>
                } />
                <Route path="/forgot-password" element={
                  <MotionWrapper>
                    <ForgotPassword
                      onBackToLogin={() => navigate('/login')}
                      onResetPassword={(data) => console.log('Reset password for:', data.email)}
                    />
                  </MotionWrapper>
                } />
                <Route path="*" element={
                  <MotionWrapper>
                    <Login onLoginSuccess={handleLoginSuccess} />
                  </MotionWrapper>
                } />
              </>
            )}
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;