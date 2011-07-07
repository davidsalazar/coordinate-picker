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

})(jQuery);