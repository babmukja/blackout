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
}

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

  const onLoad = (map: any) => {
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
