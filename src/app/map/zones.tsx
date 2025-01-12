"use client"

import { useEffect } from "react";
import { GeoFence } from "../api/data/route";

export const NoParkingZones = ({ mapRef, data }: { mapRef: React.RefObject<google.maps.Map | null>, data: GeoFence | null }) => {
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

export const WhitelistZones = ({ mapRef }: { mapRef: React.RefObject<google.maps.Map | null>}) => {
  // 더미데이터
  const polygons = [
    [
      { lat: 37.498943, lng: 127.060781 },
      { lat: 37.498516, lng: 127.061000 },
      { lat: 37.497918, lng: 127.059208 },
      { lat: 37.498254, lng: 127.058926 },
    ],
  ];
  useEffect(() => {
    if (!mapRef.current) return;

    for (const coords of polygons) {
      const polygon = new google.maps.Polygon({
        paths: coords,
        strokeColor: "#00FF00",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#00FF00",
        fillOpacity: 0.35,
      });
      polygon.setMap(mapRef.current);
    }
  }, [mapRef]);

  return null;
};