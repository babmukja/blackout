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