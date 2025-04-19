import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";

import Footer from "./assets/components/Footer/Footer";
import Header from "./assets/components/Header/Header";
import RolActivities from "./pages/MiddlePage/RolActivities";

//STUDENTS PAGES
import RegisterStudents from "./pages/ManageStudents/RegisterStudents";
import QueryStudents from "./pages/ManageStudents/QueryStudents";
import UpdateStudents from "./pages/ManageStudents/UpdateStudents";

//STAFF PAGES
import RegisterStaff from "./pages/ManageStaff/RegisterStaff";
import QueryStaff from "./pages/ManageStaff/QueryStaff";
import UpdateStaff from "./pages/ManageStaff/UpdateStaff";


import ProtectedRoute from "./assets/components/ProtectedRoute/ProtectedRoute";
import CreateIncidents from "./pages/ManageIncidents/CreateIncidents/CreateIncidents";
import ReadIncidents from "./pages/ManageIncidents/ReadIncidents/ReadIncidents";
import UpdateIncidents from "./pages/ManageIncidents/UpdateIncidents";

// Add this import at the top with other imports
import RegisterTutor from "./pages/Tutors/RegisterTutor";
import QueryTutors from "./pages/Tutors/QueryTutors";
import UpdateTutor from "./pages/Tutors/UpdateTutor";
import ExportTutors from "./pages/Tutors/ExportTutors";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Existing routes */}
        <Route path="/" element={<Login />} />
        <Route path="/RolActivities" element={<ProtectedRoute><RolActivities /></ProtectedRoute>} />
        
        {/* Staff routes */}
        <Route path="/RegisterStaff" element={<ProtectedRoute><RegisterStaff /></ProtectedRoute>} />
        <Route path="/QueryStaff" element={<ProtectedRoute><QueryStaff /></ProtectedRoute>} />
        <Route path="/UpdateStaff" element={<ProtectedRoute><UpdateStaff /></ProtectedRoute>} />

        {/* Student routes */}
        <Route path="/RegisterStudents" element={<ProtectedRoute><RegisterStudents /></ProtectedRoute>} />
        <Route path="/QueryStudents" element={<ProtectedRoute><QueryStudents /></ProtectedRoute>} />
        <Route path="/UpdateStudents" element={<ProtectedRoute><UpdateStudents /></ProtectedRoute>} />

        {/* Incident routes */}
        <Route path="/CreateIncidents" element={<ProtectedRoute><CreateIncidents /></ProtectedRoute>} />
        <Route path="/ReadIncidents" element={<ProtectedRoute><ReadIncidents /></ProtectedRoute>} />
        <Route path="/UpdateIncidents" element={<ProtectedRoute><UpdateIncidents /></ProtectedRoute>} />

        {/* New Tutor routes */}
        <Route path="/RegisterTutor" element={<ProtectedRoute><RegisterTutor /></ProtectedRoute>} />
        <Route path="/QueryTutors" element={<ProtectedRoute><QueryTutors /></ProtectedRoute>} />
        <Route path="/UpdateTutor" element={<ProtectedRoute><UpdateTutor /></ProtectedRoute>} />
        <Route path="/ExportTutors" element={<ProtectedRoute><ExportTutors /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
