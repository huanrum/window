/**
 * Created by Administrator on 2016/4/26.
 */
(function(window){

	'use strict';

	var controls = {},editors = {},lookups = {},helpers = {},$ = window.jQuery;

	if(!window.jQuery){
		throw new Error('You must add jQuery !');
	}

	window.createEhrControl = function(name){
		if(typeof controls[name] === 'function'){
			return controls[name].apply(controls,[].slice.call(arguments,1));
		}
		throw new Error('No Control : ' + name);
	};

	window.createEhrControl.addlookups = function(name,data){
		lookups[name] = data;
	};

	window.createEhrControl.updatelookups = function(name,data){
		lookups[name] = lookups[name] || [];
		[].push.apply(lookups[name],data);
	};

	helpers = {
		each: function (list, func) {
			var result = [];
			func = func || function (it) {
					return it;
				};

			if (list && typeof list.length === 'number' && typeof list !== 'function') {
				for (var i = 0; i < list.length; i++) {
					result.push(func(list[i], i, list));
				}
			} else if (list && (typeof list === 'object' || typeof list === 'function')) {
				/* jshint -W089*/
				for (var pro in list) {
					result.push(func(list[pro], pro, list));
				}
			} else if (typeof list === 'number') {
				for (var j = 0; j < list; j++) {
					result.push(func(j, j, list));
				}
			}
			return result;
		},
		filter: function (list, func, to, index) {
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
			to = to || function (t) {
					return t;
				};
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
				/* jshint -W089*/
				for (var pro in list) {
					if (func(list[pro], pro, list)) {

						if (result instanceof Array) {
							result.push(to(list[pro], pro, list));
						} else {
							result[pro] = (to(list[pro], pro, list));
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
		}
	};


	controls.grid = function(columns,data,option){
		var id = 'ehr-control-grid-'+Date.now(),helper = {};
		var $grid = $('<div id="'+id+'"></div>').attr('tabindex', 1).keydown(onkeydown);

		data = data || [];
		option = $.extend({height:800,width:800,lineHeight:30,showRowNum:true},option);

		createStyle($('<style></style>').appendTo($grid),'#'+id);
		createHeader($('<div class="ehr-control-grid-header"></div>').appendTo($grid));
		createContent($('<div class="ehr-control-grid-content"></div>').appendTo($grid));

		$grid.update = function(newData){
			data = newData || data;
			createContent($grid.find('.ehr-control-grid-content').empty());
		};

		return $grid;

		function onkeydown(e){
			if(e.keyCode === 38){
				helper.currentRow.prev().find('*:first').click();
			}
			if(e.keyCode === 40){
				helper.currentRow.next().find('*:first').click();
			}
		}

		function createStyle($element,styleHead,headerSize,contentSize){
			var $width = option.showRowNum?32:0;
			$.each(columns,function(c,column) {
				$width += (column.width || 80) + 2;
			});
			var styleContent = helpers.each([
				'{background:#ffffff; overflow-x: auto;max-height:'+option.height+'px;width:'+option.width+'px}',

				' .ehr-control-grid-header{height:2em;background:#9999ff;width:'+$width+'px}',
				' .ehr-control-grid-header-cell{ display: inline-block;float:left;height:30px;border: 1px solid #333333;font-weight: bold;}',
				' .ehr-control-grid-header-cell:hover{ cursor: pointer;background:#999999;}',

				' .ehr-control-grid-content{min-height:12em;overflow-y: auto;width:'+$width+'px}',
				' .ehr-control-grid-content-row{min-height:'+(option.lineHeight+2)+'px;}',
				' .ehr-control-grid-content-row.odd{background:#dddddd;}',
				' .ehr-control-grid-content-row:hover{background:#999999;}',
				' .ehr-control-grid-content-cell{display: inline-block;float:left;min-height:'+option.lineHeight+'px;border: 1px solid #333333;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}',
				' .ehr-control-grid-content-cell.row-num{font-weight: bold;}'
			],function(l){return styleHead + l;}).join('\n ');

			$element.html(styleContent);
		}

		function createHeader($element){
			if(option.showRowNum){
				var cell = $('<div class="ehr-control-grid-header-cell"></div>').appendTo($element);
				cell.css({width:30});
			}
			if(columns.length === 1){
				$element.remove();
			}
			$.each(columns,function(c,column){
				var cell = $('<div class="ehr-control-grid-header-cell"></div>').appendTo($element);
				cell.html(column.title || column.field);
				cell.css({width:column.width||80});
				column.formatter = column.formatter || function(row,cell,value,columnDef, dataContext){return value;};
			});
		}
		function createContent($element){
			var height = 0;
			$.each(data,function(r,item){
				var row = $('<div class="ehr-control-grid-content-row"></div>').appendTo($element);
				if(r%2){row.addClass('odd');}
				if(option.showRowNum){
					var cell = $('<div class="ehr-control-grid-content-cell row-num"></div>').appendTo(row);
					cell.css({width:30});
					cell.html(r);
					cell.click(function(e){
						if(helper.currentEditor && helper.currentEditor.blur){
							helper.currentEditor.blur();
						}
						if(helper.currentItem !== item){
							if(helper.currentRow){
								helper.currentRow.css('background','');
							}
							row.css('background','#99ff99');
							helper.currentItem = item;
							if(option.selectChange){
								option.selectChange(e,r,item);
							}
						}
						helper.currentEdito = null;
						helper.currentCell = cell;
						helper.currentRow = row;
					});
				}
				$.each(columns,function(c,column){
					var cell = $('<div class="ehr-control-grid-content-cell"></div>').appendTo(row);
					cell.html(column.formatter(r,c,item[column.field],column,item));
					cell.css({width:column.width||80});
					cell.click(function(e){
						if(helper.currentCell === cell){return;}
						if(helper.currentEditor && helper.currentEditor.blur){
							helper.currentEditor.blur();
						}
						if(column.editor && editors[column.editor]){
							helper.currentEditor = editors[column.editor](cell,column,item[column.field],function(value){
								if(''+item[column.field] !== value){
									item[column.field] = value;
									option.update(e,r,c,column,item);
								}
								cell.html(column.formatter(r,c,item[column.field],column,item));
							});
						}else if(option.cellClick){
							option.cellClick(e,r,c,column,item);
						}
						if(helper.currentItem !== item){
							if(helper.currentRow){
								helper.currentRow.css('background','');
							}
							row.css('background','#99ff99');
							helper.currentItem = item;
							if(option.selectChange){
								option.selectChange(e,r,item);
							}
						}
						helper.currentCell = cell;
						helper.currentRow = row;
					});
				});
			});
			return height;
		}
	};

	controls.form = function(rows,data,option){
		var id = 'ehr-control-form-'+Date.now(),helper = {};
		var form = $('<div id="'+id+'"></div>');

		data = data || {};
		option = $.extend({height:800,width:800,lineHeight:30},option);

		createStyle($('<style></style>').appendTo(form),'#'+id);
		createContent($('<div class="ehr-control-form-content"></div>').appendTo(form));

		form.update = function(item){
			data = item;
			createContent(form.find('.ehr-control-form-content').empty());
		};
		return form;

		function createStyle($element,styleHead){
			var styleContent =  helpers.each([
				'{background:#ffffff; overflow-x: auto;max-height:'+option.height+'px;width:'+option.width+'px;}',
				' .ehr-control-form-content{overflow-y: auto;border: 1px solid #333333;}',

				' .ehr-control-form-content-group-title{background:#9999ff;border: 1px solid #333333;}',
				' .ehr-control-form-content-group-title>*{display: inline-block;margin:2px 10px;}',

				' .ehr-control-form-content-cell{display: inline-block;min-height:'+option.lineHeight+'px;margin:2px 10px;}',
				' .ehr-control-form-content-cell.label{font-weight: bold;border:none;width:100px}',
				' .ehr-control-form-content-cell.value{border: 1px solid #333333;width:'+(option.width-148)+'px}'
			],function(l){return styleHead + l;}).join('\n ');

			$element.html(styleContent);
		}

		function createContent($element){
			var groups = {};
			$.each(rows,function(index,row){
				row.formatter = row.formatter || function(r,row,value,item){return value;};
				groups[row.group] = groups[row.group] || [];
				groups[row.group].push(row);
			});
			if(Object.getOwnPropertyNames(groups).length>1){
				helpers.each(groups,function(value,pro){
					var groupEl = $('<div class="ehr-control-form-content-group-s"></div>').appendTo($element);
					var rowsGroup = $('<div class="ehr-control-form-content-group"></div>');
					expand($('<div class="ehr-control-form-content-group-title"></div>').appendTo(groupEl),pro,rowsGroup);
					createRow(rowsGroup.appendTo(groupEl),value);
				});
			}else{
				createRow($element,rows);
			}
		}

		function expand($element,title,rowsGroup){
			var isExpand = !!option.expand;
			var d = ['M0,0 L10,0 L5,10Z','M0,10 L10,10 L5,0Z'];
			$element.click(onclick);
			onclick();
			function onclick(){
				isExpand = !isExpand;
				rowsGroup.toggle();
				$element.empty();

				$('<svg width="10" height="10"><path fill="#333333" d="'+(isExpand?d[0]:d[1])+'"></path></svg>').appendTo($element);
				$('<div></div>').html(title).appendTo($element);
			}
		}

		function createRow($element,ros){
			$.each(ros,function(index,row){
				var rowEl = $('<div class="ehr-control-form-content-row"></div>').appendTo($element);
				var label = $('<div class="ehr-control-form-content-cell label"></div>').appendTo(rowEl).html(row.title || row.field);
				var cell = $('<div class="ehr-control-form-content-cell value"></div>').appendTo(rowEl).html(row.formatter(index,row,data[row.field]));
				cell.click(function(e){
					if(helper.currentCell === cell){return;}
					helper.currentCell = cell;
					if(helper.currentEditor && helper.currentEditor.blur){
						helper.currentEditor.blur();
					}
					if(row.editor && editors[row.editor]){
						helper.currentEditor = editors[row.editor](cell,row,data[row.field],function(value){
							if(''+data[row.field] !== value){
								data[row.field] = value;
								option.update(e,0,index,row,data);
							}
							cell.html(row.formatter(0,index,data[row.field],row,data));
							helper.currentEdito = null;
						});
					}else if(option.cellClick){
						option.cellClick(e,0,index,row,data);
					}
				});
			});
		}
	};

	controls.dialog = function(option,data){
		var id = 'ehr-control-dialog-'+Date.now(),helper = {},promiseList = [];
		var dialog = $('<div id="'+id+'"></div>').css({top:option.top,left:option.left});

		data = data || {};
		option = $.extend({height:800,width:800},option);

		createStyle($('<style></style>').appendTo(dialog),'#'+id);
		createHeader($('<div class="ehr-control-dialog-header"></div>').appendTo(dialog));
		createContent($('<div class="ehr-control-dialog-content"></div>').appendTo(dialog),data);
		createFooter($('<div class="ehr-control-dialog-footer"></div>').appendTo(dialog));

		aboutZindex(dialog);

		dialog.then = then;
		return dialog;

		function aboutZindex($dialog){
			updateZindex();
			$dialog.mousedown(updateZindex);

			function updateZindex(){
				var zindex = parseFloat($dialog.css('zIndex'));
				if(!zindex || zindex < controls.dialog.zindex){
					controls.dialog.zindex = (controls.dialog.zindex || 0) + 1;
				}
				$dialog.css('zIndex',controls.dialog.zindex);
			}
		}

		function then(fn){
			promiseList.push(fn);
			return dialog;
		}
		function resove(){
			var args = arguments;
			$.each(promiseList,function(index,fn){
				fn.apply(dialog,args);
			});
		}

		function createStyle($element,styleHead){
			var styleContent =  helpers.each([
				'{ position: absolute;border: 1px solid #333333;max-height:'+option.height+'px;width:'+option.width+'px;background:#ffffff; border-radius: 8px;box-shadow:0px 0px 0px 3px #bb0a0a,0px 0px 0px 6px #2e56bf,0px 0px 0px 9px #ea982e;}',

				' .ehr-control-dialog-header{background:#9999ff;height:25px; border-radius: 8px 8px 0 0}',
				' .ehr-control-dialog-header .title{display: inline-block;margin:2px 10px;float:left;}',
				' .ehr-control-dialog-header .buttons{display: inline-block;margin:2px 10px;float:right;}',
				' .ehr-control-dialog-header .buttons>*{display: inline-block;margin:2px 10px;float:right;font-size: 1.2em;}',
				' .ehr-control-dialog-header .buttons>*:hover{cursor: pointer;background:#999999;font-weight: bold;}',

				' .ehr-control-dialog-content{width:'+(option.width-4)+'px;padding:2px 2px;overflow: auto;}',

				' .ehr-control-dialog-footer{background:#9999ff;height:25px; border-radius: 0 0 8px 8px}',
				' .ehr-control-dialog-footer>*{display: inline-block;float:left;width:'+(100/((option.buttons||[]).length + 2))+'%;}',
				' .ehr-control-dialog-footer>*>*{margin:2px 50%;}'

			],function(l){return styleHead + l;}).join('\n ');

			$element.html(styleContent);
		}

		function createHeader($element){
			var title = $('<div class="title"></div>').appendTo($element).html(option.title || 'Dialog');
			var buttons = $('<div class="buttons"></div>').appendTo($element);
			$('<span>&times;</span>').appendTo(buttons).click(resove);

			helpers.each(option.toolbars,function(bar){
				$('<span></span>').html(bar.icon).appendTo(buttons).click(bar.fn);
			});

			drag($element);
		}
		function createContent($element,elData){
			if(typeof elData === 'string'){
				$element.html(elData);
			}else if(typeof elData === 'function'){
				elData($element);
			}else if(elData instanceof HTMLElement){
				$element.append(elData);
			}else{
				helpers.each(elData,function(el){
					createContent($element,el);
				});
			}
		}
		function createFooter($element){
			var buttons = [function Ok(e){resove(e,true);},function Cancel(e){resove(e,false);}];
			buttons.push.apply(buttons,option.buttons||[]);
			helpers.each(buttons,function(button){
				$('<button></button>').html(button.name).appendTo($('<div></div>').appendTo($element)).click(button.fn || button);
			});
		}

		function drag(header){
			dialog = header.parent();
			var temp = {};
			header.on('mousedown',function(e){
				temp.e = e;
				temp.x = e.clientX - (parseInt(dialog.css('left')) || 0);
				temp.y = e.clientY - (parseInt(dialog.css('top')) || 0);
				header.css('cursor','move');
				$('body').on('mousemove',mousemove);
			});
			header.on('mouseup',function(e){
				header.css('cursor','default');
				$('body').off('mousemove',mousemove);
			});

			function mousemove(e){
				dialog.css({left:e.clientX - temp.x,top:e.clientY - temp.y});
			}
		}
	};




	editors.text = function(parent,column,value,blur){
		var element = $('<input>').css({width:parent.width() || column.width||80}).appendTo(parent.empty());
		element.val(value);
		element.blur(function(){
			blur(element.val());
			element.remove();
		});
		return element;
	};

	editors.lookup = function(parent,column,value,blur){
		var lookupsOption = lookups[column.lookup],select = {};
		if(!lookupsOption){return null;}

		var element = window.createEhrControl('grid',lookupsOption.columns,lookupsOption.data,{
			height:600,width:'auto',showRowNum:false,
			selectChange:function selectChange(e,r,item){
				select = item;
			}
		}).appendTo(parent.empty());
		element.css({position: 'absolute'});
		element.val(value);
		element.blur(function(){
			blur(select[column.lookupId] || select.text || element.val());
			element.remove();
		});
		return element;
	};

})(window);