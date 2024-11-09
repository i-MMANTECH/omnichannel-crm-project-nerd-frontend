import React, { useState } from "react";
import "./modalStyle.css";

export const Modal = ({ show, onClose, title, icon }) => {
  if (!show) return null;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleOverlayClick = (e) => {
    if (e.target.className === "modal-overlay") {
      onClose();
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {icon && <div className="modal-icon-container">{icon}</div>}
        <h2>{title}</h2>
        <p className="modal-subtitle">Enter your details to add account</p>

        <div className="modal-inputs">
          <label htmlFor="username">Username *</label>
          <input type="text" id="username" placeholder="@denise.ade" required />

          <label htmlFor="password">Password *</label>
          <div className="password-container">
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              placeholder="********"
              required
            />
            <button
              type="button"
              className="show-password-btn"
              onClick={togglePasswordVisibility}
            >
              <span role="img" aria-label={isPasswordVisible ? "monkey-icon" : "eye-icon"}>
                {isPasswordVisible ? "🙈" : "👁️"}
              </span>
            </button>
          </div>
        </div>

        <button className="connect-button">Connect Channel</button>

        <p className="modal-terms">
          By connecting your channel, you agree to our{" "}
          <a href="#">Terms and Conditions</a>, and
          <a href="#"> Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};
