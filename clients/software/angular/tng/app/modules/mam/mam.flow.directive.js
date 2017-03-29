(function (angular) {
    'use strict';
    angular.module('cms.main').directive('sinoMamFlow', ['_','$d3','$global','$filter','$timeout','mamFlowLayout',function (_,$d3,$global,$filter,$timeout,mamFlowLayout) {
        return {
            restrict: 'A',
            scope: {
                sinoMamFlow:'='
            },
            link: function (scope, element) {
                var data = mamFlowLayout(scope.sinoMamFlow,size());
                controller(element[0],{size:size},data);
                if($global.isDebug){
                    timeout();
                    scope.$on('$destroy',function(){
                        $timeout.cancel(scope.interval);
                    });
                }
                function size(){
                    return {width:element.clientWidth||1200,height:element.clientHeight||800,'pointer-events':'all'};
                }
                function timeout(){
                    scope.interval = $timeout(timeout,data.active(window.localStorage[window.usePathname('flowInterval')]));
                }
            }
        };
        function controller(ele,option,data){
            var attr = option.size();
            var force = $d3.layout.force().linkDistance(200).gravity(0.03).linkStrength(1).friction(0.62).charge(-600).size([attr&&attr.width||200,attr&&attr.height||100]);
            var svg = $d3.select(ele).append('svg:svg').attr(attr).call($d3.behavior.zoom()
                .scaleExtent([0.2, 10])
                .scale(1)
                .translate([0, 0])
                .on('zoom', rescale));
            force.resize = function(){
                var $attr = option.size();
                force.size([$attr.width,$attr.height]);
                svg.attr($attr);
            };
            force.nodes(data.nodes).links(data.links);
            force.on('tick',tick(data.active,addLink($global,$timeout,$filter,svg,force,data.links),addNode($global,$timeout,$filter,svg,force,data.nodes)));
            force.start();
            return force;
            function rescale() {
                var trans = $d3.event.translate,
                    scale = $d3.event.scale;
                svg.attr('transform', 'translate(' + trans + ')' + ' scale(' + scale + ')');
            }
        }

    }]);

    function addLink($global,$timeout,$filter,svg,force,links){
        var markers =
            svg.selectAll('marker') .data(links).enter().append("marker")
                .attr("id", function(d,i){return "resolved-"+ i;})
                .attr("markerUnits","userSpaceOnUse")
                .attr("viewBox", "0 -5 10 10")
                .attr("refX",25*2 + 2)
                .attr("refY", 0)
                .attr("markerWidth", 12)
                .attr("markerHeight", 12)
                .attr("orient", "auto")
                .attr("stroke-width",2);
        var link = svg.selectAll('.d3-link').data(links)
            .enter().append('g')
            .attr('class', 'd3-link');
        markers.append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr('class',function(d){
                return d.color;
            });
        link.append('path')
            .attr('class', function(d){
                return 'link-content '+ d.stroke;
            })
            .style('stroke-width', 1)
            .attr('fill', 'none')
            .attr("marker-end", function(d,i){
                return "url(#resolved-"+ i+")";
            });
        link.append('text')
            .attr('class', function(d){
                return 'd3-text '+ d.color;
            }).style("font-weight", "bold")
            .text(function (d) {
                return $filter('language')(d.name,true);
            });
        return link;
    }

    function addNode($global,$timeout,$filter,svg,force,nodes){
        var node = svg.selectAll('.d3-node').data(nodes)
            .enter().append('g')
            .attr('class', function(d){
                return 'd3-node '+ (d.middle ?'middle':'first-last');
            })
            .call(force.drag);
        node.filter('.middle').append('rect')
            .attr('class', function(d){
                return 'node-content ' +d.fill;
            })
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('width', function (d) {return d.width;})
            .attr('height', function (d) {return d.height;})
            .on('dblclick',function(d){
                d.fixed = !d.fixed;
            });
        node.filter('.first-last').append('circle')
            .attr('class', function(d){
                return 'node-content ' +d.fill;
            })
            .attr('r', function (d) {return d.r;});
        node.append('text')
            .attr('class',function(d){
                return 'd3-text ' +d.color;
            })
            .selectAll("tspan")
            .data(function(d){
                return $filter('language')(d.name,true).split(' ');
            })
            .enter()
            .append("tspan")
            .text(function(d){
                return d;
            });
        addTooltip($global,$timeout,svg,node,1000);
        return node;
    }

    function addTooltip($global,$timeout,svg,elements,interval) {
        if(!$global.isDebug){
            return ;
        }
        return elements.on('mouseover', function (node) {
            node.showTooltip = true;
            $timeout(function () {
                svg.selectAll('.node_tooltip').remove();
                if (node.showTooltip && node.infos && node.infos.length) {
                    createTooltip(node, {
                        x: (node.x||0) + node.r,
                        y: (node.y||0)
                    });
                }
            }, interval || 0);
        }).on('mouseout', function (node) {
            node.showTooltip = false;
            svg.selectAll('.node_tooltip').remove();
        });
        function createTooltip(node, position) {
            var index = 0, width = 0, fontSize = 14;
            var tooltip = svg.append('g')
                .attr('class', 'node_tooltip')
                .attr('x', position.x)
                .attr('y', position.y);
            var rect = tooltip.append('rect')
                .attr('fill', '#999999')
                .attr('x', position.x)
                .attr('y', position.y);
            angular.forEach(angular.isString(node.infos)?{'':node.infos}:node.infos, function (val, pro) {
                var text = tooltip.append('text')
                    .attr('style', 'font-size:' + fontSize + 'px;fill:#ffffff;')
                    .attr('dx', position.x + 6)
                    .attr('dy', position.y + 14 + index * (1.3 * fontSize))
                    .text((pro&&!angular.isNumber(pro)?(pro + '  :   '):'') + val);
                index = index + 1;
                width = Math.max(width, text[0][0].clientWidth);
            });
            rect.attr('width', width + 12)
                .attr('height', index * (1.3 * fontSize) + 12);
        }
    }

    function tick(active,link,node){
        active(function(colorFn){
            link.selectAll('.link-content').attr('class',function(d){return 'link-content ' + colorFn(d);});
            node.selectAll('.node-content').attr('class',function(d){return 'node-content ' + colorFn(d);});
        });
        return function() {
            link.selectAll('path').attr('d', function(d){
                return d.fn.path();
            });
            node.attr('x', function (d) {return d.x;}).attr('y', function (d) {return d.y;});
            node.filter('.middle').attr('transform', function (d) {
                return 'translate(' + (d.x- d.width/2) + ', ' + (d.y - d.height/2) + ')';
            });
            node.filter('.first-last').attr('transform', function (d) {
                return 'translate(' + d.x + ', ' + d.y + ')';
            });
            node.filter('.first-last').selectAll('.d3-text')
                .attr('dx', function(){
                    return -this.clientWidth /2;
                });
            link.selectAll('.d3-text').attr('dx', function(d){
                return d.fn.dx(this);
            }).attr('dy', function(d){
                return d.fn.dy(this);
            });
            node.filter('.middle').selectAll('.d3-text')
                .attr('y', function(d){
                    return d.height/2 - this.clientHeight/2;
                }).selectAll("tspan").attr("dy","1em").attr("x","1em");
        };
    }

    function canNext(v,k){
        return !/(reject)|(cancel)/.test(k);
    }

    angular.module('cms.main').factory('mamFlowLayout',['_','helper',function(_,helper){
        var nodeSize = {'width':100,'height':60,'r':25};
        return function(data,range){
            var index = 0,start = _.find(data.nodes,function(node){return  /(start)/i.test(node.name);});
            while(start){
                initPosition(angular.extend(start,nodeSize), index ++,data.nodes.length);
                start = _.find(start.links,canNext);
            }
            data.links = _.union.apply([],_.map(data.nodes,function(node){
                return _.filter(_.map(node.links,function(to,key){
                    return {
                        'name':key,'source':node,'target':to,'step':to && (node.$index>to.$index?'back':(to.$index - node.$index === 1?'run':'jump')),'fn':getPath(range,node,to)};
                }),function(i){return i.source && i.target;});
            }));
            initColor(_,helper,data.nodes,data.links,data.flows);
            data.links = data.links.sort(function(a,b){return a.zIndex - b.zIndex;});
            data.active = active(_,helper,data);
            return data;

            function initPosition(node, $index, count){
                var dValue = 30;
                var widthChild = Math.floor((range.width - 300) / (count / 2 - 1));
                if ($index < count / 2) {
                    node.x = $index * widthChild + 100;
                    node.y = 0.2 * range.height;
                } else {
                    node.x = (count - $index - 1) * (widthChild - dValue) + ((count / 2 - 1) * dValue) + 100;
                    node.y = 0.8 * range.height;
                }
                node.$index = $index;
                node.cylinder = 0;
                if(!/(^start)|(^end)/i.test(node.name)){
                    node.middle = true;
                }else{
                    node.x = 100;
                }
            }
        };
    }]);

    function active(_,helper,data) {
        var activeList = [];
        return function (fn) {
            if (angular.isFunction(fn)) {
                activeList.push(fn);
            } else if (data.flows.length) {
                fn = helper.truthValue(parseInt(fn),200);
                if (helper.truthValue(!active.el , helper.value(active.el,'run') === 1)) {
                    var index = _.findIndex(data.flows, active.el);
                    active.el = helper.truthValue(data.flows[(index + 1) % (helper.truthValue(data.flows.length, 1))], {});
                    active.el.run = -1;
                } else {
                    active.el.run += 1;
                }

                angular.forEach(activeList, function (al) {
                    al(activeEl);
                });
                return fn;
            }
            function activeEl(d) {
                switch (helper.value(active.el,'run')) {
                    case -1:
                        if (d === active.el.from) {
                            return 'background-run';
                        }
                        break;
                    case 0:
                        if (d.source === active.el.from && d.target === active.el.to) {
                            return 'color-run';
                        }
                        break;
                    case 1:
                        if (d === active.el.to) {
                            fn = _.findIndex(data.flows, active.el) === data.flows.length - 1 ? Math.max(fn * 10,5000) : fn;
                            return 'background-run';
                        }
                        break;
                    default:
                        break;
                }
                return helper.truthValue(d.fill, d.stroke);
            }
        };
    }

    function getPath(range,from,to){
        return {
            path:function(){
                if(from.$index > to.$index){
                    return 'M'+(from.x)+','+from.y+'L'+(from.x)+','+(range.height/2)+'L'+(to.x)+','+(range.height/2)+'L'+(to.x)+','+to.y;
                }else{
                    if((from.y - range.height/2) * (to.y - range.height/2) < 0){
                        if(Math.abs(from.$index - to.$index) === 1){
                            return 'M'+from.x+','+from.y+'L'+(from.x+110)+','+from.y+'L'+(to.x+110)+','+to.y+'L'+to.x+','+to.y;
                        }else{
                            return 'M'+(from.x-20)+','+from.y+'L'+(from.x-20)+','+(range.height/2)+'L'+(to.x)+','+(range.height/2)+'L'+(to.x)+','+to.y;
                        }
                    }else{
                        return 'M'+from.x+','+from.y+'L'+to.x+','+to.y;
                    }
                }
            },
            dx:function(element){
                if((from.y - range.height/2) * (to.y - range.height/2) < 0 && Math.abs(from.$index - to.$index) === 1){
                    return (from.x+to.x) /2 - element.clientWidth /2 + 110;
                }else if(from.$index > to.$index){
                    return from.x - element.clientWidth /2;
                }else{
                    return (from.x+to.x) /2 - element.clientWidth /2;
                }
            },
            dy:function(){
                if(from.$index > to.$index){
                    return (from.y + range.height/2) /2;
                }else{
                    return (from.y + to.y) /2 + 5;
                }
            }
        };
    }

    function runCylinder(node,cylinder){
        if(node){
            if(node.cylinder === cylinder){
                ++cylinder;
            }
            node.cylinder = cylinder;
            return cylinder;
        }
        return cylinder;
    }
    function initColor(_,helper,nodes,links,flows){
        var cylinder = 0;
        angular.forEach(flows,function(flow,index){
            if(helper.value(flow.from,'middle')){
                cylinder = runCylinder(flow.from,cylinder);
            }
            if(index === flows.length - 1){
                cylinder = runCylinder(flow.to,cylinder);
            }
            flow.cylinder = cylinder;
        });
        angular.forEach(nodes,function(node){
            node.fixed = true;
            if(node.middle){
                node.fill = 'background-gray';
                node.color = 'background-blue';
            }else{
                node.fill = 'background-blue';
                node.color = 'background-white';
            }

        });
        angular.forEach(links,function(link){
            link.zIndex = 0;
            link.stroke = 'color-gray';
            link.color = 'background-gray2';
        });
        if(helper.value(flows,'length')){
            angular.forEach(flows,function(flow){
                var link = _.find(links,{ source:flow.from,target:flow.to});
                if(link){
                    link.color = 'background-green';
                    link.stroke = 'color-green';
                    link.zIndex = link.zIndex + 1;
                }
                flow.from.infos = helper.truthValue(flow.from.infos , []);
                flow.from.infos.push(flow.data);
            });
            angular.forEach(_.filter(flows,function(i){ return i.cylinder === cylinder;}),function(flow){
                if(isCylinder(flow.from)){
                    flow.from.color = 'background-white';
                    flow.from.fill = 'background-green';
                }
                if(isCylinder(flow.to)){
                    flow.to.fill = 'background-yellow';
                }
            });
        }else{
            var startNode = _.find(nodes,function(node){return  /(start)/i.test(node.name);});
            var nextNode = _.find(startNode.links,function(v,k){return !/(reject)|(cancel)/.test(k);});
            if(isCylinder(nextNode)){
                nextNode.fill = 'background-yellow';
            }
        }
        function isCylinder(nd){
            return nd && nd.middle && nd.cylinder === cylinder;
        }
    }


})(window.angular);
