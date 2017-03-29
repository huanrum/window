/**
 * Created by sus on 2015/12/29.
 */
(function(){
	'use strict';

	window.contentFunc = window.contentFunc || [];

	window.contentFunc[window.contentFunc.length] = function(){

		var content = $([
			'<form action="echo.cfm" method="post">',
				'<div data-role="fieldcontain">',
					'<label for="isabsurl">Is Absolute Url?</label>',
					'<input type="text" name="isabsurl" id="isabsurl" value="">',
					'<div id="isabsurlresult"></div>',
				'</div>',
			'</form>'
		].join(''));

		content.find('#isabsurl').keyup(function(){
			var thisVal = $(this).val();
			var isAbsUrl = $.mobile.path.isAbsoluteUrl(thisVal);
			content.find('#isabsurlresult').text(isAbsUrl);
		});

		return content;
	};

	window.contentFunc[window.contentFunc.length] = function(){

		return [
			'<div class="content-func-shadow-text">This Shadow</div>',
			'<div class="content-func-shadow-box">This Shadow</div>',
			'<div class="content-func-shadow-box-inset">This Shadow</div>',
			'<div class="content-func-linear">This Shadow</div>'
		].join('');
	};


})(window.jQuery);