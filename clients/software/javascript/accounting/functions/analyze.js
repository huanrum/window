/**
 * Created by Administrator on 2016/10/12.
 */
(function($e){
    'use strict';
    $e(function(){

        return {
            title:['Analyze','数据分析'],
            action:function(panel,base){
                panel.innerHTML = '';
                base.http($e.account.getUrls('accountconsume/getmonths'),function(months) {
                    base.http($e.account.getUrls('accountconsume/getcolumns'), function (columnData) {
                        var totalPanel = base.new('div','analyze-month-content');
                        var dayContent =  base.new('div','analyze-day-content');
                        createMonthTotal(base, JSON.parse(months), totalPanel,function (month) {
                            base.http($e.account.getUrls('accountconsume/getdata',{date:month}), function (data) {
                                var days = base.group(JSON.parse(data), function (i) {
                                    return base.dateFomatter(i.consumeDate, 'dd');
                                });
                                dayContent.innerHTML = '<div>' + month + '</div>';
                                createDayTotal(base, JSON.parse(columnData),days, dayContent);
                            });
                        });
                        panel.appendChild(totalPanel);
                        panel.appendChild(dayContent);
                    });
                });
            }
        };


        function createMonthTotal(base,months,totalPanel,callback){
            var max = Math.floor(Math.max.apply(null,base.each(months,'amount')) * 1.2);
            base.each(months,function(month,index){
                var monthParent = base.new('div');
                monthParent.appendChild(base.new('div',null,month.month));
                monthParent.appendChild(base.new('div',{background:base.color(index),width:(month.amount / max * 100)+'%'}));
                monthParent.appendChild(base.new('div',null,month.amount));
                monthParent.onclick = function(){callback(month.month);};

                totalPanel.appendChild(monthParent);
            });
            callback(months[months.length-1].month);
        }

        function createDayTotal(base,columns,days,totalPanel){
            var max = Math.floor(Math.max.apply(null,base.each(days,function(items){return base.sum(items,'amount');})) * 1.2);
            base.each(days,function(items,day){
                var monthParent = document.createElement('div');

                monthParent.appendChild(base.new('div',null,base.sum(items,'amount')));
                monthParent.appendChild(base.new('div',{background:base.color(0),height:(base.sum(items,'amount') / max * 400)+'px',width:'2em'}));
                monthParent.appendChild(base.new('div',null,day));

                base.addTooltip(monthParent,function(e){ e.innerHTML = '';e.appendChild(base.toGrid(base.arrangement(items), {columns:columns}));});
                totalPanel.appendChild(monthParent);
            });
        }

    });


})(window.$ehr);