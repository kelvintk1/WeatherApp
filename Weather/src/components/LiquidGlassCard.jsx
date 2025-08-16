// src/components/LiquidGlass.jsx
import React from "react";
import "./LiquidGlass.css"; // We'll put the original styles here

const LiquidGlass = ({ children }) => {
  return (
    <>
      {/* SVG Filter for Glass Distortion */}
      <svg style={{ display: "none" }}>
        <filter id="glass-distortion">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.008"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="77" />
        </filter>
      </svg>

      <div className="glass-card ">
        <div className="glass-filter"></div>
        <div className="glass-overlay"></div>
        <div className="glass-specular"></div>
        <div className="glass-content">{children}</div>
      </div>
    </>
  );
};

export default LiquidGlass;
