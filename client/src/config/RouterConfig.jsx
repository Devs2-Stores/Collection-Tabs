import Home from "../pages/home/index";
import Auth from "../pages/auth/index";
import CollectionMetafields from "../pages/collection/metafields/index";

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
    page: <Auth />,
  },
  {
    path: "/collection/metafields/",
    layout: false,
    isPrivate: false,
    page: <CollectionMetafields />,
  }
];
