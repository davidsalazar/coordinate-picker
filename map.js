


/// <reference path="$-1.3.2.min-vsdoc.js" />

/************************************************************************************************************
* SIMPLE MODAL v 2.0
* © 2009 FISHBOWL MEDIA LLC
* http://fishbowlmedia.com
***********************************************************************************************************/

(function ($) {

	/**********************************
	* CUSTOMIZE THE DEFAULT SETTINGS
	* Ex: 
	* var _settings = {
	* 	id: 'modal',
	* 	src: function(sender){
	*		return $(sender).attr('href');
	*	},
	* 	width: 800,
	* 	height: 600
	* }
	**********************************/
	var _settings = {
		width: 800, // Use this value if not set in CSS or HTML
		height: 600, // Use this value if not set in CSS or HTML
		overlayOpacity: .85, // Use this value if not set in CSS or HTML
		id: 'modal',
		src: function (sender) {
			return $(sender).attr('href');
		},
		fadeInSpeed: 0,
		fadeOutSpeed: 0
	}

	/**********************************
	* DO NOT CUSTOMIZE BELOW THIS LINE
	**********************************/
	var _modal = function (sender, params) {
		this.options = {
			parent: null,
			overlayOpacity: null,
			id: null,
			content: null,
			width: null,
			height: null,
			modalClassName: null,
			imageClassName: null,
			closeClassName: null,
			overlayClassName: null,
			src: null,
			onLoad: false
		}
		this.options = $.extend({}, options, _defaults);
		this.options = $.extend({}, options, _settings);
		this.options = $.extend({}, options, params);
		this.close = function () {
			$('.' + options.modalClassName + ', .' + options.overlayClassName).fadeOut(_settings.fadeOutSpeed, function () { $(this).unbind().remove(); });
		}
		this.open = function () {
			if (typeof options.src == 'function') {
				options.src = options.src(sender)
			} else {
				options.src = options.src || _defaults.src(sender);
			}

			var fileExt = /^.+\.((jpg)|(gif)|(jpeg)|(png)|(jpg))$/i;
			var contentHTML = '';
			if (fileExt.test(options.src)) {
				contentHTML = '<div class="' + options.imageClassName + '"><img src="' + options.src + '"/></div>';

			} else {
				contentHTML = '<iframe id="coord_selector_iframe" name="coord_selector_iframe" width="' + options.width + '" height="' + options.height + '" frameborder="0" scrolling="no" allowtransparency="true" src="' + options.src + '">&lt/iframe>';
			}
			options.content = options.content || contentHTML;

			if ($('.' + options.modalClassName).length && $('.' + options.overlayClassName).length) {
				$('.' + options.modalClassName).html(options.content);
			} else {
				$overlay = $((_isIE6()) ? '<iframe id="coord_selector_iframe" name="coord_selector_iframe" src="BLOCKED SCRIPT\'&lt;html&gt;&lt;/html&gt;\';" scrolling="no" frameborder="0" class="' + options.overlayClassName + '"></iframe><div class="' + options.overlayClassName + '"></div>' : '<div class="' + options.overlayClassName + '"></div>');
				$overlay.hide().appendTo(options.parent);

				$modal = $('<div id="' + options.id + '" class="' + options.modalClassName + '" style="width:' + options.width + 'px; height:' + options.height + 'px; margin-top:-' + (options.height / 2) + 'px; margin-left:-' + (options.width / 2) + 'px;">' + options.content + '</div>');
				$modal.hide().appendTo(options.parent);

				$close = $('<a class="' + options.closeClassName + '"></a>');
				$close.appendTo($modal);

				var overlayOpacity = _getOpacity($overlay.not('iframe')) || options.overlayOpacity;
				$overlay.fadeTo(0, 0).show().not('iframe').fadeTo(_settings.fadeInSpeed, overlayOpacity);
				$modal.fadeIn(_settings.fadeInSpeed);

				$close.click(function () { $.smodal().close(); });
				$overlay.click(function () { $.smodal().close(); });
			}
			
			if ($.isFunction(options.onLoad))
			{
				$('#coord_selector_iframe').load(options.onLoad);
			}
		 
		}
		return this;
	}
	var _isIE6 = function () {
		if (document.all && document.getElementById) {
			if (document.compatMode && !window.XMLHttpRequest) {
				return true;
			}
		}
		return false;
	}
	var _getOpacity = function (sender) {
		$sender = $(sender);
		opacity = $sender.css('opacity');
		filter = $sender.css('filter');

		if (filter.indexOf("opacity=") >= 0) {
			return parseFloat(filter.match(/opacity=([^)]*)/)[1]) / 100;
		}
		else if (opacity != '') {
			return opacity;
		}
		return '';
	}
	var _defaults = {
		parent: 'body',
		overlayOpacity: 85,
		id: 'modal',
		content: null,
		width: 800,
		height: 600,
		modalClassName: 'modal-window',
		imageClassName: 'modal-image',
		closeClassName: 'close-window',
		overlayClassName: 'modal-overlay',
		src: function (sender) {
			return $(sender).attr('href');
		},
		onload: false
	}
	
	$.smodal = function (options) {
		return _modal(this, options);
	}
	$.smodal.open = function () {
		_modal().open();
	}
	$.smodal.close = function () {		
		_modal().close();
	}
	$.fn.smodal = function (options) {
		return _modal(this, options);
	}
})(jQuery);



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
	
	$.fn.coord_selector = function(options) {  

		var settings = {
			lat_selector: '#lat',
			long_selector: '#long',
			callback: false
		};

		var Map = {
			map: null,
			geocoderService: null,
			markers: [],
			iframe: null,
			init: function(config) {
				Map.iframe = $('#coord_selector_iframe').contents();
				var settings = $.extend(settings, config);
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

				Map.map = new google.maps.Map(Map.iframe.find('#map_canvas').get(0), options);

				google.maps.event.addListener(Map.map, 'dragend', Map.update_marker);
				google.maps.event.addListener(Map.map, 'zoom_changed', Map.update_marker);


	    		Map.geocoderService = new google.maps.Geocoder();
				Map.add_marker(latlng);
				Map.update();

				Map.iframe.find('#search_map').input_hint();

				Map.iframe.find('#search_address_button').click(function() {
					$(this).parents('form').submit();
				});

				Map.iframe.find('#search_map_form').submit(function(e) {
					e.preventDefault();
					geocoderService.geocode({'address': Map.iframe.find('#search_map').val()}, function(results, status) {
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

				Map.iframe.find('#select_coords_button').click(function(e) {
					var coords = {'lat': Map.iframe.find('#lat').val(), 'long': Map.iframe.find('#long').val()};
					if ($.isFunction(settings.callback))
					{
						settings.callback(coords);
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

					$.smodal.close();
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
				Map.iframe.find('#long').val(lng);
				Map.iframe.find('#lat').val(lat);
				Map.iframe.find('#on_long').text(lng.toFixed(3));
				Map.iframe.find('#on_lat').text(lat.toFixed(3));
			}

		};

		if (options)
		{ 
			$.extend(settings, options);
		}

		return this.each(function() {

			var $this = $(this);
			$this.click(function(e) {
				e.preventDefault();
				$.smodal({
					src: 'map.html', width: 700, height: 500, onLoad: function() {
						Map.init(settings);
					}
				}).open();
				
			});
		
		});

	};

	
	
})(jQuery);
