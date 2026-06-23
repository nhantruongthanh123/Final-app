import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Photo from "./components/Photo";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header name="Ronaldo Messi" />
      <div className="flex flex-row flex-1">
        <Sidebar />
        <div></div>
      </div>
    </div>
  );
}

export default App;
