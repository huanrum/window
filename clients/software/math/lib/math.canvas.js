/**
 * Created by sus on 2015/11/23.
 */
(function(window){
	'use strict';

	window.showwave = (function(){

		var color = {
			background:'#000000',
			content:'#9999ff',
			scale:'#999999'

		};

		return function(parent,points,scaleValue,interval){

			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			var render = function(){
				var tempPoints = typeof points === 'function'?points(ctx.ctxLength || 100):points;
				canvas.width = parent.offsetWidth;
				canvas.height = parent.offsetHeight;
				ctx.fillStyle = color.background;
				ctx.fillRect(0,0,canvas.width,canvas.height);
				ctx.fill();
				drawCoordinate(ctx,canvas.zoom||1,canvas,scaleValue,20);
				drawAllLines(ctx,canvas.zoom||1,canvas,tempPoints);

			};

			canvas.onmousewheel = function(e){
				canvas.zoom = (canvas.zoom||1) * (e.deltaY<0?1.25:0.8);
				ctx.ctxLength = Math.floor(100 / canvas.zoom);
			};

			canvas.width = parent.offsetWidth;
			canvas.height = parent.offsetHeight;
			parent.appendChild(canvas);
			ctx.zoom = ctx.zoom || 1.0;
			ctx.ctxLength = ctx.ctxLength || 100;
			timeout(render,interval || 200);
		};

		function timeout(func,interval){
			func();
			setTimeout(function(){
				timeout(func,interval);
			},interval);
		}

		function drawAllLines(ctx,zoom,size,points){
			ctx.beginPath();
			ctx.strokeStyle = color.content;
			if(points.length){
				ctx.moveTo(0,size.height*0.5 - points[0]*size.height*zoom);
				for(var i=0;i<points.length;i++){
					ctx.lineTo(i*size.width/ctx.ctxLength,size.height*0.5 -points[i]*size.height*zoom);
				}
			}
			ctx.stroke();
			ctx.closePath();
		}

		function drawCoordinate(ctx,zoom,size,scaleValue,scale){
			var scaleWidth = 3;
			scale = scale / zoom;
			scaleValue = 2 * (scaleValue || 1) / scale;

			ctx.beginPath();
			ctx.strokeStyle = color.scale;
			ctx.fillStyle = color.scale;

			ctx.moveTo(0,0.5*size.height);
			ctx.lineTo(size.width,0.5*size.height);
			ctx.moveTo(size.width*0.5,0);
			ctx.lineTo(size.width*0.5,size.height);

			for(var i=0;i<scale;i++){
				ctx.moveTo(size.width/2-scaleWidth,i*size.height/scale);
				ctx.lineTo(size.width/2+scaleWidth,i*size.height/scale);

				ctx.moveTo(i*size.width/scale,size.height/2-scaleWidth);
				ctx.lineTo(i*size.width/scale,size.height/2+scaleWidth);

				if( i !== scale/2){
					var value = i- Math.floor(scale/2);
					ctx.fillText( toTwo(value*scaleValue)+ '',size.width/2+scaleWidth,i*size.height/scale);
					ctx.fillText(value+ '',i*size.width/scale,size.height/2-scaleWidth);
				}
			}

			ctx.stroke();
			ctx.fill();
			ctx.closePath();
		}

		function toTwo(value,count){
			var str = value.toString().split('.');
			count = count || 2;
			return str[0] +'.'+ (str[1]&&str[1].length>count?str[1].slice(0,count):(str[1]||'0'));
		}
	})();

})(window);