/**
 * Created by sus on 2016/1/22.
 */
(function($e){
	'use strict';

	$e(function array(){
		return {
			title:'Array',
			fn:function(panel,base){
				panel.classList.add('javascript-array');
				base.each(Object.getOwnPropertyNames(Array.prototype),function(value){
					var content = document.createElement('div');
					content.innerHTML = value;
					base.addTooltip(content,Array.prototype[value] + '');
					panel.appendChild(content);
				});
			}
		};
	});

	$e(function arithmetic(){
		return {
			title:'Arithmetic',
			fn:function(panel,base){
				panel.classList.add('javascript-arithmetic');
				panel.appendChild(arrayMange(base));
			}
		};

		function arrayMange(base){
			var content = document.createElement('div');
			content.innerHTML = [
				'<span style="font-weight: bold;font-size: 1.5em;">.splice(5,3,a,b,c) :</span> remove [5],[6],[7] then insert a,b,c'
			].join('<br>');
			return content;
		}
	});

	$e(function edit(){
		return {
			title:'Edit',
			fn:function(panel,base){
				panel.classList.add('javascript-edit');
				panel.appendChild(base.editObject($e.keyCodes));
			}
		};

	});


	$e(function video(){
		return {
			title:'Video',
			fn:function(panel){
				var video = document.createElement('video');
				var track = document.createElement('track');
				video.width = 700;
				video.height = 520;
				video.controls = true;
				video.style.background = 'black';
				video.src = '../../../../explorerfile/getmedia?name=big_buck_bunny';
				video.type = 'video/mp4';

				//track.default = true;
				//track.kind = 'subtitles';
				//track.srclang = 'en';
				//track.label = 'English';
				//track.src = '../../../../explorerfile/getmedia?name=big_buck_bunny';

				video.appendChild(track);
				panel.appendChild(video);
			}
		};
	});

	$e(function lottery(){
		return {
			title:'Lottery',
			action:function(panel,base){
				if(!this.init) {
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
					var lotteryElement = document.createElement('div');
					var message = document.createElement('div');
					lotteryElement.className = 'javascript-lottery-control';
					message.className = 'javascript-lottery-message';
					message.innerHTML = '---';
					panel.appendChild(lotteryElement);
					panel.appendChild(message);

					window.$ehr.http('../data/lottery.json',null,function(req) {
						var size = Math.min(panel.parentNode.scrollWidth,panel.parentNode.scrollHeight) - 100;
						controlElement(lotteryElement, JSON.parse(req), size)(function (item) {
							message.innerHTML = item.title;
						});
					});

					window.addEventListener('resize',function(){
						var size = Math.min(panel.parentNode.scrollWidth,panel.parentNode.scrollHeight) - 100;
						lotteryElement.firstChild.style.zoom = size/100;
					});
				}
			},
			fn:function(panel,base){
				panel.className = 'javascript-lottery';
			}
		};

		function controlElement(panel,data,size){//var r = 100;
			var base = window.$ehr;
			var callBackList = [];
			var items = base.each(data,function(item,index){return base.extend({index:index},item);});
			var temp = document.createElement('div');
			temp.innerHTML = '<svg width="100" height="100" style="zoom:'+(size/100)+';-moz-zoom:'+(size/100)+';"></svg>';

			//background
			var background =  document.createElement('g');
			background.className = 'javascript-lottery-background';
			addItems(background);
			temp.childNodes[0].appendChild(background);

			var indicator =  document.createElement('g');
			indicator.className = 'javascript-lottery-indicator';
			fillIndicator(indicator);
			temp.childNodes[0].appendChild(indicator);

			panel.innerHTML = temp.innerHTML;
			addOnClick(panel.lastChild.lastChild);


			return function then(){
				callBackList.push.apply(callBackList,arguments);
				return then;
			};

			function addItems(parent){
				var dAng = 2*Math.PI/items.length;//M50,50 Lx0,y0 Lx1,y1 z
				var content = '<path fill="#fill" d="Mx0,y0 A50,50 0 0 1 x1 y1 L50,50 z"></path><text dx="x3" dy="y3" stroke="#ffffff" stroke-width="0.2" font-size="0.2em">#text</text>'
					.replace('x0', 50+50*Math.cos(Math.PI/2 - dAng/2))
					.replace('y0', 50+50*Math.sin(Math.PI/2 - dAng/2))
					.replace('x1', 50+50*Math.cos(Math.PI/2 + dAng/2))
					.replace('y1', 50+50*Math.sin(Math.PI/2 + dAng/2))
					.replace('x3', 50+20*Math.cos(Math.PI/2 + dAng/2))
					.replace('y3', 50+40*Math.sin(Math.PI/2));
				base.each(items,function(item){
					var gItem = document.createElement('g');
					gItem.innerHTML = content.replace('#fill',base.color(item.index+1)).replace('#text',item.title);
					gItem.style.transformOrigin = '50px 50px';
					gItem.style.transform = 'rotate('+180*dAng*item.index/Math.PI+'deg)';
					parent.appendChild(gItem);
				});
			}
			function fillIndicator(parent){
				//cricle
				var cricle = document.createElement('g');
				cricle.innerHTML = '<circle cx="50" cy="50" r="20" fill="transparent"></circle>';

				var indicator = document.createElement('g');
				indicator.innerHTML = '<path fill="#ffffff" d="M45,50 L50,35 L55,50Z"></path>';

				var content = document.createElement('g');
				content.innerHTML = '<circle cx="50" cy="50" r="10" fill="#99ff99"></circle>';

				parent.style.transition = 'all 5s ease 0s';
				parent.style.transformOrigin = '50% 50%';
				parent.appendChild(cricle);
				parent.appendChild(indicator);
				parent.appendChild(content);
			}

			function addOnClick(el){
				var dAng = 360 / items.length;
				var itemSum = base.sum(items,function(item){return item.value;});
				var angTemp = 0;
				el.onclick = function(){
					angTemp++;
					var onclick = el.onclick;
					window.$ehr.http('../../../../values/getrandom',null,function(req){
						var ang = (req || Math.random()) * itemSum ;
						var index = 0;
						for(var i=0;i<items.length;i++){
							if(ang - items[i].value < 0){
								index = i;
								break;
							}else{
								ang = ang - items[i].value;
							}
						}
						el.onclick = null;
						el.style.transform = 'rotate('+(3600*angTemp+180+((index-0.45+0.9*Math.random()) * dAng ))+'deg)';
						setTimeout(function(){
							base.each(callBackList,function(callback){
								callback(items[index]);
							});
							el.onclick = onclick;
						},5000);
					});
				};
			}
		}
	});

	$e(function(){
		return {
			title: 'Test',
			fn:function(panel){
				panel.className = 'javascript-test';
			},
			action: function (panel, base) {
				var sequence = base.sequence();
				if(!this.init) {
					this.init = true;
					for (var i = 0; i < 100; i++) {
						sequence = addSequence(panel, base, sequence, i);
					}
				}
				sequence.fire('Test sequence.');
			}
		};

			function addSequence(panel,base,sequence,index) {
				return sequence.then(function (result, message) {
					panel.appendChild(base.new('span',null,index + ' - ' + message,{style:'background: ' + base.color(index + 1) }));
					panel.appendChild(base.new('br'));
				}, index * 50);
			}
	});


	$e(function(){
		return {
			title: 'Promise',
			fn:function(panel){
				panel.className = 'javascript-promise';
			},
			action: function (panel, base) {
				if(!this.init) {
					this.init = true;
					var promise = base.promise();
					for (var i = 0; i < 100; i++) {
						promise = promise(create);
					}
					promise('Test promise.');
				}

				/* jshint -W040*/
				function create(message){
					var self = this;
					panel.appendChild(base.new('span',null,self.index + ' - ' + message,{style:'background: ' + base.color(self.index + 1) }));
					panel.appendChild(base.new('br'));
					setTimeout(function(){
						self.next(message);
					},Math.floor(Math.random()*1000) + 500);
				}
			}
		};
	});

	$e(function(){
		function saveData(file,data){
			if(data){
				var a = document.createElement('a');
				a.download = file;
				a.href = 'data:text/txt;charset=utf-8,' + data;
				a.click();
			}
		}

		return {
			title: 'SaveData',
			fn:function(panel){
				panel.className = 'save-data';
			},
			action: function (panel, base) {
				if(!this.init) {
					this.init = true;
					var textContent = base.new('textarea');
					var saveButton = base.new('a',null,'download');
					panel.appendChild(textContent);
					panel.appendChild(saveButton);

					saveButton.onclick = function(){
						saveData('downlaod'+Date.now()+'.txt',textContent.value);
					};
				}

			}
		};
	});

})(window.$ehr);