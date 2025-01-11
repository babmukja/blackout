import * as fs from "fs";
import * as path from "path";
import { NextResponse } from "next/server";

export interface GeoFence {
  service_regions: any;
  no_parking_zones: {
    id: number;
    northeast_lat: number;
    northeast_lng: number;
    southwest_lat: number;
    southwest_lng: number;
    bounds: number[][];
  }[];
  geo_fence_areas: any;
  discount_areas: any;
}

export const GET = async () => {
  try {
    const filePath = path.join(process.cwd(), "src/data", "강남대치_geo_fence.json");
    const fileContents = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ 
      error: "Failed to read JSON file" 
    }, { 
      status: 500 
    });
  }
};
