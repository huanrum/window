/**
 * Created by sus on 2016/1/19.
 */
(function($e,d3){
	'use strict';

	$e(function pie(){
		return {
			title: 'Pie',
			fn: function (panel) {
				panel.classList.add('d3-pie');
			},
			action: function (panel, base) {
				if (!this.init) {
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';

					var svg = d3.select(panel).append('svg').attr('width', panel.clientWidth).attr('height', panel.clientHeight);
					svg.datum(7);
					d3Svg(base, svg);
				}
			}
		};

		function d3Svg(base, svg){
			var dataset = d3.layout.pie().value(function(d){return d.value;})(base.each(10,function(i){return {id:i,add:1,value:Math.floor(Math.random() * 500 + 25)};}));
			var cellSize = {width : svg.attr('width') / 2,height:svg.attr('height') / 2};
			var arc = d3.svg.arc().innerRadius(0).outerRadius(cellSize.width/3);

			var nodes = svg.selectAll('g').data(dataset).enter().append('g')
				.attr('transform',function(d,i){return "translate("+(cellSize.width /2) + ","+(cellSize.height/2 + 100)+")";});

			nodes.append('path').attr('fill',function(d,i){return base.color(i);}).attr('d',function(d){return arc(d);})
				.on('mouseenter',function(d,i){d3.select(this).attr('opacity',0.6);})
				.on('mouseleave',function(d,i){d3.select(this).attr('opacity',1);});

			nodes.append('text').attr('transform',function(d){
				return "translate("+( arc.centroid(d)[0] * 1.4) + ","+(arc.centroid(d)[1] * 1.4)+")";
			}).attr('text-anchor','middle').text(function(d){
				return (d.value / d3.sum(dataset,function(d){return d.value;}) * 100).toFixed(1) + '%';
			});
		}
	});

	$e(function force() {
		return {
			title: 'Force',
			fn: function (panel) {
				panel.classList.add('d3-force');
			},
			action: function (panel, base) {
				if (!this.init) {
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';

					var svg = d3.select(panel).append('svg').attr('width', panel.clientWidth).attr('height', panel.clientHeight);
					d3Svg(base, svg);
				}
			}
		};

		function getData(base,count){
			var nodes = base.each(count,function(){return {name:'L'+Math.floor(Math.random() * 500)};});
			var links = base.each(count - 1,function(i){return {source:i,target:i+1};});
			return {
				nodes:nodes,
				links:links
			};
		}

		function d3Svg(base, svg){
			var dataset = getData(base,40);
			var force = d3.layout.force().size([svg.attr('width'),svg.attr('height')]).linkDistance(100).gravity(0.03).linkStrength(1).friction(0.62).charge(-900);


			var lines = svg.selectAll('.forceLine').data(dataset.links).enter().append('line')
				.style('stroke-width', 2)
				.style('stroke',base.color(0))
				.attr('class','forceLine');
			var nodes = svg.selectAll('.forceCircle').data(dataset.nodes).enter().append('circle').attr('r',40)
				.style('fill','#dddddd')
				.attr('class','forceCircle').call(force.drag);
			var texts = svg.selectAll('.forceText').data(dataset.nodes).enter().append('text').attr('dy','.3em').text(function(d){return d.name;})
				.attr('class','forceText');

			force.on('tick',function(){
				lines.attr('x1',function(d){return d.source.x;}).attr('y1',function(d){return d.source.y;}).attr('x2',function(d){return d.target.x;}).attr('y2',function(d){return d.target.y;});
				nodes.attr('cx',function(d){return d.x;}).attr('cy',function(d){return d.y;});
				texts.attr('x',function(d){return d.x;}).attr('y',function(d){return d.y;});
			});

			force.nodes(dataset.nodes).links(dataset.links);
			force.start();
		}
	});

	$e(function chord() {
		return {
			title: 'Chord',
			fn: function (panel) {
				panel.classList.add('d3-chord');
			},
			action: function (panel, base) {
				if (!this.init) {
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';

					var svg = d3.select(panel).append('svg').attr('width', panel.clientWidth).attr('height', panel.clientHeight);
					d3Svg(base, svg);
				}
			}
		};

		function getData(base,count){
			var continent = base.each(count,function(){return 'L'+Math.floor(Math.random() * 500);});
			var population = base.each(count,function(){return base.each(count,function(){return Math.floor(Math.random() * 10000);});});
			return {
				continent:continent,
				population:population
			};
		}

		function d3Svg(base, svg){
			var dataset = getData(base, Math.floor(Math.random() * 4 + 3));
			var cellSize = {width : svg.attr('width') / 2,height:svg.attr('height') / 2};
			var chord = d3.layout.chord().padding(0.03).sortSubgroups(d3.ascending).matrix(dataset.population);
			var gChord = svg.append('g').attr('transform','translate('+(cellSize.width /2) + ','+(cellSize.height/2 + 100)+')');
			var gOuter = gChord.append('g');
			var gInner = gChord.append('g');
			var innerRadius = cellSize.width /2 * 0.7;
			var outerRadius = innerRadius * 1.1;
			var arcOut = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

			gOuter.selectAll('.outerPath').data(chord.groups()).enter().append('path').attr('class','outerPath')
				.attr('d',arcOut)
				.style('fill',function(d){return base.color(d.index);});

			gOuter.selectAll('.outerText').data(chord.groups()).enter().append('text').attr('class','outerPath')
				.attr('dy','.35em').text(function(d,i){return dataset.continent[i];})
				.attr('transform',function(d){
					var angle = (d.startAngle + d.endAngle)/2;
					var result = 'rotate(' +(angle * 180 / Math.PI) + ') ';
					result += 'translate(0,' + (-1 * outerRadius - 10) + ') ';

					if(angle > Math.PI * 3 / 4 && angle > Math.PI * 5 / 4){
						result += 'rotate(180)';
					}
					return result;
				});

			var arcInner = d3.svg.chord().radius(innerRadius);
			gInner.selectAll().data(chord.chords()).enter().append('path').attr('class','innerPath')
				.attr('d',arcInner)
				.style('fill',function(d){return base.color(d.index);});
		}

	});

})(window.$ehr,window.d3);