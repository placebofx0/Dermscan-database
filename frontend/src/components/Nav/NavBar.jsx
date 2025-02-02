import React from "react";
import { Link } from "react-router-dom";


function Header() {
    return (
        <header className="header">
            <div className="headerbox">
                <div className="logo">
                    <Link to="/">Dermscan Asia</Link>
                </div>
                <div className="nav-box">
                    <nav>
                        <ul className="nav-links">
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/subjectmain">Subject</Link></li>
                            <li><Link to="/studymain">Study</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default Header;
