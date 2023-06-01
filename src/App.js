import React from "react";
import RichText from "./components/RichText/RichText";
import Published from "./components/Published/Published";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  redirect,
  Outlet,
} from "react-router-dom";

const App = () => {
  return (
    <>
      <Router>
      <Routes>
          <Route
            path={"/"}
            element={<RichText />}
          />
        </Routes>
        <Routes>
          <Route
            path={"/published"}
            element={<Published />}
          />
        </Routes>
      </Router>

    </>
  );
};

export default App;
