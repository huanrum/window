/**
 * Created by Administrator on 2016/10/24.
 */
(function($e){
    'use strict';

    $e(function(){
        return {
            title:'Test Poker',
            fn:function(panel,base){
                var pokerList = base.each(base.each(54).random(),function(value,index){
                    var poker = base.new(window.poker(value,{onclick:function(e){
                        poker.active = !poker.active;
                        base.new(poker,{marginTop:poker.active?'-12px':null}).drag();
                        pokerList = base.filter(pokerList,function(i){return i!==poker;});
                        pokerList.push(poker);
                        base.each(pokerList,function(i,index){base.new(i,{zIndex:index});});
                    }}),{marginLeft:20*index +'px'});
                    panel.appendChild(poker);
                    return poker;
                });
            }
        };
    });

})(window.$ehr);