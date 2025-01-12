"use client";

import React, { useEffect } from "react";

interface LatLng {
  lat: number;
  lng: number;
}

interface OverlayProps {
  mapRef: React.RefObject<google.maps.Map | null>;
  overlays: { position: LatLng; iconPath: string }[];
}

const SVGOverlay = ({ mapRef, overlays }: OverlayProps) => {
  useEffect(() => {
    if (!mapRef.current) return;

    class CustomSVGOverlay extends google.maps.OverlayView {
      private position: LatLng;
      private iconPath: string;
      private div?: HTMLElement;

      constructor(position: LatLng, iconPath: string) {
        super();
        this.position = position;
        this.iconPath = iconPath;
      }

      onAdd() {
        this.div = document.createElement("div");
        this.div.style.borderStyle = "none";
        this.div.style.borderWidth = "0px";
        this.div.style.position = "absolute";

        const img = document.createElement("img");
        img.src = this.iconPath;
        img.style.width = "50px"; 
        img.style.height = "50px";
        img.style.position = "absolute";
        this.div.appendChild(img);

        const panes = this.getPanes()!;
        panes.overlayLayer.appendChild(this.div);
      }

      draw() {
        const overlayProjection = this.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(new google.maps.LatLng(this.position.lat, this.position.lng))!;

        if (this.div) {
          const iconWidth = 50; 
          const iconHeight = 50;
          this.div.style.left = position.x - iconWidth / 2 + "px"; 
          this.div.style.top = position.y - iconHeight / 2 + "px"; 
        }
      }

      onRemove() {
        if (this.div) {
          (this.div.parentNode as HTMLElement).removeChild(this.div);
          delete this.div;
        }
      }
    }

    const overlayInstances = overlays.map(({ position, iconPath }) => {
      const overlay = new CustomSVGOverlay(position, iconPath);
      overlay.setMap(mapRef.current);
      return overlay;
    });

    return () => {
      overlayInstances.forEach((overlay) => overlay.setMap(null));
    };
  }, [mapRef.current, overlays]);

  return null;
};

export default SVGOverlay;
