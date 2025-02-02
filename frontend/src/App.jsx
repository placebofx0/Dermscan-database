import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Nav/NavBar";
import Login from "./components/Register/Users/Login";
import Signup from "./components/Register/Users/Signup";
import Home from "./components/Home";
import StudyTable from "./components/Register/Study/StudyMain";
import StudyProfile from "./components/Register/Study/StudyProfile";
import SubjectTable from "./components/Register/Subjects/SubjectMain";
import SubjectProfile from "./components/Register/Subjects/SubjectProfile";

function Layout() {
  const location = useLocation(); 
  const hideHeaderRoutes = ["/", "/signup"]; // เส้นทางที่ไม่ต้องการให้มี Header

  return (
    <div>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/studymain" element={<StudyTable />} />
        <Route path="/studyprofile/:id" element={<StudyProfile />} />
        <Route path="/subjectmain" element={<SubjectTable />} />
        <Route path="/subjectprofile/:id" element={<SubjectProfile />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
