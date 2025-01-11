"use client"

import { useState, useEffect, useRef } from "react";
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

const CustomUI = ({ position }: { position: LatLng }) => {
  const [style, setStyle] = useState({});
  const [data, setData] = useState<GeoFence | null>(null);

  useEffect(() => {
    // 데이터
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

    // Google Maps Projection을 활용하여 UI 위치 계산
    const overlay = new google.maps.OverlayView();
    overlay.onAdd = function () {};
    overlay.draw = function () {
      const projection = this.getProjection();
      if (projection) {
        const point = projection.fromLatLngToDivPixel(
          new google.maps.LatLng(position.lat, position.lng)
        );
        setStyle({
          position: "absolute",
          left: `${point?.x}px`,
          top: `${point?.y}px`,
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "5px",
        });
      }
    };
    overlay.onRemove = function () {};
    overlay.setMap(null); // API 로드 완료 후 맵 연결
  }, [position]);

  return <div style={style}></div>;
};

export default function Page() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const mapRef = useRef(null);

  const onLoad = (map: any) => {
    mapRef.current = map;
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  return isLoaded ? (
    <div style={{ position: "relative" }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoomLevel}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <CustomUI position={center} />
      </GoogleMap>
    </div>
  ) : (
    <Skeleton height="50vh" />
  );
}
