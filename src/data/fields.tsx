"use client";

import { useEffect } from "react";

export type Field = {
  name: string;
  crop: string;
  lastUpdated: Date;
  loading: boolean;
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
  } catch (e) {
    return false;
  }
};

// In-memory fallback when localStorage is not available
let inMemoryFields: Field[] = [];

// Get fields from localStorage or memory fallback
export function getFieldsFromStorage(): Field[] {
  if (!isLocalStorageAvailable()) {
    return inMemoryFields;
  }

  const fieldsJSON = localStorage.getItem(FIELDS_STORAGE_KEY);
  if (!fieldsJSON) return [];

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
  };
}
