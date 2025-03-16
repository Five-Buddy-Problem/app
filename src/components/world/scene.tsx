"use client";

import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import Globe, { type GeoJSONData } from "./globe";
import { useFields } from "@/data/fields";

// Import GeoJSON types
// interface GeoJSONGeometry {
//   type: string;
//   coordinates: number[][];
// }

// interface GeoJSONFeature {
//   type: "Feature";
//   geometry: GeoJSONGeometry;
//   properties?: Record<string, unknown>;
// }

// Camera helper to focus on a specific longitude/latitude
const CameraFocus = ({
  longitude,
  latitude,
}: {
  longitude: number;
  latitude: number;
}) => {
  const { camera } = useThree();

  longitude = 180 - longitude;

  useEffect(() => {
    // Convert longitude and latitude to position
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);

    // Position camera to look at this point
    const cameraDistance = 6;
    camera.position.x = cameraDistance * Math.sin(phi) * Math.cos(theta);
    camera.position.y = cameraDistance * Math.cos(phi);
    camera.position.z = cameraDistance * Math.sin(phi) * Math.sin(theta);

    camera.lookAt(0, 0, 0);
  }, [camera, longitude, latitude]);

  return null;
};

export default function Scene() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData[] | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getAllGeoJsonData } = useFields();

  useEffect(() => {
    setIsLoading(true);
    const geoJson = getAllGeoJsonData();
    if (!geoJson) {
      setError("No GeoJSON features found in the data.");
    } else {
      setGeoJsonData(geoJson);
      const coords = geoJson[0]?.features[0]?.geometry.coordinates;
      if (!coords || coords.length === 0) {
        setError(
          "No fields found, please register your fields to see them on the globe.",
        );
        setIsLoading(false);
        return;
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {error && (
        <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-destructive">
          {error}
        </span>
      )}
      {isLoading && (
        <span className="text-muted-foreground">
          Loading the globe with your fields...
        </span>
      )}

      <Canvas camera={{ position: [0, 0, 6], fov: 20 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />

        <Globe
          geoJsonData={geoJsonData}
          geoJsonLineColor="#FFFFFF"
          geoJsonFillColor="rgba(0, 255, 255, 0.3)"
          geoJsonLineWidth={3}
          geoJsonOpacity={1.0}
        />

        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          autoRotate={!geoJsonData || geoJsonData.length <= 0}
          autoRotateSpeed={0.2}
        />

        <CameraFocus longitude={11} latitude={42} />
      </Canvas>
    </>
  );
}
