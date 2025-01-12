"use client"

import { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Skeleton } from "@chakra-ui/react";
import { GeoFence } from "../api/data/route";
import { NoParkingZones } from "./zones";
import SVGOverlay from "./overlayIcon";
import Path from "./path";
import Papa, { ParseResult } from 'papaparse';

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

const origin: LatLng = {
  // 은마사거리
  lat: 37.498973,
  lng: 127.060913,
};

const destinatin: LatLng = {
  lat: 37.500786, // 역삼역
  lng: 127.036469,
}

export default function Page() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const mapRef = useRef<google.maps.Map>(null);
  const [data, setData] = useState<GeoFence | null>(null);
  const [overlays, setOverlays] = useState<any[]>([]);

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

      fetch("/data/regionid_560_test_data.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          complete: (results: ParseResult<any>) => {
            const coords = results.data
              .slice(350, 400)
              .filter((_: any, index: number) => index % 5 === 0)
              .map((row: any) => ({
                position: {
                  lat: parseFloat(row.end_lat),
                  lng: parseFloat(row.end_lng),
                },
                iconPath: "/icons/help-svgrepo-com.svg", // Update this path to your SVG icon
              }));
            setOverlays(coords);
          },
        });
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

        {/* <SVGOverlay mapRef={mapRef} bounds={overlayBounds} iconPath={iconPath} /> */}
        <Path mapRef={mapRef} origin={origin} destination={destinatin} />

        <SVGOverlay mapRef={mapRef} overlays={overlays} />

      </GoogleMap>
    </div>
  ) : (
    <Skeleton height="50vh" />
  );
}

