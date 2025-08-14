"use client";

import React, { useEffect, useRef, useState } from "react";

interface VideoTextProps {
  children: React.ReactNode;
  src: string; // Video source URL
}

export const VideoText: React.FC<VideoTextProps> = ({ children, src }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mask, setMask] = useState<string>("");

  // Convert children into a plain string
  const getTextContent = (node: React.ReactNode): string => {
    let text = "";
    React.Children.forEach(node, (child) => {
      if (typeof child === "string") {
        text += child;
      } else if (
        React.isValidElement(child) &&
        typeof child.props.children === "string"
      ) {
        text += child.props.children;
      } else if (
        React.isValidElement(child) &&
        child.props.children
      ) {
        text += getTextContent(child.props.children);
      }
    });
    return text;
  };

  useEffect(() => {
    const textContent = getTextContent(children).trim() || "VIDEO TEXT";

    const svgMask = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="300">
        <text x="50%" y="50%" font-size="100" fill="white"
          text-anchor="middle" dominant-baseline="middle"
          font-family="Arial, sans-serif" font-weight="bold">
          ${textContent}
        </text>
      </svg>
    `;

    const base64Mask = btoa(unescape(encodeURIComponent(svgMask)));
    setMask(`url("data:image/svg+xml;base64,${base64Mask}")`);
  }, [children]);

  return (
    <div
      ref={containerRef}
      className="relative lg:w-[600px] lg:h-[200px] overflow-hidden w-100 h-60"
    >
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover bg-black"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: "contain",
          WebkitMaskSize: "contain",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
          maskPosition: "center",
          WebkitMaskPosition: "center",
          maskMode: "alpha",
          WebkitMaskMode: "alpha",
          maskComposite: "intersect",
          WebkitMaskComposite: "destination-in",
        }}
      />
    </div>
  );
};
