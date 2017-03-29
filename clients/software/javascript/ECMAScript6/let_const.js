/**
 * Created by Administrator on 2016/8/25.
 */
(function($e){
	'use strict';

	$e(function let_const(){
		return {
			title:'Let/Const',
			fn:function(panel,base){
				panel.classList.add('ecmscript-letconst');
				panel.innerHTML = [
					'<div><h3>let</h3><h5>不存在变量提升</h5><h5>不允许重复声明</h5>ES6新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。</div>',
					'<div><h3>const</h3>const声明一个只读的常量。一旦声明，常量的值就不能改变。</div>'
				].join('');

			}
		};

	});

})(window.$ehr);