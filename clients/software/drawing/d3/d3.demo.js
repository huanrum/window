/**
 * Created by sus on 2016/1/18.
 */
(function($e,$d3){
	'use strict';

	$e(function demo(){
		return {
			title : 'Demo',
			fn:function(panel){
				panel.classList.add('d3-demo');
			},
			action:function(panel,base){
				if(!this.init){
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
					$d3.json('../data/d3.base.json',function(data){
						base.each(data&&data.nodes,function(node){
							node.image = node.image || ('../../../../midea/downImages/'+Math.floor(Math.random() * base.downIconCount)+'.png');
						});
						var force = controller(panel,base,data||{nodes:[],links:[]});
						window.addEventListener('resize',function(){
							panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
							force.resize();
						});
					});
				}
			}
		};

		function controller(ele,base,grapth){
			var attr = getParentAttr(ele);
			var force = $d3.layout.force().linkDistance(100).gravity(0.03).linkStrength(1).friction(0.62).charge(-900).size([attr&&attr.width||200,attr&&attr.height||100]);
			var svg = $d3.select(ele).append('svg:svg').attr(attr).call($d3.behavior.zoom()
				.scaleExtent([0.2, 10])
				.scale(1)
				.translate([0, 0])
				.on('zoom', rescale));
			force.nodes(grapth.nodes).links(grapth.links);
			force.resize = function(){
				var $attr = getParentAttr(ele);
				force.size([$attr.width,$attr.height]);
				svg.attr($attr);
			};
			renderDefs(svg,force,base.filter(grapth.nodes,function(node){return !!node.image;}));
			force.on('tick',tick(addLink(svg,force,grapth.links),addNode(svg,force,grapth.nodes)));
			force.start();


			window.addEventListener('resize',function(){
				svg.attr({height:0});
			});
			return force;

			function rescale() {
				var trans = $d3.event.translate,
					scale = $d3.event.scale;
				svg.attr('transform', 'translate(' + trans + ')' + ' scale(' + scale + ')');
			}
		}

		function getParentAttr(parent){
			return {width:parent.clientWidth,height:parent.clientHeight,'pointer-events':'all'};
		}

		function addLink(svg,force,links){
			var link = svg.selectAll('.d3-link').data(links)
				.enter().append('g')
				.attr('class', 'd3-link');
			link.append('line')
				.attr('class', 'd3-link')
				.style('stroke-width', 2)
				.style('stroke', $d3.scale.category20(3));
			return link;
		}

		function renderDefs(svg,force,imageNodes){
			var pattern = svg.append('defs').selectAll('pattern').data(imageNodes).enter().append('pattern').attr('x', -25).attr('y', -25)
				.attr('height', 25 * 2).attr('width', 25 * 2).attr('patternUnits', 'userSpaceOnUse').attr('id', function(d,i){ return 'demo-img' + (d.Id || i);});
			pattern.append('image')
				.attr('height', 25 * 2)
				.attr('width', 25 * 2)
				.attr('xlink:href', function(d){return d.image;});
		}

		function addNode(svg,force,nodes){
			var node = svg.selectAll('.d3-node').data(nodes)
				.enter().append('g')
				.attr('class', 'd3-node')
				.call(force.drag);
			node.append('circle')
				.attr('class', 'node-content')
				.attr('r', function (d) {return d.r || 25;})
				.style('stroke-width', 2)
				.style('stroke', '#999999')
				.attr('fill',function(d,i){return d.image?('url(#demo-img'+(d.Id||i)+')'):'';});
			node.append('text')
				.attr('dx', -1 * 25 + 2)
				.attr('dy', 25 + 12)
				.attr('class', 'd3-text')
				.attr('fill','white')
				.text(function (d) {return d.name;});
			return node;
		}

		function tick(link,node){
			return function() {
				link.selectAll('line').attr('x1', function (d) {
					return d.source.x;
				}).attr('y1', function (d) {
					return d.source.y;
				}).attr('x2', function (d) {
					return d.target.x;
				}).attr('y2', function (d) {
					return d.target.y;
				});
				node.attr('cx', function (d) {
					return d.x;
				}).attr('cy', function (d) {
					return d.y;
				});

				node.attr('transform', function (d) {
					var x = d.x;
					var y = d.y;
					return 'translate(' + x + ', ' + y + ')';
				});
			};
		}

	});

})(window.$ehr,window.d3);