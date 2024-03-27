import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Extent from "@arcgis/core/geometry/Extent";
import Polygon from "@arcgis/core/geometry/Polygon";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import { FacultyType } from "../FacultySelection/FacultySelection";
import { Coordinates } from "./MapComponent";
import MapView from "@arcgis/core/views/MapView";
import React from "react";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import { facultyInfo } from "../../FacultyLogos/constants";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";


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
					color: [255, 0, 0, 0.5], // RGBA color, here red with 50% opacity
					outline: {
						color: "black",
						width: 5
					},
				})
			});

			mapViewRef.current?.graphics.add(boundingBoxGraphic);
		}
	}).catch((err): any => {
		console.error("Failed to query features:", err);
	});
};
export const addPinMarkerWithSvg = (mapView: GraphicsLayer, latitude: number, longitude: number, data: any, faculty: FacultyType) => {
	if (faculty === "USI") return;
	const height = 99.189;
	const ratio = data.width / height;
	const desiredHeight = 30;
	const desiredWidth = desiredHeight * ratio;
	const point = new Point({
		latitude: longitude,
		longitude: latitude
	});

	// Pin symbol
	const pinSymbol = new PictureMarkerSymbol({
		url: `${ process.env.REACT_APP_APP_URL }/Google_Maps_pin.svg`,
		width: "20px",
		height: "35px",
	});

	const pinGraphic = new Graphic({
		geometry: point,
		symbol: pinSymbol
	});

	mapView.add(pinGraphic);
	// SVG symbol placed above the pin
	const svgSymbol = new PictureMarkerSymbol({
		url: data.logo, // Replace with the path to your SVG image
		width: `${ desiredWidth }px`,
		height: `${ desiredHeight }px`,
		yoffset: "37px" // Half of the pin's height to position the SVG above the pin
	});

	const svgGraphic = new Graphic({
		geometry: point, // Use the same point for placement
		symbol: svgSymbol,
		attributes: {
			type: 'facultyAddressPin',
			faculty: faculty,
			address: data.address // faculty address
		}
	});

	if (faculty === "FCH") {
		const desiredHeight = 30;
		const desiredWidth = desiredHeight * ratio;
		const usiSvgUrl = data.USILogo;

		const usiSvgSymbol = new PictureMarkerSymbol({
			url: usiSvgUrl,
			width: `${ desiredWidth }px`,
			height: `${ desiredHeight }px`,
			yoffset: "70px" // Adjust this value based on the visual stacking requirement
		});

		const usiSvgGraphic = new Graphic({
			geometry: point,
			symbol: usiSvgSymbol
		});

		mapView.graphics.add(usiSvgGraphic);

	}
	mapView.graphics.add(svgGraphic);
};

export const adjustMapHeight = () => {
	const topBarElement = document.getElementById('topbar'); // Adjust 'topbar' to your topbar's ID
	const mapContainerElement = document.getElementById('mapDiv'); // Adjust 'mapDiv' to your map container's ID

	if (topBarElement && mapContainerElement) {
		const topBarHeight = topBarElement.clientHeight;
		const viewportHeight = window.innerHeight;
		const mapHeight = `${ viewportHeight - topBarHeight }px`;
		mapContainerElement.style.height = mapHeight;
	} else {
		console.error('Topbar or MapDiv element is not found in the document.');
	}
};

export const debounce = (func: Function, wait: number) => {
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

const removeBoundingBoxes = (mapViewRef: React.MutableRefObject<MapView | null>) => {
	const graphicsLayer = mapViewRef.current?.graphics;
	if (!graphicsLayer) return;
	const graphicsToRemove = graphicsLayer.toArray().filter((graphic: any) => graphic.attributes && graphic.attributes.isBoundingBox);
	graphicsToRemove.forEach((graphic: any) => mapViewRef.current!.graphics.remove(graphic));
};

export const updateBoundingBoxes = debounce((
	mapViewRef: React.MutableRefObject<MapView | null>,
	minZoomLevel: number,
	featureLayersRef: React.MutableRefObject<FeatureLayer[]>,
	toggleLayersVisibility: (visible: boolean) => void,
	zoom: number | undefined
) => {
	// const zoom: number | undefined = mapViewRef.current?.zoom;
	if (zoom === undefined) return;

	if (zoom <= 17) {
		featureLayersRef.current.forEach((layer: any) => addBoundingBox(layer, mapViewRef, minZoomLevel));
		toggleLayersVisibility(false);
	} else if (zoom > 17) {
		removeBoundingBoxes(mapViewRef);
		toggleLayersVisibility(true);
	}
}, 150); // debounce period


export const convertPathToFacultyType = (path: string): FacultyType | null => {
	if (!path) return null;
	const pathUpper = path.toUpperCase();
	switch (pathUpper) {
		case "FIT":
			return "FIT";
		case "FAST":
			return "FAST";
		case "FSI":
			return "FSI";
		case "FEKT":
			return "FEKT";
		case "FAVU":
			return "FAVU";
		case "FCH":
			return "FCH";
		case "USI":
			return "USI";
		case "FP":
			return "FP";
		case "FA":
			return "FA";
		default:
			return null; // or return a default value if you have one
	}
};

export const getFacultyCoordinates = (name: FacultyType): Coordinates => {
	if (name === "FIT") return { lat: 16.5960477306341, lng: 49.226545887028706 }
	else if (name === "FAST") return { lat: 16.592231660862765, lng: 49.20650409622601 }
	else if (name === "FSI") return { lat: 16.57653658893718, lng: 49.22429533272419 }
	else if (name === "FEKT") return { lat: 16.575806766341735, lng: 49.22599596291861 }
	else if (name === "FAVU") return { lat: 16.59241880634435, lng: 49.19814593252842 }
	else if (name === "FCH") return { lat: 16.578578883550467, lng: 49.23125625760177 }
	else if (name === "USI") return { lat: 16.578578883550467, lng: 49.23125625760177 }
	else if (name === "FP") return { lat: 16.573466531972247, lng: 49.231060330007544 }
	else if (name === "FA") return { lat: 16.59381902575785, lng: 49.186889974169276 }
	else return { lat: 16, lng: 49 }
}

export function getRoomCenter(allFeatures: any, RoomID: number) {
	const feature = allFeatures.find((f: any) => f.attributes.RoomID === RoomID);
	if (feature === undefined) {
		return;
	}

	if (feature && feature.geometry.type === "polygon") {
		return feature.geometry.centroid;
	} else if (feature) {
		return feature.geometry;
	} else {
		console.log(feature)
		console.error('No feature found with the given RoomID:', RoomID);
		return null;
	}
}

export const displayPinsWhenZoomChange = (mapView: GraphicsLayer | null, RoomHighlightGraphicsLayerRef: any,
                                          FeaturesGraphicsLayerRef: any, setArePinsVisible: any) => {
	if (!mapView) return;
	// RoomHighlightGraphicsLayerRef.current?.removeAll();
	setArePinsVisible(true);
	FeaturesGraphicsLayerRef.current?.graphics.removeAll()
	Object.entries(facultyInfo).forEach(([faculty, data]) => {
		if (faculty === "USI") return;//FCH and USI are on the same coordinates
		const coordinates: Coordinates = getFacultyCoordinates(faculty as FacultyType);
		if (coordinates) {
			addPinMarkerWithSvg(mapView, coordinates.lat, coordinates.lng, data, faculty as FacultyType);
		} else {
			console.warn(`No coordinates found for ${ faculty }`);
		}
	});

}



