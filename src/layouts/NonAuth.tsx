import { Outlet } from "react-router-dom";

const NonAuth = () => {
  return (
    <>
      <h1>Auth</h1>
      <Outlet />
    </>
  );
};

export default NonAuth;
