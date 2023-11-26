import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';

esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';

const MapComponent = ({ selectedFloor, setFloors }: any) => {

	const mapDiv = useRef<HTMLDivElement | null>(null);
	const mapViewRef = useRef<MapView | null>(null);
	const featureLayerRef = useRef<FeatureLayer | null>(null);

	useEffect(() => {
		if (!mapDiv.current) return;

		const webMap = new WebMap({
			portalItem: { id: 'f8374035877545c9916d19faed8d39f7' }
		});

		mapViewRef.current = new MapView({
			container: mapDiv.current,
			map: webMap
		});

		mapViewRef.current?.when(() => {
			webMap.load().then(() => {
				webMap.layers.forEach(layer => {
					if (layer instanceof FeatureLayer) {
						featureLayerRef.current = layer;
						queryUniqueFloors(layer); // Query unique floors first
					}
				});
			});
		});

		return () => mapViewRef.current!.destroy();
	}, []);

	useEffect(() => {
		// Update the definitionExpression after fetching unique floors
		if (featureLayerRef.current) {
			featureLayerRef.current!.definitionExpression = `číslo_podlaží = ${selectedFloor}`;
		}
	}, [selectedFloor]);

	const queryUniqueFloors = (layer: any) => {
		const query = layer.createQuery();
		query.returnDistinctValues = true;
		query.outFields = ["číslo_podlaží"];

		layer.queryFeatures(query).then((results: any) => {
			const floors = results.features.map((feature: any) => feature.attributes["číslo_podlaží"]);
			const uniqueFloors = Array.from(new Set(floors));
			console.log("Unique Floors:", uniqueFloors);
			setFloors(uniqueFloors);
		}).catch((err: Error) => {
			console.error("Query error:", err);
		});
	};

	return (
		<div ref={mapDiv} className="map-container" style={{ height: "100vh", width: '100%' }} />
	);
};

export default MapComponent;
