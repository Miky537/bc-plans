import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import { featureLayerUrl, fastLayerUrl } from "./constants";
import GeoJsonLoader, { CentroidType } from "./Centroid";
import Point from '@arcgis/core/geometry/Point';
import { getRoomLabelById } from "../parser/jsonParser";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";

import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import Polygon from "@arcgis/core/geometry/Polygon";
import Extent from "@arcgis/core/geometry/Extent";
import { useMapContext } from "./MapContext";


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

	const debounce = (func: Function, wait: number) => {
		let timeout: NodeJS.Timeout;

		return function executedFunction(...args: any) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};

			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	const updateBoundingBoxes = debounce(() => {
		const zoom : number | undefined = mapViewRef.current?.zoom;
		if (zoom === undefined) return;

		if (zoom <= minZoomLevel) {
			featureLayersRef.current.forEach(layer => addBoundingBox(layer));
			toggleLayersVisibility(false);
		} else {
			mapViewRef.current?.graphics.removeAll(); // Remove bounding boxes if below threshold
			toggleLayersVisibility(true);
		}
	}, 150); // debounce period


	const addBoundingBox = (layer: FeatureLayer) => {
		if (!mapViewRef.current || mapViewRef.current?.zoom > minZoomLevel) {
			return;
		}

		const query = layer.createQuery();
		query.where = "1=1"; // return all features
		query.returnGeometry = true;
		query.outFields = ["*"];

		layer.queryFeatures(query).then(response => {
			let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
			response.features.forEach((feature: any) => {
				const extent = feature.geometry.extent;
				minX = minX !== undefined? Math.min(minX, extent.xmin) : extent.xmin;
				minY = minY !== undefined? Math.min(minY, extent.ymin) : extent.ymin;
				maxX = maxX !== undefined? Math.max(maxX, extent.xmax) : extent.xmax;
				maxY = maxY !== undefined? Math.max(maxY, extent.ymax) : extent.ymax;
			});

			if (mapViewRef.current && minX !== undefined && minY !== undefined && maxX !== undefined && maxY !== undefined) {
				const extent = new Extent({
					xmin: minX,
					ymin: minY,
					xmax: maxX,
					ymax: maxY,
					spatialReference: mapViewRef.current?.spatialReference
				});

				const boundingBox = Polygon.fromExtent(extent);

				const boundingBoxGraphic = new Graphic({
					geometry: boundingBox,
					symbol: new SimpleFillSymbol({
						color: "rgba(255,255,255,0.5)",
						outline: {
							color: "gray",
							width: 2
						},
					})
				});

				mapViewRef.current?.graphics.add(boundingBoxGraphic);
			}
		}).catch((err): any => {
			console.error("Failed to query features:", err);
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
				addBoundingBox(layer);
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
							setIsDrawerOpen(true);
							highlightGraphicRef.current = new Graphic({
								geometry: clickedGraphic.geometry,
								symbol: highlightSymbol
							});
							mapView.graphics.add(highlightGraphicRef.current);
							if ("id" in clickedGraphic.attributes){
								onRoomSelection(clickedGraphic.attributes.id);
							} else if ("RoomID" in clickedGraphic.attributes){
								onRoomSelection(clickedGraphic.attributes.RoomID);
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
				updateBoundingBoxes();
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

	const handleCentroidsLoaded = (centroids: CentroidType[]) => {
		centroids.forEach(({longitude, latitude, id}: CentroidType) => {
			const roomLabel = getRoomLabelById(id, selectedFloor);
			const labelPoint = new Point({
				longitude: longitude,
				latitude: latitude
			});

			const textSymbol = new TextSymbol({
				text: roomLabel,
				color: "black",
				font: {
					size: 12,
					family: "Arial"
				}
			});

			const labelGraphic = new Graphic({
				geometry: labelPoint,
				symbol: textSymbol
			});

			if (mapViewRef.current) {
				mapViewRef.current?.graphics.add(labelGraphic);
			}
		});
	};

	const adjustMapHeight = () => {
		const topBarElement = document.getElementById('topbar'); // Adjust 'topbar' to your topbar's ID
		const mapContainerElement = document.getElementById('mapDiv'); // Adjust 'mapDiv' to your map container's ID

		if (topBarElement && mapContainerElement) {
			const topBarHeight = topBarElement.clientHeight;
			const viewportHeight = window.innerHeight;
			const mapHeight = `${ viewportHeight - topBarHeight }px`;
			console.log('Map height:', mapHeight);
			mapContainerElement.style.height = mapHeight;
		} else {
			console.error('Topbar or MapDiv element is not found in the document.');
		}
	};

	useEffect(() => {
		adjustMapHeight(); // Adjust on mount
		window.addEventListener('resize', adjustMapHeight); // Adjust on window resize

		// Cleanup listener on component unmount
		return () => window.removeEventListener('resize', adjustMapHeight);
	}, []); // Empty dependency array ensures this runs once on mount


	return (
		<>
			<div ref={ mapDiv } id="mapDiv" />
			<GeoJsonLoader onCentroidsLoaded={ handleCentroidsLoaded } />
		</>
	);
};

export default React.memo(MapComponent);
