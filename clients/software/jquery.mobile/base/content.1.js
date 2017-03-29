/**
 * Created by sus on 2015/12/28.
 */
(function(){
	'use strict';

	window.contentFunc = window.contentFunc || [];

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview">',
				'<li><a>0-1</a></li>',
				'<li><a>0-2</a></li>',
				'<li><a>0-3</a></li>',
				'<li><a>0-4</a></li>',
				'<li><a>0-5</a></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview" data-inset="true">',
			'<li><a>0-1</a></li>',
			'<li><a>0-2</a></li>',
			'<li><a>0-3</a></li>',
			'<li><a>0-4</a></li>',
			'<li><a>0-5</a></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview" data-inset="true">',
			'<li data-role="list-divider"><a>0-1</a></li>',
			'<li><a>0-1</a></li>',
			'<li><a>0-1-1</a></li>',
			'<li><a>0-1-2</a></li>',
			'<li data-role="list-divider"><a>0-2</a></li>',
			'<li><a>0-2-1</a></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview" data-inset="true" data-autodividers="true">',
			'<li><a>0-1</a></li>',
			'<li><a>0-1-1</a></li>',
			'<li><a>0-1-2</a></li>',
			'<li><a>0-2-1</a></li>',
			'<li><a>1-1</a></li>',
			'<li><a>1-1-1</a></li>',
			'<li><a>2-2-1</a></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview" data-inset="true">',
			'<li data-role="list-divider"><a>0-1</a></li>',
			'<li><a>0-1</a><span class="ui-li-count">9</span></li>',
			'<li><a>0-1-1</a></li>',
			'<li><a>0-1-2</a></li>',
			'<li data-role="list-divider"><a>0-2</a></li>',
			'<li><a>0-2-1</a><span class="ui-li-count">15</span></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview" data-inset="true">',
			'<li><a><img src="../../../../midea/downImages/81.png">0-1</a></li>',
			'<li><a><img src="../../../../midea/downImages/82.png">0-2</a></li>',
			'<li><a><img src="../../../../midea/downImages/83.png">0-3</a></li>',
			'<li><a><img src="../../../../midea/downImages/92.png">0-4</a></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview" data-inset="true">',
			'<li><a><img src="../../../../midea/downImages/81.png" class="ui-li-icon">0-1</a></li>',
			'<li><a><img src="../../../../midea/downImages/82.png" class="ui-li-icon">0-2</a></li>',
			'<li><a><img src="../../../../midea/downImages/83.png" class="ui-li-icon">0-3</a></li>',
			'<li><a><img src="../../../../midea/downImages/92.png" class="ui-li-icon">0-4</a></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview" data-inset="true">',
			'<li><a><img src="../../../../midea/downImages/81.png" class="ui-li-icon">0-1</a><a>Delete</a></li>',
			'<li><a><img src="../../../../midea/downImages/82.png" class="ui-li-icon">0-2</a></li>',
			'<li><a><img src="../../../../midea/downImages/83.png" class="ui-li-icon">0-3</a></li>',
			'<li><a><img src="../../../../midea/downImages/92.png" class="ui-li-icon">0-4</a></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview" data-inset="true" data-filter=true>',
			'<li><a>0-1</a></li>',
			'<li><a>0-1-1</a></li>',
			'<li><a>0-1-2</a></li>',
			'<li><a>0-2-1</a></li>',
			'<li><a>1-1</a></li>',
			'<li><a>1-1-1</a></li>',
			'<li><a>2-2-1</a></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<ul data-role="listview" data-inset="true" data-filter=true>',
			'<li><a>0-1</a></li>',
			'<li><a>0-1-1</a></li>',
			'<li><a>0-1-2</a></li>',
			'<li><a>0-2-1</a></li>',
			'<li><a>1-1</a></li>',
			'<li><a>1-1-1</a></li>',
			'<li><a>2-2-1</a></li>',
			'</ul>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<form action="echo.cfm" method="post">',
				'<div data-role="fieldcontain">',
					'<label for="name">Name:</label>',
					'<input type="text" name="name" id="name" value="Seto Sun">',
				'</div>',
				'<div data-role="fieldcontain">',
					'<label for="email">Email:</label>',
					'<input type="text" name="email" id="email" value="huanrum@126.com">',
				'</div>',
				'<div data-role="fieldcontain">',
					'<label for="bio">Bio:</label>',
					'<textarea name="bio" id="bio"></textarea>',
				'</div>',
				'<div data-role="fieldcontain">',
					'<input type="submit" name="submit" value="Send">',
				'</div>',
			'</form>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<form action="echo.cfm" method="post">',
				'<div data-role="fieldcontain">',
					'<fieldset data-role="controlgroup">',
						'<legend>Favorite Movie:</legend>',
						'<input type="radio" name="favoriteMovie" id="favoriteMovie1" value="Start Wars">',
						'<label for="favoriteMovie1">Start Wars</label>',
						'<input type="radio" name="favoriteMovie" id="favoriteMovie2" value="Vanilla Sky">',
						'<label for="favoriteMovie2">Vanilla Sky</label>',
						'<input type="radio" name="favoriteMovie" id="favoriteMovie3" value="Inception">',
						'<label for="favoriteMovie3">Inception</label>',
					'</fieldset>',
				'</div>',
				'<div data-role="fieldcontain">',
					'<fieldset data-role="controlgroup">',
						'<legend>Favorite Color:</legend>',
						'<input type="checkbox" name="favoriteColor" id="favoriteColor1" value="Green">',
						'<label for="favoriteColor1">Green</label>',
						'<input type="checkbox" name="favoriteColor" id="favoriteColor2" value="Red">',
						'<label for="favoriteColor2">Red</label>',
						'<input type="checkbox" name="favoriteColor" id="favoriteColor3" value="Yellow">',
						'<label for="favoriteColor3">Yellow</label>',
					'</fieldset>',
				'</div>',
			'</form>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<form action="echo.cfm" method="post">',
				'<div data-role="fieldcontain">',
					'<fieldset data-role="controlgroup" data-type="horizontal">',
						'<legend>Favorite Movie:</legend>',
						'<input type="radio" name="favoriteMovie" id="favoriteMovie1" value="Start Wars">',
						'<label for="favoriteMovie1">Start Wars</label>',
						'<input type="radio" name="favoriteMovie" id="favoriteMovie2" value="Vanilla Sky">',
						'<label for="favoriteMovie2">Vanilla Sky</label>',
						'<input type="radio" name="favoriteMovie" id="favoriteMovie3" value="Inception">',
						'<label for="favoriteMovie3">Inception</label>',
					'</fieldset>',
				'</div>',
				'<div data-role="fieldcontain">',
					'<fieldset data-role="controlgroup" data-type="horizontal">',
						'<legend>Favorite Color:</legend>',
						'<input type="checkbox" name="favoriteColor" id="favoriteColor1" value="Green">',
						'<label for="favoriteColor1">Green</label>',
						'<input type="checkbox" name="favoriteColor" id="favoriteColor2" value="Red">',
						'<label for="favoriteColor2">Red</label>',
						'<input type="checkbox" name="favoriteColor" id="favoriteColor3" value="Yellow">',
						'<label for="favoriteColor3">Yellow</label>',
					'</fieldset>',
				'</div>',
			'</form>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<form action="echo.cfm" method="post">',
				'<div data-role="fieldcontain">',
					'<fieldset data-role="controlgroup">',
						'<legend>Favorite:</legend>',
						'<label for="favMovie-11">Favorite A:</label>',
						'<select name="favMovie-11" id="favMovie-11">',
							'<option value="A1">A1</option>',
							'<option value="A2">A2</option>',
							'<option value="A3">A3</option>',
							'<option value="A4">A4</option>',
							'<option value="A5">A5</option>',
							'<option value="A6">A6</option>',
						'</select>',
						'<label for="favMovie-12">Favorite B:</label>',
						'<select name="favMovie-12" id="favMovie-12">',
							'<option value="B1">B1</option>',
							'<option value="B2">B2</option>',
							'<option value="B3">B3</option>',
							'<option value="B4">B4</option>',
							'<option value="B5">B5</option>',
							'<option value="B6">B6</option>',
						'</select>',
						'<label for="favMovie-13">Favorite C:</label>',
						'<select name="favMovie-13" id="favMovie-13">',
							'<option value="C1">C1</option>',
							'<option value="C2">C2</option>',
							'<option value="C3">C3</option>',
							'<option value="C4">C4</option>',
							'<option value="C5">C5</option>',
							'<option value="C6">C6</option>',
						'</select>',
					'</fieldset>',
					'<fieldset data-role="controlgroup" data-type="horizontal">',
						'<legend>Favorite (horizontal):</legend>',
						'<label for="favMovie-21">Favorite A:</label>',
						'<select name="favMovie-21" id="favMovie-21">',
							'<option value="A1">A1</option>',
							'<option value="A2">A2</option>',
							'<option value="A3">A3</option>',
							'<option value="A4">A4</option>',
							'<option value="A5">A5</option>',
							'<option value="A6">A6</option>',
						'</select>',
						'<label for="favMovie-22">Favorite B:</label>',
						'<select name="favMovie-22" id="favMovie-22">',
							'<option value="B1">B1</option>',
							'<option value="B2">B2</option>',
							'<option value="B3">B3</option>',
							'<option value="B4">B4</option>',
							'<option value="B5">B5</option>',
							'<option value="B6">B6</option>',
						'</select>',
						'<label for="favMovie-23">Favorite C:</label>',
						'<select name="favMovie-23" id="favMovie-23">',
							'<option value="C1">C1</option>',
							'<option value="C2">C2</option>',
							'<option value="C3">C3</option>',
							'<option value="C4">C4</option>',
							'<option value="C5">C5</option>',
							'<option value="C6">C6</option>',
						'</select>',
					'</fieldset>',
				'</div>',
			'</form>'
		].join('');
	};


	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<form action="echo.cfm" method="post">',
				'<div data-role="fieldcontain">',
					'<label for="search-01">Name:</label>',
					'<input type="search" name="search-01" id="search-01" value="Seto Sun">',
				'</div>',
				'<div data-role="field-contain">',
					'<label for="gender">Gender:</label>',
					'<select name="gender" id="gender" data-role="slider">',
						'<option value="0">Male</option>',
						'<option value="1">Female</option>',
					'</select>',
				'</div>',
				'<div data-role="fieldcontain">',
					'<label for="coolness">Coolness:</label>',
					'<input  type="range" name="coolness" id="coolness" min="0" max="100" value="22" data-hightlight="true">',
				'</div>',
				'<div data-role="fieldcontain">',
					'<div data-role="range-slider">',
						'<label for="coolnessLow">Cool Range (error):</label>',
						'<input  type="range" name="coolnessLow" id="coolnessLow" min="0" max="100" value="22" data-hightlight="true">',
						'<input  type="range" name="coolnessHigh" id="coolnessHigh" min="0" max="100" value="82" data-hightlight="true">',
					'</div>',
				'</div>',
				'<div data-role="fieldcontain">',
					'<input type="submit" name="submit" value="Send">',
				'</div>',
			'</form>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(prevDialog){
		return [
			'<a href="#id" data-rel="dialog">A Dialog</a>'.replace('id',prevDialog.attr('id')),
			'<div data-role="collapsible-set">',
				'<div data-role="collapsible">',
					'<h3>Title</h3>',
					'<p>',
						'<strong>A:</strong>',
						'aaaaaaaaaaaaaaaaaaaaaa',
					'</p>',
					'<p>',
						'<strong>B:</strong>',
						'bbbbbbbbbbbbbbb',
					'</p>',
					'<p>',
						'<strong>C:</strong>',
						'ccccccccccccccccc',
					'</p>',
				'</div>',
					'<div data-role="collapsible" data-content-theme="c" data-iconpos="right">',
					'<h3>Title</h3>',
					'<p>',
						'<strong>A:</strong>',
						'aaaaaaaaaaaaaaaaaaaaaa',
					'</p>',
					'<p>',
						'<strong>B:</strong>',
						'bbbbbbbbbbbbbbb',
					'</p>',
					'<p>',
						'<strong>C:</strong>',
						'ccccccccccccccccc',
					'</p>',
				'</div>',
			'</div>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<table data-role="table" class="ui-responsive table-stroke">',
				'<thead>',
					'<tr>',
						'<th>Title</th>',
						'<th>Name</th>',
						'<th>Age</th>',
						'<th>Beers</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr>',
						'<th>Ak</th>',
						'<td>Ak47</td>',
						'<td>1965</td>',
						'<td>....</td>',
					'</tr>',
					'<tr>',
						'<th>BWM</th>',
						'<td>BWM47</td>',
						'<td>1950</td>',
						'<td>....</td>',
					'</tr>',
				'</tbody>',
			'</table>'
		].join('');
	};


	window.contentFunc[window.contentFunc.length] = function(){
		return [
			'<table data-role="table" class="ui-responsive table-stroke" data-mode="columntoggle">',
				'<thead>',
					'<tr>',
						'<th data-priority="0">Name</th>',
						'<th data-priority="1">Title</th>',
						'<th data-priority="2">Age</th>',
						'<th data-priority="3">Beers</th>',
					'</tr>',
				'</thead>',
				'<tbody>',
					'<tr>',
						'<th>Ak</th>',
						'<td>Ak47</td>',
						'<td>1965</td>',
						'<td>....</td>',
					'</tr>',
					'<tr>',
						'<th>BWM</th>',
						'<td>BWM47</td>',
						'<td>1950</td>',
						'<td>....</td>',
					'</tr>',
				'</tbody>',
			'</table>'
		].join('');
	};

	window.contentFunc[window.contentFunc.length] = function(){

		//thisPage.append($([
		//	'<div data-role="panel" id="leftPanel">',
		//		'This is left panel.',
		//		'<p>',
		//			'<a data-role="button" data-rel="close">Close</a>',
		//		'</p>',
		//	'</div>'
		//].join('')));

		return '<a href="#leftPanel" data-role="button">Open My Panel</a>';
	};

})(window.jQuery);