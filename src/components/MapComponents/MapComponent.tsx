import React, { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import { featureLayerUrl, fastLayerUrl, FITLayerUrl, typeToColorMapping, iconProps } from "./constants";
import { useMapContext } from "./MapContext";
import {
	adjustMapHeight,
	updateBoundingBoxes,
	convertPathToFacultyType,
	getFacultyCoordinates,
	getRoomCenter
} from "./MapFunctions";
import { useLocation, useParams } from "react-router-dom";
import { serverAddress, appAddress } from "../../config";
import { useFacultyContext } from "../FacultyContext";
import { replaceCzechChars } from "../FloorSelection";
import Track from "@arcgis/core/widgets/Track";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import Query from "@arcgis/core/rest/support/Query";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { debounce } from "@mui/material";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";


esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';

interface MapComponentProps {
	onRoomSelection: (roomId: number | undefined) => void;
	selectedFloor: number;
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
	selectedRoom: number | undefined;
	setSelectedRoom: (roomId: number | undefined) => void;
}

const layerConfigs = [
	{ url: featureLayerUrl, name: "VUT_Rektorat", facultyId: "facultyRectorate" },
	{ url: fastLayerUrl, name: "FAST", facultyId: "facultyFAST" },
	{ url: FITLayerUrl, name: "FIT", facultyId: "facultyFIT" },
	// Add more configurations as needed
];

export type Coordinates = {
	lat: number;
	lng: number;
};

interface RoomIdWithType {
	RoomID: number;
	roomType: number;
	roomName: string;
}

const MapComponent = ({
	                      onRoomSelection,
	                      selectedFloor,
	                      setIsDrawerOpen,
	                      selectedRoom,
	                      setSelectedRoom
                      }: MapComponentProps) => {
	const mapDiv = useRef<HTMLDivElement | null>(null);
	const featureLayersRef = useRef<FeatureLayer[]>([]);
	const highlightGraphicRef = useRef<Graphic | null>(null);
	const { faculty, building, floor, roomName } = useParams();
	const {
		setSelectedRoomId,
		handleRoomSelection,
		selectedFaculty,
		setSelectedFaculty,
		selectedFloorNumber,
		selectedBuilding,
		selectedBuildingOriginal,
	} = useFacultyContext()
	const IconsGraphicsLayerRef = useRef<GraphicsLayer | null>(null);
	const FeaturesGraphicsLayerRef = useRef<GraphicsLayer | null>(null);
	const RoomHighlightGraphicsLayerRef = useRef<GraphicsLayer | null>(null);
	const LabelsGraphicsLayerRef = useRef<GraphicsLayer | null>(null);
	const [allFeatures, setAllFeatures] = useState<any>([]);
	const [featureGraphicsLayer] = useState(new GraphicsLayer());
	const abortControllerRef = useRef<AbortController | null>(null);

	const location = useLocation();

	const {
		centerCoordinates,
		setCenterCoordinates,
		setIsMapLoaded,
		zoom,
		mapViewRef
	} = useMapContext();
	const minZoomLevel = 17;

	useEffect(() => {
		mapViewRef.current?.map.add(featureGraphicsLayer);
	}, [featureGraphicsLayer]);

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
				outFields: ["*"], // * means all fields
				maxScale: 0,
				title: config.name, //used to only affect selected faculty
			});

			return layer;
		});

		const map = new Map({
			basemap: 'dark-gray-vector',
		});

		const mapView = new MapView({
			container: mapDiv.current,
			map: map,
			center: [centerCoordinates.lat, centerCoordinates.lng],
			zoom: zoom,
		});
		mapViewRef.current = mapView;

		const iconsGraphicsLayer = new GraphicsLayer();
		const featureGraphicsLayer = new GraphicsLayer();
		const labelsGraphicsLayer = new GraphicsLayer();
		const roomHighlightGraphicsLayer = new GraphicsLayer();

		mapView.map.add(featureGraphicsLayer);
		FeaturesGraphicsLayerRef.current = featureGraphicsLayer;

		mapView.map.add(roomHighlightGraphicsLayer);
		RoomHighlightGraphicsLayerRef.current = roomHighlightGraphicsLayer;

		mapView.map.add(labelsGraphicsLayer);
		LabelsGraphicsLayerRef.current = labelsGraphicsLayer;

		mapView.map.add(iconsGraphicsLayer);
		IconsGraphicsLayerRef.current = iconsGraphicsLayer;


		let isFirstTrackingActivation = true; // flag for not moving the view when tracking starts
		const trackWidget = new Track({
			view: mapView,
			rotationEnabled: false, // Disable the rotation of the view
			goToLocationEnabled: true, // automatically moves the view to the user's location
			geolocationOptions: {
				maximumAge: 0,
				timeout: 15000,
				enableHighAccuracy: true
			},
			goToOverride: (view, goToParams) => {
				if (isFirstTrackingActivation) {
					isFirstTrackingActivation = false; // Update the flag
					return view.goTo(goToParams.target);
				}
				return Promise.resolve();
			}
		});

		mapView.ui.add(trackWidget, `bottom-right`);
		trackWidget.watch("tracking", function(isTracking) {
			if (!isTracking) {
				isFirstTrackingActivation = true; // reset the flag when tracking stops
			}
		});

		mapView.when(() => {
			setIsMapLoaded(true);
			mapView.on('click', async(event) => {
				// Remove the current highlight if it exists
				if (RoomHighlightGraphicsLayerRef.current) {
					RoomHighlightGraphicsLayerRef.current!.removeAll();
				}

				const response = await mapView.hitTest(event);
				if (response.results.length > 0) {
					const firstHit = response.results.find(result => result.type === "graphic");

					if (firstHit && "graphic" in firstHit) {
						const clickedGraphic = firstHit.graphic;

						if (clickedGraphic.attributes === null)
							return;
						// Check if the graphic has an 'id' or 'RoomID' attribute
						if ('id' in clickedGraphic.attributes || 'RoomID' in clickedGraphic.attributes) {
							const highlightGraphic = new Graphic({
								geometry: clickedGraphic.geometry,
								symbol: highlightSymbol // Make sure 'highlightSymbol' is defined
							});

							// Add the highlight to the roomHighlightGraphicsLayer
							await RoomHighlightGraphicsLayerRef.current?.add(highlightGraphic);
							// Trigger any additional actions on room selection
							if ('id' in clickedGraphic.attributes) {
								onRoomSelection(clickedGraphic.attributes.id);
							} else if ('RoomID' in clickedGraphic.attributes) {
								onRoomSelection(clickedGraphic.attributes.RoomID);
							}
							setIsDrawerOpen(true);
						} else {
							onRoomSelection(undefined);
						}
					}
				}
			});
			mapView.watch("zoom", (zoom) => {
				updateBoundingBoxes(mapViewRef, minZoomLevel, featureLayersRef, toggleLayersVisibility, zoom);
			});

		}).catch((err: any) => console.error("MapView failed to load", err));

		return () => {
			if (mapView) {
				mapView.destroy();
				mapViewRef.current = null;
			}
		};
	}, [centerCoordinates]);


	useEffect(() => {
		const abortController = new AbortController();

		if (featureLayersRef.current) {
			const selectedLayer = featureLayersRef.current.find(layer => layer.title === selectedFaculty);
			if (!selectedLayer) {
				return;
			}
			const query = new Query();
			query.where = '1=1';
			query.returnGeometry = true;
			query.outFields = ['RoomID', 'name', 'roomType', 'Shape__Area'];

			selectedLayer.queryFeatures(query, { signal: abortController.signal })
				.then((results) => {
					setAllFeatures(results.features);
				})
				.catch((error) => {
					if (error.name === "AbortError") {
						// console.log("Found abortError!")
					} else {
						console.error("Error fetching feature layer data:", error);
						if (error?.message) {
							console.error("Error message:", error.message);
						}
					}
				});
		}
		return () => {
			abortController.abort()
		};
	}, [featureLayersRef.current, selectedFaculty]);

	function createLabels(features: any, floorRoomIds: number[]) {
		LabelsGraphicsLayerRef.current?.removeAll();
		const filteredFeatures = features.filter((feature: Graphic) => floorRoomIds.includes(feature.attributes.RoomID));
		filteredFeatures.forEach((feature: any) => {
			const labelSymbol = new TextSymbol({
				text: feature.attributes.name,
				color: "black",
				font: {
					size: 12,
					weight: "bold"
				}
			});

			const labelGraphic = new Graphic({
				geometry: feature.geometry.centroid,
				symbol: labelSymbol,
				attributes: feature.attributes
			});

			LabelsGraphicsLayerRef.current?.add(labelGraphic);
		});
	}

	function adjustLabelVisibility(view: MapView | null, floorRoomIds: number[]) {
		if (view === null) return;
		const currentZoom = view.zoom;
		LabelsGraphicsLayerRef.current?.graphics.forEach((graphic: any) => {
			if (graphic.attributes && graphic.symbol && graphic.symbol.type === "text") {
				const isRoomOnSelectedFloor = floorRoomIds.includes(graphic.attributes.RoomID);
				const largestAreaThreshold = 400;
				const middleAreaThreshold = 100;
				// const smallestAreaThreshold = 5.0e-9;

				const roomArea = graphic.attributes.Shape__Area;
				const isLargestArea = roomArea >= largestAreaThreshold;
				const isMiddleArea = roomArea >= middleAreaThreshold && roomArea < largestAreaThreshold;
				// const isSmallestArea = roomArea >= smallestAreaThreshold && roomArea < middleAreaThreshold;
				let shouldDisplay = false;
				if (currentZoom > 19.5) { // very close zoom, show all rooms
					shouldDisplay = isRoomOnSelectedFloor;
				} else if (currentZoom >= 18.5) { // Closer zoom, show largest and middle-sized rooms
					shouldDisplay = (isLargestArea || isMiddleArea) && isRoomOnSelectedFloor;
				} else if (currentZoom >= 16) { //show only the largest rooms
					shouldDisplay = isLargestArea && isRoomOnSelectedFloor;
				}
				graphic.visible = shouldDisplay;
			}
		});
	}

	const createIconsForRooms = (roomsToAddIcons: RoomIdWithType[], iconsGraphicsLayer: GraphicsLayer | null) => {
		if (!iconsGraphicsLayer || !mapViewRef.current || allFeatures.length === 0) return;
		iconsGraphicsLayer.removeAll();
		roomsToAddIcons.forEach(room => {
			const roomCenter = getRoomCenter(allFeatures, room.RoomID);
			if (roomCenter) {
				let excludedRoomIconURL;

				switch (room.roomType) {
					case 35:
						excludedRoomIconURL = `${ appAddress }/icons/WomanIcon.svg`;
						break;
					case 26:
						excludedRoomIconURL = `${ appAddress }/icons/WheelchairIcon.svg`;
						break;
					case 36:
						excludedRoomIconURL = `${ appAddress }/icons/ManIcon.svg`;
						break;
					case 87:
						excludedRoomIconURL = `${ appAddress }/icons/ElevatorIcon.svg`;
						break;
					case 88:
						excludedRoomIconURL = `${ appAddress }/icons/WCIcon.svg`;
						break;
					default:
						excludedRoomIconURL = ''; // Default or 'none' indicating no icon should be added
						break;
				}

				if (excludedRoomIconURL) {
					const iconGraphic = new Graphic({
						geometry: roomCenter,
						symbol: new PictureMarkerSymbol({
							...iconProps,
							url: excludedRoomIconURL,
						}),
						attributes: room,
					});

					iconsGraphicsLayer.add(iconGraphic);
				}
			}
		});
	};

	function adjustIconVisibility(view: MapView | null, floorRoomIds: number[]) {
		if (view === null) return;

		const currentZoom = view.zoom;
		IconsGraphicsLayerRef.current?.graphics.forEach((graphic: any) => {
			if (graphic.attributes) {
				const isRoomOnSelectedFloor = floorRoomIds.includes(graphic.attributes.RoomID);
				const largestAreaThreshold = 30;
				const roomArea = graphic.attributes.Shape__Area;

				const isLargestArea = roomArea >= largestAreaThreshold;
				let shouldDisplay;
				if (currentZoom > 18.5) { // Very close zoom, show all icons
					shouldDisplay = isRoomOnSelectedFloor;
				} else {
					shouldDisplay = false
				}
				graphic.visible = shouldDisplay;
			}
		});
	}

	useEffect(() => {
		if (!mapViewRef.current || !featureLayersRef.current) return;
		featureGraphicsLayer.removeAll();
		const fetchSome = async() => {
			try {
				const response = await fetch(`${ serverAddress }/api/rooms/${ selectedFaculty }/byFloor/${ selectedFloor }`);
				if (!response.ok) {
					throw new Error('Failed to fetch rooms');
				}
				const rooms = await response.json();
				const roomsWithoutLabels = [7, 8, 21, 24, 25, 26, 27, 35, 36, 38, 78, 79, 81, 83, 84, 85, 86, 87, 88, 90, 138, 140, 150, 161];

				const selectedLayer = featureLayersRef.current.find(layer => layer.title === selectedFaculty);
				FeaturesGraphicsLayerRef.current?.removeAll();

				rooms.forEach((room: RoomIdWithType) => {
					const color = typeToColorMapping[room.roomType] || typeToColorMapping["Default"];

					const feature = allFeatures.find((feature: any) => feature.attributes.RoomID === room.RoomID);
					if (room.RoomID === 1308) return;
					if (feature) {
						const graphic = new Graphic({
							geometry: feature.geometry, // Assuming this is how you access geometry
							attributes: feature.attributes,
							symbol: new SimpleFillSymbol({
								color: color, // Customize as needed
								outline: { color: "black", width: 1 },
							}),
						});
						FeaturesGraphicsLayerRef.current?.add(graphic);
					}
				});
				const includedRooms = rooms.filter((room: RoomIdWithType) => !roomsWithoutLabels.includes(room.roomType));
				const floorRoomIds = includedRooms.map((room: RoomIdWithType) => room.RoomID);
				createLabels(allFeatures, floorRoomIds);
				adjustLabelVisibility(mapViewRef.current, floorRoomIds);

				const roomsToAddIcons = rooms.filter((room: RoomIdWithType) => roomsWithoutLabels.includes(room.roomType));
				const floorRoomIdsIcons = roomsToAddIcons.map((room: RoomIdWithType) => room.RoomID);

				IconsGraphicsLayerRef.current?.when(() => {
					createIconsForRooms(roomsToAddIcons, IconsGraphicsLayerRef.current);
					adjustIconVisibility(mapViewRef.current, floorRoomIdsIcons);
				});

				mapViewRef.current?.watch('zoom', () => {
					debouncedAdjustIconVisibility(mapViewRef.current, floorRoomIdsIcons);
					debouncedAdjustLabelVisibility(mapViewRef.current, floorRoomIds);
				});
			} catch (error) {
				console.error('Error fetching rooms for floor:', error);
			}
		}
		fetchSome();
	}, [selectedFloor, allFeatures, featureGraphicsLayer]);


	const debouncedAdjustLabelVisibility = debounce(adjustLabelVisibility, 50);
	const debouncedAdjustIconVisibility = debounce(adjustIconVisibility, 50);

	useEffect(() => {
		adjustMapHeight(); // Adjust on mount
		window.addEventListener('resize', adjustMapHeight); // Adjust on window resize

		// Cleanup listener on component unmount
		return () => window.removeEventListener('resize', adjustMapHeight);
	}, []);

	useEffect(() => {
		if (!selectedRoom || allFeatures.length === 0) return;

		const roomFeature = allFeatures.find((feature: any) => feature.attributes.RoomID === selectedRoom);
		if (!roomFeature) {
			return;
		}

		if (roomFeature && mapViewRef.current) { //removing existing highlight
			// if (highlightGraphicRef.current) {
			// 	if (highlightGraphicRef.current && "graphics" in mapViewRef.current) {
			// 		mapViewRef.current.graphics.remove(highlightGraphicRef.current);
			// 	}
			// }
			// RoomHighlightGraphicsLayerRef.current?.removeAll();
			// Highlight the selected room
			const highlightGraphic = new Graphic({
				geometry: roomFeature.geometry,
				symbol: highlightSymbol
			});

			// mapViewRef.current?.graphics.add(highlightGraphic);
			// highlightGraphicRef.current = highlightGraphic;


			// Zoom to the selected room
			abortControllerRef.current = new AbortController();
			// console.log("Trying")
			if (roomFeature.geometry.extent) {
				mapViewRef.current!.goTo(
					{ target: roomFeature.geometry.extent.expand(1.5)},
					{ duration: 1250, easing: "ease-out", signal: abortControllerRef.current!.signal, animate: true }
				).then(() => {
					if (!mapViewRef.current) return;
					// console.log("Animation finished");
				}).catch(function(error) {
					if (error.name !== "AbortError") {
						console.error(error);
					}
				});
			} else {
				mapViewRef.current!.goTo(
					{ target: roomFeature.geometry, zoom: 19 },
					{ duration: 1250, easing: "ease-out", signal: abortControllerRef.current!.signal, animate: true }
				).then(() => {
					if (!mapViewRef.current) return;
					// console.log("Animation finished");
				}).catch(function(error) {
					if (error.name !== "AbortError") {
						console.error(error);
					}
				});
			}

			// Reset selectedRoom after processing
			// setSelectedRoom(undefined);
		} else {
			console.error("Room not found.");
		}

		return () => {
			abortControllerRef.current!.abort();
			setSelectedRoom(undefined);
		};
	}, [selectedRoom, allFeatures]);


	useEffect(() => {
		const pathParts = location.pathname.split('/').filter(Boolean);
		const facultyName = pathParts[1];
		const firstUrlPart = pathParts[0];
		// if (firstUrlPart === "map" && facultyName === undefined) {
		// 	mapViewRef.current?.goTo({
		// 		center: [16.603375432788052, 49.20174147400288],
		// 		zoom: 10
		// 	}, { duration: 500, easing: "ease-out" });
		// }

		const facultyType = convertPathToFacultyType(facultyName);
		if (facultyType) {
			const facultyCoordinates = getFacultyCoordinates(facultyType);
			setCenterCoordinates(facultyCoordinates);
			setSelectedFaculty(facultyType);
		}
	}, [location, setCenterCoordinates, setSelectedFaculty]);

	useEffect(() => {

		if (!faculty || !building || !floor || !roomName) {
			return
		}
		const fetchRoomId = async() => {
			try {
				// console.log("building", selectedBuilding)
				const normalizedBuilding = replaceCzechChars(building).replace(/\s/g, "_");
				if (!faculty || !selectedBuilding || !selectedFloorNumber || !roomName) {
					console.log("Missing parameters for fetching room ID");
					return
				}
				const response = await fetch(`${ serverAddress }/api/roomid/${ faculty }/${ selectedBuilding }/${ selectedFloorNumber }/${ roomName }`);
				if (!response.ok) {
					throw new Error('Failed to fetch room ID');
				}
				const data = await response.json();
				setSelectedRoomId(data.room_id);
				handleRoomSelection(data.room_id);
			} catch (error) {
				console.error('Error fetching room ID:', error);
				setSelectedRoomId(0);
			}
		};

		fetchRoomId();
	}, [faculty, building, floor, roomName]);


	return (
		<div ref={ mapDiv } id="mapDiv" />
	);
};

export default React.memo(MapComponent);
