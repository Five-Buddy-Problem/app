/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */

"use client";

import type { GeoJSONData } from "@/components/world/globe";
import { useEffect } from "react";

export type Field = {
  name: string;
  crop: string;
  lastUpdated: Date;
  loading: boolean;
  geoJson: GeoJSONData;
  finishTime: Date;
  imageSrc: string;
  data?: {
    infected: boolean;
    infectationChance: number;
  };
};

// Key for the localStorage
const FIELDS_STORAGE_KEY = "fields_data";

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (error: unknown) {
    console.error("localStorage is not available:", error);
    return false;
  }
};

// In-memory fallback when localStorage is not available
let inMemoryFields: Field[] = [];

export function getAllGeoJsonData() {
  return fields.map((field) => field.geoJson);
}

// Get fields from localStorage or memory fallback
export function getFieldsFromStorage(): Field[] {
  if (!isLocalStorageAvailable()) {
    return inMemoryFields;
  }

  const fieldsJSON = localStorage.getItem(FIELDS_STORAGE_KEY);
  if (!fieldsJSON) {
    // This is the first time the app is loaded.
    // Load the app with some mock data
    const mockData: Field[] = [
      {
        name: "Field 1",
        crop: "Wheat",
        lastUpdated: new Date(),
        loading: false,
        imageSrc: "/fields/field1.png",
        geoJson: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [
                  [
                    [10.1462154932114, 45.12560525530924],
                    [10.1462154932114, 45.985198388170716],
                    [8.23058979531993, 45.985198388170716],
                    [8.23058979531993, 45.12560525530924],
                    [10.1462154932114, 45.12560525530924],
                  ],
                ],
                type: "Polygon",
              },
            },
          ],
        },
        finishTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 0.3),
      },
      {
        name: "Field 2",
        crop: "Corn",
        lastUpdated: new Date(),
        loading: false,
        imageSrc: "/fields/field2.png",
        geoJson: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                coordinates: [
                  [
                    [11.898955111101458, 42.22013122218158],
                    [11.898955111101458, 41.53770959372409],
                    [13.165839381129047, 41.53770959372409],
                    [13.165839381129047, 42.22013122218158],
                    [11.898955111101458, 42.22013122218158],
                  ],
                ],
                type: "Polygon",
              },
            },
          ],
        },
        finishTime: new Date(new Date().getTime() + 1000 * 60 * 60 * 0.17),
      },
    ];

    saveFieldsToStorage(mockData);
    return mockData;
  }

  try {
    // Parse the JSON and convert date strings back to Date objects
    const parsedFields = JSON.parse(fieldsJSON, (key, value) => {
      if (key === "lastUpdated") {
        return new Date(value);
      }
      return value;
    });
    return parsedFields;
  } catch (error) {
    console.error("Error parsing fields from localStorage:", error);
    return [];
  }
}

// Save fields to localStorage or memory fallback
export function saveFieldsToStorage(fields: Field[]): void {
  if (!isLocalStorageAvailable()) {
    inMemoryFields = [...fields];
    return;
  }

  try {
    const fieldsJSON = JSON.stringify(fields);
    localStorage.setItem(FIELDS_STORAGE_KEY, fieldsJSON);
  } catch (error) {
    console.error("Error saving fields to localStorage:", error);
    inMemoryFields = [...fields];
  }
}

// Fields array that will be synced with storage
export let fields: Field[] = getFieldsFromStorage();

// Add a new field
export function addField(field: Omit<Field, "loading" | "lastUpdated">): void {
  fields.push({ ...field, lastUpdated: new Date(), loading: false });
  saveFieldsToStorage(fields);
}

// Remove a field
export function removeField(fieldName: Field["name"]): void {
  const fieldIndex = fields.findIndex((field) => field.name === fieldName);
  if (fieldIndex === -1) return;

  fields.splice(fieldIndex, 1);
  saveFieldsToStorage(fields);
}

// Update a field
export function updateField(field: Field, data: Partial<Field>): void {
  Object.assign(field, data);
  saveFieldsToStorage(fields);
}

export function setLoading(fieldName: Field["name"], loading: boolean): void {
  const field = fields.find((field) => field.name === fieldName);
  if (field) {
    field.loading = loading;
    saveFieldsToStorage(fields);
  }
}

// React hook for components that need to access fields
export function useFields() {
  useEffect(() => {
    // Initialize fields from storage when component mounts
    fields = getFieldsFromStorage();

    // Setup storage event listener for cross-tab synchronization
    // (only if localStorage is available)
    if (isLocalStorageAvailable()) {
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === FIELDS_STORAGE_KEY) {
          fields = getFieldsFromStorage();
        }
      };

      window.addEventListener("storage", handleStorageChange);

      // Cleanup listener on unmount
      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);

  return {
    fields,
    addField,
    removeField,
    updateField,
    getAllGeoJsonData,
    setLoading,
  };
}
