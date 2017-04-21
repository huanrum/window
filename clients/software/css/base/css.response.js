/**
 * Created by sus on 2016/2/25.
 */
(function($e,$){
	'use strict';

	$e(function base() {
		return {
			title: 'Base',
			fn:function(panel,base){
				panel.classList.add('base-body');
				base.each(20,function(index){
					panel.innerHTML += '<div class="base-body-'+index+'">'+index+'</div>';
				});
			}

		};

	});

	$e(function learn() {
		return {
			title: 'Learn',
			fn:function(panel,base){
				panel.classList.add('learn-body');
				backgroundOrigin(panel,base);
				textShadow(panel,base);
				transition(panel,base);
				keyframes(panel,base);
				others(panel,base);
			}
		};

		function backgroundOrigin(panel,base){
			var int = 0;
			var div = document.createElement('div');
			div.className = 'learn-body-background-origin';
			panel.appendChild(div);

			base.eachrun(function () {
				div.style.opacity = (int++) % 100 / 100;
			}, 100);
		}

		function textShadow(panel,base){
			var int = 0;
			var div = document.createElement('div');
			div.className = 'learn-body-text-shadow';
			base.each(9,function(index){
				var child = document.createElement('div');
				child.className = 'learn-body-text-shadow-'+index;
				div.appendChild(child);
			});
			panel.appendChild(div);
			base.eachrun(function () {
				int++;
				base.each(div.childNodes, function (c) {
					c.innerHTML = int;
				});
			}, 1000);
		}

		function transition(panel,base){
			var int = 0;
			var div = document.createElement('div');
			div.className = 'learn-body-transition';
			base.each(6,function(index){
				var child = document.createElement('div');
				child.className = 'learn-body-transition-'+index;
				div.appendChild(child);
			});
			panel.appendChild(div);
		}

		function keyframes(panel,base){
			var int = 0;
			var div = document.createElement('div');
			div.className = 'learn-body-keyframes';
			base.each(2,function(index){
				var child = document.createElement('div');
				child.className = 'learn-body-keyframes-'+index;
				child.innerHTML = index;
				div.appendChild(child);
			});
			panel.appendChild(div);
		}

		function others(panel,base){
			var int = 0;
			var div = document.createElement('div');
			div.className = 'learn-body-others';
			base.each(4,function(index){
				var child = document.createElement('div');
				child.className = 'learn-body-others-'+index;
				child.innerHTML = index;
				div.appendChild(child);
			});
			panel.appendChild(div);
		}

	});

	$e(function form() {
		return {
			title: 'Form',
			fn:function(panel,base){
				panel.classList.add('form-body');
				panel.innerHTML = [
					'<form id="redemption" method="post">',
						'<hgroup>',
							'<h1>Oscar Redemption</h1>',
							'<h2>Here\'s your chance to set the record straight: tell us what year the wrong film got nominated, and which film <b>should</b> have received a nod...</h2>',
						'</hgroup>',
						'<fieldset>',
							'<legend>About the offending film (part 1 of 3)</legend>',
							'<div>',
								'<label for="film">The film in question?</label>',
								'<input id="film" name="film" type="text" placeholder="e.g. King Kong" required aria-required="true" >',
							'</div>',

							'<div>',
								'<label for="search">Search the site...</label>',
								'<input id="search" name="search" type="search" placeholder="Wyatt Earp" autofocus>',
							'</div>',

							'<div>',
								'<label for="awardWon">Award Won</label>',
								'<input id="awardWon" name="awardWon" type="text" list="awards">',
								'<datalist id="awards">',
									'<select>',
										'<option value="Best Picture"></option>',
										'<option value="Best Director"></option>',
										'<option value="Best Adapted Screenplay"></option>',
										'<option value="Best Original Screenplay"></option>',
									'</select>',
								'</datalist>',
							'</div>',

							'<div>',
								'<label for="email">Your Email address</label>',
								'<input id="email" name="email" type="email" placeholder="dwight.schultz@gmail.com" required aria-required="true">',
							'</div>',
							'<div>',
								'<label for="yearOfCrime">Year Of Crime</label>',
								'<input id="yearOfCrime" name="yearOfCrime" type="number" min="1929" max="2015" required aria-required="true" >',
							'</div>',
							'<div>',
								'<label for="web">Your Web address</label>',
								'<input id="web" name="web" type="url" placeholder="www.mysite.com">',
							'</div>',
						'</fieldset>',
					'</form>'
				].join('');
			}

		};

	});

})(window.$ehr,window.jQuery);