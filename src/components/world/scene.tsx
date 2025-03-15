"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import Globe, { GeoJSONCoordinate, GeoJSONData } from "./globe";
import { Vector3 } from "three";

// Import GeoJSON types
interface GeoJSONGeometry {
  type: string;
  coordinates: number[][];
}

interface GeoJSONFeature {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties?: Record<string, unknown>;
}

// Camera helper to focus on a specific longitude/latitude
const CameraFocus = ({
  longitude,
  latitude,
  enableAutomaticRotation = true,
}: {
  longitude: number;
  latitude: number;
  enableAutomaticRotation?: boolean;
}) => {
  const { camera } = useThree();
  const rotationRef = useRef({ value: 0 });

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

// Label component to mark GeoJSON regions
const GeoLabel = ({ position, text }: { position: Vector3; text: string }) => {
  return (
    <Text
      position={position}
      fontSize={0.2}
      color="#FFFFFF"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#000000"
    >
      {text}
    </Text>
  );
};

export default function Scene() {
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [focusedRegion, setFocusedRegion] = useState<string | null>(null);
  const [focusCoordinates, setFocusCoordinates] = useState<[number, number]>([
    0, 0,
  ]);

  useEffect(() => {
    // Fetch GeoJSON data
    setIsLoading(true);
    fetch("/countries.geojson")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data: GeoJSONData) => {
        setGeoJsonData(data);
        setIsLoading(false);

        // Set initial focus to the first feature
        if (data.features.length > 0) {
          const feature = data.features[0];

          if (!feature) return;

          // Find center coordinates of the first feature
          if (feature.geometry.type === "Polygon") {
            const coords = feature.geometry
              .coordinates as GeoJSONCoordinate[][];
            if (!coords[0]) return;

            if (coords[0].length > 0) {
              const centerLong =
                coords[0].reduce((sum, coord) => sum + coord[0]!, 0) /
                coords[0].length;
              const centerLat =
                coords[0].reduce((sum, coord) => sum + coord[1]!, 0) /
                coords[0].length;
              setFocusCoordinates([centerLong, centerLat]);
            }
          }
        }
      })
      .catch((error: Error) => {
        console.error("Error loading GeoJSON:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  if (!geoJsonData) {
    return (
      <>
        <span className="text-destructive">
          No GeoJSON features found in the data.
        </span>
        <Globe />
      </>
    );
  }

  return (
    <>
      {error && (
        <span className="text-destructive">
          There was an error loading the globe. Please try again later.
        </span>
      )}
      {isLoading && (
        <span className="text-muted-foreground">
          Loading the globe with your fields...
        </span>
      )}

      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
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
          autoRotate={false}
          autoRotateSpeed={0.5}
        />

        {/* Focus camera on selected region */}
        {focusCoordinates && (
          <CameraFocus
            longitude={focusCoordinates[0]}
            latitude={focusCoordinates[1]}
            enableAutomaticRotation={false}
          />
        )}
      </Canvas>
    </>
  );
}
