import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import ManageStaff from "./pages/ManageStaff/AddStaff";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import ManageIncidents from "./pages/manageIncidents/ManageIncidents";
import RolActivities from "./pages/MiddlePage/RolActivities";
import ManageStudents from "./pages/ManageStudents/ManageStudents";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
