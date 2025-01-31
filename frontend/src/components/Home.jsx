import React from "react"
import {useLocation, useNavigate} from 'react-router-dom';
import { Link } from "react-router-dom";


function Home() {
    const location = useLocation();
  
    return (
      <div className="container">
        <Link to="/subjectmain">
          <button>Subjects</button>
        </Link>
        <Link to="/studymain">
          <button>Study</button>
        </Link>
      </div>
    );
  }
  
export default Home
