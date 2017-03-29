/**
 * Created by Administrator on 2016/8/26.
 */
(function($e){
	'use strict';

	$e(function promise(){
		return {
			title:'Promise',
			fn:function(panel,base){
				panel.classList.add('ecmscript-promise');
				panel.innerHTML = [
					'<div>var [a, b, c] = [1, 2, 3];</div>',
					'<div>var { foo, bar } = { foo: "aaa", bar: "bbb" };</div>',
					'<div>var { foo:foo, bar:bar } = { foo: "aaa", bar: "bbb" };</div>'
				].join('');

			}
		};

	});

	$e(function $class(){
		return {
			title:'Class',
			fn:function(panel,base) {
				panel.classList.add('ecmscript-promise');
				panel.innerHTML = [
					'<h3>//定义类</h3>',
					'class Point {',
					'   constructor(x, y) {',
					'	    this.x = x;',
					'	    this.y = y;',
					'   }',
					'   toString() {',
					'       return \'(\' + this.x + \', \' + this.y + \')\';',
					'   }',
					'}',
					'<h3>类的继承 class ColorPoint extends Point{}</h3>',
					'<h3>类的多继承 class DistributedEdit extends mix(Loggable, Serializable){}</h3>',
					'<h3>只有静态方法没有静态属性</h3>',
					'<h3>Module</h3>    模块功能主要由两个命令构成：export和import'
				].map(function(i){
						return '<div>'+ base.replace(i,' ','&nbsp;') +'</div>';
				}).join('');

			}
		};

	});

})(window.$ehr);