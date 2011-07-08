What is this
===============================================
- jQuery Coordinate Picker is a plugin that binds a click event to an element firing a modalbox with a google map that allows you to drag a pushpin to find and return specific coordinates.

Requirements
===============================================
1.  jQuery.  Since the google maps coordinate selector is implemented as an iframe, those dependencies (google maps api v3, etc) are isolated and auto-loaded into that iframe.  

Sample Usage
===============================================
Please see sample html files to see real world examples.

```javascript

var settings = {
	
	// Form input element selector for latitude
	lat_selector: '#lat',
	
	// Form input element selector for latitude
	long_selector: '#long',
	
	// Callback function that passes an object with the 2 properties (lat, long) in decimal format.
	// data = {lat: 00.00000000000000, long: 00.00000000000000}
	onComplete: function(data) {
		
	}

};

$('#coordinate_picker').coordinate_picker(settings);

```

Installation
===============================================
1.  Add the coordinate_picker directory to your web root or javascript directory.
2.  Load **coordinate_picker/jquery.coordinate_picker.js** and **coordinate_picker/styles/smodal/shadow.css** in the page you want to use this plugin.

Release Notes
===============================================
Version 0.5 - July 8 2011
*Initial Release

Version 0.51 - July 8 2011
* Add ie specific styles to modal box because it doesn't support shadowbox css attributes.

TODO
===============================================
* Figure out how find path of plugin without loading them after the dom is ready.
* Add HTML5 Geolocation API
* Add Microsite with demo links
