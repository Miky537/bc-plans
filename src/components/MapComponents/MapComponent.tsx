import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';  // Replace with your actual API key


interface MapComponentProps {
	selectedFloor: string;
	setFloors: (floors: any) => void;
	onRoomSelection: (selectedRoom: any) => void;
}

const MapComponent = ({selectedFloor, setFloors, onRoomSelection}: MapComponentProps) => {
	const mapDiv = useRef<any>(null);
	const geoJsonUrl = "https://gist.githubusercontent.com/Miky537/cb568efc11c1833a5cd54ba87e583db5/raw/5a32a29cc63a8a017de7e134150ee74b2f7779ac/rektorat-mistnosti.geojson";
	const smallGeoJsonUrl = "https://gist.githubusercontent.com/Miky537/60edaac3927c035cd92d064ea90f84ac/raw/8399f0c67ad662285c55080cc4b6a752f0a5db06/small-rektorat.geojson";
	const bigFile = "https://gist.githubusercontent.com/Miky537/a9e6492c6657ef53f212b700826c8df7/raw/48a9cebdd82474b56ba1957374ecb3e789c4a7e9/bigFile.geojson";
	const ultraShortFile = "https://gist.githubusercontent.com/Miky537/d2cbf6618da88eeb201d352c103cc829/raw/aca56cbb096cf7853a18aa1a21e643213cf4b89b/UltraShort.geojson";
	const featureLayerUrl = "https://services8.arcgis.com/zBrV7gOCnjSoTkv7/arcgis/rest/services/re_mistnosti2/FeatureServer";


	useEffect(() => {
		if (!mapDiv.current) return;

		const initializeMap = async() => {
			try {
				const geoJsonLayer = new GeoJSONLayer({
					url: geoJsonUrl,
					outFields: ["*"],
				});
				const ultraShortLayer = new GeoJSONLayer({
					url: ultraShortFile,
					outFields: ["*"],
				});
				const smallGeoJsonLayer = new GeoJSONLayer({
					url: smallGeoJsonUrl,
					outFields: ["*"],
				});
				const bigFileLayer = new GeoJSONLayer({
					url: bigFile,
					outFields: ["*"],
				});
				const featureLayer = new FeatureLayer({
					url: featureLayerUrl,
					outFields: ["*"],
				});

				const map = new Map({
					basemap: 'dark-gray-vector',
					layers: [featureLayer],
				});

				const mapView = new MapView({
					container: mapDiv.current,
					map: map,
					center: [16.603375432788052, 49.20174147400288],
					zoom: 18,
				});

				await mapView.when(() => {
					mapView.on("click", (event) => {
						mapView.hitTest(event).then((response) => {
							if (response.results.length > 0 && 'graphic' in response.results[0]) {
								const graphic = response.results[0]!.graphic;
								onRoomSelection(graphic.attributes.id);
							}
						}).catch(error => {
							console.error("Error in hitTest:", error);
						});
					});
				});

				return () => mapView && mapView.destroy();
			} catch (error) {
				console.error("Error creating map:", error);
			}
		};

		initializeMap();
	}, [onRoomSelection]);

	return (
		<div ref={ mapDiv } className="map-container" style={ {height: "900px", width: '100%'} } />
	);
};

export default MapComponent;
