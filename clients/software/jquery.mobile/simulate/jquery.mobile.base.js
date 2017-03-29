/**
 * Created by sus on 2015/11/23.
 */
(function($e){
	'use strict';

	$e('app.clientsoftware.simulate',function($,$q,base){
		return {
			title:'Mobile Simulate',
			icon: '@path:../Icons/desktop/mobile-simulate.png',
			openCount:1,
			model:'G7',
			hideDesktop:true,
			noCanMax : true,
			simplified : true,
			dialogSize:{width:320,height:536},
			group:'Mobile',
			fn:function(scope,dialog,app_software,app_template){
				var $promise = $q.promise(),self = this;
				dialog.classList.add('jquery-mobile-base-'+(this.model||'G7').toLocaleLowerCase());
				app_template('software/jquery.mobile/simulate/template.html',function(htmls){$promise.resolve(controller(htmls,scope,dialog,self,app_software));});
				return $promise;
			},
			info:'G7'
		};

		function controller(htmls,scope,dialog,self,app_software){
			var content =  $(htmls['jquery.mobile.base']);
			var runList = [];
			phoneStart(htmls,content.find('.jquery-mobile-base-content'),app_software,runList);
			content.handle = $e('$q.ehrCache')(content,'jquery.mobile.base');

			return {content:content,runList:runList};
		}

		function phoneStart(htmls,parent,app_software,runList){
			var text = 'Starting',runCount = 100;
			var startContent = $('<div></div>').appendTo(parent).css({color:'#ffffff',padding:'50% 20%'});
			(function run(after){
				if(text.length > 39) {text = 'Starting';}
				text = text + ' *';
				startContent.html(text);
				if(runCount-- > 0){$q.timeout(function(){run(after);},50);}
				else{after();}
			})(function(){
				phoneContent(htmls,parent,app_software,runList);
			});

		}

		function phoneContent(htmls,parent,app_software,runList){
			parent.empty();
			var content = $(htmls['jquery.mobile.base.content']).appendTo(parent);

			phoneContentHeader(htmls,parent,app_software,runList,content);
			phoneContentContent(htmls,parent,app_software,runList,content);
			phoneContentFooter(htmls,parent,app_software,runList,content);
		}

		function phoneContentHeader(htmls,parent,app_software,runList,content){
			runList.push(app_software.runList(function(){
				content.find('.desktop-top>.time').html(getDate('HH:mm'));
			}));
			function getDate(str){
				var time = new Date();
				str = str || 'HH:mm:ss';
				return str.
				replace('YY',repair(time.getFullYear(),4)).
				replace('yy',repair(time.getFullYear(),4)).
				replace('MM',repair(time.getMonth() + 1,2)).
				replace('DD',repair(time.getDate(),2)).
				replace('dd',repair(time.getDate(),2)).
				replace('HH',repair(time.getHours(),2)).
				replace('hh',time.getHours()>12?('PM '+repair(time.getHours()-12,2)):('AM '+repair(time.getHours(),2))).
				replace('mm',repair(time.getMinutes(),2)).
				replace('ss',repair(time.getSeconds(),2)).
				replace('fff',repair(time.getMilliseconds(),3));

				function repair(value,place,char){
					value = '' + value;
					while(value.length < place){
						value = (char||0) + value;
					}
					return value;
				}
			}
		}

		function phoneContentFooter(htmls,parent,app_software,runList,content){
			$q.http('software/jquery.mobile/simulate/jquery.mobile.svg').then(function(req){
				base.each(4,function(value){
					var g = $(req).find('#desktop-bottom-' +(value+1)).html();
					$('<div><svg width="20" height="20"></svg></div>').appendTo(content.find('.desktop-bottom')).find('svg').html(g).click(function(){
						if(value === 2){
							content.find('.desktop-center').children().hide();
							content.find('.desktop-center .phone-content-content-desktop').show();
						}
					});
				});
			});
		}

		function phoneContentContent(htmls,parent,app_software,runList,content){
			var desktop = $(htmls['jquery.mobile.base.content.desktop']);
			var menus = $e('app.clientsoftware.simulate.menus')(content.find('.desktop-center'));
			base.each(menus,function(menu){
				var view = menu.view(content.find('.desktop-center'));
				var menuElement = $(htmls['jquery.mobile.base.desktopMenu']).appendTo(desktop.find(menu.isFixed?'.system':'.client'));
				if(menu.isFixed){
					menuElement.find('.title').remove();
				}
				menuElement.find('.icon').html('<img src="'+menu.icon+'" style="vertical-align: middle;width:40px;height:40px;">');
				menuElement.find('.title').html(menu.name);
				menuElement.css(menu.position||{});
				menuElement.on('click',function(e){
					content.find('.desktop-center').children().hide();
					view.show();
				});
			});
			content.find('.desktop-center').append(desktop);
		}

	});

	$e('app.clientsoftware.simulate.menus',function($,base,app_software){
		return function (content) {
			var getPanel = function(name){return $('<div class="'+(this&&this.name || name)+'" style="height:100%;"></div>').appendTo(content).hide();};
			return [
				{
					name:'Phone',icon:'../midea/downImages/173.png',isFixed:true,view:getPanel
				},
				{
					name:'Option',icon:'../midea/downImages/163.png',isFixed:true,view:getPanel
				},
				{
					name:'Contract',icon:'../midea/downImages/166.png',isFixed:true,view:getPanel
				},
				{
					name:'Message',icon:'../midea/downImages/168.png',isFixed:true,view:getPanel
				},
				{
					name:'Camera',icon:'../midea/downImages/179.png',isFixed:true,view:getPanel
				},
				{
					name: 'Photo', icon: '../midea/downImages/30.png', view: function (desktop) {
					var parent = getPanel(this.name).hover(function () {
						$(this).css({overflow: 'auto'});
					}, function () {
						$(this).css({overflow: 'hidden'});
					});
					var width = desktop.width() / 3 - 12;
					var temp = '<img width="@width@" height="@height@" style="margin: 3px" src="#icon">';
					base.each(145, function (icon) {
						icon = '../midea/downImages/' + icon + '.png';
						var tooltip = $e('controls.tooltip')(temp.replace('@width@', width * 4).replace('@height@', width * 4).replace('#icon', icon));
						$(temp.replace('@width@', width).replace('@height@', width).replace('#icon', icon)).appendTo(parent).hover(tooltip.in, tooltip.out).click(function () {
							base.open(icon);
						});
					});
					return parent;
				}
				},
				{
					name: 'jQuery', icon: '../midea/downImages/159.png', view: function (desktop) {
					return getPanel(this.name).append($('<iframe style="height:100%;" src="software/jquery.mobile/base"></iframe>'));
				}
				}
			];
		};
	});

})(window.$e$);