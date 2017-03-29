/**
 * Created by sus on 2015/12/28.
 */
(function(){
	'use strict';

	window.contentFunc = window.contentFunc || [];


	window.contentFunc[window.contentFunc.length] = function(prevPage,thisPage,index){

		thisPage.find('[data-role="header"] h1').html('P'+index+' : Notekeeper');

		return '<a href="#leftPanel" data-role="button">第八章</a>';
	};

})(window.jQuery);