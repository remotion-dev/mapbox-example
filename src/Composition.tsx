import {useEffect, useRef, useState} from 'react';
import {
	AbsoluteFill,
	continueRender,
	delayRender,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import mapboxgl, {Map, MercatorCoordinate} from 'mapbox-gl';
import * as turf from '@turf/turf';
import {routes} from './routes';

mapboxgl.accessToken = process.env.REMOTION_MAPBOX_TOKEN as string;

export const MyComposition = () => {
	const ref = useRef<HTMLDivElement>(null);

	const targetRoute = routes.target;
	// This is the path the camera will move along
	const cameraRoute = routes.camera;

	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const [handle] = useState(() => delayRender('Loading map...'));
	const [map, setMap] = useState<Map | null>(null);

	useEffect(() => {
		const _map = new Map({
			container: 'map',
			zoom: 11.53,
			center: [6.5615, 46.0598],
			pitch: 65,
			bearing: -180,
			style: 'mapbox://styles/mapbox/outdoors-v12',
			interactive: false,
			fadeDuration: 0,
		});

		_map.on('style.load', () => {
			_map.addSource('mapbox-dem', {
				type: 'raster-dem',
				url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
				tileSize: 512,
				maxzoom: 14,
			});
			_map.setTerrain({source: 'mapbox-dem', exaggeration: 1.5});
			_map.addSource('trace', {
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
			_map.addLayer({
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

		_map.on('load', () => {
			continueRender(handle);
			setMap(_map);
		});
	}, [handle, targetRoute]);

	useEffect(() => {
		if (!map) {
			return;
		}
		const handle = delayRender('Moving point...');

		const animationDuration = 80000;
		const cameraAltitude = 4000;
		// Get the overall distance of each route so we can interpolate along them
		const routeDistance = turf.lineDistance(turf.lineString(targetRoute));
		const cameraRouteDistance = turf.lineDistance(turf.lineString(cameraRoute));

		const start = 0;

		const time = (frame / fps) * 1000;
		// Phase determines how far through the animation we are
		const phase = (time - start) / animationDuration;

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
		map.once('render', () => continueRender(handle));
	}, [cameraRoute, fps, frame, handle, map, targetRoute]);

	return <AbsoluteFill ref={ref} id="map" />;
};
