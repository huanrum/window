/**
 * Created by sus on 2016/1/7.
 */
(function(window){
	'use strict';

	window.board = (function board(){

		var base = window.$ehr;

		function getParentAttr(parent,margin){
			return {width:parent.offsetWidth - margin,height:parent.offsetHeight - margin};
		}

		function drawLink(ctx,item){
			ctx.strokeStyle = '#0000ff';
			ctx.moveTo(item.point1.x,item.point1.y);
			ctx.lineTo(item.point2.x,item.point2.y);
			ctx.stroke();
		}

		function drawNode(ctx,color,item){
			ctx.fillStyle = color || '#000000';
			ctx.strokeStyle = '#dddddd';
			ctx.beginPath();
			ctx.arc(item.x,item.y,item.r,0,Math.PI*2,true);
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}

		return {
			drawBoard:function(parent,rowCell,plaies){
				var rowCells = rowCell instanceof Array?rowCell:[rowCell,rowCell];
				var margin = 5;
				var cacheTemp = [];
				var size = getParentAttr(parent,2*margin);
				var canvas =  document.createElement('canvas');
				var ctx = canvas.getContext('2d');
				var playIndex = 0;

				var render = function(){
					ctx.clearRect(0,0,size.width,size.height);
					drawLink(ctx,{point1:{x:margin,y:margin},point2:{x:size.width-margin,y:margin}});
					drawLink(ctx,{point1:{x:margin,y:size.height-margin},point2:{x:size.width-margin,y:size.height-margin}});
					drawLink(ctx,{point1:{x:margin,y:margin},point2:{x:margin,y:size.height-margin}});
					drawLink(ctx,{point1:{x:size.width-margin,y:margin},point2:{x:size.width-margin,y:size.height-margin}});

					base.each(rowCells[0],function(value){
						if(value === 0){return;}
						drawLink(ctx,{point1:{x:margin,y:value*size.height/rowCell[0]},point2:{x:size.width-margin,y:value*size.height/rowCell[0]}});
					});
					base.each(rowCells[1],function(value){
						if(value === 0){return;}
						drawLink(ctx,{point1:{x:value*size.width/rowCell[1],y:margin},point2:{x:value*size.width/rowCell[1],y:size.height-margin}});
					});

					base.each(rowCells[0],function(r){
						cacheTemp[r] = cacheTemp[r] || [];
						base.each(rowCells[1],function(c){
							cacheTemp[r][c] = cacheTemp[r][c] || 0;
							if(cacheTemp[r][c]){
								drawNode(ctx,base.color(cacheTemp[r][c]),{x:c*size.width/rowCell[1],y:r*size.height/rowCell[0],r:Math.min(size.width/rowCell[1],size.height/rowCell[0])/2});
							}
						});
					});
				};

				canvas.onclick = function(e){
					updateCacheTemp(Math.floor((e.offsetX - margin) / (size.width/rowCell[1]) + 0.5),Math.floor((e.offsetY - margin) / (size.height/rowCell[0]) + 0.5));
					if(plaies[playIndex].auto){
						setTimeout(function () {
							updateCacheTemp(Math.floor( Math.random()*rowCell[1] + 0.5), Math.floor( Math.random()*rowCell[0] + 0.5));
						}, 1000);
					}
				};


				canvas.width = size.width;
				canvas.height = size.height;
				parent.appendChild(canvas);
				(base.filter(plaies,function(v,i){return i.auto;},0) || plaies[0]).auto = true;
				render();

				return canvas;

				function updateCacheTemp(x,y){
					var playPromise = base.filter(plaies,function(v,i){return i===playIndex;},0)(cacheTemp,{x:x,y:y},playIndex + 1);

					if(playPromise && playPromise.then){
						playPromise.then(function(result,value){
							update(result,value);
						});
					}else{
						update(playPromise,playIndex + 1);
					}

					playIndex = (playIndex +1) % plaies.length;

					function update(point,value){
						if(point){
							if(cacheTemp[point.y][point.x] === 0){
								cacheTemp[point.y][point.x] = value;
							}else{
								cacheTemp[point.y][point.x] = 0;
							}
						}
						render();
					}
				}
			}
		};
	})();

})(window);
