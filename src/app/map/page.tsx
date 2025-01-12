"use client"

import { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Skeleton } from "@chakra-ui/react";
import { GeoFence } from "../api/data/route";
import { NoParkingZones } from "./zones";
import SVGOverlay from "./overlayIcon";

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

export default function Page() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const mapRef = useRef<google.maps.Map>(null);
  const [data, setData] = useState<GeoFence | null>(null);

  const onLoad = (map: google.maps.Map) => {
    mapRef.current = map;
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

  const overlayBounds = {
    north: 37.499,
    south: 37.498,
    east: 127.061,
    west: 127.060,
  };

  const iconPath = "icons/help-svgrepo-com.svg";


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
        <SVGOverlay mapRef={mapRef} bounds={overlayBounds} iconPath={iconPath} />
      </GoogleMap>
    </div>
  ) : (
    <Skeleton height="50vh" />
  );
}

