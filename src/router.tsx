import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
import Login from "./pages/login/Login";

export const router = createBrowserRouter([
    {
        path:"/",
        element:<Home/>
    },
    {
        path:"/categories",
        element:<Categories/>
    },
    {
        path:"/auth/login",
        element:<Login/>
    }
])