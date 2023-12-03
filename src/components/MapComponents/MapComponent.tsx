import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';


esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';  // Replace with your actual API key

interface MapComponentProps {
	selectedFloor: string;
	setFloors: (floors: any) => void;
	onRoomSelection: (SelectedRoom: any) => void;
}

const MapComponent = ({selectedFloor, setFloors, onRoomSelection}: MapComponentProps) => {
	const mapDiv = useRef<HTMLDivElement | null>(null);
	const mapViewRef = useRef<MapView | null>(null);
	const featureLayerRef = useRef<FeatureLayer | null>(null);
	const floorAttribute = "číslo_podlaží";

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
						layer.popupEnabled = false;
						featureLayerRef.current = layer;
						queryUniqueFloors(layer);
					}
				});
			});
		});

		return () => {
			mapViewRef.current!.destroy();
		};
	}, []);

	useEffect(() => {
		if (featureLayerRef.current) {
			featureLayerRef.current!.definitionExpression = `${floorAttribute} = ${selectedFloor}`;
		}
	}, [selectedFloor]);

	useEffect(() => {
		let clickHandle: any;

		if (mapViewRef.current) {
			clickHandle = mapViewRef.current!.on("click", async(event) => {
				const layer = featureLayerRef.current;
				if (!layer) return;

				const query = layer.createQuery();
				query.geometry = event.mapPoint;
				query.spatialRelationship = "intersects";
				query.returnGeometry = false;
				query.outFields = ["*"];

				try {
					const results = await layer.queryFeatures(query);
					if (results.features.length > 0) {
						const roomData = results.features[0].attributes;
						onRoomSelection(roomData);
					}
				} catch (err: any) {
					console.error("Query error:", err);
				}
			});
		}

		return () => {
			clickHandle?.remove();
		};
	}, [onRoomSelection]);

	const queryUniqueFloors = (layer: any) => {
		const query = layer.createQuery();
		query.returnDistinctValues = true;
		query.outFields = [floorAttribute];

		layer.queryFeatures(query).then((results: any) => {
			const floors = results.features.map((feature: any) => feature.attributes[floorAttribute]);
			const uniqueFloors = Array.from(new Set(floors));
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
