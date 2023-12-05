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
	const smallGeoJsonUrl = "https://gist.githubusercontent.com/Miky537/60edaac3927c035cd92d064ea90f84ac/raw/816494619fd025dc647bcbda74d52dadacc1cb6c/small-rektorat.geojson";
	const bigFile = "https://gist.githubusercontent.com/Miky537/a9e6492c6657ef53f212b700826c8df7/raw/48a9cebdd82474b56ba1957374ecb3e789c4a7e9/bigFile.geojson";


	useEffect(() => {
		if (!mapDiv.current) return;

		const initializeMap = async() => {
			try {
				const featureLayer = new FeatureLayer({
					url: smallGeoJsonUrl
				});
				const geoJsonLayer = new GeoJSONLayer({
					url: geoJsonUrl,
					outFields: ["*"],
				});
				const smallGeoJsonLayer = new GeoJSONLayer({
					url: smallGeoJsonUrl
				});
				const bigFileLayer = new GeoJSONLayer({
					url: bigFile,
					outFields: ["*"],
				});

				const map = new Map({
					basemap: 'dark-gray-vector',
					layers: [geoJsonLayer],
				});

				const mapView = new MapView({
					container: mapDiv.current,
					map: map,
					center: [16.603375432788052, 49.20174147400288],
					zoom: 18,
				});

				mapView.on("click", (event) => {
					mapView.hitTest(event).then(({ results }) => {
						if (results.length > 0 && results[0]) {
							const attributes = results[0];
							console.log(attributes);
							//console.log("Found features:", attributes.graphic.layer);
							onRoomSelection(attributes);
						} else {
							console.log("No features found at click location");
						}
					}).catch(error => {
						console.error("Error in hitTest:", error);
					});
				});

				return () => mapView && mapView.destroy();
			} catch (error) {
				console.error("Error creating map:", error);
			}
		};

		initializeMap();
	}, []);

	return (
		<div ref={ mapDiv } className="map-container" style={ {height: "900px", width: '100%'} } />
	);
};

export default MapComponent;
