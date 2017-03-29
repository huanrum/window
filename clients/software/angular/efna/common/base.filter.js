(function(angular){
	'use strict';

	function formatterValue(formatter,date){
		function repair(value,place,char){
			value = '' + value;
			while(value.length < place){
				value = (char||0) + value;
			}
			return value;
		}
		return formatter.
			replace('YYYY',repair(date.getFullYear(),4)).
			replace('yyyy',repair(date.getFullYear(),4)).
			replace('YY',repair(date.getFullYear()%100,2)).
			replace('yy',repair(date.getFullYear()%100,2)).
			replace('MMM',['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][date.getMonth()]).
			replace('MM',repair(date.getMonth() + 1,2)).
			replace('DD',repair(date.getDate(),2)).
			replace('dd',repair(date.getDate(),2)).
			replace('d',repair(date.getDate(),2)).
			replace('HH',repair(date.getHours(),2)).
			replace('hh',date.getHours()>12?('PM '+repair(date.getHours()-12,2)):('AM '+repair(date.getHours(),2))).
			replace('mm',repair(date.getMinutes(),2)).
			replace('ss',repair(date.getSeconds(),2)).
			replace('fff',repair(date.getMilliseconds(),3));
	}

	angular.module('cms.common').filter('language',['languageEn','languageZhCn','languageZhTw','$global',function(en,ts,tw,$global){
		return function(value,defaultValue){
			var lang = '';
			if(/^\$empty\$/.test(value)){return '';}
			switch ($global.language){
				case 'zh-cn':
					lang = ts[value];
					break;
				case 'zh-tw':
					lang =  tw[value];
					break;
				default :
					lang =  en[value];
					break;
			}
			return lang || defaultValue || en[value] || value;
		};
	}]);

	angular.module('cms.common').filter('array',['_',function(_){
		return function(value,formatter){
			return _.map(value,function(i){return formatter&&formatter.replace('{i}',i) || i;}).join();
		};
	}]);

	angular.module('cms.common').filter('lookup',['_','lookupService',function(_,lookupService){
		return function(value,formatter){
			return lookupService(formatter.split(',').shift())[value][formatter.split(',').pop()];
		};
	}]);

	angular.module('cms.common').filter('toArray',['_',function(_){
		return function(value,count){
			var result =  _.times(value,function(i){return i+1;});
			switch (typeof count){
				case 'number':
					if(count<0) {
						return result.slice(value + Math.max(-value / 2, count), value);
					}else {
						return result.slice(0, Math.min(value / 2, count));
					}
					break;
				case 'string':
					return _.times(value,function(i){return count.replace('{index}',i);});
				default :
					return result;
			}
		};
	}]);

	angular.module('cms.common').filter('sinoDate', function(){
		return function(value,formatter){
			var date = value;
			if(angular.isString(date)) {
				date = replenish(date);
			}
			date = new Date(date);
			if(!date.valueOf() && date.valueOf() !== 0){
				return value;
			}
			return formatterValue(formatter|| 'yyyy-MM-dd HH:mm:ss',date);
		};
		function replenish(date){
			if (/^[0-9]+$/.test(date)) {
				if (date.length === 6) {
					date = '19700101T' + date;
				}
				if (date.length === 8) {
					date = date + 'T000000';
				}
			}
			if(date.indexOf('T')!==-1){
				var dates = date.split('T');
				dates[0] = dates[0].slice(0,4)+'/'+dates[0].slice(4,6)+'/'+dates[0].slice(6,8);
				dates[1] = dates[1].slice(0,2)+':'+dates[1].slice(2,4)+':'+dates[1].slice(4,6);
				date = dates[0] +' '+ dates[1];
			}
			return date;
		}
	});


	angular.module('cms.common').filter('efnaStatus',[function(){
		return function(value){
			return ['Incompleted','Completed','Submitted','Housekeeping'][value] || value;
		};
	}]);


})(window.angular);