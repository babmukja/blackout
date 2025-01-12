"use client";

import { useEffect, useState } from "react";
import { DirectionsRenderer } from "@react-google-maps/api";

type LatLng = {
  lat: number;
  lng: number;
};

type RouteProps = {
  mapRef: React.MutableRefObject<google.maps.Map | null>;
  origin: LatLng;
  destination: LatLng;
};

export default function Path({ mapRef, origin, destination }: RouteProps) {
  const [directionsResponse, setDirectionsResponse] = useState<google.maps.DirectionsResult | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const fetchDirections = async () => {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK && result) {
            setDirectionsResponse(result);
          } else {
            console.error("Failed to get directions:", status);
          }
        }
      );
    };

    fetchDirections();
  }, [mapRef, origin, destination]);

  return directionsResponse ? <DirectionsRenderer directions={directionsResponse} /> : null;
}