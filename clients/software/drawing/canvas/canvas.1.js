/**
 * Created by sus on 2016/1/25.
 */
(function($e){
	'use strict';

	$e(function base() {
		return {
			title: 'Base',
			fn: function (panel) {
				panel.classList.add('canvas-base');
			},
			action: function (panel, base) {
				if (!this.init) {
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
					var canvas =  document.createElement('canvas');

					canvas.width = panel.offsetWidth;
					canvas.height = panel.offsetHeight;
					panel.appendChild(canvas);

					base.drawCanvas(canvas,[1,0,0,1,0,0])
					([100,150],['#0000ff','#999999',5],
						['30px Arial','Start'],
						[50,100,100,0,150,50],
						[200,0,250,100,200,150],
						['40px Arial','Middle'],
						[250,200,200,300,150,250],
						[100,300,50,200,100,150],
						['#0000ff','#999999',5],
						[150,50],[200,150],[150,250],[100,150]
					)
					([500,150],
						['../../../../Icons/svgs/app/cosinus.svg',500,100,200,200]
					);
				}
			}
		};
	});

	$e(function string() {
		return {
			title: 'String',
			fn: function (panel) {
				panel.classList.add('canvas-string');
			},
			action: function (panel, base) {
				if (!this.init) {
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';

					var value = '';
					var inputDiv =  document.createElement('div');
					var inputRun =  document.createElement('button');
					var inputClear =  document.createElement('button');
					var inputWiper =  document.createElement('button');
					var textarea =  document.createElement('textarea');
					var canvas =  document.createElement('canvas');
					var draw = base.drawCanvas(canvas,[1,0,0,1,0,0],getSelected,getMoveTo(textarea,inputWiper));
					var helper = base.helper(textarea);

					canvas.width = panel.offsetWidth * 0.7;
					canvas.height = panel.offsetHeight;
					canvas.style.background = '#333333';
					canvas.style.marginLeft = '5%';

					inputRun.innerHTML = 'Run';
					inputClear.innerHTML = 'Clear';
					inputWiper.innerHTML = 'Wiper-10';
					inputDiv.appendChild(inputRun);
					inputDiv.appendChild(inputClear);
					inputDiv.appendChild(inputWiper);
					inputDiv.appendChild(textarea);
					panel.appendChild(inputDiv);
					panel.appendChild(canvas);
					panel.appendChild(helper);


					textarea.onkeydown = getOnkeydown(base,helper);
					inputRun.onclick = function(){
						if(textarea.value && value !== textarea.value){
							value = textarea.value;
							draw([base.color(),'#dddddd',1],value);
						}
					};
					inputClear.onclick = function(){
						if(inputWiper.isCheck){
							value = textarea.value = '';
							draw();
						}else{
							draw();
						}
					};

					inputWiper.onclick = function(){
						inputWiper.isCheck = !inputWiper.isCheck;
						if(inputWiper.isCheck){
							inputWiper.style.background = '#9999ff';
						}else{
							inputWiper.style.background = '';
						}
					};

					inputWiper.onmousewheel = function(e){
						var value = parseFloat(inputWiper.innerHTML.split('-').pop()) + (e.wheelDelta/120);
						inputWiper.innerHTML = 'Wiper-' + (value<0?0:value);
					};



					base.http('../data/db.json',function(dataStr){
						inputDiv.appendChild(base.createMenu(JSON.parse(dataStr),function(item){
							value = '';
							textarea.value = item;
							inputRun.onclick();
						}));
					});
				}

				function getSelected(){
					return !inputWiper.isCheck;
				}

				function getMoveTo(textarea,inputWiper){
					var ctx = canvas.getContext('2d');
					return function(str,e){
						var r = parseFloat(inputWiper.innerHTML.split('-').pop());
						if(inputWiper.isCheck){
							if(inputWiper.backPoint){
								ctx.clearRect(inputWiper.backPoint[0],inputWiper.backPoint[1],inputWiper.backPoint[2],inputWiper.backPoint[3]);
							}
							inputWiper.backPoint = [e.offsetX, e.offsetY,r,r];
							ctx.clearRect(e.offsetX, e.offsetY,r,r);
							ctx.fillRect(e.offsetX, e.offsetY,r,r);
							setTimeout(function(){
								ctx.clearRect(e.offsetX, e.offsetY,r,r);
							},1000);
						}else{
							if(typeof str === 'string'){
								textarea.value += str + ' ';
								return true;
							}
						}
					};
				}
			}
		};

		function getOnkeydown(base,helper){
			return function(e){
				switch (e.keyCode){
					case base.keyCodes.KEY_T://M
						helper.show(['T100,100 [example],[#ffffff]','t100,100 [example],[#ffffff]']);
						break;
					case base.keyCodes.KEY_M://M
						helper.show(['M0,0','m0,0']);
						break;
					case base.keyCodes.KEY_L://L
						helper.show(['L100,100','l100,100']);
						break;
					case base.keyCodes.KEY_R://R
						helper.show(['R0,0 100,100','r0,0 100,100'],'大写是填充');
						break;
					case base.keyCodes.KEY_A://A
						helper.show(['A0,0 50,0,2','a0,0 50,0,2']);
						break;
					case base.keyCodes.KEY_P://P
						helper.show(['P0,0 100,100','p0,0 100,100']);
						break;
					case base.keyCodes.KEY_B://B
						helper.show(['B0,0 100,100 200,200','b0,0 100,100 200,200']);
						break;
					default:
						helper.show(null);
						break;
				}

			};
		}
	});

})(window.$ehr,window.d3);
