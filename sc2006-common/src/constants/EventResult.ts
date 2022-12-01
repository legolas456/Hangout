import { Timestamp } from 'firebase/firestore';

export interface DbEventResultRes extends Omit<DbEventResult, 'createdAt'> {
	uuid: string;
	createdAt: string;
}
export interface DbEventResult {
	// Because firebase doesn't allow directly nested arrays
	suggestedDates: Record<string, Array<{ start: string; end: string }>>;
	suggestions: DbEventSuggestion;
	createdAt: Timestamp;
}

export interface DbEventSuggestion {
	[category: string]: DbPlace[];
}

export const API_DATETIME_FORMAT = 'ddd LL HH:mm:ss.SSS';
export const EVENT_DATETIME_FORMAT = 'ddd LL HH:mm';
export const EVENT_DATE_FORMAT = 'ddd (DD MMM)';

export interface DbPlace {
	name: string;
	address: string;
	postal: string;
	coordinates: [lat: number, lng: number];
	distanceFromCenter: number;
}

export interface GeoapifyResponse {
	type: 'FeatureCollection';
	features: Array<GeoapifyFeature>;
}

export interface GeoapifyFeature {
	type: 'Feature';
	properties: {
		name: string;
		street: string;
		suburb: string;
		county: string;
		postcode: string;
		country: string;
		country_code: string;
		lon: number;
		lat: number;
		formatted: string;
		address_line1: string;
		address_line2: string;
		categories: string[];
		details: string[];
		datasource: any;
		distance: number;
		place_id: string;
	};
}
