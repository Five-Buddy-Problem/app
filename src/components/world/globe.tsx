"use client";

import { Sphere, useTexture } from "@react-three/drei";
import { useEffect, useRef } from "react";
import {
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  Vector3,
} from "three";

// Properly typed GeoJSON interfaces
export interface GeoJSONCoordinate {
  0: number; // longitude
  1: number; // latitude
}

interface GeoJSONGeometry {
  type: "Polygon";
  coordinates: GeoJSONCoordinate[][];
}

interface GeoJSONFeature {
  type: "Feature";
  geometry: GeoJSONGeometry;
  properties?: Record<string, unknown>;
}

export interface GeoJSONData {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

interface GlobeProps {
  geoJsonData?: GeoJSONData[];
  geoJsonLineColor?: string;
  geoJsonFillColor?: string;
  geoJsonLineWidth?: number;
  geoJsonOpacity?: number;
}

// Helper function to convert lat/long to 3D coordinates
export const latLongToVector3 = (
  latitude: number,
  longitude: number,
  radius: number,
): Vector3 => {
  // Convert to radians
  const phi = (90 - latitude) * (Math.PI / 180);
  const theta = (longitude + 180) * (Math.PI / 180);

  // Convert to Cartesian coordinates
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new Vector3(x, y, z);
};

export default function Globe({
  geoJsonData,
  geoJsonLineColor = "#FFFFFF", // White outline
  geoJsonFillColor = "rgba(0, 255, 255, 0.3)", // Semi-transparent cyan fill
  geoJsonLineWidth = 3, // Thicker lines
  geoJsonOpacity = 1.0, // Full opacity
}: GlobeProps) {
  const meshRef = useRef<Mesh>(null!);
  const geoJsonRef = useRef<Group>(new Group());

  // Load earth texture
  const earthTexture = useTexture("/earth8k.jpg");

  // Convert GeoJSON to 3D coordinates
  useEffect(() => {
    if (!geoJsonData || !geoJsonRef.current) return;

    // Remove any existing elements
    while (geoJsonRef.current.children.length > 0) {
      if (geoJsonRef.current.children[0])
        geoJsonRef.current.remove(geoJsonRef.current.children[0]);
    }

    // Set a slightly larger radius for the GeoJSON to be visible above the globe
    const globeRadius = 2;
    const geoJsonRadius = globeRadius * 1.005; // Just slightly above the globe surface

    // Process each feature
    geoJsonData.forEach((geoJson) => {
      geoJson.features.forEach((feature) => {
        if (
          feature.geometry.type === "Polygon" ||
          feature.geometry.type === "MultiPolygon"
        ) {
          // Type assertions to handle the polymorphic types
          const polygons = [feature.geometry.coordinates];

          polygons.forEach((polygon) => {
            // Process each ring of the polygon
            polygon.forEach((ring) => {
              // Create the outline
              const outlinePoints: Vector3[] = [];

              // Create points for the shape (for filling)
              const points: Vector3[] = [];

              ring.forEach((coord: GeoJSONCoordinate) => {
                // Extract coordinates
                const longitude = coord[0];
                const latitude = coord[1];

                if (
                  typeof longitude === "number" &&
                  typeof latitude === "number"
                ) {
                  const point = latLongToVector3(
                    latitude,
                    longitude,
                    geoJsonRadius,
                  );
                  outlinePoints.push(point);
                  points.push(point);
                }
              });

              if (outlinePoints.length > 2) {
                // Create outline
                const outlineGeometry = new BufferGeometry().setFromPoints(
                  outlinePoints,
                );
                const outlineMaterial = new LineBasicMaterial({
                  color: new Color(geoJsonLineColor),
                  linewidth: geoJsonLineWidth,
                  opacity: geoJsonOpacity,
                  transparent: true,
                });
                const outline = new Line(outlineGeometry, outlineMaterial);

                // Store feature properties
                if (feature.properties) {
                  outline.userData = feature.properties;
                }

                // Add to the group
                geoJsonRef.current.add(outline);

                // Create filled area (this is challenging in 3D spherical space)
                // We'll use a simplified approach by rendering individual faces
                for (let i = 0; i < points.length - 2; i++) {
                  const triangleGeometry = new BufferGeometry();
                  const vertices = [
                    points[0]!.x,
                    points[0]!.y,
                    points[0]!.z,
                    points[i + 1]!.x,
                    points[i + 1]!.y,
                    points[i + 1]!.z,
                    points[i + 2]!.x,
                    points[i + 2]!.y,
                    points[i + 2]!.z,
                  ];

                  triangleGeometry.setAttribute(
                    "position",
                    new Float32BufferAttribute(vertices, 3),
                  );
                  triangleGeometry.computeVertexNormals();

                  // Create material with transparency for the fill
                  const fillColor = new Color(geoJsonFillColor.substring(0, 7)); // Get the hex color part
                  const fillOpacity = parseFloat(
                    geoJsonFillColor.substring(
                      geoJsonFillColor.lastIndexOf(",") + 1,
                      geoJsonFillColor.length - 1,
                    ),
                  );

                  const fillMaterial = new MeshBasicMaterial({
                    color: fillColor,
                    transparent: true,
                    opacity: fillOpacity,
                    side: DoubleSide,
                  });

                  const triangleMesh = new Mesh(triangleGeometry, fillMaterial);

                  // Store feature properties
                  if (feature.properties) {
                    triangleMesh.userData = feature.properties;
                  }

                  geoJsonRef.current.add(triangleMesh);
                }
              }
            });
          });
        }
      });
    });
  }, [
    geoJsonData,
    geoJsonLineColor,
    geoJsonFillColor,
    geoJsonLineWidth,
    geoJsonOpacity,
  ]);

  return (
    <>
      <mesh ref={meshRef}>
        <Sphere args={[2, 64, 64]}>
          <meshStandardMaterial
            map={earthTexture}
            opacity={0.8} // Slightly transparent globe to emphasize GeoJSON
            transparent={true}
          />
        </Sphere>
      </mesh>
      <primitive object={geoJsonRef.current} />
    </>
  );
}
