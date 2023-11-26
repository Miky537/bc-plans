import React, { useEffect, useRef } from 'react';
import MapView from '@arcgis/core/views/MapView';
import WebMap from '@arcgis/core/WebMap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';

esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';

const MapComponent = () => {
	const mapDiv = useRef<HTMLDivElement | null>(null);
	const mapViewRef = useRef<MapView | null>(null);
	const featureLayerRef = useRef<FeatureLayer | null>(null);

	useEffect(() => {
		if (!mapDiv.current) return;

		const webMap = new WebMap({
			portalItem: {id: 'f8374035877545c9916d19faed8d39f7'} // Replace with your Web Map ID
		});

		mapViewRef.current = new MapView({
			container: mapDiv.current,
			map: webMap,
		});

		mapViewRef.current?.when(() => {
			webMap.load().then(() => {
				webMap.layers.forEach(layer => {
					if (layer instanceof FeatureLayer) {
						featureLayerRef.current = layer;
					}
				});
			});
		});

		return () => mapViewRef.current!.destroy();
	}, []);

	const changeFloor = (newFloor: number) => {
		if (featureLayerRef.current) {
			featureLayerRef.current!.definitionExpression = `číslo_podlaží = ${ newFloor }`;
		}
	};

	return (
		<div>
			<button onClick={ () => changeFloor(0) }>Show Floor 2</button>
			<button onClick={ () => changeFloor(3) }>Show Floor 3</button>
			<div ref={ mapDiv } className="map-container" style={ {height: "90vh", width: '100%'} } />
		</div>
	);
};

export default MapComponent;
