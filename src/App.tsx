import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";

import Footer from "./assets/components/Footer/Footer";
import Header from "./assets/components/Header/Header";
import CreateIncidents from "./pages/ManageIncidents/CreateIncidents/CreateIncidents";
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
import ReadIncidents from "./pages/ManageIncidents/ReadIncidents/ReadIncidents";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/RolActivities"
          element={
            <ProtectedRoute>
              <RolActivities />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RegisterStaff"
          element={
            <ProtectedRoute>
              <RegisterStaff />
            </ProtectedRoute>
          }
        />
                <Route
          path="/QueryStaff"
          element={
            <ProtectedRoute>
              <QueryStaff />
            </ProtectedRoute>
          }
        />
                <Route
          path="/UpdateStaff"
          element={
            <ProtectedRoute>
              <UpdateStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RegisterStudents"
          element={
            <ProtectedRoute>
              <RegisterStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/QueryStudents"
          element={
            <ProtectedRoute>
              <QueryStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/UpdateStudents"
          element={
            <ProtectedRoute>
              <UpdateStudents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/CreateIncidents"
          element={
            <ProtectedRoute>
              <CreateIncidents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ReadIncidents"
          element={
            <ProtectedRoute>
              <ReadIncidents />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
