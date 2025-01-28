import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { signup } from "../../../services/user.api";


function Signup() {
    const history=useNavigate();

    const [username,setUsername]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')

    async function submit(e) {
        e.preventDefault();
    
        try {
            const res = await signup({ username, email, password });
            console.log("Response from signup API:", res.data);
    
            if (res.data.message === "exist") {
                
            } else if (res.data.message === "notexist") {
                history("/home");
            }
        } catch (error) {
            console.error("Error occurred during signup:", error); // เพิ่มการแสดงผล error
            alert(error.response?.data?.message || "An error occurred while signing up");
        }
    }


    return (
        <div className="container">
            <div className="header">
                <h1 className="text">Signup</h1>
            </div>
                <form action="POST" className="inputbox">
                    <div className="input">
                        <input type="text" onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
                    </div>
                    <div className="input">
                        <input type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    </div>
                    <div className="input">
                        <input type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                    </div>
                    </form>
                    <div className="submitbox">
                        <input className="submit" onClick={submit} value="Signup" />
                            <p>OR</p>
                        <Link className="submit" to="/">Login</Link>
                    </div>
        </div>
    )
}

export default Signup