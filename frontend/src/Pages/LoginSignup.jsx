import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const [state, setState] = useState("Login");
  const [formData,setFormData] = useState({
    username:"",
    password:"",
    email:""
  })

  const login = async () =>{
    console.log("login fn",formData)
    let responseData;
    await fetch('http://localhost:4000/login',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData = data)

    if (responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      // after signup redirect to homepage
      window.location.replace("/")
    }
    else{
      alert(responseData.error)
    }
  }

  const signup = async () =>{
    console.log("signup fn",formData);
    let responseData;
    await fetch('http://localhost:4000/signup',{
      method:'POST',
      headers:{
        Accept:'application/form-data',
        'Content-Type':'application/json'
      },
      body: JSON.stringify(formData),
    }).then((response)=>response.json()).then((data)=>responseData = data)

    if (responseData.success){
      localStorage.setItem('auth-token', responseData.token);
      // after signup redirect to homepage
      window.location.replace("/")
    }
    else{
      alert(responseData.error)
    }
  }

  const handleChange = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  return (
    <div className='loginSignup'>
      <div className="loginSignup-container">
        <h1>{state}</h1>
        <div className="loginSignup-fields">
          {state === "Sign Up" ? 
          <input name='username' value={formData.username} onChange={handleChange} type="text" placeholder="Name" /> : <></>}
          <input name='email' value={formData.email} onChange={handleChange} type="email" placeholder="Email" />
          <input name='password' value={formData.password} onChange={handleChange} type="password" placeholder="Password" />
        </div>
        <button className="loginSignup-submit" onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        {state === "Sign Up" ?
          <p className='loginSignup-login'>Already have an Account <span onClick={()=>{setState("Login")}}>Login here</span></p>
          :
          <p className='loginSignup-login'>Create an Account <span onClick={()=>{setState("Sign Up")}}>Click here</span></p>
        }
        <div className="loginSignup-agree">
          <input type="checkbox" id="agree" name="agree" />
          <p> By continuing, I agree to the terms and privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup
