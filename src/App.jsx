import React from "react";
import { useRoutes } from "react-router-dom";
import Navbar from "./componends/common/Navbar.jsx";
import { AppRouter } from "./router/AppRouter";

function App() {
  const router = useRoutes(AppRouter);

  return (
    <>
      {router}
    </>
  );
}

export default App;