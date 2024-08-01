import React from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {
  return (
    <div className='loginSignup'>
      <div className="loginSignup-container">
        <h1>Sign Up</h1>
        <div className="loginSignup-fields">
          <input type="text" placeholder="Name" />
          <input type="email" placeholder="Email" />
          <input type="password" placeholder="Password" />
        </div>
        <button className="loginSignup-submit">Continue</button>
        <p className='loginSignup-login'>Already have an Account<span>Login here</span></p>
        <div className="loginSignup-agree">
          <input type="checkbox" id="agree" name="agree" />
          <p> By continuing, I agree to the terms and privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
