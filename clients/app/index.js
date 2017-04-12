/**
 * Created by sus on 2016/1/6.
 */

/*ehuanrum<controls>*/
(function($e){
	'use strict';

	$e('controls.mark',function($,$q,base){
		var isFirst = !localStorage[$e('base.url') + 'app-desktop-menu-item/'];
		return function(parent){
			var desktopMark = parent.find('.app-desktop-mark').on('click',function(){
				$e('controls.show')($('.app-windows .app-opens'), parent.prevObject.find('.app-desktop'), {item: {
					title:'Show Mark',
					info:{ok:true},
					fn:controller
				}});
			});

			if(isFirst){
				desktopMark.click();
			}
		};

		function controller($scope){
			return $q.http('../data/mark.html');
		}
	});

	$e('controls.suspension',function($,$q,base){
		return function(parent,softwares){
			var menuItems = null;
			var suspension = $('<div class="app-desktop-suspension" style="transition:all 5s ease 0s; "></div>')
				.append($('<div class="main"><br><div style="color:white;text-align: center">Menu</div></div>').click(mainClick))
				.on('mouseenter',function() {
					suspension.find('.menu-item').show();
				}).on('mouseleave',function() {
					suspension.find('.menu-item').hide();
				}).css({left:parent.width()*Math.random(),top:parent.height()*Math.random()});
			softwares.runList(function(){
				if(suspension.find('.menu-item').is(':hidden')){
					suspension.css({left:parent.width()*Math.random(),top:parent.height()*Math.random()});
				}
			},25*8);
			$q.timeout(function(){
				createMenuItems(suspension,softwares,menuItems || base.filter(softwares.get(),function(item){return item.suspension&&!item.needAdmin;}));
			},500);
			return suspension;

			function mainClick(e){
				$e('controls.show')($('.app-windows .app-opens'), parent.prevObject.find('.app-desktop'), {item: {
					title:'Edit Suspension Menu',
					info:{cancle:false,ok:true},
					fn:controller
				}});

				function controller($scope){
					var allSofewares = softwares.get();
					var items = base.filter(allSofewares,function(i){
                        return !i.needAdmin;
                    },function(it,index){
						return {
                            Id:index+1,
							index:index+1,
							title:it.title,
							groupName:it.groupName,
							icon:it.getIcon(0.5),
							show:it.suspension};
					});

					$scope.$then(ok);
					return $e('controls.grid')(items,{height:30,minWidth:80,maxWidth:120,hideTooltip:true,hideId:true,cellCenter:true});

					function ok(res){
						if(res){
							createMenuItems(suspension,softwares,base.filter(items,function(it){return it.show;},function(it,index){
								allSofewares[index].suspension = true;
								return allSofewares[index];
							}));
						}
					}
				}
			}
		};

		function createMenuItems(suspension,softwares,menuItems){
			var main = suspension.find('.main');
			suspension.find('.menu-item').remove();
			base.each(menuItems,function(item,index){
				var x = main.width() * Math.cos(Math.PI * 2 * index / menuItems.length);
				var y = main.height() * (Math.sin(Math.PI * 2 * index / menuItems.length)-index -1);
				var title = $('<div style="color:white;font-size: 0.5em;text-align: center">'+item.title+'</div>');
				$('<div class="menu-item" style="transform:translate(@x@px, @y@px);"></div>'.replace('@x@',x).replace('@y@',y))
					.appendTo(suspension).hide().append($(item.getIcon(0.70))).append(title).click(function(){
					softwares.say({item:item});
				});
			});
		}
	});

	$e('controls.show',function($,$q,base){

		return function(parent,desktop,e,controller){
			var $dialog = null,$content = null;
			var appUser = base.extend({size:{width : desktop.width()*0.5,height : desktop.height()*0.75}},$e('app.user'));
			var position = {left:parent.prevObject.width()*0.1,top:parent.prevObject.height()*0.1};
			controller = controller || function(){};
			return $e('controls.dialog')(function($scope,dialogElement,contentElement){
				base.extend($scope,e.item);

				var content = runContent(e.item,$scope,dialogElement,desktop);
				var $position = e.item.dialogSize && e.item.dialogSize.left && {left:e.item.dialogSize.left,top:e.item.dialogSize.top} || position;
				$dialog = dialogElement;

				$($dialog).addClass('self-rightMenu').appendTo(parent).css($position);
				$scope.entity = e.item;
				$scope.width = appUser.size.width;
				$scope.height = appUser.size.height;
				if($scope.dialogSize){
					if(typeof $scope.dialogSize === 'string'){
						if($scope.dialogSize.toLocaleLowerCase() === 'max'){
							$scope.width = desktop.width();
							$scope.height = desktop.height() * 0.945;
						}else if(/,/.test($scope.dialogSize)){
							$scope.width = parseFloat($scope.dialogSize.split(',').shift()) || $scope.width;
							$scope.height =  parseFloat($scope.dialogSize.split(',').pop()) || $scope.height;
						}
					}
				}
				base.link($scope,'maxWidth',function(){return desktop.width();});
				base.link($scope,'maxHeight',function(){return desktop.height() * 0.945;});
				$scope.title = (e.item.getIcon && e.item.getIcon(0.50) || '') + e.item.title + (content.title||'');
				$scope.header = {buttons:[]};
				$scope.toggle = function(hide){ $(dialogElement).toggle(hide);};
				$scope.contentClass = $scope.simplified?'self-dialog-content-simplified':'self-dialog-content';

				if(content.then){
					content.then(function($data){
						$scope.content = getData($scope,$data.content || $data).addClass($scope.contentClass).addClass('self-rightMenu').get();
						$(dialogElement).find('.ehuanrum-controls-dialog-header-title').html($scope.title + ($data.title?(' - '+$data.title):''));
						setSize(e.item,$data);
						$scope.update($scope);
					});
				}else{
					$content = content;
					$scope.content = $(content.content || content).prop('menuItems',content.content&&content.content.menuItems||[]).addClass($scope.contentClass).addClass('self-rightMenu').get();
					setSize($content,e.item);
				}
				//$(contentElement).resizable();
				$scope.footer = e.item.info || appUser.info || 'ehuanrum 2015/10/16';
				(controller || function(){})($scope,dialogElement);

				function setSize($$content,$$item){
					if($$item.dialogSize && $$item.dialogSize.width){
						$scope.width = $$item.dialogSize.width;
						$scope.height = $$item.dialogSize.height;
					}
					if($$content.dialogSize && $$content.dialogSize.width){
						$scope.width = $$content.dialogSize.width;
						$scope.height = $$content.dialogSize.height;
					}
					if($$item.dialogSize && $$item.dialogSize.zoom){
						$scope.width = $scope.width*($$item.dialogSize.zoom.w || $$item.dialogSize.zoom);
						$scope.height =  $scope.height*($$item.dialogSize.zoom.h || $$item.dialogSize.zoom);
					}
					if($$content.dialogSize && $$content.dialogSize.zoom){
						$scope.width = $scope.width* ($$content.dialogSize.zoom.w || $$content.dialogSize.zoom);
						$scope.height =  $scope.height* ($$content.dialogSize.zoom.h || $$content.dialogSize.zoom);
					}

					if(($$item.dialogSize && $$item.dialogSize.auto) || ($$content.dialogSize && $$content.dialogSize.auto)){
						$scope.width = Number.NaN;
						$scope.height =  Number.NaN;
					}
				}

			}).then(function(e){
				if($content && $content.runList){
					var appSoftware = $e('app.software');
					base.each($content.runList,function(funName){
						appSoftware.runList(funName.name || funName);
					});
				}
				parent.each(function(index,el){
					if(el.contains($dialog)){
						el.removeChild($dialog);
					}
				});
			});
		};

		function getData(scope,res){
			if(typeof res === 'string'){
				if(/data:image/.test(res)){
					return $('<img class="self-rightMenu">').attr('src',res);
				}else{
					var div = $('<div></div>');
					div.html(res);
					return div;
				}
			}
			return $(res).prop('menuItems', res.menuItems || []);
		}

		function runContent(item,scope,dialog,desktop){
			if(item.fnUrl){
				$q.timeout(function(){
					var documentContent = $(dialog).find('iframe').prop('contentDocument');
					var icon = (item.getIcon && item.getIcon(0.50) || '');
					item.title = item.title || $(documentContent).find('head title').html();
					var href = $(documentContent).find('head link[rel=icon]').attr('href');
					if(!icon && href){
						icon = '<img src="'+documentContent.baseURI + href+'" style="vertical-align: middle;width:30px;height:25px;">';
					}
					if(scope.title !== icon + item.title){
						scope.title = icon + item.title;
						scope.update();
					}
				},100);

				return '<iframe src="'+item.fnUrl+'"/>';
			}
			var str = item.fn.toLocaleString().slice(item.fn.toLocaleString().indexOf('(')+1,item.fn.toLocaleString().indexOf(')'));
			var parameters = str?str.split(','):[];
			for(var i=0;i<parameters.length;i++){
				if(parameters[i].trim().toLocaleLowerCase() === '$desktop'){
					parameters[i] = desktop;
				}else if(parameters[i].trim().toLocaleLowerCase() === 'scope' || parameters[i].trim().toLocaleLowerCase() === '$scope'){
					parameters[i] = scope;
				}else if(parameters[i].trim().toLocaleLowerCase() === 'dialog' || parameters[i].trim().toLocaleLowerCase() === '$dialog'){
					parameters[i] = dialog;
				}else{
					parameters[i] = $e(parameters[i].trim());
				}
			}
			return item.fn.apply(item,parameters) || {};
		}
	});

})(window.$e$);

/*app<base>*/
(function($e){
	'use strict';

	$e('$',function(){

		window.jQuery.extend(window.jQuery.fn,{
			e$tooltips : function(message,$class){
				var tooltip = $e('controls.tooltip')(message,$class);
				return window.jQuery(this).hover(tooltip.in,tooltip.out);
			}
		});

		return window.jQuery;
	});

	$e('app.template',function(){
		return function(url,callBack){
			window.jQuery.get(url,function(html){
				var template = {};
				window.jQuery(html).each(function(i,el){
					template[el.id] = el.innerHTML;
				});
				callBack(template);
			});
		};
	});

	$e('app.htmls',function($){
		var data = [];
		$e('$q.http')($e('base.url') + 'app/index.html').then(function(reqData){data = reqData;});
		return function(id,defaultHtml) {
			var item = $(data).filter('#' + id)[0];
			return item ? item.innerHTML : (defaultHtml || '');
		};
	});

	$e('app.transform',function($,base){
		return function(file,content,evt){
			var item = {title:(file&&file.name||'Message'),info:file&&file.type,getIcon:function(){},dialogSize:evt&&{left: evt.clientX,top: evt.clientY} || {}};

			if(!file){
				if( /^http[s]?:.*/.test(content)){
					item.title = content;
					item.fnUrl = content;
				}else{
					toOther(item,{},content,evt);
				}
			}else if(file.type === 'application/javascript'){
				toJavaScript(item,file,content,evt);
			}else if(/^image/.test(file.type)){
				item.fn = function(){return $('<div class="drag-image"></div>').append($('<img>').attr('src',content));};
			}else if(file.type === ''){
				var type = file.name.split('.').pop();
				if(type === 'vcf'){
					toVCard(item,file,content,evt);
				}else{
					toOther(item,file,content,evt);
				}
			}else{
				toOther(item,file,content,evt);
			}

			return item;
		};

		function toElement(obj,level){
			level = level || 1;
			var items = base.each(obj,function(value,pro){
				return '<div @class@><div style="font-weight: bold;">'.replace('@class@',obj instanceof Array?'class="app-transform-first"':'')+
					pro + '</div>@message@</div>'.replace('@message@',(typeof value === 'object'?toElement(value,level+1):
						'<div @style@>@value@</div>'.replace('@value@',value || '').replace('@style@',/#[0-9|a-z|A-Z]{6,6}/.test(value)?('style="color: '+value+'"'):'')));
			});
			return  ('<div style="float:left;margin-left:'+(level*10)+'px;">@content@</div>').replace('@content@',items.join(' '));
		}

		function toOther(item,file,content,evt){
			item.element =  {content:document.createElement('div')};
			if(typeof content === 'object'){
				item.fn = function(){return toElement(content);};
			}else{
				if(evt && (evt.altKey || evt.ctrlKey || evt.shiftKey)){
					item.fn = function(){return '<div>@message@</div>'.replace('@message@',content);};
				}if(evt && evt.test){
					item.fn = function(){return '<textarea disabled="true" style="cursor: default">@message@</textarea>'.replace('@message@',content);};
				}else{
					item.fn = function(){return '<div">@message@</div>'.replace('@message@',mark(content));};
				}
			}

			if(evt.width){
				item.dialogSize.width = evt.width;
			}
			if(evt.height){
				item.dialogSize.height = evt.height;
			}
			if(evt.zoom){
				item.dialogSize.zoom = (typeof evt.zoom === 'number')?evt.zoom:{w:evt.zoom.w||1,h:evt.zoom.h||1};
			}
			item.type = file && file.type || 'other';
		}

		function toJavaScript(item,file,content){
			item.element =  {content:document.createElement('script')};
			item.element.content.id = file.name;
			item.element.content.innerHTML = content;
			item.type = 'javascript';
			item.fn = function(){return '<div>@message@</div>'.replace('@message@',content);};
		}

		function toVCard(item,file,content){
			item.dialogSize.auto = true;
			// parse vCard content
			window.VCF.parse(content, function (vc) {
				item.element = {content:document.createElement('div')};
				item.type = 'vcf';
				item.fn = function(){return item.element;};
				addElement(item.element.content,'Name',vc.fn);
				addElement(item.element.content,'Email',base.each(vc.email,function(i){return i.value;}));
				addElement(item.element.content,'Company',base.each(vc.org,function(i){return i['organization-name'] +' / '+(i['organization-unit']||'');}));
				addElement(item.element.content,'Photo','data:image/jpg;base64,'+vc.photo);
				addElement(item.element.content,'Version',vc.version);
				item.element.content.addEventListener('dragover', function(evt){
					evt.stopPropagation();
					evt.preventDefault();
				});
			});

			function addElement(parent,name,data){
				if(data instanceof Array){
					base.each(data,function(i){addElement(parent,name,i);});
				}else{
					var line = document.createElement('div');
					line.style.borderBottom = '1px solid #eeeeee';
					line.style.padding = '5px';
					var nameDiv = document.createElement('div');
					nameDiv.style.display = 'inline-block';
					nameDiv.style.width = '100px';
					nameDiv.style.fontWeight = 'bold';
					nameDiv.innerHTML = name;
					line.appendChild(nameDiv);
					parent.appendChild(line);
					if(/data:image/.test(data)){
						var img = document.createElement('img');
						img.style.display = 'inline-block';
						img.src = data;
						line.appendChild(img);
					}else{
						var div = document.createElement('div');
						div.style.display = 'inline-block';
						div.innerHTML = data;
						line.appendChild(div);
					}
				}
			}
		}

		function mark(data){
			var colors = (function(items){
				var result = {};
				base.each(items,function(value,pro){
					base.each(value.split(','),function(v){
						result[v] = pro;
					});
				});
				return result;
			})({
				'#333333':'base,controls',
				'#ff9900':'&lt;h1,&lt;h2,&lt;h3,&lt;h4,&lt;div,&lt;span,&lt;input,&lt;textarea,&lt;button,&lt;ul,&lt;ol,&lt;li,&lt;em,&lt;img,&lt;svg' +
				'h1&gt;,h2&gt;,h3&gt;,h4&gt;,div&gt;,span&gt;,input&gt;,textarea&gt;button&gt;,ul&gt;,ol&gt;,li&gt;,em&gt;,img&gt;,svg&gt;',
				'#0000ff':'var,function,return,if,else,try,catch',
				'#000099':'document,body,scrollWidth,scrollHeight,clientX,clientY,width,height,Math,PI,Array,Object'
			});

			data = data.replace(/</g,'&lt;');
			data = data.replace(/>/g,'&gt;');
			data = data.replace(/\n/g,'<br>');
			data = data.replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;');

			base.each(colors,function(color,pro){
				data = data.replace(new RegExp(pro,'g'),'<span style="font-weight:bold;color:'+color+'">'+pro+'</span>');
			});

			return data;
		}
	});

	$e('app.software',function($,base,$q,controls){
		var softwares = {refresh: $q.promise(),events:[],group:{},data:[],dictionary:[],runList:[]};
		function SoftwareItem(name){this.name = name;this.openCount = 1;}
		function ItemLinkElement(name){this.name = name;}
		function RunItem(name){this.name = name;}

		(function runListByTime(){
			base.each(softwares.runList,function(i){
				if(i && i.run && typeof i.fn === 'function'){
					if(i.now === i.count){
						i.fn();
					}
					i.now = (i.now<i.count)?(i.now+1):0;
				}
			});
			setTimeout(runListByTime,40);
		})();


		return base.extend(software,
			{
				add: function (element, func) {
					softwares.events.push({el: element, ac: func});
				},
				say: function (e, type) {
					for (var i = 0; i < softwares.events.length; i++) {
						if (softwares.events[i].el !== e.el) {
							softwares.events[i].ac(e, type);
						}
					}
				},
				runList: function (fun, time) {
					if (typeof fun === 'function') {
						var id = (base.max(softwares.runList, function (i) {
								return i.id;
							}) || 0) + 1;
						softwares.runList.push(base.extend(new RunItem(), {
							id: id,
							name: fun.name,
							count: time || 25,
							now: time || 25,
							fn: fun,
							run: true
						}));
						return id;
					}
					if (typeof fun === 'number') {
						softwares.runList = base.filter(softwares.runList, function (i) {
							return i.id !== fun;
						});
						return fun;
					}
				},
				registerRefresh: function (func) {
					for (var i = 0; i < arguments.length; i++) {
						softwares.refresh.then(arguments[i]);
					}
				},
				get: getSoftwares,
				dictionary: dictionary,
				runFile: runFile
			});

		function dictionary(elements,item,aboutElement){
			if(!elements){
				return softwares.dictionary;
			}
			if(!(elements instanceof Array)){
				elements = [elements];
			}
			if(item){
				base.each(elements,function(element){
					softwares.dictionary.push(base.extend(new ItemLinkElement(),{el:element,it:item,about:aboutElement}));
				});
			}else if(base.some(elements,function(element){return /self\-rightMenu/.test(element.className);})) {
				var els = base.filter(elements,function(element){return /self\-rightMenu/.test(element.className);});
				var data = base.filter(softwares.dictionary,function(kv){
						return base.some(elements,function(element){return element === kv.el && /self\-rightMenu/.test(element.className);});
					},0) || {};
				return [base.extend(new ItemLinkElement(),{el: data.el || els[0],it:base.extend({menuItems:els[0].menuItems},data.it || {})})];
			}else{
				return  base.filter(softwares.dictionary,function(kv){
					return base.some(elements,function(element){return element === kv.el;});
				});
			}
		}

		function getSoftwares(value){
			if(!value){
				var list = [];
				base.each(softwares.group,function(item){
					if(item instanceof Array){
						list.push.apply(list,item);
					}else{
						list.push(item);
					}
				});
				return list;
			}else if(value === true){
				var tree = {};
				base.each(softwares.group,function(item,pro){
					if(item instanceof Array && item.length === 1){
						tree[pro] = item[0];
					}else{
						tree[pro] = item;
					}
				});
				return tree;
			}else if(typeof value === 'string'){
				return softwares.group[value];
			}else if(typeof value === 'object'){
				if(value.groupBy){
					softwares.group[value.groupBy] = softwares.group[value.groupBy] || [];
					softwares.group[value.groupBy].push(value);
				}else{
					softwares.group[value.id] = value;
				}
			}
		}

		function runFile(desktop,file,content,evt){
			var item = $e('app_transform')(file,content,evt);
			if(!file){
				controls.show($('.app-windows .app-opens'),desktop,{item:item});
			}else if(item.type === 'javascript' && !base.some($('body>div:first>script').get(),function(i){return i.id === item.element.id;})){
					$('body>div:first').append(item.element);
					base.each(interpretSoftware(content),getSoftwares);
					softwares.refresh.resolve(softwares.data);
			}else {
				$q.timeout(function () {
					controls.show($('.app-windows .app-opens'), desktop, {item: item});
				});
			}
		}

		function interpretSoftware(content){
			return base.filter(base.each(content.match(/\$e\(\'.*\',function.*\)/g),function(i){
				var softwareName = i.split(',')[0].split('(').pop().replace('\'','').replace('\'','');
				return $e(softwareName.trim());
			}),function(i){return !!i;});
		}

		function software($localStorage,groupBy,after){
			var clientsoftware = $e('app.user').clientsoftware;
			var appSystemSoftwares = base.each($e('app.systemsoftware'),function(value){ return value;});

			base.each($e('app.systemsoftware'),function(item,pro){
				var $item = base.extend(new SoftwareItem(item.name),item,getExtend(item));
				$item.groupName = 'system';
				getSoftwares(base.extend($item,$localStorage($item),{groupBy : groupBy($item)}));
			});

			base.each($e('app.clientsoftware'),function(item,pro){
				var $item = base.extend(new SoftwareItem(item.name),item,getExtend(item));
				getSoftwares(base.extend($item,$localStorage($item),{groupBy : groupBy($item)}));
			});

			if(typeof clientsoftware === 'function'){
				clientsoftware(function(data){
					addClientsoftware(data);
				});
			}else{
				addClientsoftware(clientsoftware);
			}
			after(softwares.data);

			function addClientsoftware(data){
				base.each(data,function(item,index){
					var $item = base.extend(new SoftwareItem(item.name),item,getExtend(item));
					if(/@open:/.test($item.fnUrl)){
						$item.openCount = 0;
						$item.run = function(){base.open($item.fnUrl.replace('@open:',''));};
					}
					getSoftwares(base.extend($item,$localStorage($item),{groupBy : groupBy($item)}));
				});
			}

			function getExtend(item){
				return {id:('software-'+Math.random()).replace('0.',''),groupName:item.groupName,getIcon:getIcon,getDialogSize :getDialogSize };

				function getIcon($zoom){
					$zoom = $zoom || 1.0;
					if(/@path:/.test(item.icon)){
						return '<img src="@src@" style="vertical-align: middle;width:@width@px;height:@height@px;">'
							.replace('@src@',item.icon.replace('@path:',''))
							.replace('@width@',70 * $zoom)
							.replace('@height@',50 * $zoom);
					}else{
						var icons =  $('<svg viewBox="0 0 40 40" width="70" height="40" style="vertical-align:"><path fill="#5E7688" d="'+item.icon+'"></path></svg>');
						base.each(item.option,function(value,pro){icons.find('path').attr(pro,value);});
						return icons.attr({width:icons.attr('width')*($zoom||1),height:icons.attr('height')*($zoom||1)}).get(0).outerHTML;
					}
				}

				function getDialogSize($dialog){
					var width = parseFloat($($dialog).css('width')) - 4, height =  parseFloat($($dialog).find('.ehuanrum-controls-dialog-content').css('height')) - 4;
					return $e('base.extend')(item.dialogSize,$($dialog).position(),{width:width,height:height});
				}
			}
		}
	});

})(window.$e$);

/*app<controls>*/
(function($e){
	'use strict';

	$e('app.wysiwyg',function($q,base){
		var toolbars = 'smilies,insertimage,insertlink,fontname,fontsize,header,bold,italic,underline,strikethrough,forecolor,highlight,alignleft,aligncenter,alignright,removeformat';
		return function(textarea,event){
			$q.timeout(function() {
				textarea.wysiwyg({
					classes: 'some-more-classes',
					// 'selection'|'top'|'top-selection'|'bottom'|'bottom-selection'
					toolbar: 'top',
					buttons: base.filter(window.wysiwyg.toolbars(textarea.get(0), '../Icons/'), function (value, pro) {
						return toolbars.split(',').indexOf(pro) !== -1;
					}, true),
					// Submit-Button
					submit: {
						title: 'Submit',
						image: '\uf00c' // <img src="path/to/image.png" width="16" height="16" alt="" />
					},
					// Other properties
					dropfileclick: 'Drop image or click',
					placeholderUrl: 'www.example.com',
					maxImageSize: [600, 200]
				});
				base.each(event,function(fn,pro){
					textarea.parent().find('[contenteditable=true]').on(pro,fn);
				});
				$q.timeout(function () {
					textarea.parent().find('[contenteditable=true]').focus();
				}, 50);
			},50);
			return function getValue(v){
				return textarea.parent().find('[contenteditable=true]').html.apply(textarea.parent().find('[contenteditable=true]'),arguments);
			};
		};
	});

	$e('app.alert',function($, $q,app_software){
		return function(parents,content,title){
			var $dialog = null;
			$e('controls.dialog')(function(scope,dialog){
				$dialog = $(dialog);
				scope.title = title || 'Show Message';
				scope.width = 468;
				scope.content = content;
				scope.canMove = false;

				$q.timeout(function(){
					dialog.style.marginLeft = '50%';
					dialog.style.top = '50%';
					dialog.style.transform = 'translate(-50%,-50%)';
					dialog.style.opacity = 1;

					app_software.runList(function(){
						dialog.style.opacity = dialog.style.opacity - 0.02;
						if(dialog.style.opacity < 0){
							$dialog.remove();
							app_software.runList(this.id);
						}
					},5);
				});

				$dialog.appendTo(parents);
			}).then(function(){
				$dialog.remove();
			});
		};
	});

	$e('app.opens',function($, base,app_htmls,controls){
		return function(element,desktopElement,elementMin, softwares){
			var dictionary = [],minMenu = app_htmls('minMenu');
			var any = function(item,count){
				var items = base.filter(dictionary,function(di){return di.it.id === item.id;});
				if(count === 0){
					$e('app.alert')(desktopElement,'<h2 style="text-align: center">不能打开这个菜单,它已经关闭！</h2>');
					return true;
				}
				return count && items && items.length > (typeof count === 'number'?count:1) - 1;
			};
			var minClick = function(e){
				return function(hide){
					for(var i=0;i<dictionary.length;i++){
						if(dictionary[i].min ===  e.minButton){
							dictionary[i].toggle(hide);
							return dictionary[i].el;
						}
					}
				};
			};

			softwares.add(element,function desktop(e,type){
				if(e.item.run){e.item.run();}
				if(any(e.item,e.item.openCount)){return;}

				var tooltip = $e('controls.tooltip')('<h4>'+e.item.groupName +'</h4> '+ (e.item.info || e.item.title));
				var minButton = e.minButton = $(minMenu).addClass('self-rightMenu').appendTo(elementMin).click(minClick(e)).hover(tooltip.in,tooltip.out);

				controls.show(element,desktopElement,e,function(scope,dialog){
					minButton.html(e.item.getIcon(0.7) || scope.title);
					minButton.prop('menuItems', [function Close(){scope.$close();}]);
					dictionary.push({el:dialog,it: e.item,min:minButton,toggle:scope.toggle});

					scope.header.buttons.push({name:'-',fn:function(){minClick(e)(e);}});

					softwares.dictionary([dialog],e.item);

				}).then(function(result){
					elementMin.each(function(index,el){
						minButton.each(function($index,$el){
							if(el.contains($el)){
								el.removeChild($el);
							}
						});
						dictionary = base.filter(dictionary,function(di){
							return minButton !== di.min;
						});
					});
				});
			});
		};
	});

	$e('app.fileDialog',function($,$q){

		return function(){
			var $promise = new $q.promise();
			var fileElement = $('<input type="file" accept="image/*" />');
			fileElement.bind('change', addFiles);
			fileElement.click();
			return $promise;

			function addFiles(e) {
				if (e.target.files.length > 0 && /image/.test(e.target.files[0].type)) {
					var reader = new FileReader();
					var file = e.target.files[0];
					reader.onload = function(){
						file.content = reader.result;
						$promise.resolve(file);
					};
					reader.readAsDataURL(file);
				}
				fileElement.unbind('change', addFiles);
			}
		};


	});

	$e('app.inputDialog',function($,$q){
		var parents = $('body');

		return function($ele,title,option,defaultStr){
			var position = {left:$ele.width()*0.2,top:$ele.height()*0.2};
			var $promise = new $q.promise(),$dialog = null;
			if(typeof option === 'string'){
				defaultStr = option;
				option = null;
			}
			if(typeof option === 'number'){
				option = {width : option,height : 300};
			}
			if(!option){
				option = {width : 400,height : 300};
			}

			$e('controls.dialog')(function(scope,dialog){
				$dialog = dialog;
				$(dialog).appendTo(parents).css(position);
				scope.width = option.width;
				scope.height = option.height;
				scope.title = title || 'Input Dialog';
				scope.content = $('<textarea style="width: 98%;height:97%">'+(defaultStr||'')+'</textarea>').get();
				scope.footer = {ok:function okFun(scope){$promise.resolve($(scope.content).val());},cancle:false};
			}).then(function(res){
				parents.each(function(index,parent){
					if(parent.contains($dialog)){
						parent.removeChild($dialog);
					}
				});
			});
			return $promise;
		};
	});

	$e('app.openDialog',function($,$q){
		return function openDialog(parent,type){
			var promise = $q.promise();
			var input = $('<input type="'+type+'">').appendTo(parent)
				.on('change', function(e){
					promise.resolve(e,this);
				})
				.trigger('click');

			input.each(function(index,el){
				el.parentNode.removeChild(el);
			});
			return promise;
		};
	});

	$e('app.plug.getIcon',function($,base,app_htmls){
		return function(key,$zoom,option){
			$zoom = $zoom || 1.0;
			if(/@path:/.test(key)){
				return '<img src="@src@" style="width:@width@px;height:@height@px;">'
					.replace('@src@',key.replace('@path:',''))
					.replace('@width@',98 * $zoom)
					.replace('@height@',120 * $zoom);
			}else{
				var icons =  $('<svg viewBox="0 0 40 40" width="70" height="40"><path fill="#5E7688" d="'+key+'"></path></svg>');
				base.each(option,function(value,pro){icons.find('path').attr(pro,value);});
				icons.attr({width:icons.attr('width')*($zoom||1),height:icons.attr('height')*($zoom||1)});
				return $('<div></div>').append(icons).html();
			}
		};
	});

	$e('app.plug.bookshelf',function($,base,app_htmls){
		var postfixIcons = [];
		$.getJSON($e('app.user').service + 'ExplorerCatalog/GetFiles?name=Icons\\postfix&localhost='+location.hostname,function(data){
			postfixIcons = data.children;
		});
		function getIcon(postfix){
			var icon = base.filter(postfixIcons,function(i){return typeof i === 'string' && i.split('.').shift().toLocaleLowerCase() === postfix.toLocaleLowerCase();},0);
			icon = icon || postfixIcons[($e('base.sToint')(postfix) % postfixIcons.length)];
			return '../Icons/postfix/'+icon;
		}

		return function(baseUrl,books){
			var bookshelf = $(app_htmls('appPlugBookshelf'));
			var iconCount = $e('app.user').icon;
			baseUrl = baseUrl || $e('base.url');
			base.each(books,function(item,pro){
				var mark = /@.*@/.test(pro)?pro.match(/@.*@/)[0] : '@@';
				var $pro = pro.replace(mark,'');
				var ico = getIcon(item.split('.').pop());
				var tooltip = $e('controls.tooltip')($pro +'<br>https://rib-cn-dev480/Learn/Books/'+item);
				var book = $(app_htmls('appPlugBook')).appendTo(bookshelf).click(function(){
					if(!/https:/.test(item)){
						item = baseUrl + window.escape(item);
					}
					base.open(item);
				});



				base.each(mark.slice(1,mark.length-1).split(','),function(kv){
					var name = kv.split('=')[0].toLocaleLowerCase();
					var value =  kv.split('=')[1];
					switch (name){
						case 'color':
							book.find('.title').css({color:value,fontWeight: 'bold'});
							break;
						case 'ico':
							ico = value;
							break;
					}
				});

				book.hover(tooltip.in,tooltip.out);
				book.find('.icon').html($e('app.plug.getIcon')('@path:../Icons/'+ico,0.5));
				book.find('.title').html($pro);
			});
			return bookshelf;
		};
	});

	$e('app.plug.explorer',function($,base,app_htmls){
		var fileIconCount = 5,postfixIcons = [];
		$.getJSON($e('app.user').service + 'ExplorerCatalog/GetFiles?name=Icons\\postfix&localhost='+location.hostname,function(data){
			postfixIcons = data.children;
		});

		return function(data,callBack){
			var root = $(app_htmls('appPlugExplorer'));
			if(typeof data === 'function'){
				callBack = data;
				data = null;
			}
			data = data || {name:'Root',children:[]};
			callBack = callBack || base.open;
			createExplorer(root,data,callBack);
			root.find('.header button').click(function(){
				createExplorer(root,this.data.parent,callBack);
			});

			root.on('dragover', function(evt){
				evt.stopPropagation();
				evt.preventDefault();
			});
			root.on('drop', function(evt){
				evt.stopPropagation();
				evt.preventDefault();

				if(root.$data.$fill){
					base.filter(evt.originalEvent.dataTransfer.files,function(file){
						return root.$data.children.indexOf(file.name) === -1;
					},function(file){
						var formData = new FormData();
						formData.append('file',file,file.name);
						formData.append('fileType',file.type);
						formData.append('fileName',file.name);
						formData.append('filePath',root.$data.$fill);
						root.$data.children.push(file.name);
						$e('$q.http')({url:$e('app.user').service + 'ExplorerCatalog/UploadFile',setRequestHeader:function(){}},formData);
					});
					createExplorer(root,root.$data,callBack);
				}
			});
			root.addDate = function(childData){
				var fill = root.find('.header input').val();
				data.children.push(childData);
				if(!fill || fill === data.$fill){
					createExplorer(root,data,callBack);
				}
			};
			return root;
		};

		function createExplorer(parent,data,callBack){
			if(!data){return;}
			var content = parent.find('.content').empty();

			data.$fill = data.$fill || data.path || (data.parent && data.parent.$fill + '/' +data.name);
			parent.$data = data;
			parent.find('.header input').val(data.$fill);
			parent.find('.header button').prop('data',data).html($e('app.plug.getIcon')('M0,20L25,0L25,10L65,10L65,30L25,30L25,40Z',0.6));

			base.each(data.children,function(child){
				if(typeof child === 'string'){
					createFile(data,child,$(app_htmls('appPlugExplorerItem')),callBack).appendTo(content);
				}else{
					child.parent = data;
					createDirectory(parent,child,$(app_htmls('appPlugExplorerItem')),callBack).appendTo(content);
				}
			});
		}

		function createFile(parent,file,element,callBack){
			var isImg = 'png,jpg,ico,gif,svg'.indexOf(file.split('.').pop().toLocaleLowerCase()) !== -1;
			var icon = isImg?(parent.$fill + '/' +file):getIcon(file.split('.').pop());
			var tooltip = $e('controls.tooltip')((isImg?('<img src="'+icon+'"  style="background: #dddddd;max-height: 400px;"><br>'):'') + file +'<br>' + parent.$fill + '/' +file);
			element.hover(tooltip.in,tooltip.out);
			element.find('.icon').html($e('app.plug.getIcon')('@path:'+ icon,0.5));
			element.find('.title').html(file);
			element.on('dblclick',function(e){callBack(parent.$fill + '/' +file,e);});
			element.addClass('self-rightMenu');
			element.each(function(index,el){
				el.menuItems = [function Open(e){
					callBack(parent.$fill + '/' +file,e);
				},function Delete(){
					$.post($e('app.user').service + '/ExplorerCatalog/DeleteFile', {path:parent.$fill,file:file},function(req){
						if(req && JSON.parse(req)){
							parent.children = base.filter(parent.children,function(i){return i!==file;});
						}
					});
				}];
			});
			element.on('dragover',function(){
				window.open(parent.$fill + '/' +file);
			});
			return element;
		}

		function createDirectory(parent,directory,element,callBack){
			element.find('.icon').html($e('app.plug.getIcon')('M-10,5L-10,40L45,40L45,5Z  M0,5L0,0L30,0L38,5Z',1,{fill:'#999933',stroke:'#006600','stroke-width':1}));
			element.find('.title').html(directory.name);
			element.on('dblclick',function(){createExplorer(parent,directory,callBack);});
			element.addClass('self-rightMenu');
			element.each(function(index,el){
				el.menuItems = [function Open(e){
					createExplorer(parent,directory,callBack);
				}];
			});
			return element;
		}

		function getIcon(postfix){
			var icon = base.filter(postfixIcons,function(i){return typeof i === 'string' && i.split('.').shift().toLocaleLowerCase() === postfix.toLocaleLowerCase();},0);
			icon = icon || postfixIcons[($e('base.sToint')(postfix) % postfixIcons.length)];
			return '../Icons/postfix/'+icon;
		}

	});

	$e('app.loading',function($){
		var loadElement = $('<div class="app-loading"><span>Loading , please wait !!!</span></div>').get(0);
		var srtElement = $('<div></div>').appendTo(loadElement);
		return {
			load:function(refresh){
				change(true);

			},unload:function(){
				change(false);
			}};

		function change(stu){
			if(stu && !document.body.contains(loadElement)){
				document.body.appendChild(loadElement);
				loadElement.interval = setInterval(interval,500);
			}

			if(!stu && document.body.contains(loadElement)){
				document.body.removeChild(loadElement);
				clearInterval(loadElement.interval);
			}
		}

		function interval(){
			srtElement.html(srtElement.html() + '***');
			if(srtElement.html().length > 50){
				srtElement.empty();
			}
		}
	});

	$e('app.login',function($,$q,base,app_htmls){
		var promise,$dialog,$scope,baseSize = {width : 400,height : 140};
		var loginContent = $(app_htmls('login'));
		var helper = $e('controls.helper')(loginContent.find('.app-login-content .name input').get(0),function(related,search,message){
			related.value = message;
		});

		$e('app.user').test = $e('app.user').test || {};
		loginContent.append(helper);
		loginContent.find('.app-login-content .name div').html('Name');
		loginContent.find('.app-login-content .name input').attr('placeholder',$e('app.user').test.username).on('keyup',function(e){
			var key = loginContent.find('.app-login-content .name input').val();
			helper.show(e.key,base.filter(helper.data,function(i){return i.indexOf(key) !== -1;}));
		});
		loginContent.find('.app-login-content .password div').html('password');
		loginContent.find('.app-login-content .password input').val($e('app.user').test.password);

		$e('controls.dialog')(function(scope,dialog){
			$scope = scope;
			$dialog = dialog;

			scope.modal = true;
			scope.width = baseSize.width;
			scope.height = baseSize.height;
			scope.title =  $e('app.plug.getIcon')('@path:login.ico',0.15)+'  Login Dialog';
			scope.content = loginContent.addClass('self-dialog-content').addClass('self-rightMenu').get();
			scope.footer = '';

			$('<button class="login">Login</button>').appendTo(loginContent.find('.app-login-button')).click(login);
			$('<button class="register">Register</button>').appendTo(loginContent.find('.app-login-button')).click(register);

			loginContent.find('.app-login-content input').on('keydown',function(e){
				var password = loginContent.find('.app-login-content .password input').val();
				if(e.keyCode === 13 && loginContent.find('.app-login-content .name input').val() && password && password !== '-'){
					login();
				}
			});

			function register() {
				var password = loginContent.find('.app-login-content .password input').val();
				var name = loginContent.find('.app-login-content .name input').val();
				if(password && password.length > 5){
					$e('$q.http')($e('app.user').service +'/login/register?name='+name+'&password='+$e('base.md5')(password)).then(function (res) {
						if (!res || !JSON.parse(res)) {
							login();
						} else {
							$(dialog).find('.ehuanrum-controls-dialog-footer').html('register fail! '+ res);
						}
					});
				}else{
					$(dialog).find('.ehuanrum-controls-dialog-footer').html('password length must greater than 5');
				}

			}

			function login(){
				if(!$e('app.user').isDebug){
					var name = loginContent.find('.app-login-content .name input').val();
					var password = loginContent.find('.app-login-content .password input').val();
					$e('$q.http')($e('app.user').service +'/login/login?name='+name+'&password='+$e('base.md5')(password)).then(function (res,header) {
						if(res && JSON.parse(res)){
							var data = JSON.parse(res);
							$e('app.user').id = data.id;
							$e('app.user').isAdmin = data.isAdmin;
							$e('app.user').name = loginContent.find('.app-login-content .name input').val();
							$e('app.user').clientsoftware = data.softwares;
							$e('app.user').token = data.token;
							dialog.parentNode.removeChild(dialog);
							$(dialog).find('.ehuanrum-controls-dialog-footer').html('');
							scope.$close();
							promise.resolve();
						}else{
							$(dialog).find('.ehuanrum-controls-dialog-footer').html('login fail');
						}
					});
				}else{
					dialog.parentNode.removeChild(dialog);
					scope.$close();
					promise.resolve();
				}
			}
		});

		return function show(position){
			var needShow = false;
			var $position = {left:($e('base').app.width()-baseSize.width)/2,top:($e('base').app.height()-baseSize.height)/2};
			promise = $q.promise();
			if(position === true){
				needShow = true;
				position = null;
			}
			position = $e('base').extend(position||{} , $position);
			if($e('app.user').isDebug && !needShow){
				$scope.modalUpdate(false);
				$e('$q.http')($e('app.user').service +'/login/login?name=-&password='+$e('base.md5')('-')).then(function(res){
					$e('app.user').name = 'Developer';
					$e('app.user').clientsoftware = JSON.parse(res);
					promise.resolve();
				});
			}else if(position.refresh){
				$scope.modalUpdate(false);
				$e('$q.http')($e('app.user').service +'/login/login?name='+$e('app.user').name +'&token='+$e('app.localStorage')().token).then(function(res){
					var data = JSON.parse(res);
					$e('app.user').clientsoftware = data.softwares;
					$e('app.user').token = data.token;
					promise.resolve();
				});
			}else{
				$scope.modalUpdate(true);
				$($dialog).appendTo(window.document.body).css(position);
			}
			if(position.alluser && position.alluser.length){
				helper.data = position.alluser || [];
			}

			loginContent.find('.app-login-button .register').toggle(!$e('app.user').name);
			loginContent.find('.app-login-content .name input').val($e('app.user').name || position.username)
			.attr('readonly',!!$e('app.user').name);
			return promise;
		};
	});

})(window.$e$);

/*app<mouse>*/
(function($e){
	'use strict';

	$e('app.rightmenu',function($,base,app_htmls,app_software){
		var $rightMenu = app_htmls('rightMenu');
		var windowsMenuItems = null;

		return function(rightmenu){
			rightmenu.prevObject.on('selectstart',function(e){return false;});
			rightmenu.prevObject.on('contextmenu',function(e){
				var ie = app_software.dictionary(app_software.getParents(e.target))[0];
				var classes = ie&&ie.el&&ie.el.classList;
				var menuList = null;
				if(!classes){
					menuList = windowsMenuItems = windowsMenuItems || getWindowsMenuList(rightmenu.prevObject,rightmenu);
				}else{
					if(classes.contains('app-desktop-menu-item')){
						menuList = getDeskTopMenuList(rightmenu.prevObject,ie.it);
					}else if(classes.contains('app-taskbar-menu-item')){
						menuList = getTaskbarList(rightmenu.prevObject,ie.it);
					}else if(classes.contains('app-start-software-menu-item')){
						menuList = getStartSoftwareList(rightmenu.prevObject,ie.it);
					}else if(classes.contains('app-taskbar')){
						menuList = getTaskbarList(rightmenu.prevObject,ie.it);
					}else{
						menuList = getSelfList(rightmenu.prevObject,ie.it,ie.el);
					}
				}
				if(menuList && menuList.length){
					rightmenu.empty();
					var menus = createMenus(rightmenu,menuList).appendTo(rightmenu);
					menus.css(app_software.getPosition(e,menus));
				}
				$('.ehuanrum-controls-tooltip').each(function(index,$message){document.body.removeChild($message);});
				return false;
			});
		};

		function createMenus(parent,list){
			var menus = $($rightMenu);
			base.each(list,function(item){
				var menu = $('<li></li>').on('mousedown',function(){
					var ac = item.ac||function(){};
					if(item.select === undefined){
						ac.apply(item,arguments);
						parent.empty();
					}else if(item.select === false){
						item.select = true;
						ac.apply(item,arguments);
						parent.empty();
					}else{
						item.select = false;
						ac.apply(item,arguments);
					}
				});
				if(item.select){
					menu.toggleClass('app-right-menu-item-select');
				}
				menu.html(item.name);
				app_software.dictionary(menu.get(),item);
				menus.append(menu);
			});
			return menus;
		}

		function getWindowsMenuList($window){
			return [
				{name:'Create',ac:function(){}},
				{name:'Refresh',ac:function(){
					$e('app.loading').load();
					base.filter(app_software.dictionary(),function(item){
						return item.el.classList.contains('app-desktop-menu-item') && item.el.style.left && item.el.style.top;
					},function(ie){
						var position = $(ie.el).position();
						ie.it.position = {left:ie.el.style.left,top:ie.el.style.top};
					});
					setTimeout(function(){
						$e('app.windows')();
						$e('app.loading').unload();
					},1000);
				}},
				{name:'Sort',ac:function(){
					$window.find('.app-desktop .app-desktop-soft-list .app-desktop-menu-item').each(function(i,el){
						el.style.top = '';
						el.style.left = '';
					});
				}},
				{name:'Group',ac:function(){
					var user = $e('app.user');
					if(user.groupBy){
						user.groupBy = null;
					}else{
						user.groupBy = 'groupName';
					}
					$e('app.user').refresh = 'group';
					window.location.reload();
				}}
			];
		}
		function getDeskTopMenuList($window,item){
			if(item instanceof Array){
				return [];
			}else{
				var menus = [{name:'Open',ac:function(e){app_software.say(base.extend(e,{el:null,item:item}),'menulist');}}];
				if(item.fnUrl){
					menus.push({name:'OpenNewTab',ac:function(e){base.open(item.fnUrl);}});
				}
				return menus;
			}

		}
		function getTaskbarList($window,item){
			if(item){
				return [];
			}else{
				return [
					{name:'Manage Run',ac:function(){}}
				];
			}

		}
		function getStartSoftwareList($window,item){
			return [];
		}
		function getSelfList($window,item,element){
			var list = base.each(item.menuItems || [],function(i){return base.extend(i,{ac: i.fn||i});});
			if(item.name && element.classList.contains('ehuanrum-controls-dialog')){
				list.push({name: 'CodeView', ac: function(e){
					app_software.runFile($window.find('.app-desktop'),{name:'CodeView'},$e('>'+item.name).toString(),
						{clientX: e.clientX+10,clientY:e.clientY,zoom:{w:1.5},test:e.altKey || e.ctrlKey || e.shiftKey,class:'app-show-code'} );
				}});
			}
			return list;
		}
	});

	$e('app.mouse',function($, base, app_selected){
		return function($windows,softwares){
			var startElement = $windows.find('.app-taskbar .app-start-menu');
			var softwareElements = startElement.find('.app-start-software-list');
			var softwareChange = startElement.find('.app-start-software-change');
			var softwareSearch = startElement.find('.app-start-software-search');


			softwares.registerRefresh(function(){
				$windows.find('.app-taskbar .app-start-button').off('mouseup',appStartButton);
				$windows.find('.app-software-menu-item.app-desktop-menu-item').off('dblclick',appsSoftwareMenuItem);
				$windows.find('.app-software-menu-item.app-start-software-menu-item').off('mouseup',appsSoftwareMenuItem);
				$windows.find('.app-taskbar .app-start-button').on('mouseup',appStartButton);
				$windows.find('.app-software-menu-item.app-start-software-menu-item').on('mouseup',appsSoftwareMenuItem).draggable();
				$windows.find('.app-software-menu-item.app-desktop-menu-item').on('dblclick',appsSoftwareMenuItem).draggable();

			});
			$windows.find('.app-taskbar .app-start-button').on('mouseup',appStartButton);
			$windows.find('.app-software-menu-item.app-start-software-menu-item').on('mouseup',appsSoftwareMenuItem).draggable();
			$windows.find('.app-software-menu-item.app-desktop-menu-item').on('dblclick',appsSoftwareMenuItem).draggable();

			$windows.on('mousedown',function(e){
				if(e.button !== 0){return;}

				var el = $(e.target);
				if(!e.ctrlKey){
					$windows.find('.app-software-menu-item').removeClass('selection');
				}

				$windows.find('.app-desktop-group.app-desktop-soft-list').each(function(index,ele){ele.parentNode.removeChild(ele);});

				if(!base.some(['.app-start-button','.app-start-software-change','.app-start-software-search'],function(cls){
						return el.filter(cls).length || el.parents().filter(cls).length ;
					})){
					setTimeout(function(){$windows.find('.app-start-menu').hide();},200);
				}
				$windows.find('.app-rightmenu').empty();

				base.each(softwares.dictionary(softwares.getParents(e.target)),function(item){
					if(item.el.classList.contains('app-desktop-menu-item')){
						item.el.classList.add('selection');
					}
				});

			});

			app_selected($windows.find('.app-desktop'),softwares);


			softwareChange.on('mousedown',function(e){
				if(e.button !== 0){return;}
				if(softwareElements.hasClass('app-start-software-list-all')){
					softwareElements.removeClass('app-start-software-list-all');
					softwareChange.html('All Programs');
				}else{
					softwareElements.addClass('app-start-software-list-all');
					softwareChange.html('Back');
				}
			});

			softwareSearch.on('keyup',function(e){
				if(e.keyCode === base.keyCodes.ENTER){
					var softwareKey = softwareSearch.find('input').val().toLocaleLowerCase();
					var software = base.filter(softwares.get(),function(i){return softwareKey === (i.name || i.title).toLocaleLowerCase();},0);
					if(software){
						softwares.say({item: $e('base.extend')({}, software)});
					}else{
						software = base.filter($e('app.command'),function(v){return softwareKey === v.name.toLocaleLowerCase();},0);
						if(software){software($windows);}
					}
					$windows.find('.app-start-menu').hide();
				}
			});

			function appStartButton(e){
				if(e.button !== 0){return;}
				startElement.toggle();
			}

			function getLastPoint(ele,x,y){
				return {
					left:ele.offsetLeft + ele.offsetWidth + (x||0),
					top:ele.offsetTop + ele.offsetHeight + (y||0)
				};
			}

			function appsSoftwareMenuItem(e){
				if(e.button !== 0){return;}
				var items = softwares.dictionary(softwares.getParents(e.target));
				var item = base.filter(items,function(i){return !!i.about;},0) || items[0];
				$('.app-windows').find('.app-taskbar .app-start-menu').hide();
				if(!item){
					return '';
				}else if(item.it instanceof Array){
					base.each(item.about,function(about){
						$(about).appendTo($windows.find('.app-opens')).css(getLastPoint(item.el,-20)).css(resize(about));
						$(about).on('mousedown',appsSoftwareMenuItem);
					});
				}else{
					softwares.say(base.extend(e,{el:item.el.parentNode,item:item.it}),'software');
				}
			}

			function resize(groupList){
				var count = groupList.children.length;
				var rows = Math.floor(Math.sqrt(count) + 0.999999);
				var cells = Math.floor(count/rows + 0.999999);
				var childWidth = groupList.children[0].offsetWidth + 12;
				var childHeight = groupList.children[0].offsetHeight + 12;

				return {width:rows*childWidth,height:cells*childHeight};
			}
		};

	});

	$e('app.selected',function($,base,app_htmls){
		var selected = $(app_htmls('selectDiv'));

		return function(element,softwares) {
			var softwareElements = null;
			element.on('mousedown',selectFun);

			function selectFun(e) {
				softwareElements = element.find('.app-desktop-soft-list');
				//1:left 2:middle 3:right
				if(e.button !== 0 ||  !base.some(softwareElements.get(),function(i){return i === e.target;})){
					return;
				}
				selected.$position = softwares.getPosition(e,selected);
				selected.css(base.extend({},selected.$position,{width:0,height:0}));
				selected.appendTo(element);
				element.on('mousemove', mousemove);
				element.on('mouseup', mouseup);
			}

			function mouseup(e) {
				base.each(element.get(),function(parent){
					base.each(selected.get(),function(s){
						if(parent.contains(s)){
							parent.removeChild(s);
						}
					});
				});
				element.off('mouseup', mouseup);
				element.off('mousemove', mousemove);
				delete selected.$position;
			}

			function mousemove(e) {
				var position = selected.$position;
				var width = e.clientX - position.left;
				var height = e.clientY - position.top;
				var option = {top:position.top,left:position.left,width:width,height:height};
				if(width < 0){
					option.left = e.clientX;
					option.width = - option.width;
				}
				if(height < 0){
					option.top = e.clientY;
					option.height = - option.height;
				}
				selected.css(option);
				if(option.width && option.height){
					markSoftware(softwareElements,option);
				}

			}

			function markSoftware(element,rect){
				element.find('.app-software-menu-item').each(function(index,ele){
					var $ele = $(ele);
					if(base.touch(rect,base.extend({width:$ele.width(),height:$ele.height()},$ele.offset()))){
						$ele.addClass('selection');
					}else{
						$ele.removeClass('selection');
					}
				});
			}
		};
	});

})(window.$e$);

/*app<desktop>*/
(function($e){
	'use strict';

	$e('app.windows',function($, app_htmls,app_software,app_opens,app_desktop,app_taskbar,app_rightmenu,app_mouse){

		return (function start(){
			$('.app-windows').each(function(index,$window){
				window.document.body.removeChild($window);
			});
			var app_windows = $(app_htmls('windows')).appendTo(window.document.body);

			$e('base').app = app_windows;
			app_software.getPosition = getPosition;
			app_software.getParents = getParents;

			app_desktop(app_windows.find('.app-desktop'),app_software);
			app_taskbar(app_windows.find('.app-taskbar'),app_software);
			app_rightmenu(app_windows.find('.app-rightmenu'),app_software);
			app_opens(app_windows.find('.app-opens'),app_windows.find('.app-desktop'),app_windows.find('.app-taskbar .app-taskbar-buttons'),app_software);

			app_mouse(app_windows,app_software);

			return start;
		})();

		function getParents(el){
			var parents = $(el).parents().get();
			parents.unshift(el);
			return parents;
		}
		function getPosition(e,el){
			var point = $e('base.point')(e,{width:el.width(),height:el.height()});
			return {left: point.clientX,top: point.clientY};
		}
	});

	$e('app.desktop',function($,base,app_create,app_selected){
		return function(element, softwares,groupBy){
			var listDiv = element.find('.app-desktop-soft-list');
			softwares.registerRefresh(function(){
				listDiv.empty();
				addDesktopItems(softwares,listDiv,groupBy);
			});
			$(window).resize(function(){
				listDiv.empty();
				addDesktopItems(softwares,listDiv,groupBy);
			});
			base.each($e('app.user').suspension || 1,function(){
				element.append($e('controls.suspension')(element,softwares));
			});

			element.append($e('controls.mark')(element));

			addDesktopItems(softwares,listDiv,groupBy);
			element.each(function(index,ele){
				ele.addEventListener('dragover', function(evt){
					evt.stopPropagation();
					evt.preventDefault();
				});
				ele.addEventListener('drop', function(evt){
					evt.stopPropagation();
					evt.preventDefault();
					/** @namespace evt.dataTransfer */
					base.filter(evt.dataTransfer.files,function(file){return file instanceof Blob;},function(file){
						var reader = new FileReader();
						if(/^image/.test(file.type)){
							reader.onload = function(e) {
								softwares.runFile(element,file,reader.result,evt);
							};
							reader.readAsDataURL(file);
						}else{
							reader.onload = function(e) {
								// convert utf-8 (without bom) coded byte-array to a javascript string
								softwares.runFile(element,file,String.fromCharCode.apply(null, new Uint8Array(reader.result)),evt);
							};
							reader.readAsArrayBuffer(file);
						}

						return reader;
					});
					base.each(base.distinct(base.filter(evt.dataTransfer.items,function(item){return item.kind === 'string';},function(item){
						return evt.dataTransfer.getData(item.type);
					})),function(item){
						softwares.runFile(element,null,item,evt);
					});
				});
			});
		};

		function addDesktopItems(softwares,parent){
			var items = softwares.get(true), lineCount = getLCineount();
			base.each(base.filter(items,function(item){return !item.hideDesktop && (!item.needAdmin || $e('app.user').isAdmin);}),function(item,index){
				if(!parent.children().length || parent.children().get(-1).children.length > lineCount - 1){
					parent.append($('<div class="app-desktop-soft-row"></div>'));
				}
				app_create.desktop(item).appendTo(parent.children().get(-1));
			});

			function getLCineount(){
				var heightEl = app_create.desktop(items[Object.getOwnPropertyNames(items)[0]]).appendTo(parent);
				var lineCount = Math.floor(parent.height() / (heightEl.outerHeight()||70)) - 1;
				heightEl.remove();
				return lineCount;
			}
		}

		function addSuspension(softwares,parent,count){
			base.each(count,function(){
				parent.append($e('controls.suspension')(parent,softwares));
			});
		}
	});

	$e('app.taskbar',function($,$q,base,app_create,app_start,app_fixed){
		return function(element, softwares){
			app_start(element.find('.app-start-menu').hide(),softwares);
			app_fixed(element.find('.app-fixed-buttons'),softwares);
			softwares.dictionary(element.find('.app-start-button').get(),{info:'start'});
			softwares.dictionary(element.get(),{info:'taskbar'});
			$q.timeout(function(){
				element.find('.app-start-button').css('width',element.find('.app-start-button').css('height'));
					//.html('<svg width="20" height="20" style="zoom:0.8;margin: 4px"><path stroke="#999999" fill="#ff9999" stroke-width="1" d="M1,1L1,19L19,19L19,1Z M10,0L10,20M0,10L20,10"></path></svg>');
			});
		};
	});

	$e('app.fixed',function($,base){
		return function(element, softwares){
			var time = $('<div style="float: right;color: white"></div>').appendTo(element);
			var tooltip = $e('controls.tooltip')(function(ele){
				softwares.runList(function timeTooltip(){
					if(ele.style.display !== 'none'){
						ele.innerHTML = getDate();
					}});
			});

			time.hover(tooltip.in,tooltip.out);
			softwares.runList(function timeShow(){time.html(getDate('HH:mm')+'<br>'+getDate('yy/MM/dd'));},10);
		};

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
		}
		function repair(value,place,char){
			value = '' + value;
			while(value.length < place){
				value = (char||0) + value;
			}
			return value;
		}

	});

	$e('app.start',function($,base,app_create){
		return function(element, softwares){
			var softwareElements = element.find('.app-start-software-list');
			var softwareChange = element.find('.app-start-software-change');
			var startfixedElements = element.find('.app-start-fixed');
			var shutdownElements = element.find('.shut-down-button');

			softwares.registerRefresh(function(){
				softwareElements.empty();
				base.each(base.filter(softwares.get(),function(i){return (!i.needAdmin || $e('app.user').isAdmin);}),function(item){
					softwareElements.append(app_create.start(item));
				});
			});
			base.each(base.filter(softwares.get(),function(i){return (!i.needAdmin || $e('app.user').isAdmin);}),function(item){
				softwareElements.append(app_create.start(item));
			});
			softwareChange.html('All Programs');

			startfixedElements.find('.start-fixed-button').append($('<div class="user"></div>').html($e('app.user').name));

			shutdownElements.find('div').html('Shut down').click(function(){
				var shutdown =  $('<div class="app-loading" style="color: #999999;background: #000000;"><span>Shut Down !!!</span></div>').css({ opacity: 1}).appendTo(document.body);
				var relogin = $('<div class="app-re-login" style="color: #999999;">Re Login</div>').click(reLoginClick).appendTo(document.body);

				function reLoginClick(){
					$e('app.login')(true);
					shutdown.each(function(i,el){el.parentNode.removeChild(el);});
					relogin.each(function(i,el){el.parentNode.removeChild(el);});
				}
			});
		};
	});

	$e('app.create',function($,base,app_htmls,app_software){
		return {
			desktop:createDesktopMenu,
			taskbar:createTaskbarMenu,
			start:createStartMenu
		};

		function getSign(sign){
			if(sign){
				return '</h4> <div style="padding:2px;margin-bottom: 5px; background: #999999;">'+sign +'</div> ';
			}else{
				return '';
			}
		}

		function createBase(item,baseMenu,isGroup){
			var menu = $(baseMenu);
			var tooltip = $e('controls.tooltip')(function(el){
				var titleHtml = ('<h5>'+item.title+'</h5>');
				var tip = $('<div>'+(item.groupName?('<h4>'+item.groupName +' -- '+titleHtml+'</h4>'):titleHtml)+getSign(item.sign) + (item.info?('<div style="margin-bottom: 5px;">'+(item.info)+ '</div>'):'') +'</div>').appendTo(el);
				/* jshint -W031*//* jshint -W117*/
				new QRCode($('<div></div>').appendTo(tip).get(0), (/^http/.test(item.fnUrl)?'':window.location) + (item.fnUrl||''));
			});

			app_software.dictionary(menu.get(),item);
			menu.hover(tooltip.in,tooltip.out);
			return menu;
		}

		function createDesktopMenu(item){
			if(item instanceof Array && item.length){
				item = base.filter(item,function(i){return !i.hideDesktop && (!i.needAdmin || $e('app.user').isAdmin);});
				var menuGroup = $(app_htmls('desktopGroup')).filter('.app-desktop-group.app-software-menu-item');
				app_software.dictionary(menuGroup.get(),item);
				menuGroup.find('.icon>div>div').each(function(index,icon){
					var child = item[index]||{getIcon:function(){return '';}};
					icon.innerHTML =  child.getIcon(0.3);
				});
				menuGroup.find('.title').html(item[0].groupBy[0].toLocaleUpperCase()+item[0].groupBy.slice(1));
				menuGroup.css(item.position||{});
				var groupList =  $(app_htmls('desktopGroup')).filter('.app-desktop-group.app-desktop-soft-list');
				base.each(item,function(it){//item.hideDesktop
					groupList.append(createDesktopMenu(it));
				});
				app_software.dictionary(menuGroup.get(),item,groupList.get());
				return menuGroup;
			}else{
				var desktopMenu = app_htmls('desktopMenu');
				var menu = createBase(item,desktopMenu);
				menu.find('.icon').html(item.getIcon($e('app.user').iconSize) || '');
				menu.find('.title').html(item.title);
				menu.css(item.position||{});
				return menu;
			}
		}
		function createTaskbarMenu(item){
			var taskbarMenu = app_htmls('taskbarMenu');
			var menu = createBase(item,taskbarMenu);
			menu.find('.title').html(item.title);
			return menu;
		}
		function createStartMenu(item){
			var startMenu = app_htmls('startMenu');
			var menu = createBase(item,startMenu);
			menu.find('.icon').html(item.getIcon(0.30) || '');
			menu.find('.title').html(item.title);
			return menu;
		}
	});

	$e('app.command',function($,base,$q,app_software){
		return [
			function cmd() {
				var historyList = [];
				function getValue(str){
					window.$e$result = {};

					return window.$e$result;
				}
				function run(str){
					var promise = $q.promise();
					historyList.push(str);
					switch (str.toLocaleLowerCase()){
						case '-clear':
							promise.resolve(true);
							break;
						case '-v':
							promise.resolve($e('app.user').version || '1.0.0');
							break;
						case '-i':
							promise.resolve($e('app.user').info);
							break;
						default:
							base.run('window.$e$result='+str);
							$q.timeout(function(){
								var result = window.$e$result;
								delete window.$e$result;
								if(typeof result === 'object'){
									result = JSON.stringify(result);
								}else{
									result = '' + result;
								}
								promise.resolve(result);
							},500);
							break;
					}
					return promise;
				}
				app_software.say({item: {
					title:'CMD',
					getIcon:function(){
						return '<img style="vertical-align: middle;width:35px;height:25px;" src="cmd.png">';
					},
					fn:function(){
						var textarea = $( '<textarea contenteditable="true" style="background: black;color: white;width: 100%;height: 100%;">');
						var helper = $e('controls.helper')(textarea.get(0));
						var content = $('<div></div>').append(textarea).append(helper);
						textarea.val(textarea.val() + '>> ');
						textarea.on('keydown',function(e){
							var value = textarea.val().split('\n').pop().replace('>>','').trim();
							if(e.keyCode === base.keyCodes.BACKSPACE){
								return !!value;
							}
							if(e.keyCode === base.keyCodes.ENTER){
								run(value).then(function(result){
									var count = Math.floor(textarea.width()/6);
									result = result || 'it\'s not command !';
									if(result === true){
										textarea.val('>> ');
									}else{
										textarea.val(textarea.val() + result + '\n' +
											new Array(count).join('-') +'\n' + new Array(count).join('-')+'\n\n>> ');
									}
								});
								textarea.val(textarea.val() +'\n');
								return false;
							}else if(e.keyCode === base.keyCodes.CTRL){
								helper.show('',base.each('-i,-v,-clear'.split(','),function(v){return v;}));
							}else if(e.keyCode === base.keyCodes.DOWN){
								textarea.val(textarea.val().slice(0,textarea.val().lastIndexOf(value))  + historyList[(historyList.indexOf(value) - 1 + historyList.length) % historyList.length]);
								return false;
							}else if(e.keyCode === base.keyCodes.UP){
								textarea.val(textarea.val().slice(0,textarea.val().lastIndexOf(value)) + historyList[(historyList.indexOf(value) + 1) % historyList.length]);
								return false;
							}
						});
						return content;

					}
				}});
			}
		];
	});

})(window.$e$);

/*app<onready>*/
(function($e){
	'use strict';

	$e('app.localStorage',function (base) {
		var isFristGet = true;
		return function(obj){
			var data = JSON.parse(localStorage[$e('base.url') + 'app-desktop-menu-item/'] || '{}');
			if(obj || typeof obj === 'object'){
				base.each(data,function(item){item.refresh = false;item.lastLogin = false;});

				obj.groupBy = $e('app.user').groupBy;
				obj.refresh = $e('app.user').refresh;
				obj.token = $e('app.user').token;
				obj.lastLogin = true;
				data[$e('app.user').name] = obj;

				localStorage[$e('base.url') + 'app-desktop-menu-item/'] = JSON.stringify(data);
			}else{
				var userData = data[$e('app.user').name] || {};
				if(isFristGet){
					isFristGet = false;
					base.each(data,function(v,k){
						if(v.lastLogin){
							userData.username = k;
						}
					});
					base.each(data,function(v,k){
						if(v.refresh){
							userData = v;
							$e('app.user').name = k;
						}
					});
					userData.alluser = base.each(data,function(value,key){return key;});
				}
				if(typeof obj === 'string'){
					return base.value(userData,obj);
				}else if(typeof obj === 'function'){
					return obj(userData);
				}else{
					return userData;
				}
			}
		};
	});

	$e(function() {
			$e('app.htmls');
			$e('$q.timeout')(function(){
				$e('app.login')($e('app.localStorage')()).then(function () {
					var data = $e('app.localStorage')();
					$e('app.user').groupBy = data.groupBy;
					$e('app.loading').load(data.refresh);
					$e('app_software')(function $localStorage(item) {
						return $e('base.filter')(data.items, function (i) {
							return i.$id === item.groupName + ' > ' + item.title;
						}, 0);
					}, function group($item) {
						return $e('base.value')($item, $e('app.user').groupBy || '');
					}, function () {
						var app_software = $e('app_software');
						$e('app');
						$e('app.loading').unload();
						$e('base.filter')(app_software.get(), function (it) {
							return $e('base.some')(data.openItem, function (i) {
								return i.$id === it.groupName + ' > ' + it.title;
							});
						}, function (it) {
							$e('base.filter')(data.openItem, function (i) {
								return i.$id === it.groupName + ' > ' + it.title;
							}, function (open) {
								app_software.say({item: $e('base.extend')({}, it, open)});
							});
						});

					});
					$e('$q.http')($e('app.user').service + 'ExplorerCatalog/GetFiles?name=Icons\\Background\\images&localhost='+location.hostname).then(function(req){
						var images = $e('app_software').backgroundImages = JSON.parse(req).children || [];
						$e('app.user').autoBackground = $e('app.user').background;
						var time = typeof $e('app.user').autoBackground === 'number'?$e('app.user').autoBackground:1;
						if($e('app.user').background){$e('base').app.css('backgroundImage','none');}
						$e('app_software').runList(function(){
							if($e('app.user').background){
								var imagesIndex = images.indexOf($e('base').app.css('backgroundImage').split('/').pop().replace(')','')) || 0;
								$e('base').app.css({backgroundImage: 'url(../Icons/background/images/'+(images[(imagesIndex+1) % images.length])+')'});
							}
						},time * 25);
					});
				});
			},500);
		},
		function(e) {
			if(!$e('app.user').name){return;}
			var $ = $e('$');
			var desktopItem = $e('base.filter')($e('app_software').dictionary(), function (item) {
				return item.el.classList.contains('app-desktop-menu-item') && item.el.style.left && item.el.style.top;
			}, function (ie) {
				var position = $(ie.el).position();
				return {
					$id: ie.it.groupName + ' > ' + ie.it.title,
					position: {left: ie.el.style.left, top: ie.el.style.top}
				};
			});
			var openItem = $e('base.each')($('.app-windows .app-opens .ehuanrum-controls-dialog').get(), function (dialog) {
				var ie = $e('app_software').dictionary($e('app_software').getParents(dialog))[0];
				return {$id: ie.it.groupName + ' > ' + ie.it.title, dialogSize: ie.it.getDialogSize(ie.el)};
			});

			$e('app.localStorage')({items: desktopItem,openItem: openItem});
		});
})(window.$e$);