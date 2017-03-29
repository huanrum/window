/**
 * Created by sus on 2015/9/11.
 */
(function($e,$){
	'use strict';
	
	$e(function show(){
		return {
			title : 'Show',
			action:function(panel,base){
				if(!panel.getElementsByClassName('.chapters').length){
					var parent = $('<div class="chapters"></div>').appendTo(panel);
					base.each(getFunctions(),function(item){
						var element = $('<div id="'+item.name.toLocaleLowerCase()+'"></div>').appendTo($('<div></div>').append($('<h3>'+item.name+'</h3>')).appendTo(parent));
						var height = item(element,{randodString:randodString,intMin:intMin,getTextHeight:getTextHeight}) || 20;
						element.css('height',height + element.children().height());
					});
				}
			}
		};
		
		function randodString(rank,min){
			var baseChar = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			var result = '',length = Math.random() * (rank || 1000) + (min || 100);
			while(length-- > 0){
				result += baseChar[parseInt(Math.random() * baseChar.length)];
			}
			return result;
		}

		function intMin(num){
			return parseInt(num.toLocaleString().split('.')[0]) + 1;
		}

		function getTextHeight(element){
			var font = parseFloat(element.css('font-size'));
			var num = element.text().length * font / element.parent().width();
			return (intMin(num) + 1) * font;
		}

		function getFunctions(){
			return [function Chapter01(element,extendFun){
				element.append($('<div class="color">1. Font Color</div>'));
				element.append($('<div class="background">2. Background</div>'));
				
				//*** Chapter 02
			},function Chapter02(element,extendFun){
				
				element.append($('<div class="font">Font Style</div>'));
				
			},function Chapter03(element,extendFun){
				
				var text = extendFun.randodString(1,400);
				element.append($('<div style="font-weight: bold">Test Style :</div>'));
				element.append($('<div class="text"></div>').html(text));
				
				return extendFun.getTextHeight(element.find('.text'));
				
			},function Chapter04(element,extendFun){
				
				element.append($('<table class="table1" border="1">@content@</table>'.replace('@content@',createData('T',10 , 10))));
				element.append($('<table class="table2" border="1">@content@</table>'.replace('@content@',createData('K',11 , 10))));
				
				function createData(char,length,cell){
					var result = '<caption>'+char+length+'*'+cell+'</caption>';
					for(var i=0;i<length;i++){
						result += '<tr>';
						for(var j=0;j<cell;j++){
							result += ('<td>'+char+i+'*'+j+'</td>');
						}
						result += '</tr>';
					}
					return result;
				}
			},function Chapter05(element,extendFun){
				
				element.append($('<div class="container"></div>'));
				
			},function Chapter06(element,extendFun){
				
				element.append($('<ul class="list">@content@</ul>'.replace('@content@',createData('T',10))));
				element.append($('<ol class="list">@content@</ol>'.replace('@content@',createData('K',10))));
				
				function createData(char,length){
					var result = '';
					for(var i=0;i<length;i++){
						result += '<li>'+char+' - '+i+'</li>';
					}
					return result;
				}
				
			},/**
			 * @return {number}
			 */
			function Chapter07(element,extendFun){
				
				element.append($('<div class="system-cursor">Cursor</div>'));
				element.append($('<div class="system-ie">IE Special </div>').append($('<div></div>').html(extendFun.randodString(1,400))));
				
				return 250;
			},/**
			 * @return {number}
			 */
			function Chapter08(element,extendFun){
				
				element.append($('<div class="alpha">Alpha</div>'));
				element.append($('<div class="blend-trans">BlendTrans</div>'));
				element.append($('<div class="blur">Blur</div>'));
				element.append($('<div class="chroma">Chroma</div>'));
				element.append($('<div class="drop-shadow">DropShadow</div>'));
				element.append($('<div class="emboss">Emboss</div>'));
				element.append($('<div class="engrave">Engrave</div>'));
				element.append($('<div class="flip-h">FlipH</div>'));
				element.append($('<div class="flip-v">FlipV</div>'));
				element.append($('<div class="glow">Glow</div>'));
				element.append($('<div class="gray">Gray</div>'));
				element.append($('<div class="invert">Invert</div>'));
				element.append($('<div class="mask-filter">MaskFilter</div>'));
				element.append($('<div class="motion-blur">MotionBlur</div>'));
				element.append($('<div class="shadow">Shadow</div>'));
				element.append($('<div class="wave">Wave</div>'));
				element.append($('<div class="xray">Xray</div>'));
				element.append($('<div class="basic-image">BasicImage</div>'));
				element.append($('<div class="reveal-trans">RevealTrans</div>'));
				element.append($('<div class="light">Light</div>'));
				element.append($('<div class="compositor">Compositor</div>'));
				
				element.children().draggable();
				var childWidth = parseFloat(element.children().css('margin-left'))+parseFloat(element.children().css('margin-right'))+element.children().innerWidth();
				return extendFun.intMin(element.children().length/extendFun.intMin(element.innerWidth()/childWidth)) * element.children().height();
				
			},function Chapter09(element,extendFun){
				
				element.append($('<div class="display">Display</div>').click(function(e){$(e.currentTarget).hide(2000,function(){$(e.currentTarget).show(5000);});}));
				element.append($('<div class="clear">Clear</div>'));
				element.append($('<div class="direction">Direction</div>'));
				
			},function Chapter10(element,extendFun){
				
				'em,px,pt,%'.split(',').forEach(function(item){
					element.append($('<div style="padding-left: 5'+item+'">'+item+'</div>'));
				});
				
			},function Chapter11(element,extendFun){
				
				element.append($('<div class="overflow">Overflow</div>'));
				element.append($('<div class="important">!important(priority)</div>'));
				
			}];
		}
	});
	
})(window.$ehr,window.jQuery);