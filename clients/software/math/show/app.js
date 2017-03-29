/**
 * Created by sus on 2016/1/7.
 */
(function(window){
	'use strict';

	var base = window.$ehr;

	var mathFun = {
		stop:function stop(){
			return 0;
		},
		sin:function sin(x){
			return Math.sin(x/50*Math.PI)/2;
		},
		wave:function wave(x){
			return Math.floor(x / 40)%2 === 0?-0.4:0.4;
		},
		sqrt:function sqrt(x){
			return Math.sqrt(x / (Date.now()/625) % 25)/5 - 0.5;
		},
		random:function(){
			return Math.random() - 0.5;
		}
	};

	function getFun(mathFun,x){
		var selectes = base.filter(mathFun,function(i){return i.selected;});
		return base.sum(selectes,function(f){return f(x);}) / (selectes.length||1);
	}

	window.addEventListener('load',function(){
		var points = [];
		var menu = document.getElementById('select');
		var content = document.getElementById('content');

		content.style.height = content.parentNode.scrollHeight - 16 + 'px';
		window.showwave(content,function(maxLength){
			var fun = getFun(mathFun);
			if(points.length > maxLength){
				points.shift();
			}
			points.push(getFun(mathFun,Date.now() / 25));
			return points;
		});

		base.each(mathFun,function(value,prop){
			var li = document.createElement('li');
			li.innerHTML = prop;
			li.onclick = function(){
				value.selected = ! value.selected;
				li.style.background = value.selected ? '#999999':'none';
			};
			menu.appendChild(li);
		});

		window.addEventListener('resize',function(){
			content.style.height = content.parentNode.scrollHeight - 16 + 'px';
		});

	});
})(window);