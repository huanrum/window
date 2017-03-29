/**
 * Created by Administrator on 2016/10/12.
 */
(function($e){
    'use strict';
    $e(function(){

        return {
            title:['Reconciliation','对账记录'],
            action:function(panel,base){
                panel.innerHTML = '';
                base.http($e.account.getUrls('accountself/gettotal'),function(req){
                    var options = JSON.parse(req);
                    panel.appendChild(base.new(base.new('div','animation-neon4-hover'),{textAlign: 'center',color:'#ffffff',fontSize:'3em'},base.each(JSON.parse(options.total),function(i,k){
                        var cm = base.filter(options.comsumptionModes,function(c){return (c.id+'') === k;},0);
                        return base.translate([cm.name,cm.info])  + '('+i+') ';
                    }).join()));

                    loadData(panel,base,base.each(options.comsumptionModes,changeToColumn));
                });
            }
        };

        function changeToColumn(column){
            column.field = column.id;
            column.show = true;
            column.title = [column.name,column.info];
            column.formatter = function(value){
                return JSON.parse(value.amount)[column.id] || '';
            };
            return column;
        }

        function countColumn(base,columns){
            return {
                field:'',
                show:true,
                title : ['Count','总和'],
                formatter:function(value){
                    return base.sum(columns,function(column){
                        return parseFloat(JSON.parse(value.amount)[column.id]) || 0;
                    });
                }
            };
        }

        function loadData(panel,base,comsumptionModes){
            base.http($e.account.getUrls('accountself/getdata'),function(req){
                base.http($e.account.getUrls('accountself/getcolumns'),function(columnData){
                    var columns = JSON.parse(columnData).concat(comsumptionModes).concat([countColumn(base,comsumptionModes)]);
                    var grid = base.toGrid(base.filter(base.arrangement(JSON.parse(req)),function(i){return i.id;}),base.extend({columns:columns},base.extend({className:'root-grid-data'},$e.account.gridOption)));
                    panel.appendChild(grid);
                });
            });
        }
    });


})(window.$ehr);