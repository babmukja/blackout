"use client"

import { useState, useEffect, useRef } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot, Box, Button, Card, Flex, Skeleton, Text } from "@chakra-ui/react";
import { GeoFence } from "../api/data/route";
import { NoParkingZones, WhitelistZones } from "./zones";
import SVGOverlay from "./overlayIcon";
import Path from "./path";
import Papa, { ParseResult } from 'papaparse';
import { useRouter } from "next/navigation";

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

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371000;

  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const phi1 = toRadians(lat1);
  const phi2 = toRadians(lat2);
  const deltaPhi = toRadians(lat2 - lat1);
  const deltaLambda = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
}

export default function Page() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });
  const mapRef = useRef<google.maps.Map>(null);
  const [data, setData] = useState<GeoFence | null>(null);
  const [overlays, setOverlays] = useState<any[]>([]);
  const router = useRouter();

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
          {/* <Path mapRef={mapRef} origin={origin} destination={destinatin} /> */}
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
      <AccordionRoot collapsible defaultValue={["b"]} size="lg">
      {overlays.map((item, idx) => {
        const distance = Math.floor(
          haversineDistance(center.lat, center.lng, item.position.lat, item.position.lng)
        );

        return (
          <Card.Root 
            width="full"
            backgroundColor={"#f1f3f4"}
            border={"none"}
            borderRadius={"8px"}
            marginBottom={"30px"}
            key={idx}
          >
            <AccordionItem value={idx.toString()}>
              <AccordionItemTrigger>
                <Card.Body gap="2">
                  <Card.Title mt="2">{distance} 미터</Card.Title>
                  <Card.Description>
                  </Card.Description>
                </Card.Body>  
              </AccordionItemTrigger>
              <AccordionItemContent>
                <Flex width={"full"} justifyContent={"center"} marginBottom={"30px"}>
                  <Button width={"80%"} backgroundColor={"#28C86E"} onClick={() => router.push("/map/reward")}>구하기!</Button>
                </Flex>
              </AccordionItemContent>
            </AccordionItem>
          </Card.Root>
        )
      })}
    </AccordionRoot>
    </Box>
    </>
  )
  
  
}

