
jQuery(function($) {
	
	$.findJsPath = function(js) {

		var relative_js = false;

		// if js supplied, use that to find path relative to that file.
		if (js)
		{
			$('script').each(function() {
				var $this = $(this);
				var src = $this.attr('src');
				if (src && src.substring(src.length - js.length) == js)
				{
					relative_js = src;
					return true; 
				}
			});
		}

		// Fallback to using the first script tag
		else if ($('script').length)
		{
			relative_js = $('script').attr('src');	
		}
	
		var js_path = '';
		if (relative_js)
		{
			var _js_path = relative_js.split('/')
			_js_path && _js_path.pop();
			if (_js_path && _js_path.length)
			{
				js_path = _js_path.join('/');
			}
		}
		return js_path ? js_path + '/' : '';

	};

	var js_path = $.findJsPath('jquery.coordinate_picker.js');

	$.get(js_path + 'jquery.smodal.js');
	
	$.coordinate_picker = {settings: {}};
	$.fn.coordinate_picker = function(options) {  

		var settings = {
			lat_selector: '#lat',
			long_selector: '#long',
			onComplete: false
		};

		if (options)
		{ 
			$.extend(settings, options);
		}
		
		$.coordinate_picker.settings = settings;
		return this.each(function() {

			var $this = $(this);
			$this.click(function(e) {
				e.preventDefault();
				$.smodal({
					src: js_path + 'map.html', width: 700, height: 500
				}).open();
				
			});
		
		});

	};
	

	
});

