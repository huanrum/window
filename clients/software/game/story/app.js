/**
 * Created by Administrator on 2016/5/20.
 */
(function ($e, webSpeech) {
	'use strict';

	function getBooks(path, size) {
		return '../../../../ExplorerFile/Get?path=' + path + '&size=' + (size || null);
	}

	/*jshint -W117*/
	function speak(element, text, i) {
		element.innerHTML = text;
		element.id = Date.now();
		if (window.SpeechSynthesisUtterance) {
			var voices = window.speechSynthesis.getVoices();
			var msg = new SpeechSynthesisUtterance(element.innerText);
			msg.voice = voices[i || Math.floor(Math.random() * voices.length)];
			window.speechSynthesis.cancel();
			window.speechSynthesis.speak(msg);
			window.speechSynthesis.resume();
		} else {
			webSpeech.stopHtml();
			webSpeech.setVoice('en');
			webSpeech.speakHtml(element.id);
		}
	}

	window.addEventListener('load', function (e) {
		var height = document.body.scrollHeight;
		var menus = window.document.createElement('div');
		var content = window.document.createElement('div');
		var navFn = createNav(function getBookContent(value) {
			height = Math.min(height, document.body.scrollHeight);
			$e.http(getBooks(value.path, [Math.floor((height - menus.offsetHeight) / 40), value.index]), function (req) {
				var data = JSON.parse(req);
				value.end = !req;
				value.index = data.page;
				speak(content, data.content);
			});
		});
		menus.style.border = ' 0.1em solid #333333';
		content.className = 'text-content';

		window.document.body.appendChild(menus);
		window.document.body.appendChild(content);

		loadFile(menus, navFn, 'F:\\个人文件\\TXT\\');

	});


	function loadFile(menus, navFn, path) {
		$e.http(getBooks(path), function (res) {
			var data = { $Back$: null };
			menus.innerHTML = '';
			$e.each(document.getElementsByClassName('ehr-controls-tooltip'), function (el) { el.parentNode.removeChild(el); });
			$e.each(JSON.parse(res), function (v, k) { data[v.name || v.path.slice(0, v.path.length - 1).split('\\').pop()] = v; });
			$e.each($e.toElements(data, 10, function (el) {
				el.className = 'book-menu';
				menus.appendChild(el);
			}, function (e, value, pro, obj) {
				$e.each(menus.children, function (menu) { menu.className = menu.className.replace('active', ''); });
				this.className = this.className + ' active';
				if (value) {
					if (value.name) {
						navFn(value);
					} else {
						loadFile(menus, navFn, value.path);
					}
				} else {
					var paths = path.slice(0, path.length - 1).split('\\');
					paths.pop();
					loadFile(menus, navFn, paths.join('\\') + '\\');
				}
			}));
		});
	}

	function createNav(callBack) {
		var activeTab = null;
		var nav = window.document.createElement('div');
		nav.className = 'text-nav';

		create('div', 'pre', { onclick: click(false) });
		var text = create('input', 'text', { onkeydown: keydown });
		create('div', 'next', { onclick: click(true) });
		window.document.body.appendChild(nav);

		/*注册事件*/
		if (document.addEventListener) {
			document.addEventListener('DOMMouseScroll', scrollFunc, false);
		}//W3C
		window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome/Safari
		text.onfocus = function () { text.className += ' onfocus'; };
		text.onblur = function () { text.className = text.className.replace(' onfocus', ''); };


		return function (tab) {
			nav.style.display = 'block';
			tab.index = tab.index || 0;
			activeTab = tab;
			refresh();
		};

		function refresh() {
			text.value = activeTab.index;
			callBack(activeTab);
		}

		function create(type, className, extendObj) {
			var btn = window.document.createElement(type);
			btn.className = 'text-nav-' + className;
			$e.extend(btn, extendObj);
			nav.appendChild(btn);
			return btn;
		}

		function click(add) {
			return function () {
				if (!activeTab) { return; }
				if (add && !activeTab.end) {
					activeTab.index = activeTab.index + 1;
				} else if (activeTab.index > 0) {
					activeTab.index = activeTab.index - 1;
				}
				refresh();
			};
		}

		function keydown(e) {
			if (e.keyCode === $e.keyCodes.ENTER) {
				activeTab.index = text.value;
				refresh();
			}
		}

		function scrollFunc(e) {
			if (!scrollFunc.isRuning) {
				scrollFunc.isRuning = true;
				setTimeout(function () {
					click((e.wheelDelta || e.detail) < 0)();
					scrollFunc.isRuning = false;
				}, 50);
			}
		}

	}




})(window.$ehr, window.WebSpeech);