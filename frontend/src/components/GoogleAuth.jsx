import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const GoogleAuth = ({ onSuccess }) => {
  
  const handleSuccess = (response) => {
    if(response.credential) {
      onSuccess(response.credential);
    } else {
      console.error('Google login failed. No credentials returned.');
    }
    
  };

  return (
      <GoogleLogin
        onSuccess={handleSuccess} 
        onError={(error) => console.error('Google Login Error:', error)}
      />
  );
};

export default GoogleAuth;
