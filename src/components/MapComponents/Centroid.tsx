import roomsGeoJson from "./re_mistnosti.json"

import { useEffect, useState } from 'react';
import polylabel from 'polylabel';

export type CentroidType = {
	longitude: number;
	latitude: number;
	id: number;
};

const GeoJsonLoader = ({onCentroidsLoaded, mapViewRef, selectedFloor}: any) => {
	const [centroids, setCentroids] = useState<CentroidType[]>([]);

	useEffect(() => {
		const calculatedCentroids = roomsGeoJson.features.map(feature => {
			if (feature.geometry.type === "Polygon") {
				const coordinates = feature.geometry.coordinates as any;
				const labelPoint = polylabel(coordinates);
				return {
					longitude: labelPoint[0],
					latitude: labelPoint[1],
					id: feature.properties.id,
				};
			} else if (feature.geometry.type === "MultiPolygon") {
				// For MultiPolygons, use the first polygon
				const firstPolygonCoordinates = feature.geometry.coordinates[0];
				if (firstPolygonCoordinates.length > 0 && Array.isArray(firstPolygonCoordinates[0])) {
					// Flatten one level - take the first polygon from MultiPolygon
					const labelPoint = polylabel(firstPolygonCoordinates);
					return {
						longitude: labelPoint[0],
						latitude: labelPoint[1],
						id: feature.properties.id,
					};
				}
			}

			return null; // Return null for unsupported types or if coordinates are not as expected
		}).filter((centroid): centroid is CentroidType => centroid !== null);

		setCentroids(calculatedCentroids);

		if (onCentroidsLoaded) {
			onCentroidsLoaded(calculatedCentroids, mapViewRef, selectedFloor);
		}
	}, [onCentroidsLoaded]);

	// Render nothing - this component is purely for data processing
	return null;
};

export default GeoJsonLoader;

