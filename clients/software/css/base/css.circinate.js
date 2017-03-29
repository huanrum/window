/**
 * Created by Administrator on 2016/5/24.
 */
(function($e,$){
	'use strict';

	$e(function base() {
		return {
			title: 'Base',
			fn:function(panel,base){
				var perent = 0;
				panel.innerHTML = [
					'<div class="circle">',
						'<div class="pie_left"><div class="left"></div></div>',
						'<div class="pie_right"><div class="right"></div></div>',
						'<div class="mask"><span>0</span>%</div>',
					'</div>'
				].join(' ');

				base.eachrun(function(){
					perent = (perent + 1)%100;
					$(panel).find('.mask span').html(perent);

					$('.circle').each(function(index, el) {
						var num = $(this).find('span').text() * 3.6;
						$(this).find('.right').css('transform', "rotate(" + Math.min(num,180) + "deg)");
						$(this).find('.left').css('transform', "rotate(" + Math.max(num - 180,0) + "deg)");
					});

				},500);
			}
		};

	});

	$e(function position() {
		return {
			title: 'Position',
			fn:function(panel,base){
				var perent = 0;
				panel.className = 'position';
				panel.innerHTML = base.each(4,function(i){
						return [
							'<div class="case-'+(i>1?'position':'none')+'" style="top:'+(120*i)+'px;">',
							'	<input class="content content-left">',
							'	<div class="content-'+(i%2?'fixed':'absolute')+' content-right"></div>',
							'</div>'
						].join(' ');
				}).join(' ');
			}
		};

	});

})(window.$ehr,window.jQuery);