var Map;

(function($) {

	if (!$.isFunction($.fn.selectRange))
	{
		$.fn.selectRange = function(start, end) {
		    var el = $(this).get(0);
		    if (!el) return;
		    else if (el.setSelectionRange) { el.focus(); el.setSelectionRange(start, end); } /* WebKit */ 
		    else if (el.createTextRange) { var range = el.createTextRange(); range.collapse(true); range.moveEnd('character', end); range.moveStart('character', start); range.select(); } /* IE */
		    else if (el.selectionStart) { el.selectionStart = start; el.selectionEnd = end; }
		};
	}

	$.fn.input_hint = function(settings) {
		var config = {class_name: 'label'};

		if (settings)
		{
			$.extend(config, settings);
		}

		var $selector = this;

		var unload = function() {
			$selector.each(function() {
				var $this = $(this);
				if ($this.attr('value') == $this.attr('title'))
					$this.attr('value', '');

			});
		};

		$(window).unload(function() {
			unload();
		});

		return $selector.each(function() {

			var $this = $(this);

			if ($this.attr('value').length == 0)
				$this.attr('value', $this.attr('title')).addClass(config.class_name);

			$this.focus(function() {
				if ($this.attr('value') == $this.attr('title'))
					$this.selectRange(0, 0);
			}).click(function() {
				if ($this.attr('value') == $this.attr('title'))
					$this.selectRange(0, 0);
			}).keypress(function() {
				if ($this.attr('value') == $this.attr('title'))
					$this.attr('value', '').removeClass(config.class_name);
			}).keyup(function() {
				if ($this.attr('value') == $this.attr('title'))
					$this.addClass(config.class_name);
				else
					$this.removeClass(config.class_name);
			}).blur(function() {
				if ($this.attr('value') == '')
					$this.attr('value', $this.attr('title')).addClass(config.class_name);
			});

			var $form = $this.parents('form');
			if (!$form.data('input_hint_event'))
			{
				$form.submit(function() {
					unload();
				});
				$form.data('input_hint_event', true);
			}

		});

		return this;
	};
	
	Map = {
		map: null,
		markers: [],
		init: function(config) {
			
			var settings = {
				lat_selector: '#lat',
				long_selector: '#long',
				onComplete: false
			};
			
			if (window.parent.$.coord_selector && window.parent.$.coord_selector.settings)
			{
				$.extend(settings, window.parent.$.coord_selector.settings);
			}
			
			var zoom = 8;
			var coord_lat = 29.399519677124808, coord_long = -98.50343423461912;
			if (google.maps.ClientLocation)
			{
				zoom = 12;
				coord_lat = google.maps.ClientLocation.latitude;
				coord_long = google.maps.ClientLocation.longitude;
			}

			var latlng = new google.maps.LatLng(coord_lat, coord_long);

			var options = {
				zoom: zoom,
				center: latlng,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};

			Map.map = new google.maps.Map($('#map_canvas').get(0), options);

			google.maps.event.addListener(Map.map, 'dragend', Map.update_marker);
			google.maps.event.addListener(Map.map, 'zoom_changed', Map.update_marker);


    		var geocoderService = new google.maps.Geocoder();
			Map.add_marker(latlng);
			Map.update();

			$('#search_map').input_hint();

			$('#search_address_button').click(function() {
				$(this).parents('form').submit();
			});

			$('#search_map_form').submit(function(e) {
				e.preventDefault();
				geocoderService.geocode({'address': $('#search_map').val()}, function(results, status) {
					if (status == google.maps.GeocoderStatus.OK)
					{

						var latlng = results[0].geometry.location;
						Map.add_marker(latlng);
						Map.update();
						Map.map.fitBounds(results[0].geometry.viewport);
					}
					else if (status == google.maps.GeocoderStatus.ZERO_RESULTS)
					{
						alert('Address not found');
					}
					else
					{
						alert('Address lookup failed');
					}
				});

			});

			$('#select_coords_button').click(function(e) {
				var coords = {'lat': $('#lat').val(), 'long': $('#long').val()};
				if ($.isFunction(settings.onComplete))
				{
					settings.onComplete(coords);
				}
				else
				{
					if ($(settings.long_selector, window.parent.document).length)
					{
						$(settings.long_selector, window.parent.document).val(coords.long);
					}

					if ($(settings.lat_selector, window.parent.document).length)
					{
						$(settings.lat_selector, window.parent.document).val(coords.lat);
					}
				}

				// If using smodal box, close it. 
				if (window.parent.$.smodal)
				{
					window.parent.$.smodal.close();	
				}
				// try closing this window
				else
				{
					window.self.close();
				}
			});

		},

		add_marker: function(latlng) {
			Map.reset_markers();

			var marker = new google.maps.Marker({
				map: Map.map,
				position: latlng,
				draggable: true
			});

			Map.markers.push(marker);
			google.maps.event.addListener(marker, 'dragend', function(e) {
				Map.map.panTo(e.latLng);
				Map.update();
			});

			return marker;
		},

		reset_markers: function() {
			if (Map.markers)
			{
				for (i in Map.markers)
				{
					Map.markers[i].setMap(null);
				}
				Map.markers = [];
			}
		},

		update_marker: function() {
			var latlng = Map.map.getCenter();
			Map.add_marker(latlng);
			Map.update();
		},

		update: function() {
			var marker = Map.markers[0];
			var markerLatLng = marker.getPosition();

			var lat = markerLatLng.lat(), lng = markerLatLng.lng();
			$('#long').val(lng);
			$('#lat').val(lat);
			$('#on_long').text(lng.toFixed(3));
			$('#on_lat').text(lat.toFixed(3));
		}

	};
	
	
})(jQuery);
