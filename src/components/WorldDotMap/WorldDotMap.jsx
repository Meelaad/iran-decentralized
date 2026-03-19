import React, { useRef, useState } from 'react';
import { countryColors, COUNTRY_DOTS, regionMarkers } from '../../data/globalData';
import worldDots from '../../data/world-dots.json';
import './WorldDotMap.css';

const MAP_W = 1000;
const MAP_H = 500;

// Mercator projection matching world-dots.json (generated with d3-geo geoMercator).
// Parameters derived from empirical calibration:
//   S  = 1000 / (2π) ≈ 159.155  — lon ±180° fills x 0–1000
//   TX = 500                     — equator x-center
//   TY = 295.4                   — equator y-position (map shows ~72°N to ~58°S)
const S  = 1000 / (2 * Math.PI);
const TX = 500;
const TY = 295.4;

export function project(lon, lat) {
  const λ = (lon * Math.PI) / 180;
  const φ = (lat * Math.PI) / 180;
  const x = λ * S + TX;
  const y = -Math.log(Math.tan(Math.PI / 4 + φ / 2)) * S + TY;
  return [x, y];
}

function unproject(x, y) {
  const lon = ((x - TX) / S) * (180 / Math.PI);
  const mercY = (TY - y) / S;
  const lat = (2 * Math.atan(Math.exp(mercY)) - Math.PI / 2) * (180 / Math.PI);
  return [parseFloat(lon.toFixed(4)), parseFloat(lat.toFixed(4))];
}

// markers: array of DB map_markers rows { id, type, lon, lat, color, label, region, pop_estimate, description }
// onMarkerClick: (marker) => void
// editMode: bool — shows crosshair cursor and enables onMapClick
// onMapClick: (lon, lat) => void
// selectedMarkerId: id string — highlights a marker
export default function WorldDotMap({ markers = [], onMarkerClick, editMode = false, onMapClick, selectedMarkerId }) {
  const [tooltip, setTooltip] = useState({ text: '', x: 0, y: 0, show: false });
  const [hoverCoords, setHoverCoords] = useState(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  const dots = worldDots.map(([x, y], i) => (
    <circle key={`bg-${i}`} cx={x} cy={y} r={1.2} className="wdm-dot-static" />
  ));

  const animatedDots = [];
  for (const [code, positions] of Object.entries(COUNTRY_DOTS)) {
    const color = countryColors[code];
    if (!color) continue;
    positions.forEach(([lon, lat], idx) => {
      const [x, y] = project(lon, lat);
      animatedDots.push(
        <circle
          key={`${code}-${idx}-a`}
          cx={x} cy={y} r={2.2}
          fill={color}
          className="wdm-pulse"
          style={{ animationDelay: `${(idx * 0.25) % 2}s` }}
        />
      );
    });
  }

  function handleMarkerEnter(e, name) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ text: name, x: e.clientX - rect.left, y: e.clientY - rect.top, show: true });
  }

  function handleMarkerLeave() {
    setTooltip((prev) => ({ ...prev, show: false }));
  }

  function getSvgCoords(e) {
    const svgEl = svgRef.current;
    if (!svgEl) return null;
    const ctm = svgEl.getScreenCTM();
    if (!ctm) return null;
    const pt = svgEl.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(ctm.inverse());
  }

  function handleSvgMouseMove(e) {
    if (!editMode) return;
    const sc = getSvgCoords(e);
    if (!sc) return;
    const [lon, lat] = unproject(sc.x, sc.y);
    setHoverCoords({ lon, lat });
  }

  function handleSvgMouseLeave() {
    setHoverCoords(null);
  }

  function handleSvgClick(e) {
    if (!editMode || !onMapClick) return;
    const sc = getSvgCoords(e);
    if (!sc) return;
    const [lon, lat] = unproject(sc.x, sc.y);
    onMapClick(lon, lat);
  }

  return (
    <div className={`wdm-map-wrap${editMode ? ' wdm-map-wrap--edit' : ''}`} ref={containerRef}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        onClick={handleSvgClick}
        onMouseMove={handleSvgMouseMove}
        onMouseLeave={handleSvgMouseLeave}
      >
        {dots}
        {animatedDots}

        {/* Pink triangle region markers — hardcoded from globalData */}
        {regionMarkers.map((marker) => {
          const [mx, my] = project(marker.coordinates[0], marker.coordinates[1]);
          return (
            <g
              key={marker.id}
              transform={`translate(${mx}, ${my})`}
              className="wdm-region-marker"
              onMouseEnter={(e) => handleMarkerEnter(e, marker.name)}
              onMouseLeave={handleMarkerLeave}
            >
              <polygon points="0,-5 -3.5,3 3.5,3" fill="#e8507a" stroke="#0b0b18" strokeWidth="0.8" />
              <circle cx={0} cy={0} r={7} fill="transparent" />
            </g>
          );
        })}

        {/* DB markers */}
        {markers.map((marker) => {
          const [mx, my] = project(Number(marker.lon), Number(marker.lat));
          const isSelected = marker.id === selectedMarkerId;
          const color = marker.color || '#26DEC2';
          const strokeColor = isSelected ? '#ffffff' : '#0b0b18';
          const strokeW = isSelected ? 1.5 : 0.8;

          if (marker.type === 'triangle') {
            return (
              <g
                key={marker.id}
                transform={`translate(${mx}, ${my})`}
                className="wdm-db-marker"
                onMouseEnter={(e) => handleMarkerEnter(e, marker.label)}
                onMouseLeave={handleMarkerLeave}
                onClick={(e) => { e.stopPropagation(); onMarkerClick?.(marker); }}
              >
                <polygon points="0,-5 -3.5,3 3.5,3" fill={color} stroke={strokeColor} strokeWidth={strokeW} />
                <circle cx={0} cy={0} r={7} fill="transparent" />
              </g>
            );
          }

          if (marker.type === 'circle_blink') {
            return (
              <g
                key={marker.id}
                transform={`translate(${mx}, ${my})`}
                className="wdm-db-marker"
                onMouseEnter={(e) => handleMarkerEnter(e, marker.label)}
                onMouseLeave={handleMarkerLeave}
                onClick={(e) => { e.stopPropagation(); onMarkerClick?.(marker); }}
              >
                <circle
                  cx={0} cy={0} r={isSelected ? 5 : 4}
                  fill={color} stroke={strokeColor} strokeWidth={strokeW}
                  className="wdm-db-blink"
                  style={{ '--blink-color': color }}
                />
                <circle cx={0} cy={0} r={9} fill="transparent" />
              </g>
            );
          }

          // type === 'circle' (static)
          return (
            <g
              key={marker.id}
              transform={`translate(${mx}, ${my})`}
              className="wdm-db-marker"
              onMouseEnter={(e) => handleMarkerEnter(e, marker.label)}
              onMouseLeave={handleMarkerLeave}
              onClick={(e) => { e.stopPropagation(); onMarkerClick?.(marker); }}
            >
              <circle
                cx={0} cy={0} r={isSelected ? 5 : 4}
                fill={color} stroke={strokeColor} strokeWidth={strokeW}
                className="wdm-db-circle"
              />
              <circle cx={0} cy={0} r={8} fill="transparent" />
            </g>
          );
        })}
      </svg>

      {tooltip.show && (
        <div className="wdm-map-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}

      {editMode && hoverCoords && (
        <div className="wdm-edit-coords">
          {hoverCoords.lon.toFixed(2)}, {hoverCoords.lat.toFixed(2)}
        </div>
      )}
    </div>
  );
}
