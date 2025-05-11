import { Fragment } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { routes } from "./config/RouterConfig";
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
      </div>
    </main>
  );
}

export default App;
