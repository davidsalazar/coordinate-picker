
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