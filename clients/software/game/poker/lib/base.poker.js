/**
 * Created by Administrator on 2016/10/24.
 */
(function($e){
    'use strict';

    function Poker(value){

        this.value = value;
        if(value>51){
            this.type = value - 52 + 4;
            this.index = 13;
        }else{
            this.type = value % 4;
            this.index = Math.floor(value / 4);
        }
    }

    window.poker = function(value,pros){
        var types = ['&spades;','&hearts;','&clubs;','&diams;','',''];
        var indexs = ['A',2,3,4,5,6,7,8,9,10,'J','Q','K','King'];
        var po = new Poker(value);
        return $e.new($e.new('div','ehr-poker','<div>'+indexs[po.index]+'</div><div class="icon">'+types[po.type]+'</div>',{poker:po}),{color:(po.type%2?'#ff0000':'#333333')},null, pros);
    };
})(window.$ehr);