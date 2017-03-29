/**
 * Created by sus on 2016/1/7.
 */
(function(window){
	'use strict';

	function play1(data,point,value){
		return point;
	}

	function play2(data,point){
		if(data[point.y][point.x] === 0){
			return point;
		}
	}
	window.addEventListener('load',function(){
		var content = window.document.getElementById('content');
		content.style.width = window.document.body.scrollWidth - 30 + 'px';
		content.style.height = window.document.body.scrollHeight - 30 + 'px';
		window.board.drawBoard(content,[20,20],[play1,play2]);
	});
})(window);