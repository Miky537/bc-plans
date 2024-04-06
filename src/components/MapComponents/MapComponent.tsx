import React, { useEffect, useRef, useState } from 'react';
import MapView from '@arcgis/core/views/MapView';
import Map from '@arcgis/core/Map';
import esriConfig from '@arcgis/core/config';
import './MapComponent.css';
import '@arcgis/core/assets/esri/themes/dark/main.css';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import { fastLayerUrl, FITLayerUrl, typeToColorMapping, iconProps } from "./constants";
import { useMapContext } from "../../Contexts/MapContext";
import {
	adjustMapHeight,
	getRoomCenter,
	debounce,
	displayPinsWhenZoomChange,
	getFacultyCoordinates
} from "./MapFunctions";
import { useParams, useLocation } from "react-router-dom";
import { useFacultyContext } from "../../Contexts/FacultyContext";
import Track from "@arcgis/core/widgets/Track";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import Query from "@arcgis/core/rest/support/Query";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import PictureMarkerSymbol from "@arcgis/core/symbols/PictureMarkerSymbol";
import { FacultyType } from "../FacultySelection/FacultySelection";
import polylabel from "polylabel";
import Point from "@arcgis/core/geometry/Point";
import { Dialog, DialogContent, DialogActions, Button, Typography, Divider } from "@mui/material";
import { DividerStyles } from "../TeacherSearch/styles";
import { RoomIdWithType } from "./types";
import { dialogStyles } from "./styles";


esriConfig.apiKey = 'AAPKc9aec3697f4a4713914b13af91abd4b6SdWI-MVezH6uUVejuWqbmOpM2km6nQVf51tilIpWLfPvuXleLnYZbsvY0o9uMey7';


interface MapComponentProps {
	selectedFloor: number;
	setIsDrawerOpen: (isDrawerOpen: boolean) => void;
	setAreFeaturesLoading: (areFeaturesLoading: boolean) => void;
	areFeaturesLoading: boolean;
	allFeatures: any;
	setAllFeatures: (allFeatures: any) => void;
	setAreFeaturesEmpty: (areFeaturesEmpty: boolean) => void;
	isDrawerOpen: boolean;
}

const layerConfigs = [
	{ url: fastLayerUrl, name: "FAST", facultyId: "facultyFAST" },
	{ url: FITLayerUrl, name: "FIT", facultyId: "facultyFIT" },
	// Add more configurations as needed
];


const MapComponent = ({
	                      isDrawerOpen,
	                      selectedFloor,
	                      setIsDrawerOpen,
	                      setAreFeaturesLoading,
	                      allFeatures,
	                      setAllFeatures,
	                      setAreFeaturesEmpty,
	                      areFeaturesLoading,
                      }: MapComponentProps) => {
	const mapDiv = useRef<HTMLDivElement | null>(null);
	const featureLayersRef = useRef<FeatureLayer[]>([]);
	const { faculty, building, floor, roomName } = useParams();
	const {
		setSelectedRoomId,
		handleRoomSelection,
		selectedFaculty,
		setSelectedFaculty,
		selectedFloorNumber,
		selectedRoomId,
		roomData,
	} = useFacultyContext()
	const IconsGraphicsLayerRef = useRef<GraphicsLayer | null>(null);
	const FeaturesGraphicsLayerRef = useRef<GraphicsLayer | null>(null);
	const RoomHighlightGraphicsLayerRef = useRef<GraphicsLayer | null>(null);
	const LabelsGraphicsLayerRef = useRef<GraphicsLayer | null>(null);
	const PinsGraphicsLayerRef = useRef<GraphicsLayer | null>(null);

	const [featureGraphicsLayer] = useState(new GraphicsLayer());
	const abortControllerRef = useRef<AbortController | null>(null);
	const selectedFloorNumberRef = useRef(selectedFloorNumber);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [dialogData, setDialogData] = useState<any>(null);
	const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
	const [featuresUpdated, setFeaturesUpdated] = useState(false);

	const location = useLocation()

	const {
		centerCoordinates,
		setIsMapLoaded,
		isMapLoaded,
		zoom,
		mapViewRef,
		activateAnimation,
		setActivateAnimation,
		setCenterCoordinates,
		setArePinsVisible,
		setZoom,
		doesRoomExist,
		setDoesRoomExist
	} = useMapContext();

	useEffect(() => {
		mapViewRef.current?.map.add(featureGraphicsLayer);
	}, [featureGraphicsLayer, mapViewRef]);


	const highlightSymbol = { // design one selected room
		type: "simple-fill",
		color: [255, 0, 0, 1],
		style: "solid",
		outline: {
			color: "black",
			width: 3
		}
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

		const featureGraphicsLayer = new GraphicsLayer();
		const roomHighlightGraphicsLayer = new GraphicsLayer();
		const labelsGraphicsLayer = new GraphicsLayer();
		const iconsGraphicsLayer = new GraphicsLayer();
		const pinsGraphicsLayer = new GraphicsLayer();

		mapView.map.add(pinsGraphicsLayer);
		PinsGraphicsLayerRef.current = pinsGraphicsLayer;

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
			icon: "", //adding custom icon in index.css
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
					RoomHighlightGraphicsLayerRef.current!.graphics.removeAll();
				}
				const response = await mapView.hitTest(event);
				if (response.results.length > 0) {
					const firstHit = response.results.find(result => result.type === "graphic");

					if (firstHit && "graphic" in firstHit) {
						const clickedGraphic = firstHit.graphic;
						if (clickedGraphic.attributes?.type === "facultyAddressPin") {
							setDialogData({
								faculty: clickedGraphic.attributes.faculty,
								address: clickedGraphic.attributes.address,
							});
							setIsDialogOpen(true);
							return;
						}

						if (clickedGraphic.attributes === null) {
							return;
						}

						// Check if the graphic has an 'id' or 'RoomID' attribute
						if ('id' in clickedGraphic.attributes || 'RoomID' in clickedGraphic.attributes) {
							// Trigger any additional actions on room selection
							if ('id' in clickedGraphic.attributes) {
								handleRoomSelection(clickedGraphic.attributes.id);
							} else if ('RoomID' in clickedGraphic.attributes) {
								handleRoomSelection(clickedGraphic.attributes.RoomID);

							}
							setIsDrawerOpen(true);
						} else {
							handleRoomSelection(undefined);
						}
					}
				}
			});

		}).catch((err: Error) => console.error("MapView failed to load", err));

		return () => {
			if (mapView) {
				setIsMapLoaded(false);
				mapView.destroy();
				setIsRoomDialogOpen(false);
				mapViewRef.current = null;
				if (abortControllerRef.current) {
					if ("abort" in abortControllerRef.current) {
						abortControllerRef.current.abort();
					}
				}
			}
		};
	}, [centerCoordinates]);

	useEffect(() => {
		const zoomWatch = mapViewRef.current?.watch("zoom", (zoom) => {
			if (zoom > 16 && allFeatures.length > 0) {
				debouncedDisplayRoomWhenZoomChange();
			} else {
				debouncedDisplayPinsWhenZoomChange(PinsGraphicsLayerRef.current, RoomHighlightGraphicsLayerRef, FeaturesGraphicsLayerRef, setArePinsVisible);
			}
		});
		return () => {
			if (zoomWatch) {
				if ("remove" in zoomWatch) {
					zoomWatch?.remove();
				}
			}
		};

	}, [allFeatures]);


	useEffect(() => {
		selectedFloorNumberRef.current = selectedFloorNumber;
	}, [selectedFloorNumber]);

	const fetchCurrentFloorRooms = async() => {
		try {
			const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/rooms/${ selectedFaculty }/byFloor/${ selectedFloorNumberRef.current }`);
			if (!response.ok) {
				throw new Error('Failed to fetch rooms');
			}
			const rooms = await response.json();
			return rooms;
		} catch (error) {
			console.error('Error fetching rooms for floor:', error);
			return [];
		}
	}
	const displayRoomWhenZoomChange = () => {
		if (allFeatures.length === 0) {
			return;
		}
		if (FeaturesGraphicsLayerRef.current?.graphics.length !== 0) { //already added
			return;
		}
		setArePinsVisible(false);
		PinsGraphicsLayerRef.current?.graphics.removeAll();
		fetchCurrentFloorRooms().then((rooms) => {
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
		})
	}
	const debouncedDisplayPinsWhenZoomChange = debounce(displayPinsWhenZoomChange, 50);
	const debouncedDisplayRoomWhenZoomChange = debounce(displayRoomWhenZoomChange, 50);


	useEffect(() => {
		console.log("Started fetching features")
		setAllFeatures([]);
		setFeaturesUpdated(false);
		setAreFeaturesLoading(true);
		const abortController = new AbortController();
		if (featureLayersRef.current) {
			const selectedLayer = featureLayersRef.current.find(layer => layer.title === selectedFaculty);
			if (!selectedLayer) {
				setAreFeaturesEmpty(true);
				console.log("here")
				setAreFeaturesLoading(false);
				setFeaturesUpdated(true);
				return;
			}
			const query = new Query();
			query.where = '1=1';
			query.returnGeometry = true;
			query.outFields = ['RoomID', 'name', 'roomType', 'Shape__Area'];

			selectedLayer.queryFeatures(query, { signal: abortController.signal })
				.then((results) => {
					// console.log("res", results.features)
					setAllFeatures(results.features);
					if (results.features.length === 0) {
						setAreFeaturesEmpty(true);
						console.log("Here 2")
						setAreFeaturesLoading(false);
						setFeaturesUpdated(true)
					} else {
						console.log("Ended fetching features")
						setFeaturesUpdated(true)
						setAreFeaturesEmpty(false);
						console.log("Here 3")
						setAreFeaturesLoading(false);
					}
				})
				.catch((error) => {
					setFeaturesUpdated(true)
					setAreFeaturesEmpty(true);
					console.log("Here 4")
					// setAreFeaturesLoading(false);
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
	}, [selectedFaculty]);

	function createLabels(features: any, floorRoomIds: number[]) {
		LabelsGraphicsLayerRef.current?.removeAll();
		const filteredFeatures = features.filter((feature: Graphic) => floorRoomIds.includes(feature.attributes.RoomID));

		filteredFeatures.forEach((feature: any) => {
			// Convert ArcGIS Polygon geometry to a format compatible with polylabel
			const polygon = feature.geometry.rings.map((ring: number[][]) => ring.map((point) => [point[0], point[1]]));


			// Use polylabel to find the pole of inaccessibility (optimal label position)
			const [x, y] = polylabel(polygon, 1.0);

			const labelSymbol = new TextSymbol({
				text: feature.attributes.name,
				color: "black",
				haloColor: "white",
				haloSize: "2px",
				yoffset: -2,
				font: {
					size: 12,
					weight: "bold",
				}
			});

			const pointGeometry = new Point({
				x: x,
				y: y,
				spatialReference: feature.geometry.spatialReference // Use the feature's spatial reference
			});

			const labelGraphic = new Graphic({
				geometry: pointGeometry,
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
				} else if (currentZoom >= 17) { //show only the largest rooms
					shouldDisplay = isLargestArea && isRoomOnSelectedFloor;
				} else {
					shouldDisplay = false;
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
						excludedRoomIconURL = `${ process.env.REACT_APP_APP_URL }/icons/WomanIcon.svg`;
						break;
					case 26:
						excludedRoomIconURL = `${ process.env.REACT_APP_APP_URL }/icons/WheelchairIcon.svg`;
						break;
					case 36:
						excludedRoomIconURL = `${ process.env.REACT_APP_APP_URL }/icons/ManIcon.svg`;
						break;
					case 87:
						excludedRoomIconURL = `${ process.env.REACT_APP_APP_URL }/icons/ElevatorIcon.svg`;
						break;
					case 88:
						excludedRoomIconURL = `${ process.env.REACT_APP_APP_URL }/icons/WCIcon.svg`;
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
				// const largestAreaThreshold = 30;

				// const isLargestArea = roomArea >= largestAreaThreshold;
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
				const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/rooms/${ selectedFaculty }/byFloor/${ selectedFloorNumber }`);
				if (!response.ok) {
					throw new Error('Failed to fetch rooms');
				}
				const rooms = await response.json();
				const roomsWithoutLabels = [7, 8, 21, 24, 25, 26, 27, 35, 36, 38, 78, 79, 81, 83, 84, 85, 86, 87, 88, 90, 138, 140, 150, 161];

				// const selectedLayer = featureLayersRef.current.find(layer => layer.title === selectedFaculty);
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
		RoomHighlightGraphicsLayerRef.current?.graphics.removeAll();
	}, [selectedFloorNumber]);

	useEffect(() => {
		// console.log("alll", selectedRoomId, areFeaturesLoading, featuresUpdated)
		if (selectedRoomId === undefined || areFeaturesLoading || !featuresUpdated) {
			return;
		}
		RoomHighlightGraphicsLayerRef.current!.graphics.removeAll();
		const roomFeature = allFeatures.find((feature: any) => feature.attributes.RoomID === selectedRoomId);
		if (!roomFeature && selectedFaculty) {
			const centerArr = getFacultyCoordinates(selectedFaculty);
			const arr = [centerArr.lat, centerArr.lng]
			mapViewRef.current?.goTo(
				{ target: arr },
				{ duration: 1000, easing: "ease-out", animate: true }
			).then(() => {
				if (!mapViewRef.current) return;
			}).catch(function(error) {
				if (error.name !== "AbortError") {
					console.error(error);
				}
			});
		}
		if (!roomFeature) {
			if (isDrawerOpen) {
				setIsRoomDialogOpen(true);
			}
			return;
		}

		if (roomFeature && mapViewRef.current) {
			// Zoom to the selected room
			const highlightGraphic = new Graphic({
				geometry: roomFeature.geometry,
				symbol: highlightSymbol
			});

			if (isDrawerOpen) {
				RoomHighlightGraphicsLayerRef.current?.graphics.add(highlightGraphic)
			} else {
				return;
			}

			abortControllerRef.current = new AbortController();
			if (roomFeature.geometry.extent) {

				mapViewRef.current?.goTo(
					{ target: roomFeature.geometry.extent.expand(1.5) },
					{ duration: 1000, easing: "ease-out", signal: abortControllerRef.current!.signal, animate: true }
				).then(() => {
					// console.log("Animation")
					if (!mapViewRef.current) return;
				}).catch(function(error) {
					if (error.name !== "AbortError") {
						console.error(error);
					}
				});
			} else {

				mapViewRef.current?.goTo(
					{ target: roomFeature.geometry, zoom: 19 },
					{ duration: 1250, easing: "ease-out", signal: abortControllerRef.current!.signal, animate: true }
				).then(() => {
					if (!mapViewRef.current) return;
				}).catch(function(error) {
					if (!isMapLoaded) return;
					if (error.name !== "AbortError") {
						console.error(error);
					}
				});
			}
		} else {
			console.error("Room not found.");
		}

		return () => {
			abortControllerRef.current!.abort();
			setSelectedRoomId(undefined);
		};
	}, [selectedRoomId, allFeatures, isDrawerOpen, areFeaturesLoading, featuresUpdated]);

	useEffect(() => {
		if (activateAnimation) {
			const arr = [centerCoordinates.lat, centerCoordinates.lng]
			mapViewRef.current?.goTo({
				target: arr,
				zoom: zoom
			}, { duration: 500, easing: "ease-out" })
				.then(() => {
					setActivateAnimation(false);
				})
				.catch(err => {
					console.error("Animation failed:", err);
				});
		}
	}, [activateAnimation])

	useEffect(() => {
		const fetchRoomId = async() => {
			try {
				if (!faculty || !building || !floor || !roomName) {
					console.log("Missing parameters for fetching room ID", faculty, building, selectedFloorNumber, roomName);
					return
				}
				const response = await fetch(`${ process.env.REACT_APP_BACKEND_URL }/api/roomid/${ faculty }/${ building }/${ floor }/${ roomName }`)
				if (!response.ok) {
					throw new Error('Failed to fetch room ID');
				}

				const data = await response.json();
				setSelectedRoomId(data.room_id);
				await handleRoomSelection(data.room_id);
				setIsDrawerOpen(true);
			} catch (error) {
				console.error('Error fetching room ID:', error);
				setSelectedRoomId(undefined);
			}
		};
		if (faculty && building && floor && roomName) {
			fetchRoomId();
		} else if (faculty) {
			setSelectedFaculty(faculty as FacultyType)
			setCenterCoordinates(getFacultyCoordinates(faculty as FacultyType));
		} else if (location.pathname === "/map" || location.pathname === "/" || location.pathname === "/map/") {
			setCenterCoordinates({ lat: 16.58718904843347, lng: 49.217963479239316 });
			setZoom(13);
			displayPinsWhenZoomChange(PinsGraphicsLayerRef.current, RoomHighlightGraphicsLayerRef, FeaturesGraphicsLayerRef, setArePinsVisible);
		} else {
			return;
		}
	}, [faculty, building, floor, roomName]);
	useEffect(() => {
		if (!mapViewRef.current || !PinsGraphicsLayerRef.current) {
			return;
		}
		if (location.pathname === "/map" || location.pathname === "/" || location.pathname === "/map/") {
			displayPinsWhenZoomChange(PinsGraphicsLayerRef.current, RoomHighlightGraphicsLayerRef, FeaturesGraphicsLayerRef, setArePinsVisible);
		}
	}, [location.pathname, mapViewRef.current, PinsGraphicsLayerRef.current]);

	const handleCloseRoomDialog = () => {
		setIsRoomDialogOpen(false);
		setDoesRoomExist(true)
	};
	const handleClose = () => {
		setIsDialogOpen(false);
	};


	return (
		<>
			<div ref={ mapDiv } id="mapDiv" />
			<Dialog open={ isDialogOpen } onClose={ handleClose }>
				<Typography variant="h5" align="center" pt={ 2 }>Navigate to faculty</Typography>
				<DialogContent sx={ { pl: 2 } }>
					<Typography color="GrayText" variant="body2">Faculty</Typography>
					<Typography variant="body1">{ dialogData?.faculty }</Typography>
					<Divider sx={ { mb: 1, pt: 1, ...DividerStyles } } />
					<Typography color="GrayText" variant="body2">Address</Typography>
					<Typography variant="body1">{ dialogData?.address }</Typography>
				</DialogContent>
				<DialogActions>
					<Button variant="outlined" onClick={ () => setIsDialogOpen(false) }>Cancel</Button>
					<Button variant="contained" onClick={ () => {
						window.open(`https://www.google.com/maps/dir/?api=1&destination=${ encodeURIComponent(dialogData?.address) }`, '_blank');
						setIsDialogOpen(false);
					} }><Typography>Navigate</Typography></Button>
				</DialogActions>
			</Dialog>

			<Dialog open={ isRoomDialogOpen } className="room-dialog"
			        onClose={ handleCloseRoomDialog } sx={ dialogStyles }>
				<DialogContent sx={ { margin: 0, display: "flex", alignItems: "center" } }>
					<Typography variant="h5" align="center" pt={ 2 }>Room is yet to be added!</Typography>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default React.memo(MapComponent);
