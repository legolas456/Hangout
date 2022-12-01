export enum DateFormat {
	// ISO 8601
	API_DATE = 'YYYY-MM-DD',
	API_DATETIME = 'YYYY-MM-DDTHH:mm:ssZ',
	API_TIME = 'HH:mm:ss',

	// These should be the standardized formats for displaying date/time on frontend,
	// if designers' designs show otherwise, we should advise them to standardize the format by using these
	DISPLAY_DATE = 'DD MMM YYYY',
	DISPLAY_DATETIME = 'DD MMM YYYY, h:mm A',
	DISPLAY_TIME = 'h:mm A',
	DISPLAY_MONTH_YEAR = 'MMM YY',

	// Picker components
	PICKER_DATE = 'DD/MM/YYYY',
	PICKER_DATETIME = 'DD/MM/YYYY, h:mm A',
	PICKER_TIME = 'h:mm A',

	// MySQL
	MYSQL_DATE = 'YYYY-MM-DD',
	MYSQL_DATETIME = 'YYYY-MM-DD HH:mm:ss',
	MYSQL_TIME = 'HH:mm:ss',
}
