import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
  useLocation,
} from "react-router-dom";
import Home from "./user/Home";
import Profile from "./user/Profile";
import UserManagement from "./admin/UserManagement";
import Dashboard from "./admin/Dashboard";
import NavAdmin from "../components/admin/NavAdmin";
import NavUser from "../components/user/NavUser";
import ManagementProduct from "./admin/ManagementProduct";
import { AuthContextProvider } from "../context/AuthContext";
import Footer from "../components/user/Footer";
import SignIn from "./admin/SignIn";
import SignUp from "./admin/SignUp";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route
            path="/admin/product-management"
            element={<ManagementProduct />}
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </>
    )
  );

  return (
    <div className="App">
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </div>
  );
}

function Root() {
  const location = useLocation();
  const isAdmin = location.pathname.includes("admin");
  const isSigned = location.pathname.includes("sign");

  return (
    <>
      {isSigned ? null : <NavUser />}
      <div className={`${isAdmin ? "flex" : ""}`}>
        {isAdmin ? <NavAdmin /> : null}
        <Outlet />
      </div>
      {isAdmin || isSigned ? null : <Footer />}
    </>
  );
}
