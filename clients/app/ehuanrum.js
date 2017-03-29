/**
 * Created by sus on 2016/1/6.
 */
(function(window){
	'use strict';

	/*ehuanrum(main)*/
	var $e$ = (function($window){

		var chaceData = {temp:{},data:{},load:[]};

		function ehuanrum(field,value){
			if(typeof field !== 'string'){
				if(typeof field === 'function'){
					$window.addEventListener('load',field);
					if(typeof value === 'function'){
						//$window.addEventListener('unload',value);
						$window.addEventListener('beforeunload',value);
					}
				}
				return ;
			}
			field = field.trim();
			while(/_/.test(field)){
				field = field.replace('_','.');
			}

			if(field[0] === '>'){
				return chaceData.temp[field.slice(1)];
			}

			if(value){
				if(field[field.length-1] === '.'){
					var $value = value;
					field = field.slice(0,field.length-1);
					value = function(){return $value;};
				}
				chaceData.temp[field] = value;

			}else {
				if(!field){
					return chaceData.data;
				}else if(chaceData.temp[field]) {
					var tempField,fields = field.split('.'), lastField = fields.pop(),chaceTempData = chaceData.data;
					value = chaceData.temp[field];

					while(fields.length){
						tempField = fields.shift();
						chaceTempData = chaceTempData[tempField] = chaceTempData[tempField] || {};
					}
					if(!chaceTempData[lastField] && value){
						if(typeof value === 'function'){
							var str = value.toLocaleString().slice(value.toLocaleString().indexOf('(')+1,value.toLocaleString().indexOf(')'));
							var parameters = str?str.split(','):[];
							for(var i=0;i<parameters.length;i++){
								if(parameters[i].trim().toLocaleLowerCase() === 'self'){
									parameters[i] = chaceData.data[field.split('.')[0]];
								}else{
									parameters[i] = ehuanrum(parameters[i].trim());
								}
							}
							chaceTempData[lastField] = value.apply(value,parameters);
						}else{
							chaceTempData[lastField] = value;

						}
					}
				}

				for (var f in chaceData.temp) {
					if (f !== field && check(f.split('.'),field.split('.'))) {
						ehuanrum(f);
					}
				}

				var $fields = field.split('.'),$chaceTempData = chaceData.data;
				while($fields.length > 1){
					$chaceTempData = $chaceTempData[$fields.shift()];
				}
				return $chaceTempData[$fields.shift()];
			}

			function check(bases,news){
				for(var ck = 0;ck<news.length;ck++){
					if(bases[ck] !== news[ck]){
						return false;
					}
				}
				return true;
			}
		}

		ehuanrum('$q.ehrCache',function(){
			function EhrCache(item,type){
				this.it = item;
				this.type = type;
			}
			return function func(item,type){
				if(item || type){
					func.$cache = func.$cache || {};
					var handle = Date.now();
					func.$cache[handle] = new EhrCache(item,type);
					return handle;
				}else{
					return func.$cache;
				}
			};
		});

		ehuanrum('$q.promise',function(){
			return function(){
				var list = [];
				return new Promise([]);
			};

			function Promise(list,$arguments){
				var self = this,$resolve = false;
				this.then =  function (fn) {
					if($arguments && typeof fn === 'function' && !$resolve){
						setTimeout(function(){
							fn.apply(self, $arguments);
						});
					}
					list.push(fn);
					return this;
				};
				this.resolve = function () {
					$arguments = arguments;
					$resolve = true;
					setTimeout(function(){
						for (var i = 0; i < list.length; i++) {
							if(typeof list[i] === 'function'){
								list[i].apply(self, $arguments);

							}
						}
						$resolve = false;
					});
				};
			}
		});

		ehuanrum('$q.timeout',function(){
			return function(func,time){
				var promise = ehuanrum('$q_promise')();
				setTimeout(function(){
					if(typeof func === 'function'){
						promise.resolve(func());
					}else{
						setTimeout(func);
						promise.resolve();
					}
				},time);
				return promise;
			};
		});

		ehuanrum('$q.http',function(){

			return function(url,data,backFun) {
				var promise = ehuanrum('$q_promise')();
				var xhr = createXHR();
				if(typeof url === 'string'){
					$http(xhr,url,data,function(req){
						promise.resolve.apply(null,[req]);
						(backFun||function(){}).apply(null,[req]);
					});
				}else if(url instanceof Array){
					var reqData = [];
					for(var i=0;i<url.length;i++){
						$onload(xhr,url[i],i,url.length,reqData);
					}
				}else if(url && url.url){
					$http(xhr,url.url,data,function(req){
						promise.resolve.apply(null,[req]);
						(backFun||function(){}).apply(null,[req]);
					},url.setRequestHeader);
				}
				return promise;

				function createXHR(){
					var xhr = null;
					if($window.XMLHttpRequest){
						xhr = new $window.XMLHttpRequest();
						if(xhr.overrideMimeType){
							xhr.overrideMimeType('text/xml');
						}
					}else{
						xhr = new $window.ActiveXObject('Microsoft.XMLHTTP');
					}
					return xhr;
				}

				function $onload(xhr,$url,$index,$count,$reqData){
					$http(xhr,$url,data,function(req){
						$reqData[$index] = req;
						$reqData.$index = ($reqData.$index||0)+1;
						if($reqData.$index === $count){
							promise.resolve.apply(null,$reqData);
							(backFun||function(){}).apply(null,$reqData);
						}
					});
				}
			};

			function $http(xhr,url,data,backFun,setRequestHeader){
				if(typeof data === 'function'){
					backFun = data;
					data = null;
				}
				xhr.onreadystatechange = callBack;
				xhr.open((!data?'GET':'POST'),url,true);
				if(setRequestHeader){
					setRequestHeader(xhr);
                    xhr.send(data);
				}else if(data){
                    if(data instanceof FormData){
                        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
                        xhr.send(data);
                    }else{
                        xhr.setRequestHeader('Content-Type','application/json');
                        xhr.send(JSON.stringify(data));
                    }
				}else{
                    xhr.send(data);
                }

				function callBack(){
					if(xhr.readyState === 4 && xhr.status === 200){
						(backFun||function(){})(xhr.responseText);
					}
				}
			}
		});

		ehuanrum('$q.sequence',function(){
			return function(backCall,interval){
				return new Sequence(null,backCall,interval);
			};
			function Sequence(root,backCall,interval){
				this.$id = Date.now();
				this.root = root || this;
				this.fn = backCall;
				this.interval = interval;
				this.then = function result(backCall,interval){
					var dataItem = new Sequence(this.root,backCall,interval);
					this.next = dataItem;
					return dataItem;
				};
				this.fire = function fire(){
					(function run(data,args){
						if(data){
							if(data && data.fn){
								data.fn.apply(data,args);
							}
							ehuanrum('$q.timeout')(function(){
								run(data.next,args);
							},data.interval);
						}
					})(this.root,arguments);
				};
			}
		});

		return ehuanrum;

	})(window);

	/*ehuanrum<base>*/
	(function($e){

		$e('base.url',function(){
			var url = '';
			if(/msie([\d.]+)/i.test( window.navigator.userAgent)){//IE
				url = window.location;
			}else if(/firefox\/([\d.]+)/i.test( window.navigator.userAgent)){//firefox
				url =  window.location;
			}else if(/chrome\/([\d.]+)/i.test( window.navigator.userAgent)){//chrome
				url =  window.location.origin + window.location.pathname;
			}else if(/opera.([\d.]+)/i.test( window.navigator.userAgent)){//opera
				url =  window.location.origin + window.location.pathname;
			}else if(/version\/([\d.]+)/i.test( window.navigator.userAgent)){//safari
				url =  window.location.origin + window.location.pathname;
			}
			if(/.*\.[html|htm|asp|cshtml]/.test(url)){
				var urls = url.split('/');
				urls.pop();
				url = urls.join('/') + '/';
			}
			return url;
		});

		$e('base.type',function(){
			return function(obj){
				if(obj === null){
					return 'null';
				}else if(obj === undefined){
					return 'undefined';
				}else{
					return obj.constructor.name;
				}
			};
		});

		$e('base.is',function(){
			return function(obj,type){
				if(type === 'object'){
					return true;
				}
				if(obj === null){
					return 'null' === type;
				}else if(obj === undefined){
					return 'undefined' === type;
				}else{
					var parent = obj;
					while(parent && parent.constructor.name !== 'object'){
						if(parent.constructor.name === type){
							return true;
						}else{
							/*jshint -W103*/
							parent = parent.__proto__;
						}
					}
				}
				return false;
			};
		});

		$e('base.sToint',function(){
			return function(str){
				return $e('base.sum')(str,function(i){return i.charCodeAt();});
			};
		});

		$e('base.color',function(){
			return function(index){
				if(typeof index === 'number'){
					return '#'+ new Date(10000).setYear(index).toString(16).slice(-8,-2);
				}else{
					return '#'+ Math.floor(Math.random() * 256*256*256).toString(16).slice(-6);
				}
			};
		});

		$e('base.translate',function() {
			return function (translates, defaultValue) {
				var defaultTranslates = {
					1: {
						ok: '确定',
						cancel: '取消',
						show: '显示',
						add: '新增',
						edit: '编辑',
						delete: '删除',
						name: '名称',
						password: '密码',
						language: '语言',
						load: '登录'
					}
				};
				if (translates && !(translates instanceof Array)) {
					defaultValue = translates;
					translates = null;
				}
				return (translates && translates[$e('base.app').language || 0]) ||
					(defaultValue && defaultTranslates[$e('base.app').language || 0] && defaultTranslates[$e('base.app').language||0][defaultValue.toLocaleLowerCase().trim()]) ||
					defaultValue;
			};
		});

		$e('base.hump',function() {
			return function hump(str) {
				if (!str) {
					return '&nbsp;';
				}
				if (/.*FK$/.test(str.toLocaleUpperCase())) {
					str = str.slice(0, str.length - 2);
				}
				if(!/a-z/.test(str)){
					return str;
				}
				var result = $e('base.each')(str, function (char) {
					if (/[A-Z]/.test(char)) {
						return ' ' + char;
					} else {
						return char;
					}
				}).join('');
				return result[0].toLocaleUpperCase() + result.slice(1);
			};
		});

		$e('base.formatter',function(){
			return function(str){
				for(var i=1;i<arguments.length;i++){
					var reg = new RegExp('#'+(i-1)+'#');
					while(reg.test(str)){
						str = str.replace(reg,arguments[i]);
					}
				}
				return str;
			};
		});

		$e('base.formatter.date',function(){
			return function (date,fomatter){
				if(!date){
					return '';
				}
				if(typeof date === 'string'){
					date = new Date(date);
				}
				fomatter = fomatter || 'yyyy-MM-dd HH:mm:ss';
				return fomatter.
				replace('YYYY',repair(date.getFullYear(),4)).
				replace('yyyy',repair(date.getFullYear(),4)).
				replace('MM',repair(date.getMonth() + 1,2)).
				replace('DD',repair(date.getDate(),2)).
				replace('dd',repair(date.getDate(),2)).
				replace('HH',repair(date.getHours(),2)).
				replace('hh',date.getHours()>12?('PM '+repair(date.getHours()-12,2)):('AM '+repair(date.getHours(),2))).
				replace('mm',repair(date.getMinutes(),2)).
				replace('ss',repair(date.getSeconds(),2)).
				replace('fff',repair(date.getMilliseconds(),3));
				function repair(value,place,char){
					value = '' + value;
					while(value.length < place){
						value = (char||0) + value;
					}
					return value;
				}
			};
		});

		$e('base.extend',function(){
			return function(obj){
				obj = obj ||{};
				for(var i =1;i<arguments.length;i++){
					/* jshint -W089*/
					for(var pro in arguments[i]){
						obj[pro] = arguments[i][pro];
					}
				}
				return obj;
			};
		});

		$e('base.value',function(){
			return function(obj,field,value){
				var fields = field.split('.');
				while(fields.length > 1){
					obj = obj[fields.shift()] || {};
				}
				if(value){
					obj[fields.shift()] = value;
				}else{
					return obj[fields.shift()];
				}
			};
		});

		$e('base.each',function(){
			return function(list,func){
				var result = [];
				if(typeof func === 'string'){
					var field = func;
					func = function(item){
						return $e('base.value')(item,field);
					};
				}
				if(list instanceof Array || (list && typeof list.length === 'number' &&typeof list !== 'function')){
					for(var i=0;i<list.length;i++){
						result.push(func(list[i],i,list));
					}
				}else if(list && typeof list ===  'object'){
					/* jshint -W089*/
					for(var pro in list){
						result.push(func(list[pro],pro,list));
					}
				}else if(typeof list === 'number'){
					for(var j=0;j<list;j++){
						result.push(func(j,j,list));
					}
				}
				return result;
			};
		});

		$e('base.filter',function(){
			return function(list,func,to,index){
				var result = [];
				if(typeof to === 'number'){
					index = to;
					to = null;
				}
				if(to === true){
					result = {};
					index = null;
					to = null;
				}
				if(index === true){
					result = {};
					index = null;
				}
				to = to || function(t){return t;};
				if(typeof to === 'string'){
					var field = to;
					to = function(item){
						return $e('base.value')(item,field);
					};
				}

				if(list && typeof list.length === 'number' && typeof list !==  'function'){
					for(var i=0;i<list.length;i++){
						if(func(list[i],i,list)){
							if(result instanceof Array){
								result.push(to(list[i],i,list));
							}else{
								result[i] = (to(list[i],i,list));
							}
						}
					}
				}else if(list && (typeof list ===  'object' || typeof list ===  'function')){
					/* jshint -W089*/
					for(var pro in list){
						if(func(list[pro],pro,list)){

							if(result instanceof Array){
								result.push(to(list[pro],pro,list));
							}else{
								result[pro] = (to(list[pro],pro,list));
							}
						}
					}
				}
				if(typeof index === 'number'){
					while(result.length && index < 0){
						index += result.length;
					}
					return result&&result[index];
				}
				return result;
			};
		});

		$e('base.some',function(){
			return function(list,func){
				if(list instanceof Array || (list && typeof list.length === 'number' &&typeof list !== 'function')){
					for(var i=0;i<list.length;i++){
						if(func(list[i],i,list)){
							return true;
						}
					}
				}else if(list && typeof list ===  'object'){
					/* jshint -W089*/
					for(var pro in list){
						if(func(list[pro],pro,list)){
							return true;
						}
					}
				}
				return false;
			};
		});

		$e('base.max',function(){
			return function(list,func){
				var newList = $e('base.each')(list,func);
				var max = newList[0];
				for(var i=0;i<newList.length;i++){
					if(newList[i]>max){
						max = newList[i];
					}
				}
				return max;
			};
		});

		$e('base.sum',function(){
			return function(list,func){
				var newList = $e('base.each')(list,func);
				var sum = newList[0];
				for(var i=1;i<newList.length;i++){
					sum += newList[i];
				}
				return sum;
			};
		});

		$e('base.distinct',function(){
			return function(list,func){
				var result = [];
				func = func || function(i){return i;};
				$e('base.each')(list,function(item){
					if(!$e('base.some')(result,function(i){return func(i) === func(item);})){
						result.push(item);
					}
				});
				return result;
			};
		});

		$e('base.together',function(){
			return function(list,func,sum){
				sum = sum || func();
				$e('base.each')(list,function(value,pro){
					sum = func(sum,value,pro);
				});
				return sum;
			};
		});

		$e('base.link',function(){
			var defineProp = function ($item,link,prop,linkProp) {
				var getValue = $e('base.value');
				linkProp = linkProp || prop;
				Object.defineProperty($item, prop, {
					get: function(){
						if(typeof linkProp === 'function'){
							return linkProp();
						}else{
							return link[linkProp];
						}
					},
					set: function(value){
						if(typeof linkProp === 'string'){
							link[linkProp] = value;
						}
					},
					enumerable: true,
					configurable: true
				});
			};
			return function(backItem){
				var result = backItem;
				if(typeof arguments[1] === 'string' && typeof arguments[2] === 'function'){
					defineProp(result,null,arguments[1],arguments[2]);
				}else{
					for(var i=1;i<arguments.length;i++){
						/* jshint -W089*/
						for(var pro in arguments[i]){
							defineProp(result,arguments[i],pro);
						}
					}
				}

				return result;
			};
		});

		$e('base.touch',function(){
			return function(rect1,rect2){
				var result = false;
				result = !result && check(rect1,{x:rect2.left,y:rect2.top});
				result = !result && check(rect1,{x:rect2.left,y:rect2.top + rect2.height});
				result = !result && check(rect1,{x:rect2.left + rect2.width,y:rect2.top});
				result = !result && check(rect1,{x:rect2.left + rect2.width,y:rect2.top + rect2.height});
				return result;
			};

			function check(rect,point){
				return point.x > rect.left && point.x < rect.left + rect.width &&
					point.y > rect.top && point.y < rect.top + rect.height;
			}
		});

		$e('base.app',{width:function(){
			return document.body.scrollWidth;
		},height:function(){
			return document.body.scrollHeight || document.documentElement.clientHeight;
		}});

		$e('base.open',function(){
			return function(url,setting,name){
				var appSize = $e('base.app');
				setting = (typeof(setting)==='string'?setting:'') || 'width=@width@,height=@height@,@other@'.replace('@width@',appSize.width()*0.9).replace('@height@',appSize.height()*0.9)
						.replace('@other@',setting===true?'menubar=yes':'location=no');
				window.open(url,name, setting);
			};
		});

		$e('base.point',function(){
			return function(point,size){
				var appSize = $e('base.app');
				if(point.clientX + size.width > appSize.width()){
					point.clientX  = appSize.width() - size.width - 10;
				}
				if(point.clientY + size.height > appSize.height() -20){
					point.clientY =  appSize.height() - size.height - 30;
				}
				return point;
			};
		});

		$e('base.run',function(){
			return function(text){
				try{
					/* jshint -W061 */
					window.eval(text);
				}catch(e) {

				}
			};
		});

		$e('base.keyCodes',function(){
			// Common KeyCodes
			return {
				BACKSPACE: 8,
				TAB: 9,
				ENTER: 13,
				SHIFT: 16,
				CTRL: 17,
				ALT: 18,
				PAUSE: 19,
				CAPS_LOCK: 20,
				ESCAPE: 27,
				SPACE: 32,
				PAGE_UP: 33,
				PAGE_DOWN: 34,
				END: 35,
				HOME: 36,
				LEFT: 37,
				UP: 38,
				RIGHT: 39,
				DOWN: 40,
				INSERT: 45,
				DELETE: 46,
				KEY_0: 48,
				KEY_1: 49,
				KEY_2: 50,
				KEY_3: 51,
				KEY_4: 52,
				KEY_5: 53,
				KEY_6: 54,
				KEY_7: 55,
				KEY_8: 56,
				KEY_9: 57,
				KEY_A: 65,
				KEY_B: 66,
				KEY_C: 67,
				KEY_D: 68,
				KEY_E: 69,
				KEY_F: 70,
				KEY_G: 71,
				KEY_H: 72,
				KEY_I: 73,
				KEY_J: 74,
				KEY_K: 75,
				KEY_L: 76,
				KEY_M: 77,
				KEY_N: 78,
				KEY_O: 79,
				KEY_P: 80,
				KEY_Q: 81,
				KEY_R: 82,
				KEY_S: 83,
				KEY_T: 84,
				KEY_U: 85,
				KEY_V: 86,
				KEY_W: 87,
				KEY_X: 88,
				KEY_Y: 89,
				KEY_Z: 90,
				LEFT_META: 91,
				RIGHT_META: 92,
				SELECT: 93,
				NUM_0: 96,
				NUM_1: 97,
				NUM_2: 98,
				NUM_3: 99,
				NUM_4: 100,
				NUM_5: 101,
				NUM_6: 102,
				NUM_7: 103,
				NUM_8: 104,
				NUM_9: 105,
				NUM_ADD: 107,
				NUM_DECIMAL: 110,
				NUM_DIVIDE: 111,
				NUM_ENTER: 108,
				NUM_MULTIPLY: 106,
				NUM_SUBTRACT: 109,
				F1: 112,
				F2: 113,
				F3: 114,
				F4: 115,
				F5: 116,
				F6: 117,
				F7: 118,
				F8: 119,
				F9: 120,
				F10: 121,
				F11: 122,
				F12: 123,
				NUM_LOCK: 144,
				SCROLL_LOCK: 145,
				SEMICOLON: 186,
				EQUALS: 187,
				COMMA: 188,
				DASH: 189,
				PERIOD: 190,
				SLASH: 191,
				GRAVE_ACCENT: 192,
				OPEN_BRACKET: 219,
				BACKSLASH: 220,
				CLOSE_BRACKET: 221,
				SINGLE_QUOTE: 222
			};
		});

		$e('base.watch',function(){
			return function(){

			};
		});

		$e('base.md5',function(){
			return function md5(string){
				function md5_RotateLeft(lValue, iShiftBits) {
					/* jshint -W016 */
					return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
				}
				function md5_AddUnsigned(lX,lY){
					var lX4,lY4,lX8,lY8,lResult;
					/* jshint -W016 */
					lX8 = (lX & 0x80000000);
					lY8 = (lY & 0x80000000);
					lX4 = (lX & 0x40000000);
					lY4 = (lY & 0x40000000);
					lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
					if (lX4 & lY4) {
						return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
					}
					if (lX4 | lY4) {
						if (lResult & 0x40000000) {
							return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
						} else {
							return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
						}
					} else {
						return (lResult ^ lX8 ^ lY8);
					}
				}

				function md5_F(x,y,z){
					/* jshint -W016 */
                    /* jshint -W052 */
					return (x & y) | ((~x) & z);
				}
				function md5_G(x,y,z){
					/* jshint -W016 */
                    /* jshint -W052 */
					return (x & z) | (y & (~z));
				}
				function md5_H(x,y,z){
					/* jshint -W016 */
					return (x ^ y ^ z);
				}
				function md5_I(x,y,z){
					/* jshint -W016 */
                    /* jshint -W052 */
					return (y ^ (x | (~z)));
				}
				function md5_FF(a,b,c,d,x,s,ac){
					a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
					return md5_AddUnsigned(md5_RotateLeft(a, s), b);
				}
				function md5_GG(a,b,c,d,x,s,ac){
					a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
					return md5_AddUnsigned(md5_RotateLeft(a, s), b);
				}
				function md5_HH(a,b,c,d,x,s,ac){
					a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
					return md5_AddUnsigned(md5_RotateLeft(a, s), b);
				}
				function md5_II(a,b,c,d,x,s,ac){
					a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
					return md5_AddUnsigned(md5_RotateLeft(a, s), b);
				}
				function md5_ConvertToWordArray(string) {
					var lWordCount;
					var lMessageLength = string.length;
					var lNumberOfWords_temp1=lMessageLength + 8;
					var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
					var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
					var lWordArray=new Array(lNumberOfWords-1);
					var lBytePosition = 0;
					var lByteCount = 0;
					/* jshint -W016 */
					while ( lByteCount < lMessageLength ) {
						lWordCount = (lByteCount-(lByteCount % 4))/4;
						lBytePosition = (lByteCount % 4)*8;
						lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
						lByteCount++;
					}
					lWordCount = (lByteCount-(lByteCount % 4))/4;
					lBytePosition = (lByteCount % 4)*8;
					lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
					lWordArray[lNumberOfWords-2] = lMessageLength<<3;
					lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
					return lWordArray;
				}
				function md5_WordToHex(lValue){
					var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
					/* jshint -W016 */
					for(lCount = 0;lCount<=3;lCount++){
						lByte = (lValue>>>(lCount*8)) & 255;
						WordToHexValue_temp = "0" + lByte.toString(16);
						WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
					}
					return WordToHexValue;
				}
				function md5_Utf8Encode(string){
					string = string.replace(/\r\n/g,"\n");
					var utftext = "";
					/* jshint -W016 */
					for (var n = 0; n < string.length; n++) {
						var c = string.charCodeAt(n);
						if (c < 128) {
							utftext += String.fromCharCode(c);
						}else if((c > 127) && (c < 2048)) {
							utftext += String.fromCharCode((c >> 6) | 192);
							utftext += String.fromCharCode((c & 63) | 128);
						} else {
							utftext += String.fromCharCode((c >> 12) | 224);
							utftext += String.fromCharCode(((c >> 6) & 63) | 128);
							utftext += String.fromCharCode((c & 63) | 128);
						}
					}
					return utftext;
				}
				var x= [];
				var k,AA,BB,CC,DD,a,b,c,d;
				var S11=7, S12=12, S13=17, S14=22;
				var S21=5, S22=9 , S23=14, S24=20;
				var S31=4, S32=11, S33=16, S34=23;
				var S41=6, S42=10, S43=15, S44=21;
				string = md5_Utf8Encode(string);
				x = md5_ConvertToWordArray(string);
				a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
				for (k=0;k<x.length;k+=16) {
					AA=a; BB=b; CC=c; DD=d;
					a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
					d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
					c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
					b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
					a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
					d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
					c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
					b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
					a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
					d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
					c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
					b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
					a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
					d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
					c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
					b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
					a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
					d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
					c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
					b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
					a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
					d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
					c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
					b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
					a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
					d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
					c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
					b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
					a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
					d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
					c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
					b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
					a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
					d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
					c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
					b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
					a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
					d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
					c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
					b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
					a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
					d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
					c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
					b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
					a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
					d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
					c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
					b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
					a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
					d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
					c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
					b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
					a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
					d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
					c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
					b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
					a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
					d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
					c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
					b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
					a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
					d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
					c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
					b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
					a=md5_AddUnsigned(a,AA);
					b=md5_AddUnsigned(b,BB);
					c=md5_AddUnsigned(c,CC);
					d=md5_AddUnsigned(d,DD);
				}
				return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
			};
		});

		$e('base.toXml',function(){
			return function(data){
				var str = '';
				$e('base.each')(data,function(value){
					var item = '';
					var name = value.title;
					while(/ /.test(name)){
						name = name.replace(' ','');
					}
					$e('base.each')(value,function(v,k){
						item += '<'+k+'>'+v+'</'+k+'>\n';
					});
					str +=  '<'+name+'>\n'+item+'</'+name+'>\n';
				});
				return str;
			};
		});

		$e('base.base64',function(){
			var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
			var base64DecodeChars = new Array(
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
				-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
				52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
				-1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
				15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
				-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
				41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
			return function(str){
				if(/^base64:.*/.test(str)){
					return base64decode(str.replace('base64:',''));
				}else{
					return base64encode(str);
				}
			};

			function base64encode(str) {
				var out, i, len;
				var c1, c2, c3;

				len = str.length;
				i = 0;
				out = "";
				while(i < len) {
					/* jshint -W016 */
					c1 = str.charCodeAt(i++) & 0xff;
					if(i === len)
					{
						out += base64EncodeChars.charAt(c1 >> 2);
						out += base64EncodeChars.charAt((c1 & 0x3) << 4);
						out += "==";
						break;
					}
					c2 = str.charCodeAt(i++);
					if(i === len)
					{
						out += base64EncodeChars.charAt(c1 >> 2);
						out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
						out += base64EncodeChars.charAt((c2 & 0xF) << 2);
						out += "=";
						break;
					}
					c3 = str.charCodeAt(i++);
					out += base64EncodeChars.charAt(c1 >> 2);
					out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
					out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
					out += base64EncodeChars.charAt(c3 & 0x3F);
				}
				return out;
			}

			function base64decode(str) {
				var c1, c2, c3, c4;
				var i, len, out;

				len = str.length;
				i = 0;
				out = "";
				while(i < len) {
					/* jshint -W016 */
					/* c1 */
					do {
						c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
					} while(i < len && c1 === -1);
					if(c1 === -1){
						break;
					}
					/* c2 */
					do {
						c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
					} while(i < len && c2 === -1);
					if(c2 === -1)
					{break;}

					out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

					/* c3 */
					do {
						c3 = str.charCodeAt(i++) & 0xff;
						if(c3 === 61){
							return out;
						}
						c3 = base64DecodeChars[c3];
					} while(i < len && c3 === -1);
					if(c3 === -1)
					{break;}

					out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

					/* c4 */
					do {
						c4 = str.charCodeAt(i++) & 0xff;
						if(c4 === 61){
							return out;
						}
						c4 = base64DecodeChars[c4];
					} while(i < len && c4 === -1);
					if(c4 === -1){
						break;
					}
					out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
				}
				return out;
			}
		});

	})($e$);

	/*ehuanrum<controls>*/
	(function($){

		$('controls.vector',function(base){
			function Vector(){}
			return function(point1,point2){
				var dx = point1.clientX - point2.clientX,
					dy = point1.clientY - point2.clientY;
				return base.extend(new Vector(),{
					dx:dx,
					dy:dy,
					length:Math.sqrt(dx*dx+dy*dy)
				});
			};
		});

		$('controls.scope',function(base){
			var index = 0,scopes = [];
			function Scope(key){
				var events = {};
				this.id = index++;
				this.event = function(types,func){
					var self = this,parms = [];
					for(var i=1;i<arguments.length;i++){
						parms.push(arguments[i]);
					}
					base.each(types.split(','),function(type){
						var list = events[type] = events[type] || [];
						if(typeof func === 'function'){
							list.push(func);
						}else{
							base.each(list,function(item){
								item.apply(self,parms);
							});
						}
					});
				};
				scopes.push(this);
			}
			Scope.all = scopes;
			Scope.prototype.remove = function(){
				scopes.remove(this);
			};
			return Scope;
		});

		$('controls.dialog',function(base,$q,controls_scope){

			var Scope = controls_scope,zindex = 0;
			return function(controller){
				var $promise = $q.promise();
				var $scope = new Scope();
				var dialog = document.createElement('div');
				var header = document.createElement('div');
				var content = document.createElement('div');
				var footer = document.createElement('div');
				dialog.className = 'ehuanrum-controls-dialog';
				header.className = 'ehuanrum-controls-dialog-header';
				content.className = 'ehuanrum-controls-dialog-content';
				footer.className = 'ehuanrum-controls-dialog-footer';
				dialog.appendChild(header);
				dialog.appendChild(content);
				dialog.appendChild(footer);

				$scope.canMove = true;
				$scope.handle = $q.ehrCache(dialog,'controls.dialog');
				$scope.$close = $promise.resolve;
				$scope.$then = $promise.then;
				$scope.topside = aboutZindex(dialog);
				if(typeof controller === 'function'){
					runContent(controller,$scope,$promise,dialog,header,content,footer);
					if($scope.width){
						dialog.style.width = $scope.width+3.6 + 'px';
					}
					if($scope.height){
						content.style.height = $scope.height+3.6 + 'px';
					}
					if($scope.topside){
						dialog.addEventListener('click',$scope.topside);
					}
					if($scope.modal){
						$scope.shade = document.createElement('div');
						$scope.shade.className = 'ehuanrum-controls-dialog-shade';
						window.document.body.appendChild($scope.shade);
						$promise.then(function(){
							if($scope.shade){
								window.document.body.removeChild($scope.shade);
							}
						});
					}

				}

				$scope.modalUpdate = function(modal){
					$scope.modal = modal;
					if($scope.modal){
						if(!$scope.shade){
							$scope.shade = document.createElement('div');
							$scope.shade.className = 'ehuanrum-controls-dialog-shade';
							$promise.then(function(){
								if($scope.shade){
									window.document.body.removeChild($scope.shade);
								}
							});
						}
						if(window.document.body.contains($scope.shade)){
							window.document.body.removeChild($scope.shade);
						}
						window.document.body.appendChild($scope.shade);
					}
				};

				$scope.update = function(){
					fillHeader($scope,header);
					fillContent($scope,content);
					if($scope.width){
						dialog.style.width = $scope.width+3.6 + 'px';
					}
					if($scope.height){
						content.style.height = $scope.height+3.6 + 'px';
					}
					fillContent($scope,content);
					if($scope.simplified){
						header.innerHTML = '';
						footer.innerHTML = '';
						header.style.height = 0;
						footer.style.height = 0;
						drag($scope,dialog,dialog);
					}else{
						drag($scope,dialog,$scope.simplified?dialog:header);
					}
					$scope.event('resize');
				};
				$scope.$max = function(){
					if($scope.noCanMax){return;}
					dialog.isMax = !dialog.isMax;
					if(dialog.isMax){
						$scope.canMove = false;
						$scope.width = content.clientWidth - 3.6;
						$scope.height =  content.offsetHeight - 3.6;
						$scope.position = {x:dialog.style.left,y:dialog.style.top};
						dialog.style.left = '0';
						dialog.style.top = '0';
						if($scope.maxWidth){
							dialog.style.width = $scope.maxWidth + 'px';
						}
						if($scope.maxHeight){
							content.style.height = $scope.maxHeight + 'px';
						}
					}else{
						$scope.canMove = true;
						if($scope.position){
							dialog.style.left = $scope.position.x;
							dialog.style.top = $scope.position.y;
						}
						if($scope.width){
							dialog.style.width = $scope.width+3.6 + 'px';
						}
						if($scope.height){
							content.style.height = $scope.height+3.6 + 'px';
						}
					}
					$scope.event('resize');
				};

				if($scope.simplified){
					header.style.height = 0;
					footer.style.height = 0;
					fillContent($scope,content);
					drag($scope,dialog,dialog);
				}else{
					dialog.style.padding = '5px';
					dialog.style.background = '#2e83ff';
					content.style.background = '#ffffff';
					fillHeader($scope,header);
					fillContent($scope,content);
					fillFooter($scope,footer);
					drag($scope,dialog,header);
					resize($scope,dialog,content);
				}
				return $promise;
			};

			function aboutZindex($dialog){
				updateZindex();
				$dialog.onclick = updateZindex;
				function updateZindex(){
					var $zindex = parseFloat($dialog.style.zIndex);
					if(!$zindex || $zindex <zindex){
						zindex++;
					}
					$dialog.style.zIndex = zindex;
				}
				return updateZindex;
			}

			function runContent(controller,$scope,$promise,dialog,header,content,footer){
				var str = controller.toLocaleString().slice(controller.toLocaleString().indexOf('(')+1,controller.toLocaleString().indexOf(')'));
				var parameters = str?str.split(','):[];
				for(var i=0;i<parameters.length;i++){
					if(parameters[i].trim().toLocaleLowerCase() === '$scope' || parameters[i].trim().toLocaleLowerCase() === 'scope'){
						parameters[i] = $scope;
					}else if(parameters[i].trim().toLocaleLowerCase() === 'dialogelement' || parameters[i].trim().toLocaleLowerCase() === 'dialog'){
						parameters[i] = dialog;
					}else if(parameters[i].trim().toLocaleLowerCase() === 'headerelement'){
						parameters[i] = header;
					}else if(parameters[i].trim().toLocaleLowerCase() === 'contentelement'){
						parameters[i] = content;
					}else if(parameters[i].trim().toLocaleLowerCase() === 'footerelement'){
						parameters[i] = footer;
					}else if(parameters[i].trim().toLocaleLowerCase() === '$promise'){
						parameters[i] = $promise;
					}else{
						parameters[i] = $(parameters[i].trim());
					}
				}
				return controller.apply($scope,parameters);
			}

			function fillHeader(scope,element){
				var title = document.createElement('div');
				var buttons = document.createElement('div');
				title.className = 'ehuanrum-controls-dialog-header-title';
				buttons.className = 'ehuanrum-controls-dialog-header-buttons';
				element.innerHTML = '';
				element.appendChild(title);
				element.appendChild(buttons);

				title.innerHTML = scope.title || '- Dialog -';
				fillHeaderButtons(buttons,scope.header && scope.header.buttons);
				element.ondblclick = scope.$max;

				function fillHeaderButtons(parent,items){
					if(items){
						if(!scope.noCanMax && !base.some(items,function(i){return i.name === 'o';})){
							items.push(function o(e){scope.$max(e);});
						}
					}else{
						items = [];
					}

					if(!base.some(items,function(i){return i.name === 'x';})){
						items.push(function x(e){scope.$close(e);});
					}

					if(!scope.modal){
						for(var i=0;i<items.length;i++){
							buttons.appendChild(createButton(items[i]));
						}
					}else{
						scope.noCanMax = true;
					}
				}
				function createButton(item){
					var name = item.name || item.toString().replace(/function\s?/mi,"").split("(").shift();
					var min = document.createElement('div');
					min.innerHTML = name;
					min.className = 'ehuanrum-controls-dialog-header-buttons-item';
					min.onclick = function(e){
						(item.fn || item)(e);
						scope.event(name);
					};
					return min;
				}
			}
			function fillContent(scope,element){
				if(Object.getOwnPropertyNames(scope).length>1){
					element.innerHTML = '';
				}
				if(!scope.content){
					return ;
				}
				if(typeof scope.content === 'string'){
					element.innerHTML = scope.content || '';
				}else if(typeof scope.content === 'function'){
					scope.content(element);
				}else if(scope.content instanceof HTMLElement){
					element.appendChild(scope.content);
				}else if(scope.content instanceof Array){
					base.each(scope.content,function(i){fillContent({content:i},element);});
				}

			}
			function fillFooter(scope,element){
				if(Object.getOwnPropertyNames(scope).length>1){
					element.innerHTML = '';
				}
				if(!scope.footer){
					return ;
				}
				if(typeof scope.footer === 'string'){
					element.innerHTML = scope.footer || '';
				}else if(typeof scope.footer === 'function'){
					scope.footer(element);
				}else if(scope.footer instanceof HTMLElement){
					element.appendChild(scope.footer);
				}else if(scope.footer instanceof Array){
					base.each(scope.footer,function(i){fillFooter({footer:i},element);});
				}else{
					base.each(scope.footer,function(value,title){
						var button = document.createElement('button');
						button.innerHTML = title[0].toLocaleUpperCase()+title.slice(1);
						button.className = 'ehuanrum-controls-dialog-footer-buttons-item';
						element.appendChild(button);
						button.onclick = function(){
							if(typeof value === 'function'){
								value(scope);
							}
							scope.$close(!!value);
						};
					});
				}
			}

			function drag(scope,dialog,header){
				var temp = {};
				header.addEventListener('mousedown',function(e){
					if(scope.canMove) {
						temp.move = true;
						temp.e = e;
						temp.x = e.clientX - parseInt(dialog.style.left);
						temp.y = e.clientY - parseInt(dialog.style.top);
						header.style.cursor = 'move';
						window.document.body.addEventListener('mousemove',mousemove);
					}
				});
				header.addEventListener('mouseup',function(e){
					temp.move = false;
					header.style.cursor = 'default';
					scope.event('move',$('controls.vector')(e,temp.e || e));
					window.document.body.removeEventListener('mousemove',mousemove);
				});

			function mousemove(e){
					if(temp.move){
						dialog.style.left = e.clientX - temp.x + 'px';
						dialog.style.top = e.clientY - temp.y + 'px';
					}
				}
			}

			function resize(scope,dialog,content){
				var temp = {resize:0};
				dialog.addEventListener('mousedown',function(e){
					temp.e = e;
					temp.resize = getResize(e);
					window.document.body.addEventListener('mousemove',mousemove);
				});
				dialog.addEventListener('mouseup',function(e){
					temp.resize = 0;
					dialog.style.cursor = 'default';
					scope.event('resize',$('controls.vector')(e,temp.e || e));
					window.document.body.removeEventListener('mousemove',mousemove);
				});
				dialog.addEventListener('mouseenter',function(e){
					switch (getResize(e)){
						case 0:
							dialog.style.cursor = 'default';
							break;
						case 1:
							dialog.style.cursor = 'e-resize';
							break;
						case 2:
							dialog.style.cursor = 'w-resize';
							break;
						case 4:
							dialog.style.cursor = 'n-resize';
							break;
						case 8:
							dialog.style.cursor = 's-resize';
							break;
						case 5:
							dialog.style.cursor = 'nw-resize';
							break;
						case 6:
							dialog.style.cursor = 'ne-resize';
							break;
						case 9:
							dialog.style.cursor = 'nesw-resize';
							break;
						case 10:
							dialog.style.cursor = 'nwse-resize';
							break;
					}
				});

				function mousemove(e){
					var vector = $('controls.vector')(e,temp.e || e);
					temp.e = e;
					if(collation(1)){
						dialog.style.width = parseInt(dialog.style.width) - vector.dx +'px';
						dialog.style.left = parseInt(dialog.style.left) + vector.dx +'px';
					}
					if(collation(2)){
						dialog.style.width = parseInt(dialog.style.width) + vector.dx +'px';
					}
					if(collation(4)){
						content.style.height = parseInt(content.style.height) - vector.dy +'px';
						dialog.style.top = parseInt(dialog.style.top) + vector.dy +'px';
					}
					if(collation(8)){
						content.style.height = parseInt(content.style.height) + vector.dy +'px';
					}
				}

				function collation(num){
					/* jshint -W016 */
					return temp.resize & num;
				}

				function or(result,num){
					/* jshint -W016 */
					return result | num;
				}

				function getResize(e,range){
					var dialog = e.target,result = 0;
					range = range || 10;
					if(e.clientX - parseInt(dialog.style.left) < range){
						result = 1;
					}
					if(e.clientX - parseInt(dialog.style.left) - dialog.clientWidth > -range){
						result = 2;
					}
					if(e.clientY - parseInt(dialog.style.top) < range){
						result = or(result , 4);
					}
					if(e.clientY - parseInt(dialog.style.top) - dialog.clientHeight > -range){
						result = or(result , 8);
					}
					return result;
				}

			}
		});

		$('controls.tooltip',function(base){
			return function(message,$class){
				var $message = document.createElement('div');
				$message.className = $class || 'ehuanrum-controls-tooltip';
				(function fillFooter(content,ele){
					if(!content){
						return ;
					}
					if(typeof content === 'string'){
						ele.innerHTML = content || '';
					}else if(typeof content === 'function'){
						content(ele);
					}else if(content instanceof HTMLElement){
						ele.appendChild(content);
					}else if(content instanceof Array){
						base.each(content,function(i){fillFooter(i,ele);});
					}
				})(message,$message);
				return {
					in:function(e){
						if(!document.body.contains($message)){
							document.body.appendChild($message);
							var point = base.point(e,{width:$message.offsetWidth,height:$message.offsetHeight});
							$message.style.left = e.clientX + 'px';
							$message.style.top = e.clientY + 'px';
						}
					},
					out:function(){
						if(document.body.contains($message)){
							document.body.removeChild($message);
						}
					}
				};
			};
		});

		$('controls.helper', function(){
			return function(related,onselect){
				var helper =  document.createElement('ul');
				helper.style.position = 'fixed';
				helper.style.background = '#dddddd';
				helper.style.cursor = 'pointer';
				helper.style.maxHeight = '25em';
				helper.style.overflow = 'auto';
				helper.show = show;
				return helper;

				function show(serach,messages,info){
					var parent = related.offsetParent || related;
					var lenght =  (related.value.match(/\n/g)||[]).length * parent.offsetWidth + (related.value.length - related.value.lastIndexOf('\n')) * 6.8 ;
					helper.style.left = parent.offsetLeft + related.offsetLeft +(lenght % parent.offsetWidth) +'px';
					helper.style.top = parent.offsetTop + related.offsetTop +(Math.floor(lenght / parent.offsetWidth)*15)+ 'px';
					helper.style.listStyleType = 'none';
					helper.style.padding = '1px';
					helper.innerHTML = info || '';
					if(!messages || !messages.length || (messages.length === 1 && serach === messages[0])){
						helper.style.display = 'none';
					}else{
						for(var i=0;i<messages.length;i++){
							createItem(messages[i]);
						}
						helper.style.display = 'block';
					}
					helper.focus();

					function createItem(message){
						var item =  document.createElement('li');
						item.innerHTML = message;
						item.style.color = '#6666ff';
						item.style.margin = '2px';
						helper.appendChild(item);
						item.onclick = function(){
							if(onselect){
								onselect(related,serach,message);
							}else{
								related.value = related.value.slice(0,related.value.length-serach.length) + message +' ';
							}
							helper.style.display = 'none';
							related.focus();
						};
						item.onmouseenter = function(){
							item.style.opacity = 0.6;
							item.style.color = '#ffffff';
							item.style.background = '#3333ff';
						};
						item.onmouseleave = function(){
							item.style.opacity = 1.0;
							item.style.color = '#6666ff';
							item.style.background = 'none';
						};
					}
				}
			};
		});

		$('controls.grid', function() {
			return function(data, option,cellClick) {
				if(typeof option === 'function'){
					cellClick = option;
					option = null;
				}
				
				option = $('base.extend')({minWidth:120,maxWidth:200,height:22,cellCenter:true,showTooltip:false,showToolbar:false},option||{});
				
				cellClick = cellClick || function () {};

				while(/[\n\r]/.test(data)){
					data = data.replace(/[\n\r]/,'');
				}
				while(typeof data === 'string'){
					data = JSON.parse(data);
				}


				var active = {};
				var $columns = getColumns(data,option.columns,option.showToolbar);
				var grid = document.createElement('div');
				var header = document.createElement('div');
				var content = document.createElement('div');
				var width = $('base.sum')($columns, function (colum) {return colum.width + 2;});
				$('base.each')($columns, function (column) {
					if(!column.show){return ;}
					var headerItem = document.createElement('div');
					headerItem.innerHTML = $('base.hump')($('base.translate')(column.title,column.name));
					headerItem.style.width = column.width + 'px';
					headerItem.style.display = 'inline-block';
					headerItem.style.border = '1px solid #999999';
					headerItem.style.fontSize = '1.5em';
					headerItem.style.textAlign = 'center';
					hover(headerItem, $('base.translate')(column.tooltip),{background: '#666666', color: '#ffffff'});
					force(headerItem, column, null);
					header.appendChild(headerItem);
				});
				
				
				
				$('base.each')(data, function (item,index) {
					var row = document.createElement('div');
					row.style.background = (index%2)?'#dddddd':'';
					row.style.width = width +'px';
					row.style.height = option && option.height?(option.height+'px'):'';
					if((item.id||item.Id||item.iD||item.ID) || !('id' in item||'Id' in item||'iD' in item||'ID' in item)){
						$('base.each')($columns, function (column) {
							if(!column.show){return ;}
							var cell = document.createElement('div');
							cell.style.width = column.width + 'px';
							cell.style.height = '100%';
							cell.style.display = 'inline-block';
							cell.style.border = '1px solid #999999';
							cell.style.overflow = 'hidden';
							cell.style.textOverflow = 'ellipsis';
							cell.style.textAlign = option.cellCenter&&'center';
							cell.className = 'ehr-grid-cell';
							addpendChild(cell,column.formatter(item));
							row.appendChild(cell);
							hover(cell, option.showTooltip && item[column.field],{background: '#666666', color: '#ffffff'});
							force(cell, column, item);
						});
					}else{
						var help = document.createElement('div');
						help.style.textAlign = 'center';
						help.style.opacity = 0.6;
						help.style.padding = '4px';
						help.innerHTML = $('base.translate')(['','双击新增数据'],'Double click to add new');
						force(help, {name:'--'}, item);
						row.appendChild(help);
					}
					
					row.className = 'ehr-grid-row';
					content.appendChild(row);
					hover(row, null,{background: '#aaaadd'});
				});
				
				
				header.style.fontWeight = 'bold';
				header.style.borderBottom = '1px solid #333333';
				header.style.background = '#333399';
				header.style.color = '#ffffff';
				header.style.width = width + 'px';
				content.style.overflowX = 'auto';
				content.style.width = width + 'px';
				grid.style.border = '1px solid #333333';
				grid.style.width = width + 'px';
				grid.appendChild(header);
				grid.appendChild(content);
				header.className = 'ehr-grid-header';
				content.className = 'ehr-grid-content';
				grid.className = 'ehr-grid';
				setTimeout(function(){
					var contentHeight = $('base.sum')(content.childNodes,function(row){
							return row.offsetHeight ;
						}) + 22;
					content.style.height = contentHeight + 'px';
					grid.style.height = header.offsetHeight -20 +contentHeight + 'px';
				},100);
				return grid;
				
				function addpendChild(parent,children){
					if(children instanceof HTMLElement){
						parent.appendChild(children);
					}else if(children instanceof Array){
						$('base.each')(children,function(i){addpendChild(parent,i);});
					}else{
						parent.innerHTML = children;
					}
				}
				
				function getColumns(items,columns,showToolbar) {
					function Column(){}
					columns = columns || [];
					
					$('base.each')(columns,function(i){
						i.field = i.name&&(i.name[0].toLocaleLowerCase()+i.name.slice(1));
					});
					
					$('base.each')(data, function (item) {
						$('base.each')(item, function (value, pro) {
							if(option && option.hideId && pro === 'Id' ||/.*\$back$/.test(pro)){return;}
							var column = $('base.filter')(columns, function (column) {
								return column.field === pro;
							}, 0);
							var defaultFn = function(entity){return entity[column.field]; };
							if (!column) {
								column = $('base.extend')(new Column(),{name: pro,field:pro,show:true,formatter:defaultFn,getValue:defaultFn});
								columns.push(column);
							}
							
							if(value === true || value === false){
								column.type = 'boolean';
							}else if (value) {
								column.type = value.constructor.name.toLocaleLowerCase();
							}
							if(value === null || value === undefined){
								return;
							}
							switch (typeof item[column.field]){
								case 'function':
									column.formatter = function(entity){
										return '$Func: '+entity[column.field].name;
									};
									column.getValue = function(cell,entity){
										return entity[column.field];
									};
									break;
								case 'object':
									if(['Date'].indexOf(value.constructor.name) > -1){
										column.formatter = function(entity){
											return $('base.formatter.date')(entity[column.field]) || '';
										};
										column.getValue = function(cell){
											var input = cell.querySelector('input');
											return input&&input.value || cell.innerHTML;
										};
									}else if(['Array'].indexOf(value.constructor.name) > -1){
										column.formatter = function(entity){
											return entity[column.field].map(function(it){
												var select = column.selection && $('base.filter')(column.selection,function(i){return i.id === it;},0);
												return select?(select.name +(select.info?(' - '+select.info):'')):it || '';
											}).join(',');
										};
										column.getValue = function(cell){
											var input = cell.querySelector('input');
											return (input&&input.value || cell.innerHTML).split(',');
										};
									}else{
										column.formatter = function(entity){
											return entity[column.field]?'$Object: {***}':'';
										};
										column.getValue = function(cell,entity){
											return entity[column.field];
										};
									}
									break;
								default:
									if(column.type === 'boolean'){
										column.formatter = function(entity){
											return '<input type="checkbox" style="width: '+column.width+'px;" disabled="true" '+(entity[column.field]?'checked=true':'')+'>';
										};
										column.getValue = function(cell){
											return cell.querySelector('input').checked;
										};
									}else{
										column.formatter = function(entity){
											if(/.*Fk$/.test(column.field)){
												var select = column.selection && $('base.filter')(column.selection,function(i){return i.id === entity[column.field];},0);
												return select?(select.name +(select.info?(' - '+select.info):'')):entity[column.field] || '';
											}else if(entity[column.field] && /base64:.*/.test(''+entity[column.field])){
												return $('base.base64')(''+entity[column.field]);
											}else {
												return (entity[column.field] || entity[column.field] === 0)?entity[column.field] : '';
											}
										};
										column.getValue = function(cell){
											var input = cell.querySelector('input');
											return input&&input.value || cell.innerHTML;
										};
									}
									break;
							}
							
							column.width = Math.min(Math.max(Math.max(column.width || option && option.minWidth || 120, ('' + column.formatter(item)).length * 12, option && option.minWidth ||120),('' + ($('base.translate')(column.title,column.name))).length * 15),option && option.maxWidth ||300);
						});
					});
					//columns.push(addToolbar(showToolbar));
					
					return $('base.filter')(columns,function(i){return i.show;});
					
					function addToolbar(show){
						return {
							name:'',
							width:160,
							field:'',
							show:show,
							getValue:function(){},
							formatter:function(entity){
								var editButton = document.createElement('button'),deleteButton = document.createElement('button');
								var buttons = [editButton,deleteButton];
								editButton.innerHTML = $('base.translate')('Edit');
								deleteButton.innerHTML = $('base.translate')('Delete');
								editButton.style.margin = '2px 10px';
								deleteButton.style.margin = '2px 10px';
								editButton.onclick = editButtonClick(this,entity);
								deleteButton.onclick = deleteButtonClick(this,entity);
								return entity.id && buttons;
							}
						};
						
						function editButtonClick(column,item){
							return function(e){
								cellClick(e, {
									action:'edit',
									list: data,
									item: item,
									column: column,
									value: null
								});
							};
						}
						function deleteButtonClick(column,item){//$ehr.alert
							return function(e){
								$('controls.alert')($('base.translate')(['','你确定删除这条数据？'],'You can Delete the item?'),function(){
									cellClick(e, {
										action:'delete',
										list: data,
										item: item,
										column: column,
										value: null
									});
								});
							};
						}
					}
				}
				
				function hover(ele,value, styles) {
					var backStyles = {};
					var tooltip = {in:function(){},out:function(){}};
					if(value){
						value = ''+(value?(typeof value === 'object'?JSON.stringify(value):value):'');
						while(/[<>]/.test(value)){
							value = value.replace('<','&lt;').replace('>','&gt;');
						}
						if(!option || !option.hideTooltip || ele.className !== 'ehr-grid-cell'){
							tooltip = $('controls.tooltip')('<textarea readonly="true" style="width: 400px;height: 200px;">'+value+'</textarea>');
						}
					}
					ele.onmouseenter = function (e) {
						backStyles = {};
						tooltip.in(e);
						$('base.each')(styles, function (v, k) {
							backStyles[k] = ele.style[k];
						});
						$('base.extend')(ele.style, styles);
					};
					ele.onmouseleave = function () {
						tooltip.out();
						$('base.extend')(ele.style, backStyles);
					};
				}
				
				function force(cell, column, item) {
					if((!option || !option.readonly) && (column.update||(item && !item[column.field]))){
						cell.ondblclick = ondblclick;
						cell.onclick = onclick;
					}else{
						cell.ondblclick = onclick;
					}

					function getName(){
						return $('base.filter')(item,function(v,k){return k.toLocaleLowerCase() === 'name';},function(v){return '-'+v;},0);
					}

					function getValue(){
						if(item[column.field] && /base64:.*/.test(''+item[column.field])){
							return $('base.base64')(''+item[column.field]);
						}else{
							return item[column.field] || '';
						}
					}
					
					function onclick(e) {
						if(!column.field){return;}
						if(cell !== force.target){
							(force.onblur || function(){})();
						}
						if(column.field && 'function' === column.field.toLocaleLowerCase()){
							$('controls.function')(getValue(),column.field+ getName(),grid.parentNode,e);
							return ;
						}
						cellClick(e, {
							action:'edit',
							list: data,
							item: item,
							column: column,
							value: item && item[column.field]
						});
					}
					
					function ondblclick(e) {
						var input = document.createElement('input');
						if(/.*Fk$/.test(column.field)){
							input = document.createElement('select');
							$('base.each')(column.selection,function(select){
								var option = document.createElement('select');
								option.value = select.id;
								option.innerHTML = select.name +(select.info?(' - '+select.info):'');
								input.appendChild(option);
							});
						}else if(column.field && 'function' === column.field.toLocaleLowerCase()){
							$('controls.function')(getValue(),column.field + getName(),grid.parentNode,e);
							return ;
						}
						
						input.value = column.getValue(cell,item);
						if(column.type === 'boolean'){
							input.type = 'checkbox';
							input.checked = column.getValue(cell,item);
						}else{
							input.type = column.type;
						}
						input.style.width = (column.width - 5) + 'px';
						input.onblur = onblur;
						cell.innerHTML = '';
						cell.appendChild(input);
						cell.ondblclick = null;
						
						if(cell !== force.target){
							(force.onblur || function(){})();
							force.onblur = onblur;
							force.target = cell;
						}
					}
					
					function onblur() {
						item[column.field] = column.getValue(cell,item);
						cell.innerHTML = column.formatter(item);
						cell.ondblclick = ondblclick;
					}
				}
			};
		});

        $('controls.form',function(){
            return function(columns,entity,buttons) {
                var labelWidth = 200,inputWidth = 200;
                var types = {
                    string: 'text',
                    datetime: 'datetime-local',
                    int32: 'number',
                    double: 'number'
                };

                var panel = document.createElement('div');
                panel.className = 'edit-from-entering';
                panel.style.borderTop = '1px solid #999999';
                panel.style.padding = '2%';
                panel.style.overflow = 'hidden';
                panel.style.width = 60 + labelWidth + inputWidth +'px';
                panel.style.background = '#669966';


	            if(!(columns instanceof Array)){
		            entity = columns;
		            columns = $('base.each')(entity,function(v,k){
			            return {name:k,type:typeof v,show:true,update:false};
		            });
	            }

                $('base.filter')(columns, function (column) {
                        return column.show;
                    },
                    function (column) {
                        var row = document.createElement('div');
                        row.style.margin = '2% 2%';

                        var input, label = document.createElement('div');

                        if (column.regular && column.regular.length) {
                            label.innerHTML = $('base.hump')($('base.translate')(column.title,column.name)) + '<em style="color: red">**</em> ' ;
                        }else{
                            label.innerHTML = $('base.hump')($('base.translate')(column.title,column.name));
                        }
                        if (column.selection) {
                            input = document.createElement('select');
                            $('base.each')(column.selection, function (se) {
                                var option = document.createElement('option');
                                option.value = se.id || se;
                                option.innerHTML = (se.name || se) + (se.info?(' - '+se.info):'');
                                option.title = '<img src="'+se.icon + '">';
                                input.appendChild(option);
                            });
                        } else {
                            input = document.createElement('input');
                            input.type = types[column.type.toLocaleLowerCase()] || column.type.toLocaleLowerCase();
                        }

                        if(column.type.toLocaleLowerCase() === 'datetime'){
                            var value = entity[column.name[0].toLocaleLowerCase()+column.name.slice(1)] || new Date();
                            input.value =  repair(value.getFullYear(),4)+'-'+repair(value.getMonth() + 1,2)+'-'+repair(value.getDate(),2)+'T'+repair(value.getHours(),2)+':'+repair(value.getMinutes(),2)+':'+repair(value.getSeconds(),2);

                        }else{
                            input.value =  entity[column.name[0].toLocaleLowerCase()+column.name.slice(1)] || (column.selection&&column.selection[0]) || '';
	                        if(/#[0-9a-f]{3}/.test(input.value) || /#[0-9a-f]{6}/.test(input.value)){
		                        input.style.background = input.value;
	                        }
                        }

                        if(!column.update && (entity.id || !('id' in entity)) && input.value){
                            input.disabled = 'disabled';
                        }

                        label.style.display = 'inline-block';
                        label.style.width = labelWidth +'px';
                        label.style.fontWeight = 'bold';
                        input.style.display = 'inline-block';
                        input.style.width = inputWidth +'px';
                        column.input = input;
                        row.appendChild(label);
                        row.appendChild(input);
                        panel.appendChild(row);
                    });


                $('base.filter')(buttons, function (button) {
                    return !button.filter || button.filter(entity);
                }, function (button) {
                    var buttonEl = document.createElement('button');
                    buttonEl.innerHTML =  $('base.translate')(button.name);
                    buttonEl.style.float = 'right';
                    buttonEl.style.marginTop = '5px';
                    buttonEl.style.marginRight = 100/(buttons.length+1)+'%';
                    buttonEl.onclick = function (e) {
                        (button.fn||button).apply(buttonEl, [e, {entity: entity, canSubmit: canSubmit()}]);
                    };
                    panel.appendChild(buttonEl);
                });

                return panel;

                function repair(value,place,char){
                    value = '' + value;
                    while(value.length < place){
                        value = (char||0) + value;
                    }
                    return value;
                }

                function canSubmit() {
                    var submit = true;
                    $('base.each')(columns, function (column) {
                        if (column.show && column.input) {
                            entity[column.name] = column.input.value;
                            $('base.each')(column.regular, function (regular) {
                                submit = submit && new RegExp(regular).test(entity[column.name]);
                            });
                        }
                    });
                    return submit;
                }

                function getDefaultValue(type, select) {
                    if (select && select[0]) {
                        return select[0].id;
                    }
                    switch (type) {
                        case 'date':
                            return new Date().toLocaleString();
                    }
                    return '';
                }
            };
        });


		$('controls.alert', function() {
			return function (msg, level, showButton) {
				if (typeof level === 'function') {
					showButton = level;
					level = 0;
				}

				var panel = document.createElement('div');
				var colors = ['#669966', '#666699', '#996666'];
				var div = document.createElement('div');
				var content = document.createElement('div');
				content.innerHTML = msg;
				panel.style.position = 'fixed';
				panel.style.top = 0;
				panel.style.left = 0;
				panel.style.width = window.document.body.scrollWidth + 'px';
				panel.style.height = window.document.body.scrollHeight + 'px';
				div.style.background = colors[level] || colors[0];
				div.style.position = 'fixed';
				div.style.padding = '10px';
				div.style.borderRadius = '10px';
				div.style.boxShadow = '#ff0000 0 0 ' + (level * 2 + 2) + 'px ' + (level * 2 + 2) + 'px';
				div.style.display = 'none';
				div.appendChild(content);
				if (showButton) {
					var buttons = document.createElement('div');
					var okButton = document.createElement('button');
					var cancelButton = document.createElement('button');
					okButton.innerHTML = $('base.translate')('Ok');
					cancelButton.innerHTML = $('base.translate')('Cancel');
					cancelButton.style.margin = '10px';
					okButton.style.margin = '10px';
					panel.style.background = 'rgba(123,123,123,0.6)';
					buttons.appendChild(cancelButton);
					buttons.appendChild(okButton);
					div.appendChild(buttons);
					okButton.onclick = function () {
						document.body.removeChild(panel);
						showButton();
					};
					cancelButton.onclick = function () {
						document.body.removeChild(panel);
					};
				} else {
					setTimeout(function () {
						document.body.removeChild(panel);
					}, 3000);
				}
				panel.appendChild(div);
				document.body.appendChild(panel);
				setTimeout(function () {
					div.style.left = (window.document.body.scrollWidth / 2 - (div.offsetWidth / 2 || 100)) + 'px';
					div.style.top = (window.document.body.scrollHeight / 3 - (div.offsetHeight / 2 || 100)) + 'px';
					div.style.display = 'block';
				}, 100);

			};
		});

		$('controls.function',function(){
			return function(value,title,parents,e) {

				var $dialog = null;
				var parameters = value.slice(value.indexOf('(')+1,value.indexOf(')')).split(',');
				var mathod = value.slice(value.indexOf('{')+1,value.lastIndexOf('}'));
				/*jshint -W054*/
				var func = new Function(parameters,mathod);

				$('controls.dialog')(function(scope,dialog){
					var content =	$('controls.form')($('base.filter')(parameters,function(i){return i;},function(parameter){
						return {name:parameter,type:'',show:true,update:true};
					}),{},[function Run(e,data){
						$('controls.alert')(func.apply(null,$('base.each')(data.entity,function(v){
							if(''+parseFloat(v) === v){return parseFloat(v);}
							return v;
						})));
					}]);

					$dialog = dialog;
					scope.title = title || 'Run Function';
					scope.width = 468;
					scope.content = content;

					dialog.style.left = e.clientX + 'px';
					dialog.style.top = e.clientY + 'px';

					parents.appendChild(dialog);
				}).then(function(){
					parents.removeChild($dialog);
				});
			};
		});

	})($e$);

	window.$e$ = $e$;
})(window);
