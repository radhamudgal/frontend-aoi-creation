import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet-draw";
import { useMap } from "../context/MapContext";

export default function MapView() {
  const { mapRef, savedGeoJSON, setSavedGeoJSON, aoiLayers, setAoiLayers } = useMap();

  // Get place name from coordinates
  const getPlaceName = async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      return (await res.json()).display_name || "Unnamed Area";
    } catch { return "Unnamed Area"; }
  };

  useEffect(() => {
    const map = L.map("map", { center: [51.5, 7.4], zoom: 10 });
    mapRef.current = map;

    // Base layers
    const osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "OSM" }).addTo(map);
    const wmsNRW = L.tileLayer.wms("https://www.wms.nrw.de/geobasis/wms_nw_dop", {
      layers: "DOP", format: "image/png", transparent: false, attribution: "WMS NRW"
    });
    L.control.layers({ OSM: osm, "Satellite / NRW DOP": wmsNRW }).addTo(map);

    // AOI Feature group & Draw control
    const group = new L.FeatureGroup().addTo(map);
    map.addControl(new L.Control.Draw({ draw: { polygon: true, rectangle: true, circle: true }, edit: { featureGroup: group } }));

    // On AOI created
    map.on(L.Draw.Event.CREATED, async (e: any) => {
      const layer = e.layer;
      group.addLayer(layer);
      const center = layer.getBounds?.()?.getCenter() || layer.getLatLng();
      const id = `aoi-${Date.now()}`;
      const geo = { ...layer.toGeoJSON(), properties: { id, name: await getPlaceName(center.lat, center.lng) } };
      setAoiLayers(prev => new Map(prev.set(id, layer)));
      const updated = savedGeoJSON || { type: "FeatureCollection", features: [] };
      updated.features.push(geo);
      setSavedGeoJSON(updated);
      localStorage.setItem("savedAOI", JSON.stringify(updated));
    });

    // Load saved AOIs
    const stored = localStorage.getItem("savedAOI");
    if (stored) {
      const data = JSON.parse(stored);
      data.features.forEach((f: any) => {
        const layer = L.geoJSON(f).getLayers()[0];
        group.addLayer(layer);
        if (f.properties?.id) setAoiLayers(prev => new Map(prev.set(f.properties.id, layer)));
      });
      setSavedGeoJSON(data);
    }

    return () => map.remove();
  }, []);

  return <div id="map" className="w-full h-full" />;
}
