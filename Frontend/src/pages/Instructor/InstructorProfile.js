import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import InstructorHeader from '../../components/InstructorHeader';
import '../../styles/InstructorProfile.css'
function InstructorProfile() {
  const user = useSelector(selectUser);
  
  return (
    <div className="instructor-profile">
      <InstructorHeader />
      
      <div className="profile-container">
        <h1>Instructor Profile</h1>
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h2>{user?.name}</h2>
              <p>{user?.email}</p>
              <span className="profile-role">Instructor</span>
            </div>
          </div>
          
          <div className="profile-details">
            <div className="details-section">
              <h3>Personal Information</h3>
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{user?.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{user?.email}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Role:</span>
                <span className="detail-value">{user?.role}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Member Since:</span>
                <span className="detail-value">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="details-section">
              <h3>Instructor Details</h3>
              <div className="detail-item">
                <span className="detail-label">Total Courses:</span>
                <span className="detail-value">{user?.courseCount || 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Students:</span>
                <span className="detail-value">{user?.studentCount || 0}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Average Rating:</span>
                <span className="detail-value">{user?.averageRating || 'No ratings yet'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorProfile;