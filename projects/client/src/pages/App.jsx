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
import ManajemenUser from "./admin/ManajemenUser";
import Dashboard from "./admin/Dashboard";
import NavAdmin from "../components/admin/NavAdmin";
import NavUser from "../components/user/NavUser";
import ManajemenProduk from "./admin/ManajemenProduk";

export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/manajemen-user" element={<ManajemenUser />} />
          <Route path="/admin/manajemen-produk" element={<ManajemenProduk />} />
        </Route>
      </>
    )
  );

  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

function Root() {
  const location = useLocation();
  const isAdmin = location.pathname.includes("admin");

  return (
    <>
      {isAdmin ? null : <NavUser />}
      <div className={`${isAdmin ? "flex" : ""}`}>
        {isAdmin ? <NavAdmin /> : null}
        <Outlet />
      </div>
    </>
  );
}
