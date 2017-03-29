/**
 * Created by sus on 2016/1/11.
 */
(function($e,$){
	'use strict';

	$e(function link(){
		return {
			title:'Link',
			fn:function(panel,base){
				panel.classList.add('bootstrap-link');
				panel.innerHTML = $(base.template).find('.bootstrap-link').html();

				base.each(getUrls(),function(value,pro){
					var url = 'https://rib-cn-dev480/Learn/Code/Down/'+value;
					var book = document.createElement('div');
					var icon = document.createElement('img');
					var title = document.createElement('div');
					book.appendChild(icon);
					book.appendChild(title);
					panel.appendChild(book);

					icon.src = '../../../../midea/downImages/'+(base.sToint(value.split('.').pop()) % base.downIconCount)+'.png';
					title.innerHTML = pro;
					book.onclick = function(){
						window.open(url,'Book','width=1000,height=800');
					};

					base.addTooltip(book,url);
				});
			}
		};

		function getUrls(){
			return {
				'ACE'  :'06ExternalTrainingMaterial/htmljsaj/bootstrap/BootstrapACE/index.html',
				'$25 Template'  :'06ExternalTrainingMaterial/htmljsaj/bootstrap/$25bootstrapTemplate/default.html',
				'matrix-admin00':'06ExternalTrainingMaterial/htmljsaj/bootstrap/bootstrapFramework/matrix-admin00/index.html',
				'matrix-admin01':'06ExternalTrainingMaterial/htmljsaj/bootstrap/bootstrapFramework/matrix-admin01/index.html',
				'matrix-admin02':'06ExternalTrainingMaterial/htmljsaj/bootstrap/bootstrapFramework/matrix-admin02/index.html',
				'matrix-admin03':'06ExternalTrainingMaterial/htmljsaj/bootstrap/bootstrapFramework/matrix-admin03/index.html',
				'matrix-admin04':'06ExternalTrainingMaterial/htmljsaj/bootstrap/bootstrapFramework/matrix-admin04/index.html'
			};
		}
	});

	$e(function base(){
		return {
			title:'Base',
			fn:function(panel,base){
				panel.classList.add('bootstrap-base');
				panel.innerHTML = $(base.template).find('.bootstrap-base').html();

				var ul = $(panel).find('.nav.nav-tabs');
				var container = $(panel).find('.tab-content');
				base.each(7,function(value){
					var url = '../../../../Icons/images/'+value+'.jpg';
					var thisTab = $(base.formatter('<div class="tab-pane" id="tab#0#"><img class="img-polaroid" src="#1#"></div>',value,url)).appendTo(container);
					$(base.formatter('<li><a href="#tab#0#" data-toggle="tab">Tab#0#</a></li>',value)).appendTo(ul).click(function(){
						ul.find('li').removeClass ('active');
						container.find('.tab-pane').hide();
						$(this).addClass('active');
						thisTab.show();
					});

				});
				ul.find('li:first').trigger('click');
			}
		};
	});

	$e(function grid(){
		return {
			title:'Grid',
			fn:function(panel,base){
				panel.classList.add('bootstrap-grid');
				panel.innerHTML = $(base.template).find('.bootstrap-grid').html();

				var dropdown = $(panel).find('.btn-group>.dropdown-menu');
				base.each(6,function(value){
					$(base.formatter('<li><a href="#drop#0#">Drop#0#</a></li>',value)).appendTo(dropdown);
				});
			}
		};
	});

	$e(function layout(){
		return {
			title:'Layout',
			fn:function(panel,base){
				panel.classList.add('bootstrap-layout');
				panel.innerHTML = $(base.template).find('.bootstrap-layout').html();
			}
		};
	});

	$e(function optimize(){
		return {
			title:'Optimize',
			fn:function(panel,base){
				panel.classList.add('bootstrap-optimize');
				panel.innerHTML = $(base.template).find('.bootstrap-optimize').html();
			}
		};
	});

	$e(function less(){
		return {
			title:'Less',
			fn:function(panel,base){
				panel.classList.add('bootstrap-less');
				panel.innerHTML = $(base.template).find('.bootstrap-less').html();
			}
		};
	});

	$e(function module(){
		return {
			title:'Module',
			fn:function(panel,base){
				panel.processValue = 0;
				panel.classList.add('bootstrap-module');
				panel.innerHTML = $(base.template).find('.bootstrap-module').html();
				$(panel).find('.dropdown').dropdown();
				base.eachrun(function(){
					panel.processValue = (panel.processValue + 1) % 100;
					$(panel).find('.progress.progress-striped .bar').css({width:panel.processValue+'%'});
				},1000);
			}
		};
	});

	$e(function plug(){
		return {
			title:'Plug',
			fn:function(panel,base){
				panel.classList.add('bootstrap-plug');
				panel.innerHTML = $(base.template).find('.bootstrap-plug').html();
				$(panel).find('.i-tooltip a').tooltip({
					html:true,
					title:'<img src="../../../../Icons/images/2.jpg">',
					placement:'right',
					delay:{show:1000,hide:500}
				});

				$(panel).find('.accordion .collapse').collapse();
			}
		};
	});

	$e(function extend(){
		return {
			title:'Extend',
			fn:function(panel,base){
				panel.classList.add('bootstrap-extend');
				panel.innerHTML = $(base.template).find('.bootstrap-extend').html();
			}
		};
	});

	$e(function wordtest(){
		return {
			title:'word Test',
			fn:function(panel,base){
				panel.classList.add('bootstrap-word-test');
				panel.innerHTML = $(base.template).find('.bootstrap-word-test').html();
			}
		};
	});

})(window.$ehr,window.jQuery);