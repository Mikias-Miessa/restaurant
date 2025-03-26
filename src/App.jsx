import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import { OrderProvider } from "./contexts/OrderContext";

function App() {
  return (
    <OrderProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Admin-only routes */}
          <Route
            path="/admin/*"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />
          {/* Redirect root to dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </OrderProvider>
  );
}

export default App;
