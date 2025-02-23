import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import ManageStaff from "./pages/ManageStaff/ManageStaff";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import ManageIncidents from "./pages/manageIncidents/ManageIncidents";
import RolActivities from "./pages/MiddlePage/RolActivities";
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
