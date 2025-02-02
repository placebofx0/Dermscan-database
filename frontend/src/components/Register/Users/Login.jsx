import React, { useState } from "react";
import { login } from "../../../services/user.api";
import { useNavigate, Link } from "react-router-dom"

function Login() {

    const history=useNavigate();

    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')

    async function submit(e) {
        e.preventDefault();
        console.log("Submitting login...");
      
        try {
          const res = await login({ username, password }); // ใช้ฟังก์ชันจาก user.api.js
          console.log("Response:", res.data);
      
          if (res.data.message === "exist") {
            history("/home");
          } else if (res.data.message === "invalid_username") {
            alert("Invalid username or User has not signed up");
          } else if (res.data.message === "invalid_password") {
            alert("Invalid password");
          }
        } catch (e) {
          console.error("Error occurred:", e);
          alert(e.response?.data?.message || "An error occurred while logging in");
        }
      }


    return (
        <div className="container">
            <div className="textheader">
                <h1 className="text">Login</h1>
            </div>
            
                <form action="POST" className="inputbox">
                    <div className="input">
                        <input type="Username" onChange={(e) => { setUsername(e.target.value) }} placeholder="Username"  />
                    </div>
                    <div className="input">
                        <input type="password" onChange={(e) => { setPassword(e.target.value) }} placeholder="Password"  />
                    </div>
                </form>
            
                <div className="submitbox">
                    <input className="submit" onClick={submit} value="Login" />
                        <p>Or</p>
                    <Link className="submit" to="/signup">Signup</Link>
                </div>
        </div>
    )
}

export default Login