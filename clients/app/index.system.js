/**
 * Created by sus on 2016/1/6.
 */
(function($e){
	'use strict';

	$e('app.systemsoftware.manage',function($,base) {
		return {
			title: 'Software Manage',
			icon: '@path:../Icons/desktop/system-software.png',
			hideDesktop: true,
			suspension: true,
			needAdmin: true,
			fn: controller
		};

		function controller(){
			var columns = [];
			var content = $('<fieldset style="background:#333333;"><legend><button>Add</button></legend><div class="user-content"></div></fieldset>');

			$e('$q.http')('../software/getcolumns').then(function(data) {
				columns = JSON.parse(data);
			});

			load();
			content.find('button').on('click',function(e){
				var $dialog = null;
				$e('controls.dialog')(function(scope,dialog){
					$dialog = $(dialog).appendTo(content);
					var inputEls = $('<textarea style="width: 100%;margin:2em auto;"/><div>@@的替代值<input></div>');
					scope.title = 'Input Url';
					scope.width = 600;
					scope.content = inputEls.get();
					scope.footer = {Next:function(){
						$dialog.remove();
						editEntity(inputEls.filter('textarea').val(),inputEls.find('input').val());
					}};
					dialog.style.left = e.clientX + 'px';
					dialog.style.top = e.clientY + 'px';

					inputEls.change(function(){
						if(/@@/.test(this.value)){
							inputEls.filter('div').show();
						}else{
							inputEls.filter('div').hide();
						}

					}).val('../downWebs/@@/index.html');
				}).then(function(){
					$dialog.remove();
				});

				function editEntity(url,replace){
					if(!url || (/@@/.test(url) && !replace)){
						showDialog(e,{});
					}else{
						$e('$q.http')('../software/getnew?url='+url.replace('@@',replace)).then(function(data) {
							showDialog(e,JSON.parse(data));
						});
					}
				}
			});

			return {content:content};

			function load(){
				$e('$q.http')('../software/getdata').then(function(softwares) {
					content.find('.user-content').empty();
					base.each(JSON.parse(softwares),function(st){
						$('<div class="app-desktop-menu-item '+(!st.isLive&&'opacity-03'||'')+'"></div>').prop('software',st.id)
							.append($('<div class="icon"></div>').append($e('app.plug.getIcon')(st.icon,0.5)))
							.append($('<div class="title"></div>').html(st.title || st.name))
							.append($('<div class="close">&times;</div>').click(deleteData(st)))
							.append($('<div class="save">&radic;</div>').click(saveData(st)))
							.appendTo(content.find('.user-content')).click(function(e) {
								showDialog(e,st);
							}).hover(function(){
							if(st.isLive){$(this).find('.close').toggle();}else{$(this).find('.save').toggle();}
						});
					});
				});
			}

			function deleteData(item){
				return function(e){
					e.stopPropagation();
					$e('$q.http')('../software/deletedata',item).then(function(softwares) {
						load();
					});
					return false;
				};
			}
			function saveData(item){
				return function(e){
					e.stopPropagation();
					$e('$q.http')('../software/savedata',item).then(function(softwares) {
						load();
					});
					return false;
				};
			}

			function showDialog(e,entity){
				var $dialog = null;
				$e('controls.dialog')(function(scope,dialog){
					$dialog = $(dialog).appendTo(content);
					scope.title = 'Run Function';
					scope.width = 468;
					scope.content = $e('controls.form')(columns,entity,[ok,cancle]);

					dialog.style.left = e.clientX + 'px';
					dialog.style.top = e.clientY + 'px';

				}).then(function(){
					$dialog.remove();
				});


				function cancle(e){
					$dialog.remove();
				}
				function ok(e,data){
					$dialog.remove();
					if (data.canSubmit) {
						$e('$q.http')('../software/postdata',data.entity).then(load);
					} else {
						$e('controls.alert')('验证不通过！', 2);
					}

				}
			}
		}
	});

	$e('app.systemsoftware.user',function($,base){
		return {
			title:'User Manage',
			icon: '@path:../Icons/desktop/system-user.png',
			hideDesktop:true,
			suspension:true,
			needAdmin:true,
			fn:controller
		};

		function controller(){
			var content = $('<fieldset style="background:#333333;"><legend><select class="user-menu"></select> -- <button>Save</button></legend><div class="user-content"></div></fieldset>');

            $e('$q.http')('../loginsoftware/getcolumns').then(function(columns) {
                var columnsData = JSON.parse(columns);
                var softwares = base.filter(columnsData,function(i){return i.name.toLocaleLowerCase() === 'softwarefk';},0).selection;
                var users = base.filter(columnsData,function(i){return i.name.toLocaleLowerCase() === 'userfk';},0).selection;
                base.each(users,function(op){ $('<option></option>').val(op.id).appendTo(content.find('.user-menu')).html(op.name);});
                content.find('.user-menu').on('change',function(e){
                    showUser(users[this.selectedIndex],softwares);
                });
                showUser(users[0],softwares);
            });

            content.find('button').on('click',function(){
                var user =  content.find('.user-menu').val();
                var userSoftware = base.each(content.find('.app-desktop-menu-item.selection'),function(i){return {UserFk:user,SoftwareFk:i.software};});
                $e('$q.http')('../loginsoftware/postdata',userSoftware).then(function(){
                    $e('controls.alert')( $e('base.translate')(['Save success','保存成功']));
                });
            });

			return {content:content};

            function showUser(user,softwares){
                content.find('.user-content').empty();
                $e('$q.http')('../loginsoftware/getdata?user='+(user&&user.id)).then(function(data){
                    var selfSoftware = JSON.parse(data);
                    base.each(softwares,function(st){
                        $('<div class="app-desktop-menu-item"></div>').prop('software',st.id)
                            .append($('<div class="icon"></div>').append($e('app.plug.getIcon')(st.icon,0.5)))
                            .append($('<div class="title"></div>').html(st.name))
                            .appendTo(content.find('.user-content')).click(function() {
                                $(this).toggleClass('selection');
                            }).addClass(selfSoftware.indexOf( st.id) !== -1?'selection':'');
                    });
                });
            }
		}
	});

	$e('app.systemsoftware.browser',function($,$q){
		return {
			title:'Browser',
			icon: '@path:../Icons/desktop/system-browser.png',
			dialogSize:{width:800,height:600},
			suspension:true,
			fn:controller
		};

		function controller(){
			var content = $('<div><input style="font-weight: bold;width: 99%;"><iframe style="font-weight: bold;width: 99%;height: 94%;"></iframe></div>');
			content.find('input').val('https://www.baidu.com/');
			content.find('input').on('keydown',function(e){
				if(e.keyCode === 13){
					enter();
				}
			});
			$q.timeout(enter,10);
			return {content:content};

			function enter(){
				var url = content.find('input').val();
				if(!/^http/g.test(url)){
					url = 'https://' + url;
				}
				content.find('iframe').attr('src', url);
			}
		}
	});

	$e('app.systemsoftware.explorer',function($,base,$q){
		return {
			title:'Explorer',
			icon: '@path:../Icons/desktop/system-explorer.png',
			suspension:true,
			fn:controller
		};

		function controller($scope){
			var content = $('<div class="system-explorer"></div>');

			$q.timeout(function(){
				var explorer = $e('app.plug.explorer')(open);
				explorer.css({height:content.height()}).appendTo(content);
				$scope.event('resize',function(){
					explorer.css({height:content.height()});
				});

				base.each(['icons','midea','clients'],function(fileName){
					$.getJSON($e('app.user').service + 'ExplorerCatalog/GetFiles?localhost='+window.location.hostname+'&name='+fileName,explorer.addDate);
				});
			});

			return {content:content};
		}

		function getData(){
			var $promise = $q.promise();
			var count = arguments.length;
			var allData = {name:'Root',children:[]};

			return $promise;
		}

		function open(url,e){
			if('xml,txt,ini,js,css,json,cmd'.split(',').indexOf(url.split('.').pop()) !== -1){
				$q.http(url).then(function(data){
					$e('controls').show($('.app-windows .app-opens'),$('.app-desktop'),{item:{
						title:url,
						dialogSize:{width:1000,height:720,left:10,top:20},
						fn:function(){return $('<textarea></textarea>').html(data).css({background:'#dddddd'});}
					}});

					//$e('app_software').runFile($('.app-desktop'),{name:url},data,
					//	{clientX: e.clientX+10,clientY:e.clientY,zoom:{w:1.5},test:e.altKey || e.ctrlKey || e.shiftKey,class:'app-show-code'} );
				});
			}else{
				base.open.apply(null,arguments);
			}
		}
	});

	$e('app.systemsoftware.photo',function($,base,$q){
		return {
			title:'Photo',
			icon: '@path:../Icons/desktop/system-photo.png',
			hideDesktop:true,
			suspension:true,
			fn:controller
		};

		function controller(){
			var content = $('<div class="system-photo"></div>');

			$q.timeout(function(){
				addPhoto(content);
			});

			return {content:content};
		}

		function addPhoto(parent){
			var width = parent.width() / 5 - 12;
			var temp = '<img width="@width@" height="@height@" style="margin: 3px" src="#icon">';
			base.each(145,function(icon){
				icon = '../midea/downImages/' + icon + '.png';
				var tooltip = $e('controls.tooltip')(temp.replace('@width@',width*2).replace('@height@',width*2).replace('#icon',icon));
				$(temp.replace('@width@',width).replace('@height@',width).replace('#icon',icon)).appendTo(parent)
					.hover(tooltip.in,tooltip.out).click(function(){base.open(icon);});
			});
		}
	});

	$e('app.systemsoftware.book',function($,base){
		return {
			title:'Book',
			icon: '@path:../Icons/desktop/system-book.png',
			hideDesktop:true,
			suspension:true,
			fn:controller
		};

		function controller(){
			var content = $('<div class="system-book"></div>');

			$e('app.plug.bookshelf')('https://rib-cn-dev480/Learn/Books/',getUrls()).appendTo(content);

			return {content:content};
		}

		function getUrls(){
			return {
				'Manning.C# in Depth'  :'c#/Manning.C# in Depth.pdf',
				'Oreilly.CSharp.4.0.in.a.Nutshell.4th.Edition.Jan.2010'  :'c#/Oreilly.CSharp.4.0.in.a.Nutshell.4th.Edition.Jan.2010.pdf',
				'Wrox.Beginning.C.Sharp.3.0.An.Introduction.to.Object.Oriented.Programming.May.2008':'c#/Wrox.Beginning.C.Sharp.3.0.An.Introduction.to.Object.Oriented.Programming.May.2008.pdf',
				'Angular':'angular-1.2.11/angular-1.2.11/docs/index.html',
				'AngularJS@ico=Report.ico@':'Tutorials/',
				'D3@ico=Report.ico@':'d3js/',
				'jQuery':'Jquery/jQuery.pdf',
				'jQuery_Mobile':'Jquery/jQuery_Mobile.pdf',
				'jquery-easyui-1.3.5@ico=Report.ico@':'jquery-easyui-1.3.5/',
				'LESS@ico=Report.ico@':'less/',
				'materials@ico=Report.ico@':'materials',

				'jsjq@ico=Report.ico@':'../DownCodes/06ExternalTrainingMaterial/htmljsaj/jsjq',
				'jquery1.8.3_20121129@color=#ff0000@':'jquery1.8.3_20121129.chm',
				'W3School-Full@color=#ff0000':'W3School-Full.chm'
			};
		}
	});

	$e('app.systemsoftware.color',function($,base){
		return {
			title:'Color',
			icon: '@path:../Icons/desktop/system-color.png',
			hideDesktop:true,
			fn:controller
		};

		function controller(){
			var content = $([
				'<div class="system-color">',
				'<div class="show">Show</div>',
				'<div class="choose"><div>Choose</div><select style="width: 100%;margin-top: 5%;"></select></div>',
				'<div class="radom">Radom</div>',
				'</div>'
			].join(''));

			content.find('.show').click(function(){
				$e('app.openDialog')(content,'file').then(function(e,el){
					window.alert(el);
				});
			});
			content.find('.choose>div').click(function(){
				this.$index = (this.$index || 0) +1;
				this.color =  base.color(this.$index);
				content.find('.choose>select').on('change',function(e){
					var tempBackground = $(e.target.selectedOptions).css('background');
					content.find('.choose').css('background', tempBackground);
					content.find('.choose>select').css('background', tempBackground);
				}).get(0).options.add($('<option></option>').css('background',this.color)
					.html(this.$index + ' :  ' + this.color).get(0));
			});
			content.find('.radom').click(function(){
				this.style.background = base.color();
				this.innerHTML = 'Radom <br> ' + this.style.background;
			});

			return {content:content};
		}
	});

	$e('app.systemsoftware.media',function($){
		return {
			title:'Media',
			icon: '@path:../Icons/desktop/system-media.png',
			hideDesktop:true,
			fn:controller
		};

		function controller(){
			var content = $('<div><img width="100" height="100"><video width="700" height="480" controls style="background: black;"></video></div>'),count = 0;

			var runId = $e('app.software').runList(function(){
				if(count > 7){count = 0;}
				count = count +1;
				content.find('img').attr({src:'../Icons/Rotate'+count+'.ico'});
			},1);

			content.find('video').attr({src:'../midea/RIB-iTWO-Features_All.mp4'});

			return {content:content,runList:[runId]};
		}
	});

	$e('app.systemsoftware.note',function($,base,$q){
		return {
			title:'Note',
			icon: '@path:../Icons/desktop/system-note.png',
			hideDesktop:true,
			fn:controller
		};

		function controller($scope){
			var content = $('<textarea placeholder="Type your text here..."></textarea>');
			var toolbars = 'smilies,insertimage,insertlink,fontname,fontsize,header,bold,italic,underline,strikethrough,forecolor,highlight,alignleft,aligncenter,alignright,removeformat';

			$q.timeout(function(){
				content.wysiwyg({
					classes: 'some-more-classes',
					// 'selection'|'top'|'top-selection'|'bottom'|'bottom-selection'
					toolbar: 'top',
					buttons: base.filter(window.wysiwyg.toolbars(content,'../Icons/'),function(value,pro){
						return toolbars.split(',').indexOf(pro) !== -1;
					},true),
					// Submit-Button
					submit: {
						title: 'Submit',
						image: '\uf00c' // <img src="path/to/image.png" width="16" height="16" alt="" />
					},
					// Other properties
					dropfileclick: 'Drop image or click',
					placeholderUrl: 'www.example.com',
					maxImageSize: [600,200]
				});
				var textDiv = content.parent().find('[contenteditable=true]').focus();
				var contentParent = content.parents('.ehuanrum-controls-dialog-content');
				textDiv.css({height:parseFloat(contentParent.css('height')) - parseFloat(contentParent.find('.wysiwyg-toolbar').css('height')) - 2});
			});

			$scope.event('resize',function(){
				var textDiv = content.parent().find('[contenteditable=true]').focus();
				var contentParent = content.parents('.ehuanrum-controls-dialog-content');
				textDiv.css({height:parseFloat(contentParent.css('height')) - parseFloat(contentParent.find('.wysiwyg-toolbar').css('height'))- 2});
			});

			$scope.$then(function(){
				var data = content.parent().find('[contenteditable=true]').html();
				if(data){
					$q.http($e('app.user').service + 'ExplorerCatalog/SaveNotepad',data);
				}
			});

			return {content:content};
		}
	});

	$e('app.systemsoftware.relation',function($,base,$q,control){

		return {
			title:'Relation',
			icon: '@path:../Icons/desktop/system-relation.png',
			dialogSize:{width:200,height:400},
			openCount:1,
			hideDesktop:true,
			noCanMax : true,
			info:' ',
			fn:controller
		};

		function createWebsocket(content,friendUl){
			var dateFormatter = $e('base.formatter.date');
			var messagesList = {maxId:0},self = $e('app.user').id;
			var websocket = new WebSocket('ws://127.0.0.1:9000/');
			websocket.onopen = function(evt) {
				messagesList[self] = messagesList[self] || {data:[],self:$e('app.user')};
				websocket.send(JSON.stringify({fromUser:self}));
			};
			websocket.onmessage = function(evt) {
				var data = JSON.parse(evt.data);
				if(data instanceof Array){
					content.empty();
					base.each(data,function(friend){
						messagesList[friend.id] = messagesList[friend.id] || {data:[],self:friend};
						messagesList[friend.id].self = friend;
					});
					base.each(base.filter(messagesList,filter),function(friend){
						friend.ui = friendUl(friend.self,websocketHelp);
					});
				}else if(data.content){
					messagesList[data.fromUser].data.push(data);
					if(messagesList[data.fromUser].chat){
						messagesList[data.fromUser].chat();
					}else{
						messagesList[data.fromUser].ui.click();
					}
				}else{
					content.empty();
					messagesList[data.fromUser].self.logout = true;
					base.each(base.filter(messagesList,filter,'self'),function(friend){
						friend.ui = friendUl(friend,websocketHelp);
					});

				}

				function filter(v,k){
					return k!==''+self && v.self;
				}
			};

			return websocket;

			function getMessages(to){
				var messages = [];
				[].push.apply(messages, messagesList[to].data);
				[].push.apply(messages, base.filter(messagesList[self].data, function (i) {return i.toUser === to;}));
				return messages.sort(function (a, b) {
					return dateFormatter(a.insertDate,'yyyyMMddHHmmss') - dateFormatter(b.insertDate,'yyyyMMddHHmmss');
				});
			}

			function websocketHelp(friend,contentList,showDialog){

				messagesList[friend.id].chat = chat;
				setTimeout(chat,500);

				return function (message){
					messagesList[self].data.push({toUser:friend.id,content:message,insertDate:new Date()});
					websocket.send(JSON.stringify({toUser:friend.id,content:message}));
					chat();
				};

				function chat() {
					showDialog();
					contentList.empty();
					base.each(getMessages(friend.id), function (msg) {
						var item = $('<div style="width:100%;margin: 1em auto;"><span style="font-size: 0.7em;font-weight: bold;margin: auto 0.5em;">[' + (msg.fromUser ? '朋友':'自己') + ']<em style="font-size: 0.6em;">' + dateFormatter(msg.insertDate) + '</em></span></div>').appendTo(contentList)
							.css('text-align', msg.fromUser ?  'left':'right');
						$('<div style="margin: 0.5em 1em;"></div>').appendTo(item).html(msg.content).css('background', msg.fromUser ? '#ddffdd':'#ddddff');
					});
					contentList.scrollTop(contentList.get(0).scrollHeight);
				}
			}
		}

		function controller($scope,contentElement){
			var content = $('<div class="app-systemsoftware-relation"></div>');

			var websocket = createWebsocket(content,function (friend,websocketFn){
				return $('<div class="frient id-'+friend.id +' '+(friend.logout?'relation-logout':'')+'">'+friend.name+'</div>').appendTo(content).on('click',getClick(content,friend,websocketFn));
			});

			$scope.$then(function(){
				websocket.close();
			});

			return {content:content};
		}

		function getClick(content,friend,websocketFn) {
			var $dialog,position = {left:$e('base.app').width()*0.2,top:$e('base.app').height()*0.2};
			var contentList = $('<div style="width: 98%;height:71%;overflow-y: auto;"></div>');
			return function () {
				if((!$dialog ||!$dialog.parent().length) && !friend.logout){
					$e('controls.dialog')(function(scope,dialog){
						var textarea = $('<textarea></textarea>');
						var sendMessage = websocketFn(friend,contentList,function(){
							$(dialog).appendTo(content.parent()).css(position);
						});
						$dialog = $(dialog);
						scope.width = 500;
						scope.height = 400;
						scope.title = friend.name;
						scope.content = [contentList.get(0),textarea.get(0)];
						scope.footer = {send:function okFun(){
							sendMessage(scope.textarea());
							scope.textarea('');
						},cancle:false};
						scope.textarea = $e('app.wysiwyg')(textarea,{'keyup':function(e){
							if(e.ctrlKey && e.keyCode === base.keyCodes.ENTER){
								scope.footer.send();
							}
						}});
					}).then(function(res){
						if(res!==true){$dialog.remove();}
					});
				}
			};
		}



		function log(msg) {
			var $dialog, parents = $('body');
			$e('controls.dialog')(function(scope,dialog){
				var $ele = $e('base.app');
				var position = {left:$ele.width()*0.2,top:$ele.height()*0.2};
				$dialog = dialog;
				$(dialog).appendTo(parents).css(position);
				scope.width = 400;
				scope.height = null;
				scope.title = 'Message Dialog';
				scope.content = msg;
				scope.footer = ' ';
				scope.topside = function(e){if(dialog.parentNode.lastChild === dialog){return;}scope.toggle(e)(e);e.target.focus();};
			}).then(function(res){
				parents.each(function(index,parent){
					if(parent.contains($dialog)){
						parent.removeChild($dialog);
					}
				});
			});
		}
	});


	$e('app.systemsoftware.db',function($,base,$q,control) {

		var keyWords = [];
		$e('$q.http')('data/sqlkeywords.txt').then(function(req){
			keyWords = base.filter(req.split(/[\n\s|;\s]/),function(i){return i.length>1;},function(i){return i.toLocaleLowerCase();});
		});

		return {
			title: 'DB',
			icon: '@path:../Icons/desktop/system-db.png',
			dialogSize: {width: 1600, height: 600},
			openCount: 1,
			info: ' ',
			fn: controller
		};

		function controller($scope){
			var tables = [];
			var content = $('<div class="app-systemsoftware-db"><div class="left" style="float: left;width:15%;height:100%;border: 1px solid #333333;" /><div class="right" style="float: right;width:83%;height:100%;" /></div>');

			var textarea = $('<textarea style="width: 100%;height:10%;"></textarea>').appendTo(content.find('.right')).on('keydown',keydown);
			var helper = $e('controls.helper')(textarea.get(0));
			var contentDb = $('<div class="grid-db" style="height:88%;margin-top:1%;overflow: auto;"></div>').appendTo(content.find('.right'));
			var menus = $('<div class="menus"></div>').appendTo(content.find('.left'));

			content.on('click',helper.show).find('.right').append(helper);
			$e('$q.timeout')(function(){
				updateMenu(menus,textarea);
				textarea.val('select * from Account_Consume\n');
				keydown({shiftKey:true,keyCode:$e('base.keyCodes').ENTER},{name:'Account_Consume'});
			});

			return {content:content};

			function updateMenu(menus,textarea){
				$e('$q.http')('../login/dbdata',['select name from sqlite_master where type="table"']).then(function(req){
					base.each(JSON.parse(req),function(items){
						base.each(JSON.parse(items),function(item){
							tables.push(item.name);
							$('<div class="ehr-db-menu"></div>').appendTo(menus).html(item.name).click(function(){
								menus.children().removeClass('active');
								$(this).addClass('active');
								textarea.val('select * from '+ item.name +' \n');
								keydown({shiftKey:true,keyCode:$e('base.keyCodes').ENTER},item);
							});
						});
					});
				});
			}


			function keydown(e,item){
				helper.show();
				if((e.shiftKey|| e.ctrlKey || e.altKey) && e.keyCode === $e('base.keyCodes').ENTER){
					$e('$q.http')('../login/dbdata',textarea.val().split(/[\n|;]/)).then(function(req){
						contentDb.empty();
						base.each(JSON.parse(req),function(items){
							if(items && items !== 'null'){
								contentDb.append($e('controls.grid')(items,function(e,data){
									var cellValue = JSON.parse(data.value);
									if(cellValue instanceof Array){
										showDialog(e,item&&item.name,$e('controls.grid')(cellValue));
									}else if(typeof cellValue === 'object'){
										showDialog(e,item&&item.name,$e('controls.form')(cellValue));
									}
								}));
							}
						});
					});
				}else if(e.key && e.key.length === 1){
					var serach = (textarea.val()+e.key).split(/[\n\s|;\s]/).pop().toLocaleLowerCase();
					helper.show(serach,base.filter(keyWords.concat(tables),function(v){return serach && v.toLocaleLowerCase().indexOf(serach) !== -1;}));
				}
			}

			function showDialog(e,title,contentDialog){
				var $dialog;
				$e('controls.dialog')(function(scope,dialog){
					$dialog = dialog;
					scope.title = title || 'Show Data';
					scope.width = 468;
					scope.content = contentDialog;

					dialog.style.left = e.clientX + 'px';
					dialog.style.top = e.clientY + 'px';

					content.append(dialog);
				}).then(function(){
					$dialog.remove();
				});
			}
		}
	});


	$e('app.systemsoftware.calculator',function($,base,$q,control){

		return {
			title: 'Calculator',
			icon: '@path:../Icons/desktop/system-software.png',
			hideDesktop: true,
			suspension: true,
			needAdmin: true,
			fn: controller
		};

		function controller(){
			var symol = 0,symols = '+-*/';
			var content = $('<fieldset style="background:#333333;"><legend><button>Calculator</button></legend><div class="user-content"></div></fieldset>');
			var selfElement = $('<input>&nbsp;<strong>+</strong>&nbsp;<input><br><br><br><div class="result"></div>');
			content.find('.user-content').append(selfElement);
			content.find('legend button').click(function(){
				symol = (symol + 1 )%symols.length;
				selfElement.filter('strong').html(symols[symol]);
			});
			selfElement.filter('input').on('keyup',function(){
				var result = selfElement.filter('.result');
				var nums = selfElement.filter('input').map(function(){return $(this).val() || '0';});
				switch (symol){
					case 0:
						result.html(bigSum.apply(null,nums));
						break;
					case 1:
						result.html(bigSub.apply(null,nums));
						break;
					default:
						break;
				}
			});
			return {content:content};
		}

		function initNumberArgs(str1,str2){
			var count = Math.max(str1.split('.')[0].length,str2.split('.')[0].length)/8;
			return {
				count : count,
				num1 : toNumberArray(str1,count+1),
				num2 : toNumberArray(str2,count+1)
			};
			function toNumberArray(str,count){
				var intLength = str.split('.')[0].length;
				return [parseFloat('0.'+(str.split('.')[1]||'0'))*Math.pow(10,8)].concat(base.each(count,function(i){
					return parseFloat(str.slice(Math.max(0,intLength-(i+1)*8),Math.max(0,intLength-i*8)) || '0');
				}));
			}
		}

		function bigSum(str1,str2){
			var args = initNumberArgs(str1,str2);

			var result =  base.each(args.count+2,function(i){
				return args.num1[i] + args.num2[i];
			}).map(function(num,index,list){
				list[index+1] = list[index+1] + Math.floor(num / Math.pow(10,8));
				return num % Math.pow(10,8);
			}).reverse();
			var floatNumber = result.pop() ;
			return base.each(result,function(v,i){
					return i?repair(v,8):(v||'');
				}).join('') + (floatNumber?('.'+repair(floatNumber,8)):'').replace(/0*$/g,'');
		}

		function bigSub(str1,str2){
			var args = initNumberArgs(str1,str2);

			var result =  base.each(base.each(args.count+2,function(i){
				return args.num1[i] + args.num2[i];
			}),function(num,index,list){
				list[index+1] = list[index+1] + Math.floor(num / Math.pow(10,8));
				return num % Math.pow(10,8);
			}).reverse();
			var floatNumber = result.pop() ;
			return base.map(result,function(v,i){
					return i?repair(v,8):(v||'');
				}).join('') + (floatNumber?('.'+repair(floatNumber,8)):'').replace(/0*$/g,'');
		}

		function repair(value,place,ch){
			value = '' + value;
			while(value.length < Math.abs(place)){
				if(place > 0){
					value = (ch||0) + value;
				}else{
					value = value + (ch||0);
				}
			}
			return value;
		}
	});


})(window.$e$);