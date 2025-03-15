"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import Globe, {
  GeoJSONCoordinate,
  GeoJSONData,
  latLongToVector3,
} from "./globe";
import { Vector3 } from "three";
import { useFields } from "@/data/fields";

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
}: {
  longitude: number;
  latitude: number;
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
  const [geoJsonData, setGeoJsonData] = useState<GeoJSONData[] | undefined>(
    undefined,
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [focusCoordinates, setFocusCoordinates] = useState<[number, number]>([
    0, 0,
  ]);
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
        return;
      }
      const firstCoords = latLongToVector3(
        coords[0]![0]![0],
        coords[0]![0]![1],
        2,
      );

      setFocusCoordinates([firstCoords.x, firstCoords.y]);
    }
    setIsLoading(false);
  }, []);

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

        {focusCoordinates && (
          <CameraFocus
            longitude={focusCoordinates[0]}
            latitude={focusCoordinates[1]}
          />
        )}
      </Canvas>
    </>
  );
}
