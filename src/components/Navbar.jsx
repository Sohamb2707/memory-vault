import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "../images/MVLogo.jpg";
import { auth } from '../firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/signin');
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="p-3 shadow-md header">
      <div className="flex justify-between items-center container mx-auto">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <div className="logo w-12 h-12">
            <img src={Logo} alt="logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <div className="website-name">
            <p className="text-xl font-semibold">Memory Vault</p>
          </div>
        </div>

        {/* Right Section for Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <ul className="flex space-x-6">
            <li className="cursor-pointer hover:underline" onClick={() => handleNavigate('/')}>Home</li>
            <li className="cursor-pointer hover:underline" onClick={() => handleNavigate('/my-capsules')}>Capsules</li>
            <li className="cursor-pointer hover:underline" onClick={() => handleNavigate('/public-capsules')} >Public Vault</li>
            <li className="cursor-pointer hover:underline" onClick={() => handleNavigate('/faqs')}>FAQS</li>
          </ul>
          <div className="space-x-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md"
                style={{ backgroundColor: 'var(--cta-color)', color: 'white' }}
              >
                Log Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-3 py-2 btn-cta"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => navigate("/signin")}
                  className="px-3 py-2 btn-cta"
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={handleMobileMenuToggle} className="text-white">
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden mt-4 p-4 rounded-lg shadow-md"
          style={{
            backgroundColor: 'var(--primary-accent)',
            color: 'var(--bg-color)',
          }}
        >
          <ul className="space-y-4 text-lg font-medium">
            <li onClick={() => handleNavigate('/')} className="cursor-pointer">🏠 Home</li>
            <li onClick={() => handleNavigate('/my-capsules')} className="cursor-pointer">🧳 Capsules</li>
            <li onClick={() => handleNavigate('/public-capsules')} className="cursor-pointer">🌐 Public Vault</li>
            <li onClick={() => handleNavigate('/faqs')} className="cursor-pointer">❓ FAQS</li>
            {user ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md"
                  style={{ backgroundColor: 'var(--cta-color)', color: 'white' }}
                >
                  🔓 Log Out
                </button>
              </li>
            ) : (
              <>
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-3 py-2 btn-cta"
                  >
                    ✍️ Sign Up
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate("/signin")}
                    className="px-3 py-2 btn-cta"
                  >
                    🔐 Sign In
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}

    </div>
  );
};

export default Navbar;
