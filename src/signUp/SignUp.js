import './SignUp.css'
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/Authcontext"
import { useState } from 'react';

export default function SignUp() {
    const { signup } = useAuth()

    async function register(event) {
      event.preventDefault();
      var x = document.getElementById("frm2");
      var name = x.elements[0].value;
      var username = x.elements[1].value;
      var pass = x.elements[2].value;
      try {
        await signup(username, pass, name);
      } catch {
        alert("Failed to create an account");
      }
    }

    return (
      <div>
        <div className ="login-page">
          <div className ="form">
            <p className = "title"> Sign Up </p>
            <form className ="login-form" id = "frm2">
              <input type="text" className = "One" name = "FullName" autoComplete = "off" placeholder="Full Name" required/>
              <label className = "three">Full Name</label>
              <input type="text" className = "Two" name = "Username" autoComplete = "off" placeholder="Username" required/>
              <label className = "one">Username</label>
              <input type="password" placeholder="Password" autoComplete = "off" required/>
              <label className = "two">Password</label>
              <button onClick = {register}>Register</button>
              <p className ="message">Already registered? <Link to="/SignIn">Sign In</Link></p>
            </form>
          </div>
        </div>
      </div>
    )
}
