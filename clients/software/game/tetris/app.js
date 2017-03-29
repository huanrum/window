/**
 * Created by sus on 2016/1/7.
 */
(function(window){
	'use strict';


	window.addEventListener('load',function(){

		var curTimer = window.tetris(document.getElementById('games-tetris'),document.getElementById('curScoreEle'),
			document.getElementById('curSpeedEle'),document.getElementById('maxScoreEle'));

		document.getElementById('resatrt').onclick = function(){
			curTimer.reStart();
		};
		document.getElementById('stop').onclick = function(){
			curTimer.suspend();
			curTimer.stop = !curTimer.stop;
			document.getElementById('stop').innerHTML = (curTimer.stop?'Start':'Stop');
		};
	});
})(window);