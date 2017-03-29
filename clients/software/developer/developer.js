/**
 * Created by Administrator on 2016/6/24.
 */
(function(window){
	'use strict';

	window.addEventListener('load',function(){
		var contentElement = document.createElement('iframe');
		var eareCss = document.createElement('textarea');
		var eareHtml = document.createElement('textarea');
		var eareJs = document.createElement('textarea');

		document.body.appendChild(contentElement);
		document.body.appendChild(eareCss);
		document.body.appendChild(eareHtml);
		document.body.appendChild(eareJs);

		addStyle.call(null,contentElement,eareCss,eareHtml,eareJs);
		bindDeveloper(eareCss,eareHtml,eareJs,contentElement.contentDocument);
	});

	function addStyle(){
		for(var i=0;i<arguments.length;i++){
			arguments[i].style.display = 'inline-block';
			arguments[i].style.width = (i%2?'38%':'60%');
			arguments[i].style.marginLeft = '5px';
			arguments[i].style.height = (window.document.body.scrollHeight - 40)/(arguments.length/2) + 'px';
		}
	}

	function bindDeveloper(eareCss,eareHtml,eareJs,contentElement){
		var css = document.createElement('style');
		var js = document.createElement('script');
		contentElement.head.appendChild(css);
		contentElement.head.appendChild(js);

		eareCss.value = '/*输入样式*/\n a{\n  background:#99ff99;\n}\n';
		eareHtml.value = '<!--输入标签-->\n<a href="http://www.baidu.com">Baidu</a>\n';
		eareJs.value = '/*输入脚本*/\n';

		eareCss.onkeyup = update;
		eareHtml.onkeyup = update;
		eareJs.onkeyup = update;

		update();
		function update(){
			css.innerHTML = eareCss.value;
			js.innerHTML = eareJs.value;
			contentElement.body.innerHTML = eareHtml.value;
		}
	}

})(window);