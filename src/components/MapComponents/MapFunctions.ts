import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Extent from "@arcgis/core/geometry/Extent";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import { CentroidType } from "./Centroid";
import { getRoomLabelById } from "../parser/jsonParser";
import Point from "@arcgis/core/geometry/Point";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";


export const addBoundingBox = (layer: FeatureLayer, mapViewRef: any, minZoomLevel: number) => {
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
				attributes: {
					isBoundingBox: true
				},
				symbol: new SimpleFillSymbol({
					color: "rgba(255,255,255,1)",
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


export const handleCentroidsLoaded = (centroids: CentroidType[], mapViewRef: any, selectedFloor: number) => {
	centroids.forEach(({ longitude, latitude, id }: CentroidType) => {
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


export const adjustMapHeight = () => {
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

const removeBoundingBoxes = (mapViewRef: any) => {
	const graphicsLayer = mapViewRef.current.graphics;
	const graphicsToRemove = graphicsLayer.toArray().filter((graphic: any) => graphic.attributes && graphic.attributes.isBoundingBox);
	graphicsToRemove.forEach((graphic: any) => mapViewRef.current.graphics.remove(graphic));
};

export const updateBoundingBoxes = debounce((mapViewRef: any, minZoomLevel: number, featureLayersRef: any, toggleLayersVisibility: any) => {
	const zoom: number | undefined = mapViewRef.current?.zoom;
	if (zoom === undefined) return;
	console.log("Zoom level:", zoom, minZoomLevel);

	if (zoom <= 17) {
		featureLayersRef.current.forEach((layer: any) => addBoundingBox(layer, mapViewRef, minZoomLevel));
		toggleLayersVisibility(false);
	} else if (zoom > 17) {
		console.log("Removing bounding boxes");
		removeBoundingBoxes(mapViewRef);
		toggleLayersVisibility(true);
	}
}, 150); // debounce period