import Login from "./components/Register/Users/Login"
import Signup from "./components/Register/Users/Signup"
import Home from "./components/Home"
import StudyTable from "./components/Register/Study/StudyMain";


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/studymain" element={<StudyTable/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;