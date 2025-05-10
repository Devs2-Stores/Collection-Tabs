import Home from "../pages/home/index";
import Login from "../pages/login/index";
import Install from "../pages/install/index";

export const routes = [
  {
    path: "/",
    layout: false,
    isPrivate: false,
    page: <Home />,
  },
  {
    path: "/install/login",
    layout: false,
    isPrivate: false,
    page: <Login />,
  }
];
