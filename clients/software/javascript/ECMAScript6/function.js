/**
 * Created by Administrator on 2016/8/26.
 */
(function($e){
	'use strict';

	$e(function $function(){
		return {
			title:'Function',
			fn:function(panel,base){
				panel.classList.add('ecmscript-function');
				panel.innerHTML = [
					'<div><a href="http://es6.ruanyifeng.com/#docs/function" target="_blank">function</a></div>',
					'<div><ol>',
					base.each(getContent(),function(item){
						if(item instanceof Array){
							return '<li>'+item.map(function(i,index){
									if(index){
										return '<div>'+base.replace(i,' ','&nbsp;')+'</div>';
									}else{
										return i;
									}
								}).join('') +'</li>';
						}else{
							return '<li>'+item +'</li>';
						}
					}).join(''),
					'</ol></div>'
				].join('');
			}
		};

		function getContent(){
			return [
				'函数参数的默认值',
				'rest参数 function(...values)',
				['扩展运算符（spread）是三个点（...）。','它好比rest参数的逆运算，将一个数组转为用逗号分隔的参数序列。','console.log(...[1, 2, 3])// 1 2 3。','a=[1,2,3,4],b=[11,12,13,14],c=[...a,...b];'],
				'函数的name属性，返回该函数的函数名。',
				'ES6允许使用“箭头”（=>）定义函数。',
				['对象简单化 ','id=1,a = {id,fn(){}}'],
				['字段名表达式 ','obj[\'a\' + \'bc\'] = 123;'],
				['属性',' a={set Name(value){this.name = value;},get Name(){return this.name;}}'],
				'let ab = { ...a, ...b }; 等同于 $.extend({},a,b);',
				'模板 function (target, key, value, receiver) {console.log(`setting ${key}!`);}',
				'Proxy和Reflect',
				'var socket = new WebSocket(\'ws://127.0.0.1:8081\');',
				[
					'yield*后面跟的是一个可遍历的结构，它会调用该结构的遍历器接口。',
					'Generator函数有多种理解角度。从语法上，首先可以把它理解成，Generator函数是一个状态机，封装了多个内部状态。',
					'   let generator = function* () {',
					'       yield 1;',
					'       yield* [2,3,4];',
					'       yield 5;',
					'   };'
				]
			];
		}

	});

})(window.$ehr);