/**
 * Created by Administrator on 2016/8/26.
 */
(function($e){
	'use strict';

	$e(function destructuring(){
		return {
			title:'Destructuring',
			fn:function(panel,base){
				panel.classList.add('ecmscript-destructuring');
				panel.innerHTML = [
					'<div>var [a, b, c] = [1, 2, 3];</div>',
					'<div>var { foo, bar } = { foo: "aaa", bar: "bbb" };</div>',
					'<div>var { foo:foo, bar:bar } = { foo: "aaa", bar: "bbb" };</div>'
				].join('');

			}
		};

	});

})(window.$ehr);