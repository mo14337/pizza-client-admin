import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <>
      <h1>Dashboard component</h1>
      <Outlet />
    </>
  );
};

export default Dashboard;
