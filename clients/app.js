/**
 * Created by sus on 2015/10/13.
 */
(function($e){
	'use strict';

	$e('app.user',function(){
		return {
			Id:101,
			service:'../',
			info:'ehuanrum desktop by 10/16/2015 to '+new Date().toLocaleDateString(),
			test:{username:'seto.sun.developer',password:'12345678'}
			//suspension:5
		};
	});

})(window.$e$);