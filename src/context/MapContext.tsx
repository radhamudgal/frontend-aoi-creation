import React, { createContext, useContext, useRef, useState } from "react";
import L from "leaflet";

interface MapContextType {
  mapRef: React.MutableRefObject<L.Map | null>;
  savedGeoJSON: any;
  setSavedGeoJSON: (geo: any) => void;
  aoiLayers: Map<string, L.Layer>;
  setAoiLayers: React.Dispatch<React.SetStateAction<Map<string, L.Layer>>>;
  wmsVisible: boolean;
  toggleWms: () => void;
  searchLocation: (query: string) => void;
  clearSaved: () => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const mapRef = useRef<L.Map | null>(null);
  const [savedGeoJSON, setSavedGeoJSON] = useState<any>(() => {
    const stored = localStorage.getItem("savedAOI");
    return stored ? JSON.parse(stored) : null;
  });
  const [aoiLayers, setAoiLayers] = useState<Map<string, L.Layer>>(new Map());
  const [wmsVisible, setWmsVisible] = useState(true);

  const toggleWms = () => setWmsVisible(!wmsVisible);

  const searchLocation = (query: string) => {
    if (!query || !mapRef.current) return;
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.length) return alert("Location not found");
        const { lat, lon } = data[0];
        mapRef.current?.setView([parseFloat(lat), parseFloat(lon)], 13);
      });
  };

  const clearSaved = () => {
    localStorage.removeItem("savedAOI");
    setSavedGeoJSON(null);
    aoiLayers.forEach((l) => mapRef.current?.removeLayer(l));
    setAoiLayers(new Map());
  };

  return (
    <MapContext.Provider value={{ mapRef, savedGeoJSON, setSavedGeoJSON, aoiLayers, setAoiLayers, wmsVisible, toggleWms, searchLocation, clearSaved }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within MapProvider");
  return context;
};
