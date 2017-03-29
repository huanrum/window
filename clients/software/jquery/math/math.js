/**
 * Created by Administrator on 2016/9/22.
 */
(function(eF){
    'use strict';

    eF( 'y=sub(a,b)');
    eF( 'y=pow(a,b)');
    eF( 'y=log(a,b)');

    eF( 'y=sub(x,5)+pow(x,5)+log(x,5)-sqrt(x)-sqrt(x,3)');
    eF( 'y=log(a,x)+pow(x,5)+log(x,a)-sqrt(x,2)-sqrt(3,x)');

})(window.elFunction);