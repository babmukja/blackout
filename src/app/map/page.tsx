"use client"

import { useState, useEffect, useRef, RefObject } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Skeleton } from "@chakra-ui/react";
import { GeoFence } from "../api/data/route";

const containerStyle = {
  width: "100%",
  height: "50vh",
};


type LatLng = {
  lat: number;
  lng: number;
};

const center: LatLng = {
  // 은마사거리
  lat: 37.498973,
  lng: 127.060913,
};

const zoomLevel = 17;

const NoParkingZones = ({ mapRef, data }: { mapRef: React.RefObject<google.maps.Map | null>, data: GeoFence | null }) => {
  useEffect(() => {
    if (!mapRef.current) return;

    const polygons = [];
    if (data?.no_parking_zones) {
      for (const zones of data?.no_parking_zones) {
        const polygonCoords = zones.bounds.map((coord) => {
          const [lng, lat] = coord;
          return { lat, lng };
        });

        const polygon = new google.maps.Polygon({
          paths: polygonCoords,
          strokeColor: "#FF0000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.35,
        });
        polygons.push(polygon);
      }
    }

    for (const polygon of polygons) {
      polygon.setMap(mapRef.current);
    }
  }, [mapRef]);

  return null;
};

export default function Page() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const mapRef = useRef<google.maps.Map>(null);
  const [data, setData] = useState<GeoFence | null>(null);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;

    class SVGOverlay extends google.maps.OverlayView {
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
        img.style.width = "50px"; // Fixed size
        img.style.height = "50px"; // Fixed size
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

      hide() {
        if (this.div) {
          this.div.style.visibility = "hidden";
        }
      }

      show() {
        if (this.div) {
          this.div.style.visibility = "visible";
        }
      }

      toggle() {
        if (this.div) {
          if (this.div.style.visibility === "hidden") {
            this.show();
          } else {
            this.hide();
          }
        }
      }

      toggleDOM(map: google.maps.Map) {
        if (this.getMap()) {
          this.setMap(null);
        } else {
          this.setMap(map);
        }
      }
    }

    const iconPath = "icons/help-svgrepo-com.svg"; // Update this path to your SVG icon
    const overlay = new SVGOverlay(center, iconPath);
    overlay.setMap(map);
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  useEffect(() => {
    fetch("/api/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


  return isLoaded ? (
    <div style={{ position: "relative" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoomLevel}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <NoParkingZones mapRef={mapRef} data={data} />
      </GoogleMap>
    </div>
  ) : (
    <Skeleton height="50vh" />
  );
}

