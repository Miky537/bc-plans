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
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import Point from '@arcgis/core/geometry/Point';
import { getRoomLabelById } from "../parser/jsonParser";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";


esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';

interface MapComponentProps {
	onRoomSelection: (roomId: number) => void;
	selectedFloor: number;
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}

const MapComponent = ({ onRoomSelection, selectedFloor = 1, setIsDrawerOpen }: MapComponentProps) => {
	const mapDiv = useRef<HTMLDivElement | null>(null);
	const mapViewRef = useRef<MapView | null>(null);
	const featureLayerRef = useRef<FeatureLayer | null>(null);
	const highlightGraphicRef = useRef<Graphic | null>(null);

	const highlightSymbol = {
		type: "simple-fill",
		color: [255, 0, 0, 0.4],
		style: "solid",
		outline: {
			color: "blue",
			width: 2
		}
	};

	useEffect(() => {
		if (!mapDiv.current) return;

		const featureLayer = new FeatureLayer({
			maxScale: 0, // show polygons no matter how far you zoom in
			url: featureLayerUrl,
			// url: fastLayerUrl,
			outFields: ["*"],
		});
		const fastFeatureLayer = new FeatureLayer({
			maxScale: 0, // show polygons no matter how far you zoom in
			url: fastLayerUrl,
			// url: fastLayerUrl,
			outFields: ["*"],
		});
		featureLayerRef.current = featureLayer;

		const map = new Map({
			basemap: 'dark-gray-vector',
			layers: [featureLayer, fastFeatureLayer],
		});

		const mapView = new MapView({
			container: mapDiv.current,
			map: map,
			center: [16.603375432788052, 49.20174147400288],
			zoom: 18,
		});

		mapViewRef.current = mapView;

		mapView.when(() => {
			mapView.on('click', async (event) => {
				const response = await mapView.hitTest(event);
				if (response.results.length > 0) {
					const firstHit = response.results[0];
					if (firstHit.type === "graphic" && firstHit.graphic && firstHit.graphic.attributes) {
						if (highlightGraphicRef.current) {
							mapView.graphics.remove(highlightGraphicRef.current); // remove previous highlight
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

		if (featureLayerRef.current) {
			featureLayerRef.current!.definitionExpression = `číslo_podlaží = ${selectedFloor}`;
		}
	}, [selectedFloor]);


	const handleCentroidsLoaded = (centroids: any) => {
		const markerSymbol = new SimpleMarkerSymbol({
			color: [226, 119, 40], // Example color
			outline: {color: [255, 255, 255], width: 2}
		});

		centroids.forEach(({longitude, latitude, id}: any) => {
			const roomLabel = getRoomLabelById(id, selectedFloor);
			// console.log("Room label", roomLabel);
			const labelPoint = new Point({
				longitude: longitude,
				latitude: latitude
			});

			const textSymbol = new TextSymbol({
				text: roomLabel, // The label/name of the room
				color: "black", // Choose a color that suits your map's style
				font: { // Example font properties
					size: 12,
					family: "Arial"
				},
				// Adjust other TextSymbol properties as needed
			});

			const labelGraphic = new Graphic({
				geometry: labelPoint,
				symbol: textSymbol,
			});

			if (mapViewRef.current) {
				mapViewRef.current!.graphics.add(labelGraphic);
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
