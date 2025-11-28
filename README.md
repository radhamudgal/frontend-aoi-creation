#AOI Creation Web App
Project Overview
A single-page React + TypeScript application that allows users to view satellite/drone imagery and define Areas of Interest (AOIs) with interactive map features.

#Tech Stack
Frontend: React, TypeScript, Vite
Styling: Tailwind CSS
Map: Leaflet (with WMS layer from https://www.wms.nrw.de/geobasis/wms_nw_dop
)
Testing: Playwright

#Map Library Choice
Chose Leaflet because it is lightweight, highly extensible, and integrates easily with React.
Alternatives considered: OpenLayers (heavier, more complex), MapLibre (similar to Leaflet but focused on vector tiles).

#Architecture
Components: MapView, Sidebar, Header
Context: MapContext for client-side state management
Modular, maintainable code with clear separation of concerns.

#Performance Considerations
Supports 1000+ AOIs with optimized rendering.
Debounced map events and lazy updates for drawn polygons/markers.

#Testing Strategy
Playwright tests:
Homepage load & title
WMS layer tiles loaded
AOI drawing functionality
With more time: unit tests for custom components, layer toggle functionality, localStorage persistence.

#Tradeoffs
Client-side only state management (no backend integration yet).
Basic map controls implemented, full production-ready accessibility requires additional work.

#Setup Instructions
git clone https://github.com/radhamudgal/frontend-aoi-creation.git
cd frontend-aoi-creation
npm install
npm start

#Time Spent
Development: 6–7 hours
Testing: 1 hour
Documentation: 1 hour
