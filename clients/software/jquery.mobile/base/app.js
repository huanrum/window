/**
 * Created by sus on 2015/12/28.
 */
(function($){
	'use strict';

	$(function(){
		var oldPage = $('[data-role="page"]'),pages = [];
		var select = $('<ul style="overflow: auto;"></ul>').appendTo(oldPage.find('[data-role="content"]').empty());
		for(var i=0;i<window.contentFunc.length;i++){
			pages.push(createPage(pages[pages.length-1]||$(),i));
			select.append($('<li><a href="#'+pages[i].attr('id')+'">@title@</a></li>'.replace('@title@',pages[pages.length-1].find('[data-role="header"]>h1').text())));
			oldPage.before(pages[pages.length-1]);
		}

		refresh();
		if(typeof window.goto === 'number'){
			while(window.goto < 0){
				window.goto += pages.length;
			}
			$.mobile.changePage('#' + pages[window.goto % pages.length].attr('id'));
		}

		function refresh(){
			var activePage = $('[data-role="page"].ui-page');
			var header = activePage.find('[data-role="header"]').get(0) || {offsetHeight:42.396};
			var contentPadding =activePage.find('[data-role="content"]').css('padding');
			var footer = activePage.find('[data-role="footer"]').get(0) || {offsetHeight:35};

			$('[data-role="page"]').each(function(){
				var self = $(this).css({overflow:'hidden'});
				self.find('[data-role="content"]').css({overflow:'auto',minHeight: self.height() - header.offsetHeight-footer.offsetHeight - 2 * parseFloat(contentPadding)});
				if(oldPage.get(0) !== this){
					self.find('[data-role="footer"]').append($('<a>Select</a>').click(function(){$.mobile.changePage('#');}));
				}
			});
		}

	});

	function createPage(prePage,index){
		var thisPage = $('<div data-role="page" id="page-00"></div>'.replace('00',Date.now() + index));

		$('<div data-role="header"><h1>Page @index@</h1></div>'.replace('@index@',index)).appendTo(thisPage);

		$('<div data-role="content"></div>').append(getContent(prePage,thisPage,index)).appendTo(thisPage);

		$('<div data-role="footer"></div>').append($('<a href="#'+(prePage.attr('id')||'')+'" data-icon="back">Prev</a>')).appendTo(thisPage);

		prePage.find('[data-role="footer"]').append($('<a href="#'+thisPage.attr('id')+'">Next</a>'));

		return thisPage;
	}

	function getContent(prePage,thisPage,index){
		var fun = window.contentFunc[index] || function(){};
		return $(fun(prePage,thisPage,index) || '<div>No Content</div>');
	}

})(window.jQuery);