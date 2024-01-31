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

const MapComponent = ({ onRoomSelection, selectedFloor = 1, setIsDrawerOpen }: MapComponentProps) => {
	const mapDiv = useRef<HTMLDivElement | null>(null);
	const mapViewRef = useRef<MapView | null>(null);
	const featureLayersRef = useRef<FeatureLayer[]>([]);
	const highlightGraphicRef = useRef<Graphic | null>(null);
	const minZoomLevel = 17;

	const highlightSymbol = {
		type: "simple-fill",
		color: [255, 0, 0, 0.4],
		style: "solid",
		outline: {
			color: "blue",
			width: 2
		}
	};

	const toggleLayersVisibility = (visible) => {
		featureLayersRef.current.forEach(layer => {
			layer.visible = visible;
		});
	};

	const debounce = (func: any, wait: number) => {
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
		} else {
			mapViewRef.current?.graphics.removeAll(); // Remove bounding boxes if below threshold
		}
	}, 150); // 250 milliseconds debounce period


	const addBoundingBox = (layer: FeatureLayer) => {
		if (!mapViewRef.current || mapViewRef.current?.zoom > minZoomLevel) {
			return;
		}

		const query = layer.createQuery();
		query.where = "1=1";
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
					spatialReference: mapViewRef.current.spatialReference
				});

				const boundingBox = Polygon.fromExtent(extent);

				const boundingBoxGraphic = new Graphic({
					geometry: boundingBox,
					symbol: new SimpleFillSymbol({
						color: "rgba(0,0,0,0.1)",
						outline: {
							color: "black",
							width: 2
						}
					})
				});

				mapViewRef.current.graphics.add(boundingBoxGraphic);
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
			center: [16.603375432788052, 49.20174147400288],
			zoom: 18
		});

		mapViewRef.current = mapView;

		mapView.when(() => {
			mapView.on('click', async (event) => {
				const response = await mapView.hitTest(event);
				if (response.results.length > 0) {
					const firstHit = response.results[0];
					if (firstHit.type === "graphic" && firstHit.graphic && firstHit.graphic.attributes) {
						if (highlightGraphicRef.current) {
							mapView.graphics.remove(highlightGraphicRef.current);
							highlightGraphicRef.current = null;
						}

						const clickedGraphic = firstHit.graphic;

						if ('id' in clickedGraphic.attributes) {
							setIsDrawerOpen(true);
							highlightGraphicRef.current = new Graphic({
								geometry: clickedGraphic.geometry,
								symbol: highlightSymbol
							});
							mapView.graphics.add(highlightGraphicRef.current);

							onRoomSelection(clickedGraphic.attributes.id);
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
		});

		return () => {
			if (mapView) {
				mapView.destroy();
			}
		};
	}, []);

	useEffect(() => {
		if (mapViewRef.current && highlightGraphicRef.current) {
			if ("graphics" in mapViewRef.current) {
				mapViewRef.current.graphics.remove(highlightGraphicRef.current);
				highlightGraphicRef.current = null;
			}
		}

		featureLayersRef.current.forEach(layer => {
			//wait for layer to be fully loaded
			layer.when(() => {
				// Now that the layer is loaded, check if it has the required field
				if (layer.fields.some(field => field.name === 'číslo_podlaží')) {
					layer.definitionExpression = `číslo_podlaží = ${ selectedFloor }`;
					// console.log(`Definition Expression set for ${ layer.title }: číslo_podlaží = ${ selectedFloor }`);
				}
			}, (error: any) => {
				console.error(`Error loading layer ${ layer.title }:`, error);
			});
		});
	}, [selectedFloor]);

	const handleCentroidsLoaded = (centroids: any) => {
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


	return (
		<>
			<div ref={ mapDiv } className="map-container" />
			<GeoJsonLoader onCentroidsLoaded={ handleCentroidsLoaded } />
		</>
	);
};

export default React.memo(MapComponent);
