/**
 * Created by sus on 2016/3/30.
 */
(function($e,$){
	'use strict';

	$e(function websql() {
		return {
			title: 'Query',
			fn: function (panel, base) {
				panel.classList.add('web-sql-query');

				var db = openDatabase('testDB', '1.0', 'Test DB', 2 * 1024 * 1024);
				var input = document.createElement('textarea');
				var result = document.createElement('div');

				input.style.width = '100%';
				input.style.minHeight = '100px';
				input.style.background = '#dddddd';
				panel.appendChild(input);
				panel.appendChild(result);

				input.value = ['CREATE TABLE IF NOT EXISTS testTable (id unique, name, age, filldate)',
					'INSERT INTO testTable (id, name, age, filldate) VALUES (0, "Byron",21,date("now"))',
					'INSERT INTO testTable (id, name, age, filldate) VALUES (1, "Casper",22,date("now"))',
					'INSERT INTO testTable (id, name, age, filldate) VALUES (2, "Frank",23,date("now"))',
					'SELECT * FROM testTable'].join(';\n') + ';';
				input.onkeyup = getOnclick(base,db,input,result);
				input.onkeyup({keyCode:base.keyCodes.ENTER,ctrlKey:true});
			}
		};

		function getOnclick(base,db,inputEle,resultEle){
			function showReault(context,result){
				if(result.rows.length){
					var grid = base.toGrid(base.each(result.rows,function(item){
						base.each(item,function(value,pro){
							if(/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(value)){
								item[pro] = new Date(value);
								item[pro].toString = function(){
									return value;
								};
							}
						});
						return item;
					}),onclick);
					grid.style.margin = '10px';
					resultEle.appendChild(grid);
				}else{
					//resultEle.innerHTML += resultEle
				}
			}
			function onclick(e,arg){
				//alert(arg.value);
			}
			return function(e){
				if(e.keyCode !== base.keyCodes.ENTER || !e.ctrlKey){return;}
				resultEle.innerHTML = '';
				switch (inputEle.value){
					case 'clear':
						resultEle.innerHTML = '';
						break;
					default:
						base.each(inputEle.value.split(';'),function(sql){
							if(sql){
								db.transaction(function(context){
									context.executeSql(sql,[],showReault);
								});
							}
						});
						break;
				}

			};
		}
	});
})(window.$ehr,window.jQuery);