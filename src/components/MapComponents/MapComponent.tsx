import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';
import GeoJSONLayer from "@arcgis/core/layers/GeoJSONLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";


esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';  // Replace with your actual API key

	interface HitTestResult {
	results: Array<{
		graphic: Graphic;
		// Include other properties of the hit test result that you use
	}>;
}


interface MapComponentProps {
	onRoomSelection: (roomId: number) => void;
}

const MapComponent = ({onRoomSelection}: MapComponentProps) => {
	// console.log("Rendering MapComponent");
	const mapDiv = useRef<any>(null);

	const highlightSymbol = {
		type: "simple-fill", // autocasts as new SimpleFillSymbol()
		color: "none",
		style: "none",
		outline: { // autocasts as new SimpleLineSymbol()
			color: "blue",
			width: 2
		}
	};

	const geoJsonUrl = "https://gist.githubusercontent.com/Miky537/cb568efc11c1833a5cd54ba87e583db5/raw/5a32a29cc63a8a017de7e134150ee74b2f7779ac/rektorat-mistnosti.geojson";
	const smallGeoJsonUrl = "https://gist.githubusercontent.com/Miky537/60edaac3927c035cd92d064ea90f84ac/raw/8399f0c67ad662285c55080cc4b6a752f0a5db06/small-rektorat.geojson";
	const bigFile = "https://gist.githubusercontent.com/Miky537/a9e6492c6657ef53f212b700826c8df7/raw/48a9cebdd82474b56ba1957374ecb3e789c4a7e9/bigFile.geojson";
	const ultraShortFile = "https://gist.githubusercontent.com/Miky537/d2cbf6618da88eeb201d352c103cc829/raw/aca56cbb096cf7853a18aa1a21e643213cf4b89b/UltraShort.geojson";
	const featureLayerUrl = "https://services8.arcgis.com/zBrV7gOCnjSoTkv7/arcgis/rest/services/re_mistnosti2/FeatureServer";

	useEffect(() => {
		if (!mapDiv.current) return;

		const initializeMap = () => {
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

				let highlightGraphic: any;

				mapView.when(() => {
					mapView.on("click", async(event) => {
						const response: __esri.HitTestResult = await mapView.hitTest(event);
						console.log("response", response);

						if (response.results.length > 0) {
							const firstHit = response.results[0];

							if (firstHit.type === "graphic" && firstHit.graphic) {
								const clickedGraphic = firstHit.graphic;
								mapView.graphics.remove(highlightGraphic); // remove previous highlight

								highlightGraphic = new Graphic({
									geometry: clickedGraphic.geometry,
									symbol: highlightSymbol
								});
								mapView.graphics.add(highlightGraphic);

								// Call the onRoomSelection callback with the clicked graphic's ID
								onRoomSelection(clickedGraphic.attributes.id);
							}
						}
					});
				});

				return () => {
					mapView && mapView.destroy()
				};
			} catch (error) {
				console.error("Error creating map:", error);
			}
		};

		initializeMap();
	}, []);

	return (
		<div ref={ mapDiv } className="map-container" />
	);
};

export default React.memo(MapComponent);
