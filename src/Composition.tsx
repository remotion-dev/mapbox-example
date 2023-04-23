import {useEffect, useRef} from 'react';
import {AbsoluteFill} from 'remotion';
import mapboxgl, {Map, MercatorCoordinate} from 'mapbox-gl';
import * as turf from '@turf/turf';
import {routes} from './routes';

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

export const MyComposition = () => {
	const ref = useRef<HTMLDivElement>(null);

	const targetRoute = routes.target;
	// This is the path the camera will move along
	const cameraRoute = routes.camera;

	useEffect(() => {
		const map = new Map({
			container: 'map',
			zoom: 11.53,
			center: [6.5615, 46.0598],
			pitch: 65,
			bearing: -180,
			// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
			style: 'mapbox://styles/mapbox/outdoors-v12',
			interactive: false,
		});

		map.on('style.load', () => {
			map.addSource('mapbox-dem', {
				type: 'raster-dem',
				url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
				tileSize: 512,
				maxzoom: 14,
			});
			map.setTerrain({source: 'mapbox-dem', exaggeration: 1.5});
			map.addSource('trace', {
				type: 'geojson',
				data: {
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'LineString',
						coordinates: targetRoute,
					},
				},
			});
			map.addLayer({
				type: 'line',
				source: 'trace',
				id: 'line',
				paint: {
					'line-color': 'black',
					'line-width': 5,
				},
				layout: {
					'line-cap': 'round',
					'line-join': 'round',
				},
			});
		});

		// Wait for the terrain and sky to load before starting animation
		map.on('load', () => {
			const animationDuration = 80000;
			const cameraAltitude = 4000;
			// Get the overall distance of each route so we can interpolate along them
			const routeDistance = turf.lineDistance(turf.lineString(targetRoute));
			const cameraRouteDistance = turf.lineDistance(
				turf.lineString(cameraRoute)
			);

			let start = 0;

			function frame(time: number) {
				if (!start) start = time;
				// Phase determines how far through the animation we are
				const phase = (time - start) / animationDuration;

				// Phase is normalized between 0 and 1
				// when the animation is finished, reset start to loop the animation
				if (phase > 1) {
					// Wait 1.5 seconds before looping
					setTimeout(() => {
						start = 0.0;
					}, 1500);
				}

				// Use the phase to get a point that is the appropriate distance along the route
				// this approach syncs the camera and route positions ensuring they move
				// at roughly equal rates even if they don't contain the same number of points
				const alongRoute = turf.along(
					turf.lineString(targetRoute),
					routeDistance * phase
				).geometry.coordinates;

				const alongCamera = turf.along(
					turf.lineString(cameraRoute),
					cameraRouteDistance * phase
				).geometry.coordinates;

				const camera = map.getFreeCameraOptions();

				// Set the position and altitude of the camera
				camera.position = MercatorCoordinate.fromLngLat(
					{
						lng: alongCamera[0],
						lat: alongCamera[1],
					},
					cameraAltitude
				);

				// Tell the camera to look at a point along the route
				camera.lookAtPoint({
					lng: alongRoute[0],
					lat: alongRoute[1],
				});

				map.setFreeCameraOptions(camera);

				window.requestAnimationFrame(frame);
			}

			window.requestAnimationFrame(frame);
		});
	}, [cameraRoute, targetRoute]);

	return <AbsoluteFill ref={ref} id="map" />;
};
