import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import ManageStaff from "./pages/ManageStaff/AddStaff";
import Footer from "./assets/components/Footer/Footer";
import Header from "./assets/components/Header/Header";
import CreateIncidents from "./pages/ManageIncidents/CreateIncidents/CreateIncidents";
import RolActivities from "./pages/MiddlePage/RolActivities";
import ManageStudents from "./pages/ManageStudents/ManageStudents";
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
          path="/ManageStaff"
          element={
            <ProtectedRoute>
              <ManageStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ManageStudents"
          element={
            <ProtectedRoute>
              <ManageStudents />
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
