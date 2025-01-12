"use client"

import { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { Box, Card, Skeleton, Text } from "@chakra-ui/react";
import { GeoFence } from "../api/data/route";
import { NoParkingZones, WhitelistZones } from "./zones";
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
    fetch("/data/강남대치_geo_fence.json")
    .then((res) => res.json())
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


  return (
    <>
    {isLoaded ? (
      <div style={{ position: "relative" }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoomLevel}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <NoParkingZones mapRef={mapRef} data={data} />
          <SVGOverlay mapRef={mapRef} overlays={overlays} />
          <Path mapRef={mapRef} origin={origin} destination={destinatin} />
          <WhitelistZones mapRef={mapRef} />
        </GoogleMap>
      </div>
    ) : (
      <Skeleton height="50vh" />
    )}
    <Box>
      <Text fontSize={"24px"} fontWeight={"700"} marginTop={"30px"} marginBottom={"30px"}>
        지쿠를 구해주세요!
      </Text>
      <Card.Root 
        width="full"
        backgroundColor={"#f1f3f4"}
        border={"none"}
        borderRadius={"8px"}
      >
        <Card.Body gap="2">
          <Card.Title mt="2">23 미터</Card.Title>
          <Card.Description>
            가장 가까운 주차 구역: 45 미터
          </Card.Description>
        </Card.Body>
      </Card.Root>
      <Card.Root 
        width="full"
        backgroundColor={"#f1f3f4"}
        border={"none"}
        borderRadius={"8px"}
      >
        <Card.Body gap="2">
          <Card.Title mt="2">23 미터</Card.Title>
          <Card.Description>
            가장 가까운 주차 구역: 45 미터
          </Card.Description>
        </Card.Body>
      </Card.Root>
    </Box>
    </>
  )
  
  
}

