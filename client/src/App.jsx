import { BrowserRouter, Routes, Route } from "react-router";
import { routes } from "./config/RouterConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function App() {
  return (
    <main>
      <div className="container">
        <BrowserRouter>
          <Routes>
            {routes.map((route, idx) => (
              <Route key={idx} path={route.path} element={route.page} />
            ))}
          </Routes>
        </BrowserRouter>
        <ToastContainer autoClose={1500} />
      </div>
    </main>
  );
}

export default App;
