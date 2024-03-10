import React, { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import { featureLayerUrl, fastLayerUrl, FITLayerUrl, typeToColorMapping, iconProps } from "./constants";
import GeoJsonLoader from "./Centroid";
import { useMapContext } from "./MapContext";
import {
	handleCentroidsLoaded,
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
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import Query from "@arcgis/core/rest/support/Query";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { debounce } from "@mui/material";


esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';

interface MapComponentProps {
	onRoomSelection: (roomId: number) => void;
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
	const mapViewRef = useRef<MapView | null>(null);
	const featureLayersRef = useRef<FeatureLayer[]>([]);
	const highlightGraphicRef = useRef<Graphic | null>(null);
	const { faculty, building, floor, roomName } = useParams();
	const { setSelectedRoomId, handleRoomSelection, selectedFaculty, setSelectedFaculty } = useFacultyContext()
	const IconsGraphicsLayerRef = useRef<GraphicsLayer | null>(null);
	const [allFeatures, setAllFeatures] = useState<any>([]);

	const location = useLocation();
	const {
		centerCoordinates,
		setCenterCoordinates,
		setIsMapLoaded,
		zoom,
	} = useMapContext();

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
			layers: featureLayersRef.current,
		});

		const mapView = new MapView({
			container: mapDiv.current,
			map: map,
			center: [centerCoordinates.lat, centerCoordinates.lng],
			zoom: zoom,
		});
		mapViewRef.current = mapView;

		const iconsGraphicsLayer = new GraphicsLayer();
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

		mapView.ui.add(trackWidget, `bottom-right` );
		trackWidget.watch("tracking", function(isTracking) {
			if (!isTracking) {
				isFirstTrackingActivation = true; // reset the flag when tracking stops
			}
		});

		mapView.when(() => {
			setIsMapLoaded(true);
			mapView.on('click', async (event) => {
				if (highlightGraphicRef.current) {
					mapView.graphics.remove(highlightGraphicRef.current as Graphic);
					highlightGraphicRef.current = null;
				}

				const response = await mapView.hitTest(event);
				if (response.results.length > 0) {
					const firstHit = response.results[0];
					if (firstHit.type === "graphic" && firstHit.graphic && firstHit.graphic.attributes) {
						const clickedGraphic = firstHit.graphic;

						if ('id' || 'RoomID' in clickedGraphic.attributes) {

							highlightGraphicRef.current = new Graphic({
								geometry: clickedGraphic.geometry,
								symbol: highlightSymbol
							});
							mapView.graphics.add(highlightGraphicRef.current as Graphic);
							if ("id" in clickedGraphic.attributes){
								onRoomSelection(clickedGraphic.attributes.id);
								setIsDrawerOpen(true);
							} else if ("RoomID" in clickedGraphic.attributes){
								onRoomSelection(clickedGraphic.attributes.RoomID);
								setIsDrawerOpen(true);
							}
						} else {
							console.error("Invalid room selection");
							onRoomSelection(0);
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
		if (featureLayersRef.current) {
			const selectedLayer = featureLayersRef.current.find(layer => layer.title === selectedFaculty);
			if (!selectedLayer) { return; }
			const query = new Query();
			query.where = '1=1';
			query.returnGeometry = true;
			query.outFields = ['RoomID', 'Shape_Area', 'name', 'roomType', 'Shape__Area'];

			selectedLayer.queryFeatures(query)
				.then((results) => {
					setAllFeatures(results.features);
				})
				.catch((error) => {
					console.error("Error fetching feature layer data:", error);
				});
		}
	}, [featureLayersRef.current]);


	async function fetchFeatures(featureLayer: FeatureLayer) {
		const query = new Query();
		query.returnGeometry = true;
		query.outFields = ["RoomID", "name", "shape_area"];
		query.where = "1=1";

		try {
			const response = await featureLayer.queryFeatures(query);
			return response.features;
		} catch (error) {
			console.error("Error fetching features:", error);
			return [];
		}
	}

	function createLabels(features: any, view: MapView | null, floorRoomIds: number[]) {
		if (view === null) return;
		const filteredFeatures = features.filter((feature: Graphic) => floorRoomIds.includes(feature.attributes.RoomID));
		filteredFeatures.forEach((feature: any) => {
			const labelSymbol = new TextSymbol({
				text: feature.attributes.name,
				color: "black",
				font: {
					size: 12,
				}
			});

			const labelGraphic = new Graphic({
				geometry: feature.geometry.centroid,
				symbol: labelSymbol,
				attributes: feature.attributes
			});

			view.graphics.add(labelGraphic);
		});
	}

	function adjustLabelVisibility(view: MapView | null, floorRoomIds: number[]) {
		if (view === null) return;
		const currentZoom = view.zoom;
		view.graphics.forEach((graphic: any) => {
			if (graphic.attributes && graphic.symbol && graphic.symbol.type === "text") {
				const isRoomOnSelectedFloor = floorRoomIds.includes(graphic.attributes.RoomID);
				const largestAreaThreshold = 1.57284e-8;
				const middleAreaThreshold = 8.0e-9;
				// const smallestAreaThreshold = 5.0e-9;

				const roomArea = graphic.attributes.Shape_Area;
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

	const debouncedAdjustLabelVisibility = debounce(adjustLabelVisibility, 100);
	useEffect(() => {
		if (mapViewRef.current && highlightGraphicRef.current && "graphics" in mapViewRef.current) {
			mapViewRef.current.graphics.remove(highlightGraphicRef.current);
			highlightGraphicRef.current = null;
		}
		mapViewRef.current?.graphics.removeAll();
		const roomsWithoutLabels = [7, 21, 25, 26, 27, 35, 36, 38, 79, 81, 83, 88, 90, 138, 150, 161]

		const updateLayersWithRooms = async() => {
			try {
				// Fetch room details for the selected floor
				const response = await fetch(`${ serverAddress }/api/rooms/${ selectedFaculty }/byFloor/${ selectedFloor }`);
				if (!response.ok) {
					throw new Error('Failed to fetch rooms');
				}
				const rooms = await response.json();
				const selectedLayer = featureLayersRef.current.find(layer => layer.title === selectedFaculty);
				const includedRooms = rooms.filter((room: RoomIdWithType) => !roomsWithoutLabels.includes(room.roomType));
				const floorRoomIds = includedRooms.map((room: RoomIdWithType) => room.RoomID);


				mapViewRef.current?.watch('zoom', () => {
					debouncedAdjustLabelVisibility(mapViewRef.current, floorRoomIds);
				});


				const uniqueValueInfos = rooms.map(({ RoomID, roomType }: RoomIdWithType) => ({
					value: RoomID,
					symbol: new SimpleFillSymbol({
						color: typeToColorMapping[roomType.toString()] || "#CCCCCC", // Fallback color
						outline: { color: "black", width: 1 },
					})
				}));


				const renderer = new UniqueValueRenderer({
					field: "RoomID",
					uniqueValueInfos: uniqueValueInfos,
					defaultSymbol: new SimpleFillSymbol({ // Default symbol if no match
						color: "#CCCCCC", // Default color
						outline: { color: "black", width: 1 },
					})
				});

				await IconsGraphicsLayerRef.current?.removeAll();
				if (selectedLayer) {
					selectedLayer.renderer = renderer;
					selectedLayer.definitionExpression = `RoomID IN (${ rooms.map((room: any) => `'${ room.RoomID }'`).join(', ') })`;

					if (mapViewRef.current) {
						fetchFeatures(selectedLayer).then(features => {
							createLabels(features, mapViewRef.current, floorRoomIds);
							adjustLabelVisibility(mapViewRef.current, floorRoomIds);
						});
					}
					const roomsToAddIcons = rooms.filter((room: RoomIdWithType) => roomsWithoutLabels.includes(room.roomType));
					console.log(roomsToAddIcons.length);
					roomsToAddIcons.forEach((room: RoomIdWithType) => {
						getRoomCenter(selectedLayer, room.RoomID).then(center => {
							if (center) {
								let iconGraphic;
								let excludedRoomIcon;

								if (room.roomType === 35) {
									excludedRoomIcon = new PictureMarkerSymbol({
										...iconProps,
										url: `${ appAddress }/icons/WomanIcon.svg`,
									});
									iconGraphic = new Graphic({
										geometry: center,
										symbol: excludedRoomIcon
									});

								} else if (room.roomType === 26) {
									excludedRoomIcon = new PictureMarkerSymbol({
										...iconProps,
										url: `${ appAddress }/icons/WheelchairIcon.svg`,
									});
									iconGraphic = new Graphic({
										geometry: center,
										symbol: excludedRoomIcon
									});

								} else if (room.roomType === 36) {
									excludedRoomIcon = new PictureMarkerSymbol({
										...iconProps,
										url: `${ appAddress }/icons/ManIcon.svg`,
									});
									iconGraphic = new Graphic({
										geometry: center,
										symbol: excludedRoomIcon
									});

								} else if (room.roomType === 88) {
									excludedRoomIcon = new PictureMarkerSymbol({
										...iconProps,
										url: `${ appAddress }/icons/WCIcon.svg`,
									});
									iconGraphic = new Graphic({
										geometry: center,
										symbol: excludedRoomIcon
									});

								} else  {
									iconGraphic = new Graphic({});
								}
								IconsGraphicsLayerRef.current?.add(iconGraphic);
							}
						});
					});

				} else {
					console.warn(`No layer found for faculty: ${ selectedFaculty }`);
				}
			} catch (error) {
				console.error('Error fetching rooms for floor:', error);
			}
		};
		if (selectedFloor) {
			updateLayersWithRooms();
		}

	}, [selectedFloor, selectedFaculty, debouncedAdjustLabelVisibility]);


	useEffect(() => {
		adjustMapHeight(); // Adjust on mount
		window.addEventListener('resize', adjustMapHeight); // Adjust on window resize

		// Cleanup listener on component unmount
		return () => window.removeEventListener('resize', adjustMapHeight);
	}, []);

	useEffect(() => {
		if (!selectedRoom) return; // Do nothing if no room is selected

		const centerMapOnRoom = async(roomId: number) => {
			const facultyLayer = await featureLayersRef.current.find(layer => layer.title === selectedFaculty);
			setIsDrawerOpen(true);
			if (!facultyLayer) {
				console.error("Faculty layer not found.");
				return;
			}
			await facultyLayer.load().then(async () => {
				if (highlightGraphicRef.current && mapViewRef.current) {
					if ("graphics" in mapViewRef.current) {
						mapViewRef.current.graphics.remove(highlightGraphicRef.current);
					}
				}

				const query = facultyLayer.createQuery();
				query.where = `RoomID = '${roomId}'`; // Adjust to match your dataset
				query.returnGeometry = true;
				query.outSpatialReference = mapViewRef.current!.spatialReference;

				try {
					const result = await facultyLayer.queryFeatures(query);
					if (result.features.length > 0) {
						const roomFeature = result.features[0];
						const highlightGraphic = new Graphic({
							geometry: roomFeature.geometry,
							symbol: highlightSymbol
						});

						mapViewRef.current!.graphics.add(highlightGraphic);
						highlightGraphicRef.current = highlightGraphic;
						await mapViewRef.current?.goTo({
							target: roomFeature.geometry,
							zoom: 19
						}, { duration: 1500, easing: "ease-out" });


					} else {
						console.error("Room not found in the layer.");
					}
				} catch (error) {
					console.error("Error querying for room location:", error);
				} finally {
					setSelectedRoom(undefined);
				}
			}).catch((error) => {
				console.error("Error loading faculty layer:", error);
			});
		};

		centerMapOnRoom(selectedRoom);
	}, [selectedRoom, selectedFaculty]);


	useEffect(() => {
		const pathParts = location.pathname.split('/').filter(Boolean);
		const facultyName = pathParts[1];
		const firstUrlPart = pathParts[0];
		if (firstUrlPart === "map" && facultyName === undefined) {
			mapViewRef.current?.goTo({
				center: [16.603375432788052, 49.20174147400288],
				zoom: 10
			}, { duration: 500, easing: "ease-out" });
		}

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
				const normalizedBuilding = replaceCzechChars(building).replace(/\s/g, "_");
				const response = await fetch(`${ serverAddress }/api/roomid/${ faculty }/${ normalizedBuilding }/${ floor }/${ roomName }`);
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
		<div>
			<div ref={ mapDiv } id="mapDiv" />
			<GeoJsonLoader onCentroidsLoaded={ handleCentroidsLoaded }
			               mapViewRef={ mapViewRef }
			               selectedFloor={ selectedFloor } />
		</div>
	);
};

export default React.memo(MapComponent);
