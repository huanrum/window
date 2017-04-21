/**
 * Created by sus on 2016/3/7.
 */
(function($e){
	'use strict';

	$e(function(){
		return {
			title:'Element',
			fn:function(panel) {
				panel.classList.add('html-element');
				panel.innerHTML = [
					'<article>article</article>',
					'<aside>aside</aside>',
					'<figcaption>figcaption</figcaption>',
					'<figure>figure</figure>',
					'<footer>footer</footer>',
					'<header>header</header>',
					'<hgroup></hgroup>',
					'<mark>hgroup</mark>',
					'<nav>nav</nav>',
					'<section>section</section>',
					'<time>time</time>',
					'<keygen>keygen</keygen>',
					'<meter value="">meter</meter>',
					'<summary>summary</summary>'
				].join('');
			}
		};
	});

	$e(function(){
		return {
			title:'Input',
			fn:function(panel,base) {
				panel.classList.add('html-input');
				panel.innerHTML = [
					'<input type="range" min="0" max="100" step="5">',
					'<input type="date">',
					'<input type="tel" autocomplete="on">',
					'<input type="text" list="animals"><datalist id="animals"><option>A1</option><option>A2</option><option>B2</option></datalist>',
					'<input type="text" pattern="[0-9]{5}" placeholder="enter your 5 digit id number">',
					'<meter value="3" min="0" max="100"></meter>',
					'<progress value="3" max="100" ></progress>'
				].join('');

				base.eachrun(function () {
					base.each(panel.getElementsByTagName('meter'), function (meter) {
						meter.value = (meter.value + 1) % 101;
					});

					base.each(panel.getElementsByTagName('progress'), function (progress) {
						if (!progress.isfall) {
							progress.value = progress.value + 2;
							if (progress.value >= 100) {
								progress.isfall = true;
							}
						} else {
							progress.value = progress.value - 2;
							if (progress.value <= 0) {
								progress.isfall = false;
							}
						}
					});

				}, 100);
			}
		};
	});

	$e(function(){
		return {
			title:'Css',
			fn:function(panel,base) {
				panel.classList.add('html-css');
				panel.innerHTML = [
					'<div class="view-port">',
						'<div id="card" class="card flipped">',
							'<div class="front-view">HTML5 Hacks</div>',
							'<div class="back-view">Rocks</div>',
						'</div>',
					'</div>'
				].join('');

				base.eachrun(function () {
					base.each(panel.getElementsByClassName('card'), function (elem) {
						elem.className = (elem.className === 'card' ? 'card flipped' : 'card');
					});
				}, 2000);
			}
		};
	});

	$e(function(){
		return {
			title:'Svg',
			fn:function(panel,base) {
				panel.classList.add('html-css');
				panel.innerHTML = [
					'<svg version="1.1" width="100%" height="400px">',
						'<rect x="0" y="20" width="100%" height="200" fill="pink" stroke="black" stroke-width="1" />',
						'<path fill="blue" stroke="black" stroke-width="1" d="m 156.791 153.057 c -9.74527 49.4908 -25.452 56.2143 -6.50634 98.3855 c 19.9457 42.1246 24.0317 43.9411 35.476 53.4249 c 12.4416 9.44071 18.5725 12.1615 16.8043 17.2493 c -0.769961 5.03863 -11.208 17.5277 -0.992045 22.065 c 10.2625 5.53466 43.4056 8.02097 74.1791 -19.4093 c 32.6795 -29.5225 40.4336 -56.9 44.4686 -78.1055 c 5.07809 -20.2502 -17.3534 -64.2408 -29.2094 -82.7158 c -11.8569 -18.4741 -134.22 -10.894 -134.22 -10.894 Z" style="fill:#ffb039;fill-opacity:1;stroke:#ff4c01;stroke-width:4;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none;display:inline;">',
							'<animath  attributeType="XML" attributeName="d" path="M 0 0 H 380 Z" dur="3s" repeatCount="indefinite" fill="freeze" />',
						'</path>',
					'</svg>'
				].join('');
			}
		};
	});

	$e(function(){
		return {
			title:'Interactive',
			fn:function(panel,base) {
				panel.classList.add('html-interactive');
				panel.innerHTML = [
					'<div draggable="true">Drag</div>',
					'<div dropzone="true">Drop</div>',
					'<div contenteditable="true">Edit</div>',
					'<div onclick="document.designMode=(document.designMode === \'on\'?\'off\':\'on\');this.innerHTML = \'WYSIWYG<br>\' + document.designMode">WYSIWYG</div>'
				].join('');

			}
		};
	});

	$e(function(){
		return {
			title:'Worker',
			fn:function(panel,base) {
				panel.classList.add('html-worker');
				panel.innerHTML = [
						'<div>var worker = new window.Worker("javascripts/greyscale.js")</div>'
					].join('');

			}
		};
	});

})(window.$ehr);