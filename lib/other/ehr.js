/**
 * Created by sus on 2016/1/8.
 */
(function (window, _eval) {
	'use strict';

	var cache = [], user = {};

	var $ehr = function $ehr() {
		cache.push.apply(cache, arguments);
		return cache;
	};

	$ehr.downIconCount = 145;

	$ehr.isPc = (function (userAgentInfo) {
		var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];
		for (var i = 0; i < Agents.length; i++) {
			if (userAgentInfo.indexOf(Agents[i]) !== -1) {
				return false;
			}
		}
		return true;
	})(window.navigator.userAgent);

	$ehr.onReady = function (templateUrl, index, oncontextmenu, urls) {
		if (typeof templateUrl === 'number') {
			index = templateUrl;
			templateUrl = null;
		} else if (templateUrl instanceof Array) {
			oncontextmenu = templateUrl;
			index = 0;
			templateUrl = null;
		} else if (typeof templateUrl === 'object') {
			urls = templateUrl;
			oncontextmenu = null;
			index = 0;
			templateUrl = null;
		}

		if (index instanceof Array) {
			oncontextmenu = index;
			index = 0;
		} else if (typeof index === 'object') {
			urls = index;
			oncontextmenu = null;
			index = 0;
		}

		if (typeof oncontextmenu === 'object') {
			urls = oncontextmenu;
			oncontextmenu = null;
		}
		if (oncontextmenu) {
			var menuList = [];
			window.addEventListener('click', function (e) {
				$ehr.each(menuList, function (menu) {
					if (menu.parentNode) {
						menu.parentNode.removeChild(menu);
					}
				});
				menuList.length = 0;
			});
			document.oncontextmenu = function (e) {
				var menu = $ehr.createMenu(oncontextmenu, 'div', function () {
					menu.parentNode.removeChild(menu);
				});
				$ehr.new(menu, { position: 'fixed', background: '#dddddd', left: e.clientX + 'px', top: e.clientY + 'px' });
				menu.oncontextmenu = function () { return false; };
				document.body.appendChild(menu);
				menuList.push(menu);
				return false;
			};
		}

		return function () {
			var data = JSON.parse(localStorage[$ehr.url() + 'user-date/'] || '{}');
			user.language = data.language;

			getTranslate(function (translate) {
				if (urls && urls.login) {
					var languages = $ehr.each(translate).toObject(function (i, index) { return index; }, function (i) { return i; });
					if (urls.user) {
						$ehr.http(urls.user, function (user) {
							var users = $ehr.each(JSON.parse(user)).toObject(function (i, index) { return i; }, function (i) { return i; });
							$ehr.load(urls.login, { languages: languages, user: users }, function () { onload(); });
						});
					} else {
						$ehr.load(urls.login, { languages: languages }, function () { onload(); });
					}

				} else {
					onload();
				}
			});
		};

		function getTranslate(nextFun) {
			if (urls && urls.translate) {
				$ehr.http(urls.translate, function (translate) {
					nextFun(JSON.parse(translate));
				}, function () {
					nextFun(['English', '汉语']);
				});
			} else {
				nextFun(['English', '汉语']);
			}
		}

		function onload() {
			if ($ehr.isPc) {
				document.body.style.background = 'url(../../../desktop2.jpg)';
			}

			if (templateUrl && window.jQuery) {
				window.jQuery.get('template.html', function (template) {
					window.$ehr.template = template;
					window.$ehr.tabs = window.$ehr.createTabs(window.$ehr.filter(window.$ehr.each(window.$ehr(), function (i) {
						return typeof i === 'function' ? i() : i;
					}), filter), index);
					document.body.appendChild(window.$ehr.tabs);
				});
			} else {
				window.$ehr.tabs = window.$ehr.createTabs(window.$ehr.filter(window.$ehr.each(window.$ehr(), function (i) {
					return typeof i === 'function' ? i() : i;
				}), filter), index);
				document.body.appendChild(window.$ehr.tabs);
			}
		}
		function filter(i,index,list){
			/*jshint -W016*/
			return $ehr.isPc ^ i.isMobile || !$ehr.sum(list,function(r){return r.isMobile;});
		}
	};

	$ehr.keyCodes = (function () {
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
	})();

	$ehr.$value = function ($obj, $field, $value) {
		if (!/^[0-9a-zA-Z\._$@]*$/.test($field)) {
			return _eval($obj, $field, valuer);
		} else {
			return valuer($obj, $field, $value);
		}

		function valuer(obj, field, value) {
			field = field || '';
			var fields = field.trim().split('.');
			if (!obj) {
				return;
			}
			if (obj instanceof HTMLElement && ((!fields[0] in obj) && obj.hasAttribute(fields[0]))) {
				var newObj = obj.attributes[fields[0]];
				fields[0] = 'value';
				return valuer(newObj, fields.join('.'), value);
			}
			if (field instanceof Array) {//获取一个真值
				for (var i = 0; i < field.length; i++) {
					if ((typeof obj[field[i]] === 'number') || obj[field[i]]) {
						return obj[field[i]];
					}
				}
				if (!(typeof obj === 'object')) {
					return obj;
				} else {
					return null;
				}
			}

			while (fields.length > 1) {
				if (!fields[0].trim()) {
					fields.shift();
				} else {
					obj = fill(obj, fields.shift(), true);
				}
			}
			if (!(typeof value === 'undefined')) {
				fill(obj, fields.shift(), true, value);
			} else {
				return fill(obj, fields.shift(), false);
			}
		}

		function fill(ent, tempField, run, val) {
			if (!/\[\d+\]/.test(tempField)) {
				if (run) {
					if(typeof val === 'undefined'){
						if(!ent[tempField]){
							ent[tempField] = {};
						}
					}else{
						ent[tempField] = val;
					}
					ent = ent[tempField];
				} else {
					return ent[tempField];
				}
			} else {
				var fieldT = tempField.replace(/\[\d+\]/g, '');
				if (fieldT) {
					ent = ent[fieldT] = ent[fieldT] || [];
				}
				window.binding.foreach(tempField.match(/\[\d+\]/g), function (v, i, list) {
					v = v.replace('[', '').replace(']', '');
					if (i < list.length - 1) {
						ent = ent[v] = ent[v] || [];
					} else {
						if (run) {
							ent = ent[v] = (!(typeof val === 'undefined') ? val : ent[v] || {});
						} else {
							return ent[v];
						}
					}
				});
			}
			return ent;
		}
	};

	$ehr.new = function (type, className, value, pros, attrs) {
		if (typeof type === 'string') {
			var el = document.createElement(type);
			addStyle(el);
			initValue(el, value);
			initPro(el, pros);
			initAttr(el, attrs);
			return el;
		} else if (type instanceof Array) {
			return $ehr.each(type, function (elItem, index) {
				addStyle(elItem);
				initValue(elItem, value && value[index] || value);
				initPro(elItem, pros);
				initAttr(el, attrs);
				return elItem;
			});
		} else if (type instanceof HTMLElement) {
			addStyle(type);
			initValue(type, value);
			initPro(type, pros);
			initAttr(el, attrs);
			return type;
		} else {
			var select = $ehr.new('select', className);
			$ehr.each(type, function (it, pro) {
				var op = $ehr.new('option', null, it);
				op.value = pro;
				select.appendChild(op);
			});
			select.value = value || $ehr.each(type)[0];
			initPro(select, pros);
			initAttr(el, attrs);
			return select;
		}

		function initAttr(element, attrs){
			$ehr.each(attrs, function (attr, attrName) {
				element.setAttribute(attrName,attr);
			});
		}

		function initPro(element, ev) {
			if (typeof ev === 'function') {
				element.onclick = ev;
			} else {
				$ehr.each(ev, function (evFn, evName) {
					element[evName] = evFn;
				});
			}
			element.drag = function () {
				drag(element);
			};
		}

		function initValue(element, val) {
			if (value || value === '') {
				switch (type) {
					case 'input':
					case 'select':
					case 'textarea':
						element.value = val;
						break;
					case 'img':
					case 'iframe':
						element.src = value;
						break;
					default:
						element.innerHTML = val;
				}
			}
		}

		function addStyle(element) {
			if (typeof className === 'string') {
				element.className = className;
			} else {
				$ehr.each(className, function (value, pro) {
					element.style[pro] = value;
				});
			}
		}

		function drag(element) {
			var temp = {};
			element.style.left = element.style.left || element.style.marginLeft;
			element.style.marginLeft = 0;
			element.addEventListener('mousedown', function (e) {
				window.document.body.addEventListener('mousemove', mousemove);
				temp.e = e;
				temp.x = e.clientX - (parseInt(element.style.left) || (element.parentNode.offsetWidth - element.offsetWidth) / 2);
				temp.y = e.clientY - (parseInt(/%/.test(element.style.top) ? '' : element.style.top) || (element.parentNode.offsetHeight - element.offsetHeight) / 2);
				element.style.cursor = 'move';
			});
			element.addEventListener('mouseup', function (e) {
				window.document.body.removeEventListener('mousemove', mousemove);
				element.style.cursor = 'default';
			});


			function mousemove(e) {
				$ehr.new(element, {
					transform: null,
					marginLeft: null,
					left: e.clientX - temp.x + 'px',
					top: e.clientY - temp.y + 'px'
				});
			}
		}
	};

	$ehr.replace = function (str, oldChar, newChar) {
		while (str.indexOf(oldChar) !== -1) {
			str = str.replace(oldChar, newChar);
		}
		return str;
	};

	$ehr.url = function () {
		var url = '';
		if (/msie([\d.]+)/i.test(window.navigator.userAgent)) {//IE
			url = window.location;
		} else if (/firefox\/([\d.]+)/i.test(window.navigator.userAgent)) {//firefox
			url = window.location;
		} else if (/chrome\/([\d.]+)/i.test(window.navigator.userAgent)) {//chrome
			url = window.location.origin + window.location.pathname;
		} else if (/opera.([\d.]+)/i.test(window.navigator.userAgent)) {//opera
			url = window.location.origin + window.location.pathname;
		} else if (/version\/([\d.]+)/i.test(window.navigator.userAgent)) {//safari
			url = window.location.origin + window.location.pathname;
		}
		if (/.*\.[html|htm|asp|cshtml]/.test(url)) {
			var urls = url.split('/');
			urls.pop();
			url = urls.join('/') + '/';
		}
		return url;
	};

	$ehr.timeout = function (func, interval) {
		return setTimeout(func, interval);
	};

	$ehr.eachrun = function (func, interval) {
		var index = 0, stop = false;
		timeout(func, interval);

		return function () {
			stop = true;
		};

		function timeout(func, interval) {
			func(index);
			index++;
			if (!stop) {
				setTimeout(function () {
					timeout(func, interval);
				}, interval);
			}
		}
	};

	$ehr.color = function (index) {
		if (!index) {
			var color = Math.floor(Math.random() * 256 * 256 * 256).toString(16).slice(-6);
			while (color.length < 6) {
				color = 0 + color;
			}
			return '#' + color;
		} else {
			if (typeof index !== 'number') {
				index = $ehr.sToint('' + index);
			}
			return '#' + new Date(10000).setYear(index).toString(16).slice(-8, -2);
		}
	};

	$ehr.formatter = function (str) {
		for (var i = 1; i < arguments.length; i++) {
			var reg = new RegExp('#' + (i - 1) + '#');
			while (reg.test(str)) {
				str = str.replace(reg, arguments[i]);
			}
		}
		return str;
	};

	$ehr.dateFomatter = function (date, fomatter) {
		if (!date) {
			return '';
		}
		date = new Date(date);
		fomatter = fomatter || 'yyyy-MM-dd HH:mm:ss';
		return fomatter.
			replace('YYYY', repair(date.getFullYear(), 4)).
			replace('yyyy', repair(date.getFullYear(), 4)).
			replace('MM', repair(date.getMonth() + 1, 2)).
			replace('DD', repair(date.getDate(), 2)).
			replace('dd', repair(date.getDate(), 2)).
			replace('HH', repair(date.getHours(), 2)).
			replace('hh', date.getHours() > 12 ? ('PM ' + repair(date.getHours() - 12, 2)) : ('AM ' + repair(date.getHours(), 2))).
			replace('mm', repair(date.getMinutes(), 2)).
			replace('ss', repair(date.getSeconds(), 2)).
			replace('fff', repair(date.getMilliseconds(), 3));
		function repair(value, place, char) {
			value = '' + value;
			while (value.length < place) {
				value = (char || 0) + value;
			}
			return value;
		}
	};

	$ehr.arrangement = function (items) {
		return $ehr.each(items, function (item) {
			if (!item.id) {
				item.$back = { id: -1 };
			}
			$ehr.each(item, function (value, pro) {
				if (!item.id && pro !== '$back') {
					item.$back[pro] = item[pro] || item.$back[pro];
					item[pro] = null;
				} else if (/[0-9]{4}\-[0-9]{2}-[0-9]{2}/.test(value)) {
					item[pro] = new Date(value);
				}
			});
			return item;
		});
	};

	$ehr.translate = function (translates, defaultValue) {
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
		return (translates && translates[user.language]) ||
			(defaultValue && defaultTranslates[user.language] && defaultTranslates[user.language][defaultValue.toLocaleLowerCase().trim()]) ||
			defaultValue;
	};

	$ehr.extend = function (obj) {
		obj = obj || {};
		for (var i = 1; i < arguments.length; i++) {
			var pros = Object.keys(arguments[i]).sort();
			for (var ii=0;ii<pros.length;ii++) {
				obj[pros[ii]] = arguments[i][pros[ii]];
			}
		}
		obj.equal = equal;
		return obj;

		function equal(d) {
			var pros = Object.keys(d).sort();
			for (var j=0;j<pros.length;j++) {
				var isNotEq = typeof obj[pros[j]] !== 'function' && ('' + d[pros[j]]) !== ('' + obj[pros[j]]);
				isNotEq = isNotEq && !((obj[pros[j]] instanceof Date || d[pros[j]] instanceof Date) && (dataToString(d[pros[j]]) === dataToString(obj[pros[j]])));

				if (isNotEq) {
					return false;
				}
			}
			return true;
		}

		function dataToString(value) {
			if (value instanceof Date) {
				return repair(value.getFullYear(), 4) + '-' + repair(value.getMonth() + 1, 2) + '-' + repair(value.getDate(), 2) + 'T' + repair(value.getHours(), 2) + ':' + repair(value.getMinutes(), 2) + ':' + repair(value.getSeconds(), 2);
			}
			return value;
		}

		function repair(value, place, char) {
			value = '' + value;
			while (value.length < place) {
				value = (char || 0) + value;
			}
			return value;
		}
	};

	$ehr.each = function (list, func) {
		var result = [];
		func = func || function (it) { return it; };
		if (typeof func === 'string') {
			var field = func;
			func = function (it) { return it[field]; };
		}

		if (list && typeof list.length === 'number' && typeof list !== 'function') {
			for (var i = 0; i < list.length; i++) {
				result.push(func(list[i], i, list));
			}
		} else if (list && (typeof list === 'object' || typeof list === 'function')) {
			var pros = Object.keys(list).sort();
			for (var i=0;i<pros.length;i++) {
				result.push(func(list[pros[i]], pros[i], list));
			}
		} else if (typeof list === 'number') {
			for (var j = 0; j < list; j++) {
				result.push(func(j, j, list));
			}
		}

		result.toObject = toObject;
		result.random = random;
		result.each = function (fun) { return $ehr.each(result, fun); };
		return result;

		function toObject(pro, val) {
			var obj = {};
			for (var o = 0; o < result.length; o++) {
				var $pro = pro, $val = val;
				if (!result[o]) { continue; }
				if (typeof $pro === 'function') {
					$pro = $pro(result[o], o);
				} else if (typeof $val === 'string') {
					$pro = result[o][$pro];
				}
				if (typeof $val === 'function') {
					$val = $val(result[o], o);
				} else if (typeof $val === 'string') {
					$val = result[o][$val];
				}
				obj[$pro] = $val;
			}
			return obj;
		}

		function random() {
			var newResult = [], copyList = $ehr.each(result);
			while (copyList.length) {
				var index = Math.floor(Math.random() * copyList.length);
				newResult.push(copyList[index]);
				copyList = $ehr.filter(copyList, fiter(index));
			}
			return newResult;

			function fiter(index) {
				return function (v, i) {
					return i !== index;
				};
			}
		}
	};
	$ehr.filter = function (list, func, to, index) {
		var result = [];
		if (typeof to === 'number') {
			index = to;
			to = null;
		}
		if (to === true) {
			result = {};
			index = null;
			to = null;
		}
		if (index === true) {
			result = {};
			index = null;
		}
		to = to || function (t) { return t; };
		if (list && typeof list.length === 'number' && typeof list !== 'function') {
			for (var i = 0; i < list.length; i++) {
				if (func(list[i], i, list)) {
					if (result instanceof Array) {
						result.push(to(list[i], i, list));
					} else {
						result[i] = (to(list[i], i, list));
					}
				}
			}
		} else if (list && (typeof list === 'object' || typeof list === 'function')) {
			var pros = Object.keys(list).sort();
			for (var i=0;i<pros.length;i++) {
				if (func(list[pros[i]], pros[i], list)) {

					if (result instanceof Array) {
						result.push(to(list[pros[i]], pros[i], list));
					} else {
						result[pros[i]] = (to(list[pros[i]], pros[i], list));
					}
				}
			}
		}
		if (typeof index === 'number') {
			while (result.length && index < 0) {
				index += result.length;
			}
			return result && result[index];
		}
		return result;
	};
	$ehr.group = function (list, func) {
		var group = {};
		$ehr.each(list, function (item) {
			var key = func(item);
			group[key] = group[key] || [];
			group[key].push(item);
		});
		return group;
	};
	$ehr.sum = function (list, func) {
		var newList = $ehr.each(list, func);
		var sum = newList[0];
		for (var i = 1; i < newList.length; i++) {
			sum += newList[i];
		}
		return sum;
	};

	$ehr.merge = function () {
		var result = [];
		$ehr.each(arguments, function (argument) {
			if (argument instanceof Array) {
				result.push.apply(result, argument);
			} else {
				result.push(argument);
			}
		});
		return result;
	};

	$ehr.sToint = function (str) {
		return $ehr.sum(str, function (i) { return i.charCodeAt(); });
	};

	$ehr.http = (function http() {

		return function (url, data, backFun, errorFun) {
			if (typeof url === 'string') {
				$http(createXhr(), url, data, function (req) {
					(backFun || function (s) { $ehr.alert(s); }).apply(null, [req]);
				}, errorFun);
			}
			if (url instanceof Array) {
				var reqData = [];
				for (var i = 0; i < url.length; i++) {
					$onload(url[i], i, url.length, reqData);
				}

			}

			function $onload($url, $index, $count, $reqData) {
				//setTimeout(function(){
				$http(createXhr(), $url, data, function (req) {
					$reqData[$index] = req;
					$reqData.$index = ($reqData.$index || 0) + 1;
					if ($reqData.$index === $count) {
						(backFun || function () { }).apply(null, $reqData);
					}
				}, errorFun);
				//},100);
			}
		};

		function createXhr() {
			var xhr = null;
			if (window.XMLHttpRequest) {
				xhr = new window.XMLHttpRequest();
				if (xhr.overrideMimeType) {
					xhr.overrideMimeType('text/xml');
				}
			} else {
				xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
			}
			return xhr;
		}

		function $http(xhr, url, data, backFun, errorFun) {
			if (typeof data === 'function') {
				backFun = data;
				data = null;
			}
			xhr.onreadystatechange = callBack;
			xhr.open((!data ? 'GET' : 'POST'), url, true);
			xhr.setRequestHeader("User", user && user.id);
			xhr.setRequestHeader("Language", user && user.language);
			xhr.setRequestHeader("IsPc", $ehr.isPc);
			if (data instanceof FormData) {
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send(data);
			} else {
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.send(JSON.stringify(data));
			}

			function callBack() {
				if (xhr.readyState === 4 && xhr.status === 200) {
					(backFun || function () { })(xhr.responseText);
				} else if (xhr.readyState === 3 && xhr.status !== 200) {
					(errorFun || function () { })(xhr.responseText);
				}
			}
		}
	})();

	$ehr.sequence = function (backCall, interval) {
		return new Sequence(null, backCall, interval);

		function Sequence(root, backCall, interval) {
			this.$id = Date.now();
			this.root = root;
			this.fn = backCall;
			this.interval = interval;
			this.then = function result(backCall, interval) {
				var dataItem = new Sequence(this.root || this, backCall, interval);
				this.next = dataItem;
				return dataItem;
			};
			this.fire = function fire() {
				var args = $ehr.each(arguments);
				args.unshift([]);
				(function run(data, args) {
					if (data) {
						if (data.fn) {
							args[0].push(data.fn.apply(data, args));
						} else {
							args[0].push(undefined);
						}
						setTimeout(function () {
							run(data.next, args);
						}, data.interval);
					}
				})(this.root, args);
			};
		}
	};

	$ehr.point = function (point, size) {
		var result = { clientX: point.clientX, clientY: point.clientY };
		if (point.clientX + size.width > document.body.scrollWidth) {
			result.clientX = document.body.scrollWidth - size.width - 10;
		}
		if (point.clientY + size.height > document.body.scrollHeight - 20) {
			result.clientY = document.body.scrollHeight - size.height - 30;
		}
		return result;
	};

	$ehr.open = function (url, setting, name) {
		setting = (typeof (setting) === 'string' ? setting : '') || 'width=@width@,height=@height@,@other@'.replace('@width@', window.width * 0.9).replace('@height@', window.height * 0.9)
			.replace('@other@', setting === true ? 'menubar=yes' : 'location=no');
		window.open(url, name, setting);
	};

	$ehr.goto = function () {
		window.$ehr.tabs.goto.apply(window.$ehr.tabs, arguments);
	};

	$ehr.hump = function hump(str) {
		if (!str) {
			return '&nbsp;';
		}
		if (/.*FK$/.test(str.toLocaleUpperCase())) {
			str = str.slice(0, str.length - 2);
		}
		if (!/a-z/.test(str)) {
			return str;
		}
		var result = $ehr.each(str, function (char) {
			if (/[A-Z]/.test(char)) {
				return ' ' + char;
			} else {
				return char;
			}
		}).join('');
		return result[0].toLocaleUpperCase() + result.slice(1);
	};

	$ehr.createMenu = function (items, flag, onchick) {
		if (typeof flag === 'function') {
			onchick = flag;
			flag = 'span';
		}

		var menu = $ehr.new('div');
		$ehr.each(items, function (item, pro) {
			menu.appendChild($ehr.new(flag || 'span', { margin: '5px', cursor: 'pointer', color: '#0000ff', textDecoration: 'underline' }, item.name || pro, getClick(item, pro)));
		});
		return menu;

		function getClick(item, pro) {
			return function (e) {
				if (item.fn) {
					item.fn(item, item.name || pro, e);
				} else if (typeof item === 'function') {
					item(item, item.name || pro, e);
				}
				if (onchick) {
					onchick(item, item.name || pro, e);
				}
			};
		}
	};

	$ehr.createTabs = function (items, selectMenu, index) {
		var button = $ehr.new('div', { zIndex: 99, position: 'fixed', background: '#999999', width: '40px', height: '40px', borderRadius: '100%', top: '-20px', left: '-20px' }, null, function () {
			replace(button, menu);
		});
		var menu = $ehr.new('div', { zIndex: 99, position: 'fixed', top: '5px', background: '#dddddd' });
		var back = createMenuItem({ title: '&times;' }, '&times;');

		menu.appendChild(back);
		$ehr.each(items, function (item, index) {
			var binding = function(){
				$ehr.binding(menuItem, item);
				$ehr.binding(menuItem.tag, item);
			};
			var menuItem = createMenuItem(item,'<span [innerHTML]="title"></span>');
			menuItem.tag = createPanelItem(item,binding);
			menu.appendChild(menuItem);

			binding();
			menuItem.onclick = function (e, data) {
				$ehr.each(menu.childNodes, function (m) {
					m.style.background = '#dddddd';
				});
				button.tag.unload();
				replace(menu, button);
				replace(button.tag, e.currentTarget.tag);
				button.tag = e.currentTarget.tag;
				e.currentTarget.style.background = '#ddffdd';
				if (item.action) {
					item.action(button.tag, window.$ehr, data);
					binding();
				}
			};
		});

		if (typeof selectMenu === 'number') {
			index = selectMenu;
			selectMenu = null;
		}

		index = index || 0;
		while (items.length && index < 0) {
			index += items.length;
		}

		setTimeout(function () {
			if (!items.length) { return; }
			var item = items[index];
			button.tag = menu.childNodes[index + 1].tag;
			menu.childNodes[index + 1].style.background = '#ddffdd';
			if (selectMenu) {
				selectMenu(button.tag);
			} else {
				button.parentNode.appendChild(button.tag);
				if (items.length === 1) {
					button.parentNode.removeChild(button);
				}
			}
			if (item.action) {
				item.action(button.tag, window.$ehr);
			}
		});

		window.addEventListener('mousedown', function (e) {
			if (e.target !== button && !isMenu(e.target)) {
				replace(menu, button);
			}
		});

		button.goto = function (url, data) {
			if (typeof url !== 'number') {
				$ehr.each(items, function (item, indx) {
					if (item.title === url) { url = indx; }
				});
			}

			if (typeof url === 'number' && menu.childNodes[url + 1]) {
				menu.childNodes[url + 1].onclick({ currentTarget: menu.childNodes[url + 1] }, data);
			}
		};

		return button;

		function isMenu(el) {
			while (el.parentNode) {
				if (el === menu) {
					return true;
				} else {
					el = el.parentNode;
				}
			}
		}

		function createMenuItem(item,title) {
			var menuItem = $ehr.new('div', { padding: '2px 10px', background: '#dddddd', cursor: 'pointer' });
			var menuItemTitle = $ehr.new('div', null, title);

			if (item.icon) {
				if (/^[d|D]=/.test(item.icon)) {
					menuItem.innerHTML += '<svg fill="red" stroke="red" stroke-width="1" width="20" height="20" ' + item.icon + '></svg>';
				} else {
					var menuItemImage = $ehr.new('img', { verticalAlign: 'middle', width: '20px', height: '20px', display: 'inline-block' });
					$ehr.new(menuItemTitle, { fontSize: '20px', display: 'inline-block', marginLeft: '5px' });
					menuItemImage.src = '../../../' + item.icon;
					menuItem.appendChild(menuItemImage);
				}
			} else {
				$ehr.new(menuItemTitle, { fontSize: '20px', display: 'inline-block', marginLeft: '25px' });
			}
			menuItem.appendChild(menuItemTitle);

			menuItem.addEventListener('mouseenter', function (e) {
				$ehr.new(menuItem, { opacity: 0.6, color: '#0000ff' });
			});
			menuItem.addEventListener('mouseleave', function (e) {
				$ehr.new(menuItem, { opacity: 1.0, color: null });
			});

			return menuItem;
		}

		function createPanelItem(item,binding) {
			var unload = [];
			item.panel = $ehr.new('div');
			setTimeout(function () {
				if (item.fn) {
					item.fn(item.panel, window.$ehr);
					binding();
				}
			});
			item.panel.unload = function (fn) {
				if (fn) {
					unload.push(fn);
				} else {
					$ehr.each(unload, function (i) { i(); });
				}
			};
			return item.panel;
		}

		function replace(oldElement, newElement) {
			if (oldElement && oldElement.parentNode) {
				var parentNode = oldElement.parentNode;
				parentNode.removeChild(oldElement);
				parentNode.appendChild(newElement);
			}
		}
	};

	$ehr.addTooltip = function (element, message, $class) {
		var $message = $ehr.new('div', $class || 'ehr-controls-tooltip');

		if (!(element instanceof HTMLElement)) {
			$class = message;
			message = element;
			element = null;
		}

		(function fillFooter(content, ele) {
			if (!content) {
				return;
			}
			if (typeof content === 'string' || typeof content === 'number') {
				ele.innerHTML = content || '';
			} else if (typeof content === 'function') {
				ele.updateMessage = content;
			} else if (content instanceof HTMLElement) {
				ele.appendChild(content);
			} else if (content instanceof Array) {
				$ehr.each(content, function (i) { fillFooter(i, ele); });
			}
		})(message, $message);

		if (element) {
			element.addEventListener('mouseenter', _in);
			element.addEventListener('mouseleave', _out);
		} else {
			return { in: _in, out: _out };
		}


		function _in(e) {
			if (!document.body.contains($message)) {
				document.body.appendChild($message);
				var point = $ehr.point(e, { width: $message.offsetWidth, height: $message.offsetHeight });
				$ehr.new($message, { left: point.clientX + 'px', top: point.clientY + 'px' });
				if ($message.updateMessage) {
					$message.updateMessage($message);
				}
			}
		}
		function _out(e) {
			if (document.body.contains($message)) {
				document.body.removeChild($message);
			}
		}
	};

	$ehr.navigator = function (parent, item, column, option) {
		if (option) {
			var nav = $ehr.new('div', 'navigator-button', '&nbsp;', { title: option.name });
			$ehr.new(nav, { display: 'none' }, null, function (e) {
				(option.fn || option)(e, column, item, item[column.field]);
			});
			parent.appendChild(nav);
			parent.addEventListener('mouseenter', function () {
				nav.style.display = 'block';
			});
			parent.addEventListener('mouseleave', function () {
				nav.style.display = 'none';
			});
		}
	};

	$ehr.selectMenu = function (items, callBack) {
		var panel = $ehr.new('div', 'select-menu');
		$ehr.each(items, function (item) {
			var nav = $ehr.new('div', null, item, function (e) {
				callBack(item);
			});
			panel.appendChild(nav);
		});
		return panel;
	};

	$ehr.toGrid = function (data, option, cellClick) {
		if (typeof option === 'function') {
			cellClick = option;
			option = null;
		}

		option = $ehr.extend({ minWidth: 120, maxWidth: 200, height: 22, cellCenter: true, showTooltip: false, showToolbar: false }, option || {});

		cellClick = cellClick || function () { };

		var active = {};
		var $columns = getColumns(data, option.columns, option.showToolbar);
		var grid = $ehr.new('div', 'ehr-grid ' + (option.className || ''));
		var header = $ehr.new('div', 'ehr-grid-header');
		var content = $ehr.new('div', 'ehr-grid-content');
		var width = $ehr.sum($columns, function (colum) { return colum.width + 2; });
		$ehr.each($columns, function (column) {
			if (!column.show) { return; }
			var headerItem = $ehr.new('div', { width: column.width + 'px' }, $ehr.hump($ehr.translate(column.title, column.name)));
			hover(headerItem, $ehr.translate(column.tooltip), { background: '#666666', color: '#ffffff' });
			force(headerItem, column, null);
			header.appendChild(headerItem);
		});

		$ehr.each(data, function (item, index) {
			var $id = item.id || item.Id || item.iD || item.ID;
			var id = typeof $id === 'string' ? parseInt($id) : $id;
			var row = $ehr.new('div', { width: width + 'px', height: option && option.height ? (option.height + 'px') : '' });

			if (id) {
				$ehr.each($columns, function (column) {
					if (!column.show) { return; }
					var cell = $ehr.new('div', 'ehr-grid-cell');
					cell.style.width = column.width + 'px';
					if (option.textAlign) {
						cell.style.textAlign = option.textAlign;
					}
					addpendChild(cell, column.formatter(item));
					$ehr.navigator(cell, item, column, option.navigator && option.navigator[column.name.toLocaleLowerCase()]);
					$ehr.each(column.style, function (style) {
						$ehr.new(cell, $ehr.each(style.split(';')).toObject(function (i) { return i.split(':').shift(); }, function (i) { return i.split(':').pop(); }));
					});
					row.appendChild(cell);
					hover(cell, option.showTooltip && item[column.field], { background: '#666666', color: '#ffffff' });
					force(cell, column, item);
				});
			} else {
				var help = $ehr.new('div', { textAlign: 'center', opacity: 0.6, padding: '4px' }, $ehr.translate(['', '双击新增数据'], 'Double click to add new'));
				force(help, { name: '--' }, item);
				row.appendChild(help);
			}

			if (option.selectItemFn && option.selectItemFn(item)) {
				row.className = 'ehr-grid-row active';
			} else {
				row.className = 'ehr-grid-row';
			}
			content.appendChild(row);
			hover(row, null, { background: '#aaaadd' });
		});

		$ehr.new([header, content], { width: width + 'px' });

		grid.appendChild(header);
		grid.appendChild(content);

		setTimeout(function () {
			var contentHeight = $ehr.sum(content.childNodes, function (row) { return row.offsetHeight; }) + 22;

			$ehr.new(content, { height: contentHeight + 'px' });

			$ehr.new(grid, { width: Math.min(width, window.outerWidth) + 'px', height: Math.min(header.offsetHeight - 20 + contentHeight, window.outerHeight) + 'px' });

			if (width > window.outerWidth) {
				grid.style.overflowX = 'auto';
			}
			if (header.offsetHeight - 20 + contentHeight > window.outerHeight) {
				grid.style.overflowY = 'auto';
			}
		}, 100);

		return grid;

		function addpendChild(parent, children) {
			if (children instanceof HTMLElement) {
				parent.appendChild(children);
			} else if (children instanceof Array) {
				$ehr.each(children, function (i) { addpendChild(parent, i); });
			} else {
				parent.innerHTML = children;
			}
		}

		function getColumns(items, columns, showToolbar) {
			function Column() { }
			columns = columns || [];

			$ehr.each(columns, function (i) {
				i.field = i.field || i.name && (i.name[0].toLocaleLowerCase() + i.name.slice(1));
				i.width = i.width || Math.min(Math.max(option && option.minWidth || 120, ('' + ($ehr.translate(i.title, i.name).length * 15))), option && option.maxWidth || 300);
			});

			$ehr.each(data, function (item) {
				$ehr.each(item, function (value, pro) {
					if (option && option.hideId && pro === 'Id' || /.*\$back$/.test(pro)) { return; }
					var column = $ehr.filter(columns, function (column) {
						return column.field === pro;
					}, 0);
					var defaultFn = function (entity) { return entity[column.field]; };
					if (!column) {
						column = $ehr.extend(new Column(), { name: pro, field: pro, show: true, formatter: defaultFn, getValue: defaultFn });
						columns.push(column);
					}

					if (value === true || value === false) {
						column.type = column.type || 'boolean';
					} else if (value) {
						column.type = column.type || value.constructor.name.toLocaleLowerCase();
					}
					if (value === null || value === undefined) {
						value = '';
					}
					switch (typeof value) {
						case 'function':
							column.formatter = column.formatter || function (entity) {
								return '$Func: ' + entity[column.field].name;
							};
							column.getValue = column.getValue || function (cell, entity) {
								return entity[column.field];
							};
							break;
						case 'object':
							if (['Date'].indexOf(value.constructor.name) === -1) {
								column.formatter = column.formatter || function (entity) {
									return entity[column.field] ? '$Object: {***}' : '';
								};
								column.getValue = column.getValue || function (cell, entity) {
									return entity[column.field];
								};
							} else {
								column.formatter = column.formatter || function (entity) {
									return $ehr.dateFomatter(entity[column.field]) || '';
								};
								column.getValue = column.getValue || function (cell) {
									var input = cell.querySelector('input');
									return input && input.value || cell.innerHTML;
								};
							}
							break;
						default:
							if (column.type === 'boolean') {
								column.formatter = column.formatter || function (entity) {
									return '<input type="checkbox" style="width: ' + column.width + 'px;" disabled="true" ' + (entity[column.field] ? 'checked=true' : '') + '>';
								};
								column.getValue = column.getValue || function (cell) {
									return cell.querySelector('input').checked;
								};
							} else {
								column.formatter = column.formatter || function (entity) {
									if (/.*Fk$/.test(column.field)) {
										var select = column.selection && $ehr.filter(column.selection, function (i) { return i.id === entity[column.field]; }, 0);
										return select ? (select.name + ' - ' + select.info) : entity[column.field] || '';
									} else {
										return (entity[column.field] || entity[column.field] === 0) ? entity[column.field] : '';
									}
								};
								column.getValue = column.getValue || function (cell) {
									var input = cell.querySelector('input');
									return input && input.value || cell.innerHTML;
								};
							}
							break;
					}

					column.width = Math.min(Math.max(Math.max(column.width || option && option.minWidth || 120, ('' + column.formatter(item)).length * 12, option && option.minWidth || 120), ('' + ($ehr.translate(column.title, column.name).length * 15))), option && option.maxWidth || 300);
					if (option.navigator && option.navigator[column.name.toLocaleLowerCase()] && !option.navigator[column.name.toLocaleLowerCase()].init) {
						column.width = column.width + 20;
						option.navigator[column.name.toLocaleLowerCase()].init = true;
					}
				});
			});
			//columns.push(addToolbar(showToolbar));

			return $ehr.filter(columns, function (i) { return i.show; });

			function addToolbar(show) {
				return {
					name: '',
					width: 160,
					field: '',
					show: show,
					getValue: function () { },
					formatter: function (entity) {
						return entity.id && [$ehr.new('button', { margin: '2px 10px' }, $ehr.translate('Edit'), editButtonClick(this, entity)), $ehr.new('button', { margin: '2px 10px' }, $ehr.translate('Delete'), deleteButtonClick(this, entity))];
					}
				};

				function editButtonClick(column, item) {
					return function (e) {
						cellClick(e, {
							action: 'edit',
							list: data,
							item: item,
							column: column,
							value: null
						});
					};
				}
				function deleteButtonClick(column, item) {//$ehr.alert
					return function (e) {
						$ehr.alert($ehr.translate(['', '你确定删除这条数据？'], 'You can Delete the item?'), function () {
							cellClick(e, {
								action: 'delete',
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

		function hover(ele, value, styles) {
			var backStyles = {};
			var tooltip = { in: function () { }, out: function () { } };
			if (value) {
				value = '' + (value ? (typeof value === 'object' ? JSON.stringify(value) : value) : '');
				while (/[<>]/.test(value)) {
					value = value.replace('<', '&lt;').replace('>', '&gt;');
				}
				if (!option || !option.hideTooltip || ele.className !== 'ehr-grid-cell') {
					tooltip = $ehr.addTooltip('<textarea readonly="true">' + value + '</textarea>');
				}
			}
			ele.onmouseenter = function (e) {
				backStyles = {};
				tooltip.in(e);
				$ehr.each(styles, function (v, k) {
					backStyles[k] = ele.style[k];
				});
				$ehr.extend(ele.style, styles);
			};
			ele.onmouseleave = function () {
				tooltip.out();
				$ehr.extend(ele.style, backStyles);
			};
		}

		function force(cell, column, item) {
			if ((!option || !option.readonly) && (column.update || (item && !item[column.name]))) {
				cell.ondblclick = ondblclick;
				cell.onclick = onclick;
			} else {
				cell.ondblclick = onclick;
			}

			function onclick(e) {
				if (!column.name) { return; }
				if (cell !== force.target) {
					(force.onblur || function () { })();
				}
				cellClick(e, {
					action: 'edit',
					list: data,
					item: item,
					column: column,
					value: item && item[column.name]
				});
			}

			function ondblclick() {
				var input = $ehr.new('input');
				if (/.*Fk$/.test(column.name)) {
					input = $ehr.new($ehr.each(column.selection).toObject('id', function (i) { return i.name + ' - ' + i.info; }));
				}

				input.value = column.getValue(cell, item);
				if (column.type === 'boolean') {
					input.type = 'checkbox';
					input.checked = column.getValue(cell, item);
				} else {
					input.type = column.type;
				}
				input.style.width = (column.width - 5) + 'px';
				input.onblur = onblur;
				cell.innerHTML = '';
				cell.appendChild(input);
				cell.ondblclick = null;

				if (cell !== force.target) {
					(force.onblur || function () { })();
					force.onblur = onblur;
					force.target = cell;
				}
			}

			function onblur() {
				item[column.name] = column.getValue(cell, item);
				cell.innerHTML = column.formatter(item);
				cell.ondblclick = ondblclick;
			}
		}
	};

	$ehr.toListView = function (data, createRow) {
		createRow = createRow || defaultCreateRow;

		var listView = $ehr.new('div', 'ehr-listview');
		$ehr.each(data, function (item, index) {
			var listItem = $ehr.new('div', 'ehr-listview-item');
			listItem.appendChild(createRow(item, index));
			listView.appendChild(listItem);
		});
		return listView;

		function defaultCreateRow(item) {
			return $ehr.new('div', null, JSON.stringify(item));
		}
	};

	$ehr.toElements = function (obj, maxLevel, to, on) {
		var title = '<span style="color:' + $ehr.color() + ';">title</span>';
		var result = [];

		if (typeof maxLevel === 'function') {
			on = to;
			to = maxLevel;
			maxLevel = null;
		}
		maxLevel = maxLevel || 3;

		$ehr.each(obj, function (value, pro) {
			var el = $ehr.new('div', { overflow: 'hidden' }, '<span style="color:' + $ehr.color(typeof value) + ';">' + (pro || value.name) + '</span>');
			if (to) { to(el); }
			if (typeof on === 'function') {
				el.onclick = function (e) { return on.call(el, e, value, pro, obj); };
			}
			result.push(el);


			$ehr.addTooltip(el, function (parent) {
				var titleMeaasge = $ehr.new('div', { fontSize: '2em' }, el.innerHTML);
				parent.innerHTML = '';
				parent.appendChild(titleMeaasge);
				parent.appendChild(getMessage(value));
			});
		});
		return result;


		function getMessage(object, level) {
			var div = $ehr.new('div');
			object = toBase(object);
			level = level || 0;
			if (level > maxLevel) {
				div.innerHTML = object;
			} else if (typeof object === 'object') {
				$ehr.each(object, function (value, pro) {
					var child = $ehr.new('div', { marginLeft: '20px' });
					var name = $ehr.new('div', { fontWeight: 'bold' });
					name.innerHTML = pro;
					child.appendChild(name);
					child.appendChild(getMessage(value, level + 1));
					div.appendChild(child);
				});
			} else if (typeof object === 'function') {
				div.innerHTML = '<textarea style="width: 600px;height:' + (level ? 40 : 400) + 'px;background: #dddddd;">' + object + '</textarea>';
			} else {
				div.innerHTML = object || 'null';
			}
			return div;
		}

		function toBase(object) {
			if (object instanceof Array || object instanceof RegExp || object instanceof Date) {
				return object.toString();
			} else if (object instanceof window.EventTarget) {
				return '<textarea style="width: 600px;height: 40px;background: #dddddd;">' + object.outerHTML + '</textarea>';
			}
			return object;
		}
	};

	$ehr.drawCanvas = function drawCanvas(canvas, transform, getSelected, moveTo) {
		var drawData = [], images = {};
		var ctx = canvas.getContext('2d');
		var tempPoint = null;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#dddddd';
		if (transform instanceof Array) {
			ctx.transform.apply(ctx, transform);
		} else if (typeof transform === 'function') {
			moveTo = getSelected;
			getSelected = transform;
			transform = null;
		}
		addDrag(getSelected, moveTo);
		canvas.render = function () {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			$ehr.each(drawData, function (args, index) {
				args.range.length = 0;
				args.isActive = true;
				draw.apply(null, args.nodes);
				args.isActive = false;
			});
		};

		return $draw;

		function $draw() {
			var $arguments = [];
			$ehr.each(arguments, function (arg) {
				if (arg instanceof Array) {
					$arguments.push(arg);
				} else if (typeof arg === 'string') {
					$arguments.push.apply($arguments, toArray(arg));
				} else if (typeof arg === 'boolean') {
					drawData.length = 0;
				}
			});
			if (!arguments.length) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.closePath();
				ctx.beginPath();
				drawData.length = 0;
			} else {
				var args = { nodes: $arguments, range: [] };
				drawData.push(args);
				args.isActive = true;
				draw.apply(null, args.nodes);
				args.isActive = false;
			}
			return $draw;
		}

		function draw() {
			var $arguments = arguments;
			ctx.beginPath();
			$ehr.each(arguments, function (node) {
				node.update = function () { };
				switch (node.length) {
					case 1:
						if (typeof node[0] === 'string') {
							ctx.fillText(node[0], tempPoint[0], tempPoint[1]);
						} else if (typeof node[0] === 'number') {
							ctx.arc(tempPoint[0], tempPoint[1], node[0], 0, Math.PI * 2, true);
							updateRange(tempPoint[0] - node[0], tempPoint[1] - node[0]);
							updateRange(tempPoint[0] + node[0], tempPoint[1] + node[0]);
						}
						break;
					case 2:
						if (typeof node[0] === 'string' && typeof node[1] === 'string') {
							if (node[0].indexOf('#') !== -1) {
								ctx.strokeStyle = node[0];
								ctx.fillStyle = node[1];
							} else {
								ctx.font = node[0];
								ctx.fillText(node[1], tempPoint[0], tempPoint[1]);
							}
						} else if (typeof node[0] === 'number' && typeof node[1] === 'number') {
							if (!tempPoint) {
								tempPoint = node;
								ctx.moveTo(tempPoint[0], tempPoint[1]);
							} else {
								ctx.lineTo(node[0], node[1]);
								tempPoint = node;
							}
							updateRange(tempPoint[0], tempPoint[1]);
							node.update = function () { node[0] = node[0] + arguments[0]; node[1] = node[1] + arguments[1]; };
						}
						break;
					case 3:
						if (node[0] === null) {
							tempPoint = [node[1], node[2]];
							ctx.moveTo(tempPoint[0], tempPoint[1]);
							updateRange(tempPoint[0], tempPoint[1]);
							node.update = function () { node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1]; };
						} else if (node[0] === true) {
							ctx.fillRect(tempPoint[0], tempPoint[1], node[1], node[2]);
							tempPoint = node;
							updateRange(tempPoint[0], tempPoint[1]);
							updateRange(tempPoint[0] + node[1], tempPoint[1] + node[2]);
						} else if (node[0] === false) {
							ctx.strokeRect(tempPoint[0], tempPoint[1], node[1], node[2]);
							tempPoint = node;
							updateRange(tempPoint[0], tempPoint[1]);
							updateRange(tempPoint[0] + node[1], tempPoint[1] + node[2]);
						} else if (typeof node[0] === 'string' && typeof node[1] === 'string') {
							ctx.strokeStyle = node[0];
							ctx.fillStyle = node[1];
							ctx.lineWidth = node[2];
						} else if (typeof node[0] === 'string') {
							drawImage.apply(null, node);
							updateRange(node[1], node[2]);
							node.update = function () { node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1]; };
						} else if (typeof node[0] === 'number') {
							ctx.arc(node[0], node[1], node[2], 0, Math.PI * 2, true);
							tempPoint = node;
							updateRange(tempPoint[0] - node[0], tempPoint[1] - node[0]);
							updateRange(tempPoint[0] + node[0], tempPoint[1] + node[0]);
							node.update = function () { node[0] = node[0] + arguments[0]; node[1] = node[1] + arguments[1]; };
						}
						break;
					case 4:
						if (node[0] === true) {
							ctx.arc(node[1], node[2], node[3], 0, Math.PI * 2, true);
							ctx.fill();
							ctx.stroke();
							ctx.closePath();
							ctx.beginPath();
							tempPoint = node;
							updateRange(tempPoint[0] - node[1], tempPoint[1] - node[1]);
							updateRange(tempPoint[0] + node[1], tempPoint[1] + node[1]);
							node.update = function () { node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1]; };
						} else if (node[0] === false) {
							ctx.arc(node[1], node[2], node[3], 0, Math.PI * 2, true);
							ctx.fill();
							tempPoint = node;
							updateRange(tempPoint[0] - node[1], tempPoint[1] - node[1]);
							updateRange(tempPoint[0] + node[1], tempPoint[1] + node[1]);
							node.update = function () { node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1]; };
						} else if (typeof node[3] === 'string') {
							var fillStyleTenp = ctx.fillStyle;
							ctx.stroke();
							ctx.fillStyle = '#' + node[3].split('#').pop() || ctx.fillStyle;
							ctx.font = node[3].split('#').shift() || ctx.font;
							ctx.fillText(node[2], node[0], node[1]);
							ctx.stroke();
							ctx.fillStyle = fillStyleTenp;
							node.update = function () { node[0] = node[0] + arguments[0]; node[1] = node[1] + arguments[1]; };
						} else {
							ctx.quadraticCurveTo(node[0], node[1], node[2], node[3]);
							tempPoint = [node[2], node[3]];
							updateRange(node[0], node[1]);
							updateRange(node[2], node[3]);
							node.update = function () {
								node[0] = node[0] + arguments[0]; node[1] = node[1] + arguments[1];
								node[2] = node[2] + arguments[0]; node[3] = node[3] + arguments[1];
							};
						}
						break;
					case 5:
						if (node[0] === null) {
							ctx.moveTo(node[1], node[2]);
							ctx.lineTo(node[3], node[4]);
							tempPoint = [node[3], node[4]];
							updateRange(node[1], node[2]);
							updateRange(node[3], node[4]);
							node.update = function () {
								node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1];
								node[3] = node[3] + arguments[0]; node[4] = node[4] + arguments[1];
							};
						} else if (node[0] === true) {
							if (typeof node[3] === 'string') {
								var fillStyle = ctx.fillStyle;
								ctx.stroke();
								ctx.fillStyle = '#' + node[4].split('#').pop() || ctx.fillStyle;
								ctx.font = node[4].split('#').shift() || ctx.font;
								ctx.fillText(node[3], node[1], node[2]);
								ctx.stroke();
								ctx.fillStyle = fillStyle;
								node.update = function () { node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1]; };
							} else {
								ctx.fillRect(node[1], node[2], node[3], node[4]);
								tempPoint = node;
								updateRange(node[1], node[2]);
								updateRange(node[3], node[4]);
								node.update = function () {
									node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1];
								};
							}
						} else if (node[0] === false) {
							if (typeof node[3] === 'string') {
								var strokeStyle = ctx.strokeStyle;
								ctx.stroke();
								ctx.strokeStyle = '#' + node[4].split('#').pop() || ctx.strokeStyle;
								ctx.font = node[4].split('#').shift() || ctx.font;
								ctx.strokeText(node[3], node[1], node[2]);
								ctx.stroke();
								ctx.strokeStyle = strokeStyle;
								node.update = function () { node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1]; };
							} else {
								ctx.strokeRect(node[1], node[2], node[3], node[4]);
								tempPoint = node;
								updateRange(node[1], node[2]);
								updateRange(node[3], node[4]);
								node.update = function () {
									node[1] = node[1] + arguments[0];
									node[2] = node[2] + arguments[1];
								};
							}
						} else if (typeof node[0] === 'string') {
							drawImage.apply(null, node);
							updateRange(node[1], node[2]);
							updateRange(node[1] + node[3], node[2] + node[4]);
							node.update = function () { node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1]; };
						} else if (typeof node[0] === 'number') {
							ctx.arc(node[0], node[1], node[2], node[3], node[4], true);
							tempPoint = node;
							updateRange(tempPoint[0] - node[1], tempPoint[1] - node[1]);
							updateRange(tempPoint[0] + node[1], tempPoint[1] + node[1]);
							node.update = function () {
								node[0] = node[0] + arguments[0]; node[1] = node[1] + arguments[1];
							};
						}
						break;
					case 6:
						if (node[0] === true) {
							ctx.stroke();
							ctx.closePath();
							ctx.beginPath();
							ctx.arc(node[1], node[2], node[3], node[4], node[5], true);
							ctx.fill();
							ctx.stroke();
							ctx.closePath();
							ctx.beginPath();
							tempPoint = [node[1], node[2]];
							updateRange(node[1] - node[3], node[2] - node[3]);
							updateRange(node[1] + node[3], node[2] + node[3]);
							node.update = function () {
								node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1];
							};
						} else if (node[0] === false) {
							ctx.stroke();
							ctx.closePath();
							ctx.beginPath();
							ctx.arc(node[1], node[2], node[3], node[4], node[5], true);
							ctx.stroke();
							ctx.closePath();
							ctx.beginPath();
							tempPoint = [node[1], node[2]];
							updateRange(node[1] - node[3], node[2] - node[3]);
							updateRange(node[1] + node[3], node[2] + node[3]);
							node.update = function () {
								node[1] = node[1] + arguments[0]; node[2] = node[2] + arguments[1];
							};
						} else {
							ctx.bezierCurveTo(node[0], node[1], node[2], node[3], node[4], node[5]);
							tempPoint = [node[4], node[5]];
							updateRange(node[0], node[1]);
							updateRange(node[2], node[3]);
							updateRange(node[4], node[5]);
							node.update = function () {
								node[0] = node[0] + arguments[0]; node[1] = node[1] + arguments[1];
								node[2] = node[2] + arguments[0]; node[3] = node[3] + arguments[1];
								node[4] = node[4] + arguments[0]; node[5] = node[5] + arguments[1];
							};
						}

						break;
					case 9:
						if (typeof node[0] === 'string') {
							drawImage.apply(null, node);
							updateRange(node[5], node[6]);
							updateRange(node[5] + node[7], node[6] + node[8]);
							node.update = function () { node[5] = node[5] + arguments[0]; node[6] = node[6] + arguments[1]; };
						}
						break;
				}
				ctx.stroke();
			});
			ctx.closePath();
		}

		function drawImage() {
			var args = $ehr.each(arguments);
			if (!images[arguments[0]]) {
				args[0] = new Image();
				args[0].src = arguments[0];
				args[0].onload = function () {
					ctx.drawImage.apply(ctx, args);
				};
				images[arguments[0]] = args[0];
			} else {
				args[0] = images[arguments[0]];
				ctx.drawImage.apply(ctx, args);
			}
		}

		function updateRange() {
			var range = $ehr.filter(drawData, function (i) { return i.isActive; }, function (i) { return i.range; }, 0) || [];
			if (!range.length) {
				range[0] = arguments[0];
				range[1] = arguments[1];
				range[2] = arguments[0];
				range[3] = arguments[1];
			}
			if (range[0] > arguments[0]) {
				range[0] = arguments[0];
			}
			if (range[2] < arguments[0]) {
				range[2] = arguments[0];
			}
			if (range[1] > arguments[1]) {
				range[1] = arguments[1];
			}
			if (range[3] < arguments[1]) {
				range[3] = arguments[1];
			}
		}

		function defaultGetSelected(items, e) {
			for (var i = 0; i < items.length; i++) {
				if (filter(items[i].range)) {
					return items[i].nodes;
				}
			}
			function filter(node) {
				return e.offsetX > node[0] && e.offsetX < node[2] && e.offsetY > node[1] && e.offsetY < node[3];
			}
		}

		function addDrag() {
			var temp = { canMove: true, currNode: null };
			canvas.addEventListener('mousedown', function (e) {
				temp.currNode = (getSelected || defaultGetSelected)(drawData, e);
				if (temp.currNode === true) {
					temp.currNode = defaultGetSelected(drawData, e);
				}
				if (temp.currNode && temp.canMove) {
					temp.e = e;
					temp.move = true;
					canvas.style.cursor = 'move';
				} else {
					temp.draw = true;
					if (moveTo('M' + e.offsetX + ',' + e.offsetY, e)) {
						ctx.moveTo(e.offsetX, e.offsetY);
					}
				}
			});
			canvas.addEventListener('mouseup', function (e) {
				temp.move = false;
				temp.draw = false;
				canvas.style.cursor = 'default';
			});
			canvas.addEventListener('mouseover', function (e) {
				temp.move = false;
				temp.draw = false;
				canvas.style.cursor = 'default';
			});
			canvas.addEventListener('mousemove', function (e) {
				var vector = [e.clientX - (temp.e || e).clientX, e.clientY - (temp.e || e).clientY];
				temp.e = e;
				if (temp.currNode && temp.currNode.length && temp.move) {
					$ehr.filter(temp.currNode, function (i) { return !!i.update; }, function (node) {
						if (moveTo) {
							moveTo(drawData, node, vector);
						}
						node.update(vector[0], vector[1]);
					});
					canvas.render();
				} else if (temp.draw) {
					if (moveTo('L' + [e.offsetX + ',' + e.offsetY], e)) {
						ctx.lineTo(e.offsetX, e.offsetY);
						ctx.stroke();
					}
				}
			});
		}

		function toArray(str) {
			var group = [], flag, temp, level = 0;
			for (var i = 0; i < str.length; i++) {
				if (!level && /[a-z|A-Z]/.test(str[i])) {
					if (flag) {
						group.push({ flag: flag, path: temp });
					}
					flag = str[i];
					temp = '';
				} else {
					if (str[i] === '[') {
						level++;
					} else if (str[i] === ']') {
						level--;
					}
					temp = temp + str[i];
				}
			}
			if (flag) {
				group.push({ flag: flag, path: temp });
			}

			function split(str) {
				var stringList = [], level = 0;
				$ehr.each(str, function (ch) {
					if (ch === '[') {
						if (!level) {
							stringList[stringList.length] = '';
						}
						level++;
					} else if (ch === ']') {
						level--;
					} else {
						if (level) {
							stringList[stringList.length - 1] += ch;
						}
					}
				});
				$ehr.each(stringList, function (old, index) {
					str = str.replace('[' + old + ']', '#&' + index);
				});
				return $ehr.each(str.split(/[,| ]/), function (value) {
					return /^#&.*/.test(value) ? stringList[value.replace('#&', '')] : value;
				});
			}

			return $ehr.each(group, function (item) {
				var d = split(item.path);
				switch (item.flag) {
					case 't':
						return [false, parseFloat(d[0]), parseFloat(d[1]), d[2], d[3]];
					case 'T':
						return [true, parseFloat(d[0]), parseFloat(d[1]), d[2], d[3]];
					case 'm':
					case 'M':
						return [null, parseFloat(d[0]), parseFloat(d[1])];
					case 'l':
					case 'L':
						return [parseFloat(d[0]), parseFloat(d[1])];
					case 'r':
						return [false, parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3])];
					case 'R':
						return [true, parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3])];
					case 'a':
						return [false, parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]) * Math.PI, parseFloat(d[4]) * Math.PI];
					case 'A':
						return [true, parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]) * Math.PI, parseFloat(d[4]) * Math.PI];
					case 'q':
					case 'Q':
						return [parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3])];
					case 'b':
					case 'B':
						return [parseFloat(d[0]), parseFloat(d[1]), parseFloat(d[2]), parseFloat(d[3]), parseFloat(d[4]), parseFloat(d[5])];
				}
				return [];
			});
		}
	};

	$ehr.helper = function (related) {
		var helper = $ehr.new('ul', { position: 'fixed', background: '#dddddd', cursor: 'pointer' });
		helper.show = show;
		return helper;

		function show(messages, info) {
			var lenght = (related.value.match(/\n/g) || []).length * related.offsetWidth + (related.value.length - related.value.lastIndexOf('\n')) * 6.8;
			$ehr.new(helper, { padding: '1px', listStyleType: 'none', left: related.offsetLeft + (lenght % related.offsetWidth) + 'px', top: related.offsetTop + (Math.floor(lenght / related.offsetWidth) * 15) + 'px' }, info || '');

			if (!messages || !messages.length) {
				helper.style.display = 'none';
			} else {
				$ehr.each(messages, function (message) {
					var item = $ehr.new('li', { color: '#6666ff', margin: '2px' }, message, function () {
						related.value = related.value.slice(0, related.value.length - 1) + message + ' ';
						helper.style.display = 'none';
						related.focus();
					});
					helper.appendChild(item);
					item.onmouseenter = function () {
						$ehr.new(item, { opacity: 0.6, color: '#ffffff', background: '#3333ff' });
					};
					item.onmouseleave = function () {
						$ehr.new(item, { opacity: 1.0, color: '#6666ff', background: 'none' });
					};
				});
				helper.style.display = 'block';
			}
		}
	};

	$ehr.editObject = function editObject(data) {
		if (typeof data === 'function') {
			var objectTElement = $ehr.new('textarea', { width: '98%', height: 400, background: '#dddddd' }, data);

			if (Object.getOwnPropertyNames(data).length > 5) {
				var objectFElement = $ehr.new('div', { border: '1px solid #999999', height: '100px' });
				objectFElement.appendChild(objectTElement);
				$ehr.each(data, function (value, pro) {
					objectFElement.appendChild(eachObject(value, pro));
				});
				return objectFElement;
			} else {
				return objectTElement;
			}
		} else if (typeof data === 'object') {
			var objectElement = $ehr.new('div', { border: '1px solid #999999' });
			$ehr.each(data, function (value, pro) {
				objectElement.appendChild(eachObject(value, pro));
			});
			return objectElement;
		} else {
			return $ehr.new('input');
		}

		function eachObject(value, pro) {
			var childElement = $ehr.new('div');
			var childLabelElement = $ehr.new('div', { margin: '1% 0% 0% 1%', fontWeight: 'bold', cursor: 'pointer' }, pro, childLabelElementOnclick);
			var childValueElement = $ehr.new(editObject(value), { margin: '0% 0% 0% 2%', width: '96%' }, value);
			childElement.appendChild(childLabelElement);
			childElement.appendChild(childValueElement);

			return childElement;

			function childLabelElementOnclick() {
				if (childValueElement.style.display === 'none') {
					$ehr.new(childLabelElement, { display: 'block', color: '' });
				} else {
					$ehr.new(childLabelElement, { display: 'none', color: '#0000ff' });
				}
			}
		}
	};

	$ehr.dialog = function (title, content, buttons) {
		var panelParent = $ehr.new('div', { position: 'fixed', top: 0, left: 0, width: window.document.body.scrollWidth + 'px', height: window.document.body.scrollHeight + 'px' });
		var panel = $ehr.new('div', { background: '#009900' });

		var header = $ehr.new('div', { textAlign: 'center', fontSize: '2em' }, $ehr.translate(title, title));
		var footer = $ehr.new('div', { textAlign: 'center' });

		drag(panel);
		panel.appendChild(header);
		panel.appendChild(content);
		panel.appendChild(footer);
		panelParent.appendChild(panel);


		if ($ehr.isPc) {
			$ehr.new(panelParent, { background: 'rgba(123,123,123,0.6)' });
			$ehr.new(panel, {
				'position': 'absolute',
				'margin-left': '50%',
				'top': '50%',
				'transform': 'translate(-50%,-50%)',
				'outline': '5px solid #ffffff',
				'outline-offset': '5px'
			});
		} else {
			$ehr.new(panelParent, { background: 'rgb(123,123,123)' });
			panel.style.zoom = 2;
		}

		if (!buttons || !buttons.length) {
			var close = $ehr.new('a', 'btn-close', '&times', {
				onclick: function () {
					panelParent.parentNode.removeChild(panelParent);
				}
			});
			header.appendChild(close);
		}

		$ehr.filter(buttons, function (button) {
			return !button.filter || button.filter(content);
		}, function (button) {
			var buttonEl = $ehr.new('button', { margin: '5px 1em' }, $ehr.translate(button.name), function (e) {
				(button.fn || button).apply(buttonEl, [e, { dialog: panelParent, content: content }]);
			});
			footer.appendChild(buttonEl);
		});

		return panelParent;

		function drag(dialog) {
			var temp = {};
			dialog.addEventListener('mousedown', function (e) {
				window.document.body.addEventListener('mousemove', mousemove);
				temp.e = e;
				temp.x = e.clientX - (parseInt(dialog.style.left) || (dialog.parentNode.offsetWidth - dialog.offsetWidth) / 2);
				temp.y = e.clientY - (parseInt(/%/.test(dialog.style.top) ? '' : dialog.style.top) || (dialog.parentNode.offsetHeight - dialog.offsetHeight) / 2);
				dialog.style.cursor = 'move';
			});
			dialog.addEventListener('mouseup', function (e) {
				window.document.body.removeEventListener('mousemove', mousemove);
				dialog.style.cursor = 'default';
			});


			function mousemove(e) {
				$ehr.new(dialog, {
					transform: null,
					marginLeft: null,
					left: e.clientX - temp.x + 'px',
					top: e.clientY - temp.y + 'px'
				});
			}
		}
	};
	$ehr.editForm = function (columns, entity, buttons) {
		var labelWidth = 200, inputWidth = 200, oldEntity = $ehr.extend({}, entity);
		var types = {
			string: 'text',
			date: 'datetime-local',
			datetime: 'datetime-local',
			int32: 'number',
			double: 'number'
		};

		var panel = $ehr.new($ehr.new('div', 'edit-from-entering'), { borderTop: '1px solid #999999', padding: '2%', overflow: 'hidden', width: 40 + labelWidth + inputWidth + 'px' });


		$ehr.filter(columns, function (column) {
			return column.show;
		},
			function (column) {
				var row = $ehr.new('div', { margin: '2% 2%' });
				row.style.margin = '2% 2%';

				var input, label = $ehr.new('div', { display: 'inline-block', width: labelWidth + 'px', fontWeight: 'bold' });

				if (column.regular && column.regular.length) {
					label.innerHTML = $ehr.hump(column.title && column.title[user.language] || column.name) + '<em style="color: red">**</em> ';
				} else {
					label.innerHTML = $ehr.hump(column.title && column.title[user.language] || column.name);
				}
				if (column.selection) {
					input = $ehr.new($ehr.each(column.selection).toObject(function (i) { return i.id || i; }, function (i) { return (i.name || i) + ' - ' + (i.info || i); }));
				} else {
					input = $ehr.new('input');
					input.type = types[column.type.toLocaleLowerCase()] || column.type.toLocaleLowerCase();
				}

				if (['date', 'datetime'].indexOf(column.type.toLocaleLowerCase()) !== -1) {
					var value = new Date(entity[column.name[0].toLocaleLowerCase() + column.name.slice(1)]) || new Date();
					input.value = repair(value.getFullYear(), 4) + '-' + repair(value.getMonth() + 1, 2) + '-' + repair(value.getDate(), 2) + 'T' + repair(value.getHours(), 2) + ':' + repair(value.getMinutes(), 2) + ':' + repair(value.getSeconds(), 2);

				} else {
					input.value = entity[column.name[0].toLocaleLowerCase() + column.name.slice(1)] || (column.selection && column.selection[0]) || '';
				}

				if (!column.update && entity.id && input.value) {
					input.disabled = 'disabled';
				}

				$ehr.new(input, { display: 'inline-block', width: inputWidth + 'px' });
				column.input = input;
				row.appendChild(label);
				row.appendChild(input);
				panel.appendChild(row);
			});


		$ehr.filter(buttons, function (button) {
			return !button.filter || button.filter(entity);
		}, function (button) {
			var buttonEl = $ehr.new('button', { float: 'right', marginTop: '5px', marginRight: 100 / (buttons.length + 1) + '%' }, $ehr.translate(button.name), function (e) {
				(button.fn || button).apply(buttonEl, [e, { entity: entity, canSubmit: canSubmit(), valueChange: !oldEntity.equal(entity) }]);
			});
			panel.appendChild(buttonEl);
		});

		return panel;

		function repair(value, place, char) {
			value = '' + value;
			while (value.length < place) {
				value = (char || 0) + value;
			}
			return value;
		}

		function canSubmit() {
			var submit = true;
			$ehr.each(columns, function (column) {
				if (column.show && column.input) {
					entity[column.field || column.name] = column.input.value;
					$ehr.each(column.regular, function (regular) {
						submit = submit && new RegExp(regular).test(entity[column.field || column.name]);
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

	$ehr.alert = function (msg, level, showButton) {
		if (typeof level === 'function') {
			showButton = level;
			level = 0;
		}

		var panel = $ehr.new('div', 'ehr-alert');
		var colors = ['#669966', '#666699', '#996666'];
		var div = $ehr.new('div', { background: colors[level] || colors[0], boxShadow: '#ff0000 0 0 ' + (level * 2 + 2) + 'px ' + (level * 2 + 2) + 'px' });
		var content = $ehr.new('div', null, msg);

		div.appendChild(content);
		if (showButton) {
			var buttons = $ehr.new('div');
			var okButton = $ehr.new('button', null, $ehr.translate('Ok'), function () {
				remove();
				showButton();
			});
			var cancelButton = $ehr.new('button', null, $ehr.translate('Cancel'), remove);

			buttons.appendChild(cancelButton);
			buttons.appendChild(okButton);
			div.appendChild(buttons);
		} else {
			var buttonClose = $ehr.new('span', 'btn-close', '&times;', remove);
			content.appendChild(buttonClose);
			setTimeout(function () {
				document.body.removeChild(panel);
			}, 5000);
		}

		panel.appendChild(div);
		if (!$ehr.isPc) {
			panel.style.zoom = 2;
		}
		document.body.appendChild(panel);

		function remove() {
			document.body.removeChild(panel);
		}
	};

	$ehr.load = function (url, option, callBack) {
		var $user = JSON.parse(window.localStorage[$ehr.url() + 'user-date/'] || '{}');
		if (user.id || ($user.id !== undefined) && Date.now() - $user.date < ($ehr.reLoginInterval || 60 * 1000)) {
			callBack();
		} else {
			var login = $ehr.new('div', { background: '#dd9999', position: 'fixed', padding: '10px', borderRadius: '10px', top: window.document.body.scrollHeight / 2 - 100 + 'px', left: window.document.body.scrollWidth / 2 - 100 + 'px' });

			var nameLabel = $ehr.new('div', { display: 'inline-block', width: '100px' }, $ehr.translate('Name'));
			var nameValue = $ehr.new(option.user || 'input', { display: 'inline-block', fontSize: '1em' }, JSON.parse(window.localStorage[$ehr.url() + 'user-date/'] || '{}').name || '');
			var passwordLabel = $ehr.new('div', { display: 'inline-block', width: '100px' }, $ehr.translate('Password'));
			var passwordValue = $ehr.new('input', { display: 'inline-block', fontSize: '1em' });
			var languageLabel = $ehr.new('div', { display: 'inline-block', width: '100px' }, $ehr.translate('Language'));
			var languageValue = $ehr.new(option.languages, { display: 'inline-block', fontSize: '1em' }, user.language || 1);
			var name = $ehr.new('div', { margin: '10px' });
			var password = $ehr.new('div', { margin: '10px' });
			var language = $ehr.new('div', { margin: '10px' });
			var loadButton = $ehr.new('button', { float: 'right', fontSize: '1em' }, $ehr.translate('Load'), function () { loginFn(login, nameValue, passwordValue, languageValue); });

			passwordValue.onkeydown = onkeydown(login, nameValue, passwordValue, languageValue);
			passwordValue.type = 'password';

			name.appendChild(nameLabel);
			name.appendChild(nameValue);
			password.appendChild(passwordLabel);
			password.appendChild(passwordValue);
			language.appendChild(languageLabel);
			language.appendChild(languageValue);
			login.appendChild(name);
			login.appendChild(password);
			login.appendChild(language);
			login.appendChild(loadButton);
			document.body.appendChild(login);

			if (!$ehr.isPc) {
				$ehr.each([nameLabel, passwordLabel, languageLabel], function (el) {
					$ehr.each({ width: '220px' }, function (val, pro) {
						el.style[pro] = val;
					});
				});
				$ehr.new(login, { left: 0, fontSize: '3em' });
				$ehr.new(login, { left: (window.document.body.clientWidth - login.clientWidth) / 2 + 'px' });
			}


		}

		function onkeydown(login, nameValue, passwordValue, languageValue) {
			return function (e) {
				if (e.keyCode === $ehr.keyCodes.ENTER) {
					loginFn(login, nameValue, passwordValue, languageValue);
				}
			};
		}

		function loginFn(login, nameValue, passwordValue, languageValue) {
			$ehr.http(url + '?name=' + nameValue.value + '&password=' + $ehr.md5(passwordValue.value), function (res) {
				var d = res && JSON.parse(res);
				if (d) {
					user = $ehr.extend(user, { id: d.id, name: d.name, date: Date.now(), language: languageValue.value });
					window.localStorage[$ehr.url() + 'user-date/'] = JSON.stringify($ehr.extend(JSON.parse(window.localStorage[$ehr.url() + 'user-date/'] || '{}'), user));
					document.body.removeChild(login);
					callBack();
				} else {
					$ehr.alert($ehr.translate(['Login Faile', '登录失败']), 3);
				}
			});
		}
	};

	/*
	 * Javascript md5() 函数 用于生成字符串对应的md5值
	 * 吴先成  www.51-n.com ohcc@163.com QQ:229256237
	 * @param string string 原始字符串
	 * @return string 加密后的32位md5字符串
	 */
	$ehr.md5 = function md5(string) {
		function md5_RotateLeft(lValue, iShiftBits) {
			/*jshint -W016*/
			return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
		}
		function md5_AddUnsigned(lX, lY) {
			var lX4, lY4, lX8, lY8, lResult;
			/*jshint -W016*/
			lX8 = (lX & 0x80000000);
			lY8 = (lY & 0x80000000);
			lX4 = (lX & 0x40000000);
			lY4 = (lY & 0x40000000);
			lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
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

		function md5_F(x, y, z) {
			/*jshint -W016*/
			return (x & y) | ((~x) & z);
		}
		function md5_G(x, y, z) {
			/*jshint -W016*/
			return (x & z) | (y & (~z));
		}
		function md5_H(x, y, z) {
			/*jshint -W016*/
			return (x ^ y ^ z);
		}
		function md5_I(x, y, z) {
			/*jshint -W016*/
			return (y ^ (x | (~z)));
		}
		function md5_FF(a, b, c, d, x, s, ac) {
			a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
			return md5_AddUnsigned(md5_RotateLeft(a, s), b);
		}
		function md5_GG(a, b, c, d, x, s, ac) {
			a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
			return md5_AddUnsigned(md5_RotateLeft(a, s), b);
		}
		function md5_HH(a, b, c, d, x, s, ac) {
			a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
			return md5_AddUnsigned(md5_RotateLeft(a, s), b);
		}
		function md5_II(a, b, c, d, x, s, ac) {
			a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
			return md5_AddUnsigned(md5_RotateLeft(a, s), b);
		}
		function md5_ConvertToWordArray(string) {
			/*jshint -W016*/
			/*jshint -W064*/
			var lWordCount;
			var lMessageLength = string.length;
			var lNumberOfWords_temp1 = lMessageLength + 8;
			var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
			var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
			var lWordArray = Array(lNumberOfWords - 1);
			var lBytePosition = 0;
			var lByteCount = 0;
			while (lByteCount < lMessageLength) {
				lWordCount = (lByteCount - (lByteCount % 4)) / 4;
				lBytePosition = (lByteCount % 4) * 8;
				lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
				lByteCount++;
			}
			lWordCount = (lByteCount - (lByteCount % 4)) / 4;
			lBytePosition = (lByteCount % 4) * 8;
			lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
			lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
			lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
			return lWordArray;
		}
		function md5_WordToHex(lValue) {
			/*jshint -W016*/
			var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
			for (lCount = 0; lCount <= 3; lCount++) {
				lByte = (lValue >>> (lCount * 8)) & 255;
				WordToHexValue_temp = "0" + lByte.toString(16);
				WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
			}
			return WordToHexValue;
		}
		function md5_Utf8Encode(string) {
			/*jshint -W016*/

			string = string.replace(/\r\n/g, "\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else if ((c > 127) && (c < 2048)) {
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

		var x = [];
		var k, AA, BB, CC, DD, a, b, c, d;
		var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
		var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
		var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
		var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
		string = md5_Utf8Encode(string);
		x = md5_ConvertToWordArray(string);
		a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
		for (k = 0; k < x.length; k += 16) {
			AA = a; BB = b; CC = c; DD = d;
			a = md5_FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
			d = md5_FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
			c = md5_FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
			b = md5_FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
			a = md5_FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
			d = md5_FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
			c = md5_FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
			b = md5_FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
			a = md5_FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
			d = md5_FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
			c = md5_FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
			b = md5_FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
			a = md5_FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
			d = md5_FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
			c = md5_FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
			b = md5_FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
			a = md5_GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
			d = md5_GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
			c = md5_GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
			b = md5_GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
			a = md5_GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
			d = md5_GG(d, a, b, c, x[k + 10], S22, 0x2441453);
			c = md5_GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
			b = md5_GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
			a = md5_GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
			d = md5_GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
			c = md5_GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
			b = md5_GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
			a = md5_GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
			d = md5_GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
			c = md5_GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
			b = md5_GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
			a = md5_HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
			d = md5_HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
			c = md5_HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
			b = md5_HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
			a = md5_HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
			d = md5_HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
			c = md5_HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
			b = md5_HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
			a = md5_HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
			d = md5_HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
			c = md5_HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
			b = md5_HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
			a = md5_HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
			d = md5_HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
			c = md5_HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
			b = md5_HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
			a = md5_II(a, b, c, d, x[k + 0], S41, 0xF4292244);
			d = md5_II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
			c = md5_II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
			b = md5_II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
			a = md5_II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
			d = md5_II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
			c = md5_II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
			b = md5_II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
			a = md5_II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
			d = md5_II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
			c = md5_II(c, d, a, b, x[k + 6], S43, 0xA3014314);
			b = md5_II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
			a = md5_II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
			d = md5_II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
			c = md5_II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
			b = md5_II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
			a = md5_AddUnsigned(a, AA);
			b = md5_AddUnsigned(b, BB);
			c = md5_AddUnsigned(c, CC);
			d = md5_AddUnsigned(d, DD);
		}
		return (md5_WordToHex(a) + md5_WordToHex(b) + md5_WordToHex(c) + md5_WordToHex(d)).toLowerCase();
	};

	$ehr.promise = function (neme) {
		var promises = [];
		function Promise() { this.then = then; }

		return then;

		function then(fn) {
			if (typeof fn === 'function') {
				promises.push(fn);
				return then;
			} else {
				apply(promises, 0, arguments);
			}
		}

		function apply(list, index, args) {
			list[index].apply({
				index: index, next: function () {
					apply(list, index + 1, arguments);
				}
			}, args);
		}
	};


	$ehr.rang = function (x, y, width, height) {
		return $ehr.extend(new Rect(), {
			x: x, y: y, width: width, height: height
		});

		function contain(self, rang) {
			return !(beyond(self.x, self.x + self.width, rang.x) ||
				beyond(self.x, self.x + self.width, rang.x + rang.width) ||
				beyond(self.y, self.y + self.height, rang.y) ||
				beyond(self.y, self.y + self.height, rang.y + rang.height)
			);
		}
		function beyond(a, b, num) {
			return num < Math.min(a, b) || num > Math.max(a, b);
		}
		function Rect() {
			this.contain = function (rang) { return contain(this, rang); }
		}
	};


	$ehr.binding = (function () {

		var loadList = [], $id = 0;
		window.addEventListener('load', function () {
			$ehr.each(loadList, function (fn) {
				fn();
			});
			$ehr.binding(document, window);
		});

		return binding;

		function Binding(element, data) {
			this.get = function () { return element; };
			this.data = function () { return data; };
			this.appendTo = function (parent) { parent.appendChild(element); };
		}

		function binding(element, data, reserve) {
			if (typeof element === 'function') {
				loadList.push(element);
			} else if (typeof element === 'string') {
				element = createElement(element);
			}
			if (!data.$eval) {
				Object.defineProperty(data, '$id', { value: ++$id });
				Object.defineProperty(data, '$eval', { value: [] });

				$ehr.filter(data,function(i){return typeof i !== 'function' && !(i instanceof EventTarget);},function(oldVal,pro){
					Object.defineProperty(data, pro, {
						configurable: true,
						enumerable: true,
						set: function (val) {
							oldVal = val;
							$ehr.each(data.$eval, function (ev) { ev.fn() });
						},
						get: function () {
							return oldVal;
						}
					});
				});
			}
			setTimeout(function () {
				$ehr.each($ehr.filter(element.attributes, function (attr, i) {
					if (/^\[.+\]$/.test(attr.name)) {
						defineProperty(element, data, $name(attr.name.slice(1, -1)), attr.value);
						return true;
					} else if (/^\(.+\)$/.test(attr.name)) {
						watch(element, data, $name(attr.name.slice(1, -1)), attr.value);
						return true;
					}
				}), function (remove_attr) {
					if(!reserve && !$ehr.binding.reserve){
						element.removeAttribute(remove_attr.name);
					}
				});
				$ehr.each(element.children, function (child) {
					if (!child.scope) {
						binding(child, data);
					} else if (child.scope() !== data && data !== window) {
						child.scope().__proto__ = data;
					}
				});
			}, 10);

			extendElement(element, data);
			return new Binding(element, data);
		};

		function extendElement(element, data) {
			element.scope = function () {
				return data;
			};
			element.data = function () {
				return JSON.parse(JSON.stringify(data) || 'null');
			};
		}

		function $name(name) {
			var replaces = {
				class: 'className',
				fontsize: 'fontSize',
				innerhtml: 'innerHTML'
			};
			var fileds = Object.keys(replaces);
			$ehr.each(Object.keys(replaces), function (field) {
				name = name.replace(field, replaces[field]);
			});
			return name;
		}

		function createElement(string) {
			var parent = document.createElement('div');
			parent.innerHTML = string;
			return parent.children[0];
		}

		///defineProperty
		function defineProperty(element, data, field, value) {
			if (/^[0-9a-zA-Z\._$@]*$/.test(value)) {
				if (typeof $ehr.$value(data, value) === 'function') {
					$ehr.$value(element, field, function () {
						$ehr.$value(data, value).apply(data, arguments);
					});
				} else {
					var descriptor = Object.getOwnPropertyDescriptor(data, value) || {};
					$ehr.$value(element, field, $ehr.$value(data, value));
					Object.defineProperty(data, value, {
						configurable: true,
						enumerable: true,
						set: function (val) {
							$ehr.$value(element, field, val);
							if (descriptor.set) {
								descriptor.set(val);
							}
						},
						get: function () {
							return $ehr.$value(element, field) || (descriptor.get && descriptor.get());
						}
					});
					if (field === 'value') {
						element.onkeyup = function () {
							$ehr.$value(data, value, $ehr.$value(element, field));
						};
					}
				}

			} else {
				data.$eval.push({
					eval: value, fn: function () {
						$ehr.$value(element, field, $ehr.$value(data, value));
					}
				});
			}
		};

		///watch
		function watch(element, data, field, value) {
			if (!watch.createWatch) {
				watch.createWatch = initCreateWatch();
			}
			if (typeof $ehr.$value(data, value) === 'function') {
				$ehr.$value(element, field, function () {
					$ehr.$value(data, value).apply(data, arguments);
				});
			} else {
				$ehr.$value(element, field, $ehr.$value(data, value));
				watch.createWatch(element, data, field, value, function (val) {
					$ehr.$value(data, value, val);
					$ehr.$value(data, value, val);
				});
			}
		};

		function initCreateWatch() {
			var watchList = {};
			(function watch() {
				$ehr.each(Object.keys(watchList), function (key) {
					var newValue = watchList[key].value();
					if (newValue) {
						watchList[key].old = newValue;
						$ehr.each(watchList[key].list, function (fn) {
							fn(newValue);
						});
					}
				});
				setTimeout(watch, 100);
			})();

			return function createWatch(element, data, field, value, fn) {
				watchList[value] = watchList[value] || {
					old: $ehr.$value(data, value),
					value: function () {
						var d = $ehr.$value(data, value);
						var e = $ehr.$value(element, field);
						if (e !== this.old) {
							return e;
						}
						if (d !== this.old) {
							return d;
						}
					},
					list: []
				};
				watchList[value].list.push(fn);
				return watchList[value];
			}
		}


	})();


	window.$ehr = $ehr;

})(window, function (obj, str, valuer) {
	var pros = Object.keys(obj).sort(function (a, b) { return b.length - a.length; });
	for (var i = 0; i < pros.length; i++) {
		var da = valuer(obj, pros[i]),types = {function:['(',').bind(obj)'],string:'\'\''}[typeof da] || '  ';
		str = str.replace(new RegExp(pros[i], 'g'), types[0]+da+types[1]);
	}
	return eval(str);
});


// count*(cou+1)*(unt-1)  {count:12,cou:5,unt:3}  => co3*(5+1)  cou,count,unt