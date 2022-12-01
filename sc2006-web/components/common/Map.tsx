import React, { ReactNode, useEffect } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import { createCustomEqual } from 'fast-equals';

interface MapCardProps {
	markers?: ReactNode[];
	center?: google.maps.LatLngLiteral;
}

export const MapCard = ({ markers, center }: MapCardProps) => {
	const [zoom, setZoom] = React.useState(15); // initial zoom
	const [internalCenter, setCenter] = React.useState<google.maps.LatLngLiteral>(
		center || {
			lat: 0,
			lng: 0,
		},
	);

	useEffect(() => {
		if (center) {
			setCenter(center);
		}
	}, [center]);

	const onIdle = (m: google.maps.Map) => {
		setZoom(m.getZoom()!);
		setCenter(m.getCenter()!.toJSON());
	};
	const render = (status: Status) => {
		return <h1>{status}</h1>;
	};

	return (
		<div className="w-full h-96 flex flex-row items-center self-justify-center">
			<Wrapper
				apiKey={'AIzaSyC5folvhu8lxrYEgdUg1FYQBimQbChW8hk'}
				render={render}
			>
				<Map
					center={internalCenter}
					onIdle={onIdle}
					zoom={zoom}
					style={{ flexGrow: '1', height: '100%' }}
				>
					{markers}
				</Map>
			</Wrapper>
		</div>
	);
};

interface MapProps extends google.maps.MapOptions {
	style: { [key: string]: string };
	onClick?: (e: google.maps.MapMouseEvent) => void;
	onIdle?: (map: google.maps.Map) => void;
	children?: React.ReactNode;
}

const Map: React.FC<MapProps> = ({
	onClick,
	onIdle,
	children,
	style,
	...options
}) => {
	const ref = React.useRef<HTMLDivElement>(null);
	const [map, setMap] = React.useState<google.maps.Map>();

	React.useEffect(() => {
		if (ref.current && !map) {
			setMap(new window.google.maps.Map(ref.current, {}));
		}
	}, [ref, map]);

	// because React does not do deep comparisons, a custom hook is used
	// see discussion in https://github.com/googlemaps/js-samples/issues/946
	useDeepCompareEffectForMaps(() => {
		if (map) {
			map.setOptions(options);
		}
	}, [map, options]);

	React.useEffect(() => {
		if (map) {
			['click', 'idle'].forEach((eventName) =>
				google.maps.event.clearListeners(map, eventName),
			);

			if (onClick) {
				map.addListener('click', onClick);
			}

			if (onIdle) {
				map.addListener('idle', () => onIdle(map));
			}
		}
	}, [map, onClick, onIdle]);

	return (
		<>
			<div ref={ref} style={style} />
			{React.Children.map(children, (child) => {
				if (React.isValidElement(child)) {
					// set the map prop on the child component
					// @ts-ignore
					return React.cloneElement(child, { map });
				}
			})}
		</>
	);
};

const deepCompareEqualsForMaps = createCustomEqual(
	// @ts-ignore
	(deepEqual) => (a: any, b: any) => {
		if (
			isLatLngLiteral(a) ||
			a instanceof google.maps.LatLng ||
			isLatLngLiteral(b) ||
			b instanceof google.maps.LatLng
		) {
			return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
		}

		// TODO extend to other types

		// use fast-equals for other objects
		// @ts-ignore
		return deepEqual(a, b);
	},
);

export const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
	const [marker, setMarker] = React.useState<google.maps.Marker>();

	React.useEffect(() => {
		if (!marker) {
			setMarker(new google.maps.Marker());
		}

		// remove marker from map on unmount
		return () => {
			if (marker) {
				marker.setMap(null);
			}
		};
	}, [marker]);

	React.useEffect(() => {
		if (marker) {
			marker.setOptions(options);
		}
	}, [marker, options]);

	return null;
};

function useDeepCompareMemoize(value: any) {
	const ref = React.useRef();

	if (!deepCompareEqualsForMaps(value, ref.current)) {
		ref.current = value;
	}

	return ref.current;
}

function useDeepCompareEffectForMaps(
	callback: React.EffectCallback,
	dependencies: any[],
) {
	React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
