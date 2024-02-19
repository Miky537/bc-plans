import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import { featureLayerUrl, fastLayerUrl } from "./constants";
import GeoJsonLoader from "./Centroid";
import { useMapContext } from "./MapContext";
import { addBoundingBox, handleCentroidsLoaded, adjustMapHeight, updateBoundingBoxes } from "./MapFunctions";


esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';

interface MapComponentProps {
	onRoomSelection: (roomId: number) => void;
	selectedFloor: number;
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}

const layerConfigs = [
	{url: featureLayerUrl, name: "Feature Layer"},
	{url: fastLayerUrl, name: "Fast Feature Layer"},
	// Add more configurations as needed
];

export type Coordinates = {
	lat: number;
	lng: number;
};

const MapComponent = ({ onRoomSelection, selectedFloor = 1, setIsDrawerOpen }: MapComponentProps) => {
	const mapDiv = useRef<HTMLDivElement | null>(null);
	const mapViewRef = useRef<MapView | null>(null);
	const featureLayersRef = useRef<FeatureLayer[]>([]);
	const highlightGraphicRef = useRef<Graphic | null>(null);

	const {centerCoordinates, isMapVisible} = useMapContext();

	const minZoomLevel = 17;

	const highlightSymbol = { // design one selected room
		type: "simple-fill",
		color: [255, 0, 0, 0.4],
		style: "solid",
		outline: {
			color: "blue",
			width: 2
		}
	};

	const toggleLayersVisibility = (visible: boolean) => {
		featureLayersRef.current.forEach(layer => {
			layer.visible = visible;
		});
	};

	useEffect(() => {
		if (!mapDiv.current) return;

		featureLayersRef.current = layerConfigs.map(config => {
			const layer = new FeatureLayer({
				url: config.url,
				outFields: ["*"],
				maxScale: 0
			});

			layer.load().then(() => {
				console.log(`${ config.name } loaded`);
				addBoundingBox(layer, mapViewRef, minZoomLevel);
			}).catch((err): any => console.error(`${ config.name } failed to load`, err));

			return layer;
		});

		const map = new Map({
			basemap: 'dark-gray-vector',
			layers: featureLayersRef.current
		});

		const mapView = new MapView({
			container: mapDiv.current,
			map: map,
			center: [centerCoordinates.lat, centerCoordinates.lng],
			zoom: 18
		});

		mapViewRef.current = mapView;

		mapView.when(() => {
			mapView.on('click', async (event) => {
				const response = await mapView.hitTest(event);
				if (response.results.length > 0) {
					const firstHit = response.results[0];
					console.log("First hit:", firstHit);
					if (firstHit.type === "graphic" && firstHit.graphic && firstHit.graphic.attributes) {

						if (highlightGraphicRef.current) {
							mapView.graphics.remove(highlightGraphicRef.current);
							highlightGraphicRef.current = null;
						}

						const clickedGraphic = firstHit.graphic;

						if ('id' || 'RoomID' in clickedGraphic.attributes) {

							highlightGraphicRef.current = new Graphic({
								geometry: clickedGraphic.geometry,
								symbol: highlightSymbol
							});
							mapView.graphics.add(highlightGraphicRef.current);
							if ("id" in clickedGraphic.attributes){
								onRoomSelection(clickedGraphic.attributes.id);
								setIsDrawerOpen(true);
							} else if ("RoomID" in clickedGraphic.attributes){
								onRoomSelection(clickedGraphic.attributes.RoomID);
								setIsDrawerOpen(true);
							}
							console.log("mam tu id:", clickedGraphic.attributes);
						} else {
							console.error("Invalid room selection");
							onRoomSelection(0);
						}
					}
				}
			});
			mapView.watch("zoom", (zoom) => {
				updateBoundingBoxes(mapViewRef, minZoomLevel, featureLayersRef, toggleLayersVisibility);
			});
		}).catch((err): any => console.error("MapView failed to load", err));

		return () => {
			if (mapView) {
				mapView.destroy();
				mapViewRef.current = null;
			}
		};
	}, [centerCoordinates.lat, centerCoordinates.lng]);

	useEffect(() => {
		// Ensure the mapView is ready before attempting to call goTo
		mapViewRef.current?.when().then(() => {
			console.log("Changing to new location: ", centerCoordinates.lat, centerCoordinates.lng)
			mapViewRef.current?.goTo({
				target: [centerCoordinates.lat, centerCoordinates.lng],
				zoom: 18
			}).catch(err => {
				console.error("Error re-centering map:", err);
			});
		});
	}, [centerCoordinates.lat, centerCoordinates.lng]);

	useEffect(() => {
		if (mapViewRef.current && highlightGraphicRef.current) {
			if ("graphics" in mapViewRef.current) {
				mapViewRef.current.graphics.remove(highlightGraphicRef.current);
				highlightGraphicRef.current = null;
			}
		}



		featureLayersRef.current.forEach(layer => {
			//wait for layer to be fully loaded
			layer.when().then(() => {
				// Now that the layer is loaded, check if it has the required field
				if (layer.fields.some(field => field.name === 'číslo_podlaží')) {
					layer.definitionExpression = `číslo_podlaží = ${ selectedFloor }`;
				}
			}, (error: any) => {
				console.error(`Error loading layer ${ layer.title }:`, error);
			});
		});
	}, [selectedFloor]);

	useEffect(() => {
		adjustMapHeight(); // Adjust on mount
		window.addEventListener('resize', adjustMapHeight); // Adjust on window resize

		// Cleanup listener on component unmount
		return () => window.removeEventListener('resize', adjustMapHeight);
	}, []); // Empty dependency array ensures this runs once on mount


	const fetchRoomsForFloor = async (floorId: number) => {
		try {
			const response = await fetch(`/api/rooms/byFloor/${floorId}`);
			if (!response.ok) {
				throw new Error('Failed to fetch rooms');
			}
			const roomsToDisplay = await response.json();
			return roomsToDisplay; // Assuming this returns an array of room details
		} catch (error) {
			console.error('Error fetching rooms:', error);
			return []; // Return an empty array in case of error
		}
	};


	return (
		<>
			<div ref={ mapDiv } id="mapDiv" />
			<GeoJsonLoader onCentroidsLoaded={ handleCentroidsLoaded }
			               mapViewRef={ mapViewRef }
			               selectedFloor={ selectedFloor } />
		</>
	);
};

export default React.memo(MapComponent);
