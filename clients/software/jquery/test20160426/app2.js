/**
 * Created by Administrator on 2016/6/6.
 */
(function($e){
	'use strict';

	$e(function(){
		return {
			title:'Progress Bar',
			fn:function(panel,base){
				var self = this;
				var $ = window.jQuery;
				panel.innerHTML = [
					'<div class="circle" [onclick]="onclick">',
						'<div class="pie_left"><div class="left"></div></div>',
						'<div class="pie_right"><div class="right"></div></div>',
						'<div class="mask">',
							'<div>Cricle Progress</div>',
							'<span class="strong percent"></span>',
						'</div>',
					'</div>',
					'<div class="rect" [title]="index"><div></div></div>'
				].join('');

				base.eachrun(function(index){
					self.index = index % 100;
					$(panel).find('.left').css('transform','rotate(' + (180+Math.max(self.index *3.6 -180,0)) + 'deg)');
					$(panel).find('.right').css('transform','rotate(' + (180+Math.min(self.index *3.6+0.5,180)) + 'deg)');
					$(panel).find('.strong.percent').html(self.index);

					$(panel).find('.rect div').css('width',self.index+'%');
				},100);
			},
			onclick:function(){
				this.panel.appendChild($e.dialog('',$e.new('div','',this.index)));
			}
		};
	});

})(window.$ehr);