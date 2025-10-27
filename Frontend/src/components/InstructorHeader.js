import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/InstructorHeader.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from '../redux/slices/authSlice';
import { logoutThunk } from '../redux/thunks/authThunks';

function InstructorHeader() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => setShowUserMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    setShowUserMenu(false);
    navigate('/login');
  };

  const isActiveRoute = (path) => location.pathname.includes(path);

  return (
    <header className={`instructor-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="instructor-header-container">
        <div className="instructor-brand">
          <Link to="/dashboard/instructor-home" className="instructor-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">LearnPro</span>
            <span className="instructor-badge">Instructor</span>
          </Link>
        </div>

        <nav className="instructor-nav">
          <Link 
            to="/dashboard/instructor-home" 
            className={`nav-item ${isActiveRoute('instructor-home') ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dashboard
          </Link>

          <Link 
            to="/dashboard/instructor/my-courses" 
            className={`nav-item ${isActiveRoute('my-courses') ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            My Courses
          </Link>

          <Link 
            to="/dashboard/instructor/create-course" 
            className={`nav-item ${isActiveRoute('create-course') ? 'active' : ''}`}
          >
            <svg className="nav-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Create Course
          </Link>

          
        </nav>

        <div className="instructor-actions">
          <button className="action-btn notification-btn">
            <svg className="action-icon" viewBox="0 0 24 24" fill="none">
              <path d="M18 8C18 6.4 17.37 4.88 16.24 3.76C15.12 2.63 13.59 2 12 2C10.41 2 8.88 2.63 7.76 3.76C6.63 4.88 6 6.41 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z" stroke="currentColor" strokeWidth="2" />
              <path d="M13.73 21C13.55 21.3 13.3 21.55 12.99 21.73C12.69 21.9 12.35 21.99 12 21.99C11.65 21.99 11.31 21.9 11.01 21.73C10.7 21.55 10.45 21.3 10.27 21" stroke="currentColor" strokeWidth="2" />
            </svg>
            <span className="badge">3</span>
          </button>

          <button className="action-btn message-btn">
            <svg className="action-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span className="badge">5</span>
          </button>

          <div className="instructor-user-menu">
            <button 
              className={`user-avatar-btn ${showUserMenu ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowUserMenu(!showUserMenu);
              }}
            >
              <div className="user-avatar">
                {user?.name?.charAt(0).toUpperCase()}
                <span className="role-badge">I</span>
              </div>
            </button>

            {showUserMenu && (
              <div className="instructor-dropdown-menu">
                <div className="dropdown-header">
                  <div className="user-avatar-large">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user?.name}</div>
                    <div className="user-email">{user?.email}</div>
                    <div className="user-role">Instructor</div>
                  </div>
                </div>

                <div className="dropdown-section">
                  <Link to="/dashboard/instructor/profile" className="dropdown-item">Profile</Link>
                  <Link to="/dashboard/instructor/settings" className="dropdown-item">Settings</Link>
                </div>

                <div className="dropdown-section">
                  <button onClick={handleLogout} className="dropdown-item logout">
                    Log out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}

export default InstructorHeader;