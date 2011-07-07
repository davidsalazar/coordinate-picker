
(function($) {

	$.coord_selector = {settings: {}};
	$.fn.coord_selector = function(options) {  

		var settings = {
			lat_selector: '#lat',
			long_selector: '#long',
			onComplete: false
		};

		if (options)
		{ 
			$.extend(settings, options);
		}
		
		$.coord_selector.settings = settings;
		
		return this.each(function() {

			var $this = $(this);
			$this.click(function(e) {
				e.preventDefault();
				$.smodal({
					src: 'map.html', width: 700, height: 500
				}).open();
				
			});
		
		});

	};	
	
})(jQuery);