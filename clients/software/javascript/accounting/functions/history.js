/**
 * Created by Administrator on 2016/10/12.
 */
(function($e){
    'use strict';
    $e(function(){

        return {
            title:['History','历史记录'],
            action:function(panel,base){
                base.http($e.account.getUrls('accountconsume/getmonths'),function(months){
                    panel.appendChild(base.dialog(['Select Month','选择月份'],base.selectMenu(base.each(JSON.parse(months),'month'),function (month){
                        loadData(panel,base,month);
                    })));
                });
            }
        };



        function loadData(panel,base,month){
            base.http($e.account.getUrls('accountconsume/getdata',{date:month}),function(req){
                base.http($e.account.getUrls('accountconsume/getcolumns'),function(columnData){
                    var columns = JSON.parse(columnData);
                    var grid = base.toGrid(base.arrangement(JSON.parse(req)),base.extend({columns:columns},base.extend({className:'root-grid-data'},$e.account.gridOption)));
                    panel.innerHTML = '';
                    panel.appendChild(grid);
                });
            });
        }
    });


})(window.$ehr);