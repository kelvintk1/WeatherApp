import React from "react";

const LiquidGlassSpinner = ({ children }) => {
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

      {/* Glass Spinner */}
      <div
        className="relative w-20 h-20 rounded-full overflow-hidden"
        style={{
          "--bg-color": "rgba(255, 255, 255, 0.25)",
          "--highlight": "rgba(255, 255, 255, 0.75)",
        }}
      >
        {/* Glass filter layer */}
        <div
          className="absolute inset-0 rounded-full z-[1] backdrop-blur-sm"
          style={{
            filter:
              "url(#glass-distortion) saturate(120%) brightness(1.15)",
          }}
        ></div>

        {/* Glass overlay */}
        <div
          className="absolute inset-0 rounded-full z-[2]"
          style={{ background: "var(--bg-color)" }}
        ></div>

        {/* Glass specular light */}
        <div
          className="absolute inset-0 rounded-full z-[3]"
          style={{
            boxShadow: "inset 1px 1px 1px var(--highlight)",
          }}
        ></div>

        {/* Spinner content */}
        <div className="relative z-[4] flex items-center justify-center w-full h-full">
          {/* Ring animation */}
          <div
            className="absolute rounded-full border-2 border-transparent animate-spin"
            style={{
              width: "64px",
              height: "64px",
              borderTopColor: "rgba(255,255,255,0.8)",
              borderRightColor: "rgba(255,255,255,0.6)",
            }}
          ></div>

          {/* Core animation */}
          <div
            className="rounded-full animate-pulse"
            style={{
              width: "24px",
              height: "24px",
              background: "rgba(255,255,255,0.9)",
            }}
          ></div>

          {/* Custom text inside spinner */}
          {children && (
            <span className="absolute text-white text-xs font-bold">
              {children}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default LiquidGlassSpinner;
