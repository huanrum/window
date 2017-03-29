/**
 * Created by sus on 2016/1/28.
 */
(function(window){
	'use strict';

	var tempData = {};

	function namespace(name){
		tempData[name] = tempData[name] || {};
		for (var i=1;i<arguments.length;i++){
			var classFun = arguments[i];
			if(typeof classFun === 'function' && classFun.name){
				tempData[name][classFun.name] = tempData[name][classFun.name] || [];
				tempData[name][classFun.name].push(classFun);
			}
		}
	}

	namespace.create = function(name){
		var namespaceName = name.slice(0,name.lastIndexOf('.'));
		var className = name.split('.').pop();
		var classFun = [Object];
		if(namespaceName && tempData[namespaceName]){
			classFun = tempData[namespaceName][className];
		}else{
			/*jshint -W089*/
			for(var pro in tempData){
				for(var childPro in tempData[pro]){
					if(childPro === className){
						classFun = tempData[pro][className];
					}
				}
			}
		}

		var result = new classFun[0]();
		for(var i=1;i<classFun.length;i++){
			classFun[i].apply(result);
		}
		return result;
	};



	window.namespace = namespace;
})(window);