/**
 * Created by sus on 2016/1/8.
 */
(function($e){
	'use strict';

	$e(function(){
		var url = 'https://docs.google.com/a/sinodynamic.com/forms/d/e/1FAIpQLSdg4I4scHhB2M3rp0hPG1tia3AMawTM09SRzaCFMFOM5Jbcuw/viewform?entry.282164456=';
		return {
			title:'Ifram',
			fn:function(panel,base){
				panel.appendChild( base.new('button','','Show',function(){
					panel.appendChild(base.dialog('Id',base.new('input','','0000286'),[function Ok(e,arg){
						var iframe = base.new('iframe',{width:'600px',height:(window.innerHeight - 40)+'px'},'http://dell-pc-seto/');
						panel.removeChild(arg.dialog);
						panel.appendChild(base.dialog('Iframe-' + arg.content.value,iframe));

						setTimeout(function(){
							window.contentWindow = iframe.contentWindow;
							setTimeout(function(){
								var buttons = window.contentWindow.document.getElementsByClassName('quantumWizButtonPaperbuttonLabel');
								window.buttons = buttons;
							},2000);
							iframe.contentWindow.location = url + arg.content.value;
						},500);
					}]));
				}));
			}
		};


	});

	$e(function helper(){
		return {
			title:'Helper',
			fn:function(panel,base){
				panel.classList.add('javascript-helper');
				panel.innerHTML = [
					'<div><h3>cookie</h3>document.cookie = "a=1"</div>',
					'<div><h3>indexedDB</h3>window.indexedDB.open("testDB")</div>'
				].join('');

			}
		};
	});

	$e({
		title:'Function',
		fn:function(content){
			content.classList.add('javascript-function');
			content.innerHTML = [
				'<div>Function .......</div>',
				'<div>document.execCommand</div>',
				'<div><input style="border: 0;border-bottom:1px solid #333333;" value="input"></div>',
				'<div contenteditable="true">Change</div>'
			].join('');

		}
	});

	$e({
		title:'Link',
		fn:function(content,base){
			content.classList.add('javascript-link');

			base.each(getUrls(),function(value,pro){
				var url = 'https://rib-cn-dev480/Learn/Code/Down/'+value;
				var book = document.createElement('div');
				var icon = document.createElement('img');
				var title = document.createElement('div');
				book.appendChild(icon);
				book.appendChild(title);
				content.appendChild(book);

				icon.src = '../../../../midea/downImages/'+(base.sToint(value.split('.').pop()) % base.downIconCount)+'.png';
				title.innerHTML = pro;
				book.onclick = function(){
					window.open(url,'Book','width=1000,height=800');
				};

				base.addTooltip(book,url);
			});

			function getUrls() {
				return {
					'Response Layout': '06ExternalTrainingMaterial/htmljsaj/HTML5/css3Html5ResponseLayoutTemplate/index.html',
					'Style': '06ExternalTrainingMaterial/htmljsaj/HTML5/css3Html5StyleTemplate/index.html',
					'HTML5 CSS3': '06ExternalTrainingMaterial/htmljsaj/HTML5/htHTML5AndCSS3Template/index.html',
					'SlickGrid':'SlickGrid/tests/index.html'
				};
			}
		}
	});

	$e({
		title: 'Mode',
		fn: function (content, base) {
			content.classList.add('javascript-mode');
			base.each([constructor, module, revealingModule, singleton, observer, mediator, prototype, command, facade, factory, mixin, decorator, flyweight], function (fn) {
				var name = fn.name || fn.toString().replace(/function\s?/mi,"").split("(").shift();
				var child = document.createElement('h4');
				content.appendChild(child);
				child.innerHTML = name[0].toLocaleUpperCase() +name.slice(1);
				base.addTooltip(child,'<textarea style="width:800px;height:400px;overflow: hidden">' + fn.toString() +'</textarea>','javascript-mode-tooltip');
			});

			//构造器
			function constructor() {
				function Car(name, type) {
					this.name = name;
					this.type = type;
					this.parent = {
						name: 'Sun',
						index: 12
					};
				}

				return [new Car('Honda', 'XX01'), new Car('Copy', 'XX01')];
			}

			//模块
			function module() {
				function car() {
					var moduleObj = {}, hello = 'Hello Word!';
					moduleObj.name = 'Test Sun';
					moduleObj.age = 30;
					moduleObj.say = function () {
						return hello;
					};
					return moduleObj;
				}

				return [car(), car()];
			}

			//揭示模块
			function revealingModule() {
				function cat() {
					var temp = {};
					var get = function (key) {
						return temp[key];
					};
					var set = function (key, val) {
						temp[key] = val;
					};
					return {
						set: set,
						get: get
					};
				}

				return [cat(), cat()];
			}

			//单例
			function singleton() {
				function sing() {
					if (!sing.instance) {
						sing.instance = {debug: true, type: 'singleton'};
					}
					return sing.instance;
				}

				return [sing(), sing()];
			}

			//观察者
			function observer() {

			}

			//中介者
			function mediator() {

			}

			//原型
			function prototype() {
				var beget = (function () {
					function F() {
					}

					return function (proto) {
						F.prototype = proto;
						return new F();
					};
				})();

				return [beget({a: 1}), beget({b: 2})];
			}

			//命令
			function command() {
				var CarManager = {
					requestInfo: function (model, id) {
						return 'The information for ' + model + 'with ID ' + id + ' is foobar';
					},
					buyVehicle: function (model, id) {
						return 'You have successfully purchased Item ' + id + ',a ' + model;
					},
					arrangeViewing: function (model, id) {
						return 'You have successfully booked a viewing of ' + model + '(' + id + ')';
					}
				};

				CarManager.execute = function (name) {
					return CarManager[name] && CarManager[name].apply(CarManager, [].slice.call(arguments, 1));
				};

				return [
					CarManager.execute('requestInfo', 'AADD', '111222'),
					CarManager.execute('buyVehicle', 'SSDD', '124569'),
					CarManager.execute('buyVehicle', 'FFGGH', '698755'),
					CarManager.execute('arrangeViewing', 'DDSS', '555555')
				];
			}

			//外观
			function facade() {
				var module = (function () {
					var _private = {
						id: 5,
						get: function () {
							return this.i;
						},
						set: function (value) {
							this.i = value;
						},
						run: function () {
							return 'running';
						}
					};
					return {
						facade: function (args) {
							var result = {};
							_private.set(args.val);
							result.value = _private.get();
							if (args.run) {
								result.run = _private.run();
							}
							return result;
						}
					};
				})();

				return [
					module.facade({run: true, val: 10}),
					module.facade({run: true, val: 20})
				];
			}

			//工厂
			function factory() {
				function Car(options) {
					this.name = options.name || 'Car';
					this.id = options.id || Date.now();
					this.color = options.color || '#99ff99';
					this.speed = 40;
				}

				function Bus(options) {
					this.name = options.name || 'Bus';
					this.id = options.id || Date.now();
					this.color = options.color || '#000099';
					this.speed = 60;
				}

				function $factory(Type, options) {
					var obj = new Type(options || {});
					obj.run = function () {
						obj.x = (obj.x || 0) + obj.speed;
						return {x: obj.x, y: 12};
					};
					obj.type = 'motor vehicle';
					return obj;
				}

				return [$factory(Car), $factory(Bus)];
			}

			//混入
			function mixin() {
				var Car = function Car(options) {
					options = options || {};
					this.name = options.name || 'Car';
					this.id = options.id || Date.now();
					this.color = options.color || '#99ff99';
					this.speed = 40;
				};
				var NewCar = function () {
				};

				return [
					base.extend(new NewCar(), new Car()),
					base.extend(new NewCar(), new Car({name: 'NewCar', color: '#990000'}))
				];
			}

			//装饰着
			function decorator() {
				var Car = function Car(options) {
					options = options || {};
					this.name = options.name || 'Car';
					this.id = options.id || Date.now();
					this.color = options.color || '#99ff99';
					this.speed = 40;
				};

				function newCar(options) {
					var car = new Car(options);
					car.run = function () {
						return 'speed: ' + car.speed;
					};
					return car;
				}

				return [
					newCar(),
					newCar({name: 'NewCar', color: '#99aaaa'})
				];
			}

			//享元
			function flyweight() {
				//享元对象
				var coffeeObject = {
					serviceCoffee: function () {
					},
					getFlavor: function () {
					}
				};

				//实现具体享元对象
				function CoffeeFlavor(newFlavor) {
					var flavor = newFlavor;

					if (typeof this.getFlavor === 'function') {
						this.getFlavor = function () {
							return flavor;
						};
					}
					if (typeof this.serviceCoffee === 'function') {
						this.serviceCoffee = function (args) {
							return args || '';
						};
					}
				}

				CoffeeFlavor.prototype = coffeeObject;

				return [
					new CoffeeFlavor('AAA'),
					new CoffeeFlavor('BBB')
				];
			}
		}
	});

	$e({
		title:'Modularization',
		fn:function(content,base){
			content.classList.add('javascript-mode');
			base.each([],function(fn){
				var name = fn.name || fn.toString().replace(/function\s?/mi,"").split("(").shift();
				var child = document.createElement('h4');
				content.appendChild(child);
				child.innerHTML = name[0].toLocaleUpperCase() + name.slice(1);
			});
		}
	});

	$e({
		title:'MV* Mode',
		fn:function(content,base){
			content.classList.add('javascript-mode');
			base.each([MVC,MVP,MVVM,Backbone],function(fn){
				var name = fn.name || fn.toString().replace(/function\s?/mi,"").split("(").shift();
				var child = document.createElement('h4');
				content.appendChild(child);
				child.innerHTML = name[0].toLocaleUpperCase() + name.slice(1);
				base.addTooltip(child,'<textarea style="width:600px;height:400px;overflow: hidden">' + fn.toString() +'</textarea>','javascript-mode-tooltip');
			});

			/**
			 * @return {string}
			 */
			function MVC(){
				return 'M:Model<br>V:View<br>C:Controller';
			}
			/**
			 * @return {string}
			 */
			function MVP(){
				return 'M:Model<br>V:View<br>P:Presenter';
			}

			/**
			 * @return {string}
			 */
			function MVVM(){
				return 'M:Model<br>V:View<br>VM:ViewModel(Controller)';
			}

			/**
			 * @return {string}
			 */
			function Backbone(){
				return 'Backbone.js';
			}
		}
	});

})(window.$ehr);