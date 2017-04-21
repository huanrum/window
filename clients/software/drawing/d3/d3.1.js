/**
 * Created by sus on 2016/1/7.
 */
(function($e,d3){
	'use strict';

	$e(function svg(){
		return {
			title:'SVG',
			fn:function(panel){
				panel.classList.add('d3-svg');
			},
			action:function(panel){
				if(!this.init){
					this.init = true;
					var svg = document.createElement('svg');
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
					panel.innerHTML = '<svg width="'+panel.clientWidth+'" height="'+panel.clientHeight+'"></svg>';
					fillSvg(panel.childNodes[0]);
				}
			}
		};

		function fillSvg(svg){
			var arrow = [
				'<defs>',
					'<marker id="arrow" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" viewBox="0 0 12 12" refX="6" refY="6" orient="auto">',
						'<path d="M2,2 L10,6 L2,10 L6,6 L2,2" style="fill:#000000"/>',
					'</marker>',
				'</defs>'
			].join('');


			svg.innerHTML = [arrow,
				'<line x1="10" y1="10" x2="200" y2="50" stroke="red" stroke-width="2" marker-end="url(#arrow)"/>',
				'<path fill="white" stroke="red" stroke-width="2" d="M20,70 T80,100 T160,80 T200,90" marker-start="url(#arrow)" marker-mid="url(#arrow)" marker-end="url(#arrow)"></path>'
			].join('');
		}
	});

	$e(function base(){
		return {
			title:'Base',
			fn:function(panel){
				panel.classList.add('d3-base');
			},
			action:function(panel,base){
				if(!this.init){
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
					var svg = d3.select(panel).append('svg').attr('width',panel.clientWidth).attr('height',panel.clientHeight);
					svg.datum(7);
					d3Svg(base,svg);
				}
			}
		};

		function d3Svg(base,svg){
			var options = {r:60},cellCount = Math.floor(svg.attr('width') / (2 * options.r + 10));
			var dataset = base.each(20,function(i){return Math.floor(Math.random() * 100);});

			var nodes = svg.selectAll('g').data( base.each(dataset).sort(d3.ascending)).enter().append('g').attr('class', 'node')
				.attr('transform',function(d,i){
					return "translate("+(i % cellCount * (options.r * 2 + 10) + options.r) + ","+((options.r * 2 + 10) * Math.floor(i / cellCount) + options.r )+")";
				});
			nodes.append('circle').attr('r',options.r).attr('fill',function(d,i){
				var color = base.color(i);
				base.addTooltip(this, dataset.indexOf(d) + ' : ' + color);
				return  color;
			});
			nodes.append('text').attr('dx', 2 - options.r).attr('dy', options.r + 12).attr('stroke','#999999').attr('stroke-width','2').text(function(d){return d;});

			d3.timer(function(){
				svg.selectAll('g').data(base.each(8,function(){return Math.floor(Math.random() * 100);}));
			},1000);
		}
	});

	$e(function rect(){
		return {
			title:'Rect',
			fn:function(panel){
				panel.classList.add('d3-rect');
			},
			action:function(panel,base){
				if(!this.init){
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
					var svg = d3.select(panel).append('svg').attr('width',panel.clientWidth).attr('height',panel.clientHeight);
					svg.datum(7);
					d3Svg(base,svg,true);
				}
			}
		};

		function d3Svg(base,svg,run){
			var dataset = base.each(20,function(i){return {id:i,add:1,value:Math.floor(Math.random() * 500 + 25)};});
			var cellSize = {width : Math.floor(svg.attr('width') / dataset.length),height:svg.attr('height') - 100};


			var nodes =  svg.selectAll('g').data(dataset).enter().append('g').attr('class', 'svg-node')
				.attr('transform',function(d,i){
					return "translate("+(i * cellSize.width) + ","+(cellSize.height - d.value)+")";
				});
			nodes.append('rect')
				.attr('width',cellSize.width - 10)
				.attr('height',function(d){return d.value;})
				.attr('fill',function(d,i){return base.color(i);});
			nodes.append('text').attr('dx', 10).attr('dy', function(d){return d.value + 20;}).attr('stroke','#999999').attr('stroke-width','2').text(function(d){return d.value;});

			if(run){
				base.eachrun(function () {
					base.each(svg.selectAll('g').data(), function (i) {
						if (i.value > 525 || i.value < 0) {
							i.add = -1 * i.add;
						}
						i.value = i.value + i.add * Math.floor(Math.random() * 25);
					});
					var $nodes = svg.selectAll('g').attr('transform', function (d, i) {
						return "translate(" + (i * cellSize.width) + "," + (cellSize.height - d.value) + ")";
					});
					$nodes.selectAll('rect').attr('height', function (d) {
						return d.value;
					});
					$nodes.selectAll('text').attr('dy', function (d) {
						return d.value + 20;
					}).text(function (d) {
						return d.value;
					});
				}, 1000);
			}
		}
	});

	$e(function scale(){
		return {
			title:'Scale',
			fn:function(panel){
				panel.classList.add('d3-scale');
			},
			action:function(panel,base){
				if(!this.init){
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';

					var svg = d3.select(panel).append('svg').attr('width',panel.clientWidth).attr('height',panel.clientHeight);
					var quantize = setD3(base,svg);
					svg.datum(7);
					d3Svg(base,svg,{quantize:quantize});
				}
			}
		};

		function setD3(base,svg){
			var quantize = d3.scale.quantize().domain([100,0]).range(base.each(10,function(i){return base.color(i);}));

			d3.svg.axis().scale(
				d3.scale.linear().domain([0,100]).range([0,1000])
			).orient('bottom').ticks(20).tickFormat(d3.format('0.1f'))
				(svg.append('g').attr('transform','translate(80,280)'));

			return quantize;
		}

		function d3Svg(base,svg,options){
			var time = svg.append('text').attr('dx', 10).attr('dy', 20).attr('stroke','#0099ff').attr('stroke-width',1).text(new Date());

			svg.selectAll('circle').data(base.each(9,function(i){return 10 * i + 5;})).enter().append('circle')
				.attr('cx',function(i){return i*10+50;})
				.attr('cy',100)
				.attr('r',function(d){return d;})
				.attr('store','#666666')
				.attr('store-width',1)
				.attr('fill',function(d){return options.quantize(d);})
				.transition().duration(2000)
				.attr('cy',svg.attr('height') - 100);

			base.eachrun(function () {
				time.text(new Date());
			}, 1000);
		}
	});


	$e(function event() {
		return {
			title: 'Event',
			fn: function (panel) {
				panel.classList.add('d3-event');
			},
			action: function (panel, base) {
				if (!this.init) {
					this.init = true;
					panel.style.height = panel.parentNode.scrollHeight - 16 + 'px';
					var message = d3.select(panel).append('div');
					var svg = d3.select(panel).append('svg').attr('width', panel.clientWidth).attr('height', panel.clientHeight);
					svg.datum(7);
					d3Svg(base, svg, message);
				}
			}
		};

		function d3Svg(base, svg, message){
			var dataset = base.each('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
			var cellCount = svg.attr('width') / 70;
			var rects = svg.selectAll('rect').data(dataset).enter()
				.append('rect')
				.attr('x',function(d,i){return 10 + 60 * (i % cellCount);})
				.attr('y',function(d,i){return  Math.floor(i / cellCount) * 60 + 150;})
				.attr('width',55)
				.attr('height',55)
				.attr('rx',5)
				.attr('ry',5)
				.attr('fill','back');
			var texts = svg.selectAll('text').data(dataset).enter()
				.append('text')
				.attr('x',function(d,i){return 10 + 60 *  (i % cellCount);})
				.attr('y',function(d,i){return  Math.floor(i / cellCount) * 60 + 150;})
				.attr('dx',10)
				.attr('dy',25)
				.attr('fill','white')
				.attr('font-size',24)
				.text(function(d){return d;});

			d3.select('body').on('keydown',function(){
				rects.attr('fill',function(d){
					if(d === String.fromCharCode(d3.event.keyCode)){
						message.text(message.text() + d);
						return 'yellow';
					}else{
						return 'black';
					}
				});
			}).on('keyup',function(){
				rects.attr('fill','black');
			});
		}
	});

})(window.$ehr,window.d3);