/**
 * Created by sus on 2016/1/25.
 */
(function($e){
	'use strict';

	$e(function demo(){
		var base = window.$ehr;

		return {
			title: 'Demo',
			fn: function (panel) {
				panel.classList.add('canvas-demo');
			},
			action:function(panel,base){
				if(!this.init){
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
					base.http('../data/d3.base.json',function(data){
						var canvas = controller(panel,base,initData(data,panel));
						window.addEventListener('resize',function(){
							panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
							canvas.width = panel.offsetWidth;
							canvas.height = panel.offsetHeight;
							canvas.render();
						});
					});
				}
			}
		};

		function initData(data,parent){
			var result = JSON.parse(data);
			base.each(result.nodes,function(i,index){
				i.value = i.value || index;
				i.x = Math.random() * parent.offsetWidth * 0.8 + parent.offsetWidth * 0.1;
				i.y = Math.random() * parent.offsetHeight * 0.8 + parent.offsetHeight * 0.1;
				i.r = 25;
				i.image = i.image || ('../../../../midea/downImages/'+Math.floor(Math.random() * base.downIconCount)+'.png');
			});
			base.each(result.links,function(i){
				i.point1 = base.filter(result.nodes,function(l){return l.value === i.target;},0);
				i.point2 = base.filter(result.nodes,function(l){return l.value === i.source;},0);
			});
			return result;
		}

		function controller(parent,base,data){
			var canvas =  document.createElement('canvas');
			parent.appendChild(canvas);
			canvas.width = parent.offsetWidth;
			canvas.height = parent.offsetHeight;

			base.drawCanvas(canvas,getSelected,moveTo)([base.color(),'#dddddd',1])
				.apply(base,base.each(data.links,function(item){return [null,item.point1.x,item.point1.y,item.point2.x,item.point2.y];}))
				.apply(base,base.each(data.nodes,function(item){return [true,item.x,item.y,item.r];}))
				.apply(base,base.each(data.nodes,function(item){return [item.image,item.x-item.r,item.y-item.r,item.r*2,item.r*2];}))
				.apply(base,base.each(data.nodes,function(item){return [item.x-item.r,item.y-item.r,item.name,'20px Arial #ffffff'];}));

			return canvas;
		}

		function getSelected(items,e){
			var result = [];
			for(var i =0;i<items.length;i++){
				var nodes = items[i].nodes;
				for(var j=0;j<nodes.length;j++){
					if(isNode(nodes[j]) && filter(nodes[j])){
						result.push(nodes[j]);
					}
				}
			}
			return result;
			function isNode(node){
				return node.length === 4 && typeof (node[1] +node[2] +node[3]) === 'number';
			}
			function filter(node){
				return e.offsetX > node[1] - node[3] && e.offsetX < node[1] + node[3] && e.offsetY > node[2] - node[3] && e.offsetY < node[2] + node[3];
			}

		}

		function moveTo(items,currNode,vector){
			for(var i =0;i<items.length;i++){
				var nodes = items[i].nodes;
				for(var j=0;j<nodes.length;j++){
					var node = nodes[j];
					if(isImg(node) && isSelect([null,node[1] + currNode[3] ,node[2]+ currNode[3]])){
						node[1] = node[1] + vector[0];
						node[2] = node[2] + vector[1];
					}
					if(isText(node) && isSelect([null,node[0] + currNode[3] ,node[1] + currNode[3]])){
						node[0] = node[0] + vector[0];
						node[1] = node[1] + vector[1];
					}
					if(isLink(node)) {
						if (isSelect(node)) {
							node[1] = node[1] + vector[0];
							node[2] = node[2] + vector[1];
						}
						if (isSelect([null,node[3],node[4]])) {
							node[3] = node[3] + vector[0];
							node[4] = node[4] + vector[1];
						}
					}
				}
			}

			function isImg(node){
				return node.length === 5 && typeof (node[1] +node[2]+node[3] +node[4]) === 'number' && typeof node[0] === 'string';
			}
			function isText(node){
				return node.length === 4 && typeof (node[1] +node[0]) === 'number' && typeof node[2] === 'string' && typeof node[3] === 'string';
			}
			function isLink(node){
				return node.length === 5 && node[0] === null && typeof (node[1] +node[2] +node[3] +node[4]) === 'number';
			}
			function isSelect(node){
				return node[1] === currNode[1] && node[2] === currNode[2];
			}
		}
	});

})(window.$ehr);