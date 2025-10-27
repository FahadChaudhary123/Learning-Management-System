import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../redux/slices/authSlice';
import { useForm } from 'react-hook-form';
import InstructorHeader from '../../components/InstructorHeader';
import "../../styles/InstructorSettings.css"
function InstructorSettings() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      expertise: user?.expertise || ''
    }
  });

  const onSubmit = (data) => {
    console.log('Profile update data:', data);
    // TODO: Implement update profile action
    // dispatch(updateProfileThunk(data));
    alert('Profile updated successfully');
  };

  return (
    <div className="instructor-settings">
      <InstructorHeader />
      
      <div className="settings-container">
        <h1>Instructor Settings</h1>
        
        <div className="settings-layout">
          {/* Tabs */}
          <div className="settings-tabs">
            <button 
              className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile Settings
            </button>
            <button 
              className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              Account Settings
            </button>
            <button 
              className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              Notifications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              Privacy & Security
            </button>
          </div>
          
          {/* Content */}
          <div className="settings-content">
            {activeTab === 'profile' && (
              <div className="tab-content">
                <h2>Profile Settings</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      {...register("name", { required: "Name is required" })}
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name.message}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                      className={errors.email ? 'error' : ''}
                      disabled
                    />
                    {errors.email && <span className="error-text">{errors.email.message}</span>}
                    <small>Email cannot be changed</small>
                  </div>
                  
                  <div className="form-group">
                    <label>Biography</label>
                    <textarea 
                      {...register("bio")}
                      rows="4"
                      placeholder="Tell students about yourself and your teaching experience..."
                    ></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label>Areas of Expertise</label>
                    <input 
                      type="text" 
                      {...register("expertise")}
                      placeholder="e.g., Web Development, Machine Learning, Data Science"
                    />
                    <small>Separate topics with commas</small>
                  </div>
                  
                  <button type="submit" className="btn-primary">Save Changes</button>
                </form>
              </div>
            )}
            
            {activeTab === 'account' && (
              <div className="tab-content">
                <h2>Account Settings</h2>
                <p>Manage your account settings, password and connected services.</p>
                
                <div className="section">
                  <h3>Change Password</h3>
                  <form>
                    <div className="form-group">
                      <label>Current Password</label>
                      <input type="password" placeholder="Enter current password" />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <input type="password" placeholder="Confirm new password" />
                    </div>
                    <button type="button" className="btn-primary">Update Password</button>
                  </form>
                </div>
              </div>
            )}
            
            {/* Other tabs */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstructorSettings;