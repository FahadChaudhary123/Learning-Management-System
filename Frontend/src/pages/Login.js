import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  loginThunk, 
  forgotPasswordThunk, 
  resetPasswordThunk 
} from "../redux/thunks/authThunks";
import { 
  selectAuthError, 
  selectAuthLoading,
  selectIsAuthenticated,
  clearError,
  setForgotPasswordStep
} from "../redux/slices/authSlice";
import { openModal, closeModal } from "../redux/slices/uiSlice";
import "../styles/Login.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const forgotPasswordModal = useSelector(state => state.ui.modals.forgotPassword);
  const { forgotPasswordStep, resetEmail } = useSelector(state => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(loginThunk(data));
    if (loginThunk.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const result = await dispatch(forgotPasswordThunk({ email }));
    if (forgotPasswordThunk.fulfilled.match(result)) {
      alert("OTP has been sent to your email.");
      dispatch(setForgotPasswordStep({ step: 2, email }));
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;
    const newPassword = e.target.newPassword.value;
    
    const result = await dispatch(resetPasswordThunk({ 
      email: resetEmail, 
      otp, 
      newPassword 
    }));
    
    if (resetPasswordThunk.fulfilled.match(result)) {
      alert("Password reset successful. You can now log in.");
      dispatch(closeModal('forgotPassword'));
      dispatch(setForgotPasswordStep({ step: 1, email: null }));
    }
  };

  return (
    <div className="login-container">
      <div className="overlay"></div>
      <div className="login-box">
        <h2>Login</h2>

        {error && <p className="error global-error">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className={errors.email ? "input-error" : ""}
            />
            <p className="error">{errors.email ? errors.email.message : "\u00A0"}</p>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className={errors.password ? "input-error" : ""}
            />
            <p className="error">{errors.password ? errors.password.message : "\u00A0"}</p>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="login-options">
            <span 
              className="forgot" 
              onClick={() => dispatch(openModal('forgotPassword'))}
            >
              Forgot password?
            </span>
          </div>
        </form>

        <p className="signup-text">
          New to LMS?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Sign up now.
          </span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {forgotPasswordModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Reset Password</h3>

            {forgotPasswordStep === 1 && (
              <form onSubmit={handleForgot}>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Enter your email" 
                  required 
                />
                <button type="submit">Send OTP</button>
                <button 
                  type="button" 
                  className="close-btn" 
                  onClick={() => dispatch(closeModal('forgotPassword'))}
                >
                  Cancel
                </button>
              </form>
            )}

            {forgotPasswordStep === 2 && (
              <form onSubmit={handleReset}>
                <input 
                  type="text" 
                  name="otp" 
                  placeholder="Enter OTP" 
                  required 
                />
                <input 
                  type="password" 
                  name="newPassword" 
                  placeholder="Enter new password" 
                  required 
                />
                <button type="submit">Reset Password</button>
                <button 
                  type="button" 
                  className="close-btn" 
                  onClick={() => {
                    dispatch(closeModal('forgotPassword'));
                    dispatch(setForgotPasswordStep({ step: 1, email: null }));
                  }}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;