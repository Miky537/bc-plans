import roomsGeoJson from "./re_mistnosti.json"

import { useEffect, useState } from 'react';
import * as turf from '@turf/turf';
import { AllGeoJSON } from "@turf/turf";
import polylabel from 'polylabel';

type Centroid = {
	longitude: number;
	latitude: number;
	id: number;
};

const GeoJsonLoader = ({ onCentroidsLoaded }:any) => {
	const [centroids, setCentroids] = useState<Centroid[]>([]);

	useEffect(() => {
		const calculatedCentroids = roomsGeoJson.features.map(feature => {
			if (feature.geometry.type === "Polygon") {
				// Directly use the coordinates for Polygons
				const coordinates = feature.geometry.coordinates;
				const labelPoint = polylabel(coordinates);
				return {
					longitude: labelPoint[0],
					latitude: labelPoint[1],
					id: feature.properties.id,
				};
			} else if (feature.geometry.type === "MultiPolygon") {
				// For MultiPolygons, use the first polygon
				const firstPolygonCoordinates = feature.geometry.coordinates[0];
				// Ensure firstPolygonCoordinates is a number[][][]
				if (firstPolygonCoordinates.length > 0 && Array.isArray(firstPolygonCoordinates[0])) {
					const labelPoint = polylabel(firstPolygonCoordinates as number[][][]);
					return {
						longitude: labelPoint[0],
						latitude: labelPoint[1],
						id: feature.properties.id,
					};
				}
			}

			return null; // Return null for unsupported types or if coordinates are not as expected
		}).filter((centroid): centroid is Centroid => centroid !== null);

		setCentroids(calculatedCentroids);

		if (onCentroidsLoaded) {
			onCentroidsLoaded(calculatedCentroids);
		}
	}, [onCentroidsLoaded]);

	// Render nothing - this component is purely for data processing
	return null;
};

export default GeoJsonLoader;

