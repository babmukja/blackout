"use client";

import React, { useEffect } from "react";

interface Props {
  mapRef: React.RefObject<google.maps.Map | null>
  bounds: google.maps.LatLngBoundsLiteral;
  iconPath: string;
}

const SVGOverlay = ({ mapRef, bounds, iconPath }: Props) => {
  useEffect(() => {
    if (!mapRef.current) return;

    class CustomSVGOverlay extends google.maps.OverlayView {
      private bounds: google.maps.LatLngBounds;
      private iconPath: string;
      private div?: HTMLElement;

      constructor(bounds: google.maps.LatLngBounds, iconPath: string) {
        super();
        this.bounds = bounds;
        this.iconPath = iconPath;
      }

      onAdd() {
        this.div = document.createElement("div");
        this.div.style.borderStyle = "none";
        this.div.style.borderWidth = "0px";
        this.div.style.position = "absolute";

        const img = document.createElement("img");
        img.src = this.iconPath;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.position = "absolute";
        this.div.appendChild(img);

        const panes = this.getPanes()!;
        panes.overlayLayer.appendChild(this.div);
      }

      draw() {
        const overlayProjection = this.getProjection();
        const sw = overlayProjection.fromLatLngToDivPixel(this.bounds.getSouthWest())!;
        const ne = overlayProjection.fromLatLngToDivPixel(this.bounds.getNorthEast())!;

        if (this.div) {
          this.div.style.left = sw.x + "px";
          this.div.style.top = ne.y + "px";
          this.div.style.width = ne.x - sw.x + "px";
          this.div.style.height = sw.y - ne.y + "px";
        }
      }

      onRemove() {
        if (this.div) {
          (this.div.parentNode as HTMLElement).removeChild(this.div);
          delete this.div;
        }
      }
    }

    const latLngBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(bounds.south, bounds.west),
      new google.maps.LatLng(bounds.north, bounds.east)
    );

    const overlay = new CustomSVGOverlay(latLngBounds, iconPath);
    overlay.setMap(mapRef.current);

    return () => {
      overlay.setMap(null);
    };
  }, [mapRef.current, bounds, iconPath]);

  return null;
};

export default SVGOverlay;
