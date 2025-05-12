import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./frontend/pages/Login/Login";
import Footer from "./frontend/assets/components/Footer/Footer";
import Header from "./frontend/assets/components/Header/Header";
import RolActivities from "./frontend/pages/MiddlePage/RolActivities";

// STUDENTS PAGES
import RegisterStudents from "./frontend/pages/ManageStudents/RegisterStudents";
import QueryStudents from "./frontend/pages/ManageStudents/QueryStudents";
import UpdateStudents from "./frontend/pages/ManageStudents/UpdateStudents";

// STAFF PAGES
import RegisterStaff from "./frontend/pages/ManageStaff/RegisterStaff";
import QueryStaff from "./frontend/pages/ManageStaff/QueryStaff";
import UpdateStaff from "./frontend/pages/ManageStaff/UpdateStaff";

import ProtectedRoute from "./frontend/assets/components/ProtectedRoute/ProtectedRoute";
import CreateIncidents from "./frontend/pages/ManageIncidents/CreateIncidents/CreateIncidents";
import ReadIncidents from "./frontend/pages/ManageIncidents/ReadIncidents/ReadIncidents";
import UpdateIncidents from "./frontend/pages/ManageIncidents/UpdateIncidents";

// TUTOR PAGES
import RegisterTutor from "./frontend/pages/Tutors/RegisterTutor";
import QueryTutors from "./frontend/pages/Tutors/QueryTutors";
import UpdateTutor from "./frontend/pages/Tutors/UpdateTutor";
import ExportTutors from "./frontend/pages/Tutors/ExportTutors";

// RECORD PAGES
import ViewRecord from "./frontend/pages/Records/ViewRecord";
import UpdateRecord from "./frontend/pages/Records/UpdateRecord";
import CreateRecord from "./frontend/pages/Records/CreateRecord";
import ExportRecord from "./frontend/pages/Records/ExportRecord";

function App() {
  return (
    <div className="App">
      <Router>
        <Header />
        <main>
          <Routes>
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

            {/* Tutor routes */}
            <Route path="/RegisterTutor" element={<ProtectedRoute><RegisterTutor /></ProtectedRoute>} />
            <Route path="/QueryTutors" element={<ProtectedRoute><QueryTutors /></ProtectedRoute>} />
            <Route path="/UpdateTutor" element={<ProtectedRoute><UpdateTutor /></ProtectedRoute>} />
            <Route path="/ExportTutors" element={<ProtectedRoute><ExportTutors /></ProtectedRoute>} />

            <Route path="/CreateRecord" element={<ProtectedRoute><CreateRecord /></ProtectedRoute>} />
            <Route path="/ViewRecord" element={<ProtectedRoute><ViewRecord /></ProtectedRoute>} />
            <Route path="/UpdateRecord" element={<ProtectedRoute><UpdateRecord /></ProtectedRoute>} />
            <Route path="/ExportRecord" element={<ProtectedRoute><ExportRecord /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;