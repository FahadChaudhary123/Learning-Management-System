//reuable ui components
import React from 'react';
import '../styles/InstructorFooter.css';

const InstructorFooter = () => {
  return (
    <footer className="instructor-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon">🎓</span>
              <span className="logo-text">LearnPro</span>
            </div>
            <p className="footer-tagline">
              Empowering instructors to create transformative learning experiences
            </p>
            <div className="footer-social">
              <div className="social-link" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </div>
              <div className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div className="social-link" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <div className="social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="footer-info-sections">
            <div className="info-column">
              <h4 className="footer-title">Teaching Platform</h4>
              <div className="footer-text">
                <p>Create and publish online courses</p>
                <p>Reach students worldwide</p>
                <p>Earn revenue sharing</p>
                <p>Professional development</p>
                <p>Quality standards maintained</p>
              </div>
            </div>

            <div className="info-column">
              <h4 className="footer-title">Instructor Support</h4>
              <div className="footer-text">
                <p>24/7 dedicated support</p>
                <p>Resource center access</p>
                <p>Community forums</p>
                <p>Video tutorials</p>
                <p>Best practices guide</p>
              </div>
            </div>

            <div className="info-column">
              <h4 className="footer-title">Platform Features</h4>
              <div className="footer-text">
                <p>Advanced analytics</p>
                <p>Course management tools</p>
                <p>Student engagement metrics</p>
                <p>Revenue tracking</p>
                <p>Marketing assistance</p>
              </div>
            </div>

            <div className="info-column">
              <h4 className="footer-title">Quality Standards</h4>
              <div className="footer-text">
                <p>Content quality review</p>
                <p>Student satisfaction focus</p>
                <p>Continuous improvement</p>
                <p>Industry best practices</p>
                <p>Excellence in education</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; 2025 LearnPro Instructor Platform. All rights reserved.</p>
            <p className="footer-subtext">
              Transforming education through innovative teaching solutions
            </p>
          </div>
          <div className="footer-extra">
            <div className="footer-badges">
              <span className="security-badge">🔒 Secure Platform</span>
              <span className="award-badge">🏆 Top Rated</span>
              <span className="quality-badge">⭐ Quality Certified</span>
            </div>
            <div className="footer-stats">
              <span className="stat-item">📚 10,000+ Courses</span>
              <span className="stat-item">👨‍🏫 2,500+ Instructors</span>
              <span className="stat-item">🌍 150+ Countries</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default InstructorFooter;