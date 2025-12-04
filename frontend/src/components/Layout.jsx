import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <Navbar />
      <div style={{ paddingTop: "80px" }}>
        <Outlet />
      </div>
    </>
  );
}
