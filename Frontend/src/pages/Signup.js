import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signupThunk } from "../redux/thunks/authThunks";
import { 
  selectAuthError, 
  selectAuthLoading,
  selectIsAuthenticated,
  clearError 
} from "../redux/slices/authSlice";
import "../styles/Signup.css";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Redirect if authenticated
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
    const result = await dispatch(signupThunk(data));
    if (signupThunk.fulfilled.match(result)) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <div className="signup-left-text">
          <h3>Learning Management System</h3>
        </div>
      </div>

      <div className="signup-right">
        <div className="signup-form">
          <h2>Signup</h2>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              placeholder="Full Name"
              {...register("name", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: "Name must contain only letters and spaces",
                },
              })}
            />
            {errors.name && <p className="error">{errors.name.message}</p>}

            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
                  message: "Only valid @gmail.com emails are allowed",
                },
              })}
            />
            {errors.email && <p className="error">{errors.email.message}</p>}

            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters long",
                },
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
                  message:
                    "Password must include uppercase, lowercase, number, and special character",
                },
              })}
            />
            {errors.password && (
              <p className="error">{errors.password.message}</p>
            )}

            <select
              {...register("role", { required: "Role is required" })}
              defaultValue=""
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
            {errors.role && <p className="error">{errors.role.message}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Signup"}
            </button>
          </form>

          <p className="signup-login-text">
            Already have an account?{" "}
            <span className="login-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;