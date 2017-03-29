(function(angular){
	'use strict';

	function formatterValue(formatter,date){
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

		function repair(value,place,ch){
			value = '' + value;
			while(value.length < place){
				value = (ch||0) + value;
			}
			return value;
		}
	}

	function getValue(_,lang,key){
		return _.find(lang,function(v,k){
			return k.toLocaleLowerCase() === (''+key).toLocaleLowerCase();
		});
	}

	function toSplit(str){
		var newStr = '',isUp = true;
		for(var i=0;i<str.length;i++){
			if(!/[A-Z]/.test(str[i])){
				isUp = false;
			}else if(!isUp){
				isUp = true;
				newStr += ' ';
			}
			newStr += str[i];
		}
		return newStr;
	}


	angular.module('cms.common').filter('translator',['_','$filter',function(_,$filter) {
		return function(value,parameters){
			return _.map(value && value.split('-'),function(va){return $filter('language')(va,parameters);}).join(' ');
		};
	}]);

	angular.module('cms.common').filter('money',['_','$filter',function(_,$filter) {
		return function(value){
			var formatter = $filter('language')('moneyFormatter');
			if(/[0-9]*$/.test(formatter)){
				return formatter.replace(/[0-9]/g,'') + _.map(((value||0)+'').split('.'),function(val,index){
						var length = parseInt(/[0-9]*$/g.exec(formatter)[0]) || 9999999;
						if(index === 0){
							return _.map(val,function(ch,i){
								if(i && (val.length - i)%length === 0){
									return ',' + ch ;
								}else{
									return ch;
								}
							}).join('');
						}else{
							return _.map(val,function(ch,i){
								if(i%length === length-1){
									return ch + ',';
								}else{
									return ch;
								}
							}).join('');
						}
					}).join('.');
			}
			return value;
		};
	}]);

	angular.module('cms.common').filter('language',['_','$injector','$global','helper',function(_,$injector,$global,helper){
		var languageKV = _.zipObject(_.map($global.languageList,function(v){return v;}),_.map($global.languageList,function(v,k){return k;}));

		return function(value,defaultValue,parameters){
			var lang = $injector.get('languageData')[languageKV[$global.language] || 'en'];
			if(!value || /^\$empty\$/.test(value)){
				return '';
			}
			if(defaultValue && angular.isObject(defaultValue)){
				parameters = defaultValue;
				defaultValue = value;
			}
			if(parameters){
				var result = getValue(_,lang,value);
				angular.forEach(parameters,function(v,k){
					result = result.replace('{{'+k+'}}',helper.truthValue(getValue(_,lang,v),v));
				});
				return result;
			}else{
				if(defaultValue === true){
					return helper.truthValue(getValue(_,lang,value) ,(angular.isString(value)&&toSplit(value.replace(/^\S_/,'').replace('$action$',''))), value);
				}else{
					return helper.truthValue(getValue(_,lang,value) ,defaultValue ,(angular.isString(value)&&value.replace(/^\S_/,'').replace('$action$','')), value);
				}

			}
		};
	}]);

	angular.module('cms.common').filter('array',['_',function(_){
		return function(value,formatter){
			return _.map(value,function(i){return formatter&&formatter.replace('{i}',i) || i;}).join(formatter?'':',');
		};
	}]);

	angular.module('cms.common').filter('lookup',['lookupService',function(lookupService){
		return function(value,formatter){
			var item = lookupService(formatter.split(',').shift())[value];
			return item && item[formatter.split(',').pop()] || '';
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

	angular.module('cms.common').filter('sinoDate', ['$filter',function($filter){
		return function(value,formatter){
			var date = value;
			if(angular.isString(date)) {
				date = replenish(date);
			}
			date = new Date(date);
			if(!date.valueOf() && date.valueOf() !== 0){
				return '';
			}
			return formatterValue(getFormatter(formatter|| 'yyyy-MM-dd HH:mm:ss'),date);
		};

		function getFormatter(format){
			switch (format){
				case '+':
					format = $filter('language')('dataFormatter');
					break;
				case '-':
					format = $filter('language')('timeFormatter');
					break;
				case '+-':
					format = $filter('language')('dataTimeFormatter');
					break;
				default:
					break;
			}
			return format;
		}
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
	}]);


	angular.module('cms.common').filter('maintainStatus', ['$filter',function($filter){
		var classList = {
				DRAFTED:'color-blue',
				REMOVED:'color-blue',
				SUBMITTED:'color-blue',
				SUCCESS:'color-green',
				PARTIAL_SUCCESS:'color-green',
				FAIL:'color-red',
				ERROR:'color-red',
				CANCELED:'color-gray',
				REJECTED:'color-red',
				WAIT_FOR_APPRO:'color-blue',
				WAIT_FOR_EXEC:'color-blue',
				EXECUTED:'color-green'
		};
		return function(value) {
			return '<span class="font-weight-bold '+classList[value]+'">'+$filter('language')(value)+'</span>';
		};
	}]);


})(window.angular);