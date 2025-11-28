import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import MapView from "./components/MapView";
import { MapProvider } from "./context/MapContext";

const App: React.FC = () => {
  return (
    <MapProvider>
      <div className="app-root flex flex-col h-screen bg-slate-50">
        <Header />
        <div className="main-area flex flex-1 min-h-0">
          <Sidebar />
          <main className="map-container flex-1 relative">
            <MapView />
          </main>
        </div>
      </div>
    </MapProvider>
  );
};

export default App;
