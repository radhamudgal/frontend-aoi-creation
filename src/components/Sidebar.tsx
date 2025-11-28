import React, { useState, useEffect } from "react";
import L from "leaflet";
import { useMap } from "../context/MapContext";

export default function Sidebar() {
  const { searchLocation, savedGeoJSON, clearSaved, toggleWms, wmsVisible, mapRef } = useMap();
  const [query, setQuery] = useState("");
  const [aoiLayers, setAoiLayers] = useState<Map<string,L.Layer>>(new Map());

  const showAOI = (id: string) => {
    const map = mapRef.current, layer = aoiLayers.get(id); if(!map||!layer) return;
    aoiLayers.forEach(l=>map.removeLayer(l)); layer.addTo(map); map.fitBounds((layer as any).getBounds());
    if(layer instanceof L.Path){ const color=(layer as any).options.color; (layer as any).setStyle({color:"red"}); setTimeout(()=> (layer as any).setStyle({color}),1500); }
  };

  useEffect(()=>{
    if(!savedGeoJSON) return;
    const map = new Map<string,L.Layer>();
    savedGeoJSON.features.forEach(f=>f.properties?.id && map.set(f.properties.id,L.geoJSON(f).getLayers()[0]));
    setAoiLayers(map);
  },[savedGeoJSON]);

  return (
    <aside className="w-80 bg-slate-50 p-6 border-r flex flex-col gap-6">
      <h2 className="text-xl font-bold">Define Area of Interest</h2>
      <div>
        <input placeholder="Search city..." className="border px-3 py-2 w-full rounded" value={query} onChange={e=>setQuery(e.target.value)} />
        <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded" onClick={()=>searchLocation(query)}>Go</button>
      </div>
      <div className="flex flex-col gap-2">
        {["Export","Save","Load"].map((a,i)=><button key={i} className={`bg-${["green","amber","slate"][i]}-600 text-white px-4 py-2 rounded`} onClick={()=>window.dispatchEvent(new CustomEvent(`aoi:${a.toLowerCase()}`))}>{a} GeoJSON</button>)}
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={clearSaved}>Clear AOI</button>
      </div>
      <div>
        <h3 className="font-semibold">Areas of Interest</h3>
        {savedGeoJSON?.features?.length ? (
          <ul className="list-disc pl-5">
            {savedGeoJSON.features.map((f,i)=><li key={f.properties?.id||`aoi-${i}`} className="cursor-pointer hover:text-blue-600" onClick={()=>showAOI(f.properties?.id)}>{f.properties?.name||"Unnamed Area"} ({f.geometry.coordinates.length} pts)</li>)}
          </ul>
        ) : <p className="text-gray-500">No AOIs yet</p>}
      </div>
      <div className="flex items-center justify-between">
        <span>Satellite Layer (WMS)</span>
        <input type="checkbox" checked={wmsVisible} onChange={toggleWms}/>
      </div>
    </aside>
  );
}
