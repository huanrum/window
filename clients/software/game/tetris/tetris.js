(function (window) {
	'use strict';

	window.tetris = (function () {
		// û������0  // ���巽�����ɫ
		var TETRIS = {rows:20,cols:14,size:24,noblock:0,colors:["#fff", "#f00", "#0f0", "#00f", "#c60", "#f0f", "#0ff", "#609"]};

		var initTetrisStatus = function(tetris){
			// ���������ڼ�¼�����Ѿ��̶������ķ��顣
			var tetris_status = [];
			for (var i = 0; i < tetris.rows; i++) {
				tetris_status[i] = [];
				for (var j = 0; j < tetris.cols; j++) {
					tetris_status[i][j] = tetris.noblock;
				}
			}
			return tetris_status;
		};

		// �����ʼ�������µ��ķ���
		var initBlock = function (tetris) {
			// ���弸�ֿ��ܳ��ֵķ������
			var blockArr = [
				// �����һ�ֿ��ܳ��ֵķ�����ϣ�Z
				[
					{x: tetris.cols / 2 - 1, y: 0, color: 1},
					{x: tetris.cols / 2, y: 0, color: 1},
					{x: tetris.cols / 2, y: 1, color: 1},
					{x: tetris.cols / 2 + 1, y: 1, color: 1}
				],
				// ����ڶ��ֿ��ܳ��ֵķ�����ϣ���Z
				[
					{x: tetris.cols / 2 + 1, y: 0, color: 2},
					{x: tetris.cols / 2, y: 0, color: 2},
					{x: tetris.cols / 2, y: 1, color: 2},
					{x: tetris.cols / 2 - 1, y: 1, color: 2}
				],
				// ��������ֿ��ܳ��ֵķ�����ϣ� ��
				[
					{x: tetris.cols / 2 - 1, y: 0, color: 3},
					{x: tetris.cols / 2, y: 0, color: 3},
					{x: tetris.cols / 2 - 1, y: 1, color: 3},
					{x: tetris.cols / 2, y: 1, color: 3}
				],
				// ��������ֿ��ܳ��ֵķ�����ϣ�L
				[
					{x: tetris.cols / 2 - 1, y: 0, color: 4},
					{x: tetris.cols / 2 - 1, y: 1, color: 4},
					{x: tetris.cols / 2 - 1, y: 2, color: 4},
					{x: tetris.cols / 2, y: 2, color: 4}
				],
				// ��������ֿ��ܳ��ֵķ�����ϣ�J
				[
					{x: tetris.cols / 2, y: 0, color: 5},
					{x: tetris.cols / 2, y: 1, color: 5},
					{x: tetris.cols / 2, y: 2, color: 5},
					{x: tetris.cols / 2 - 1, y: 2, color: 5}
				],
				// ��������ֿ��ܳ��ֵķ������ : ��
				[
					{x: tetris.cols / 2, y: 0, color: 6},
					{x: tetris.cols / 2, y: 1, color: 6},
					{x: tetris.cols / 2, y: 2, color: 6},
					{x: tetris.cols / 2, y: 3, color: 6}
				],
				// ��������ֿ��ܳ��ֵķ������ : ��
				[
					{x: tetris.cols / 2, y: 0, color: 7},
					{x: tetris.cols / 2 - 1, y: 1, color: 7},
					{x: tetris.cols / 2, y: 1, color: 7},
					{x: tetris.cols / 2 + 1, y: 1, color: 7}
				]
			];
			var rand = Math.floor(Math.random() * blockArr.length);
			// ������������µ��ķ���
			return [
				{x: blockArr[rand][0].x, y: blockArr[rand][0].y, color: blockArr[rand][0].color},
				{x: blockArr[rand][1].x, y: blockArr[rand][1].y, color: blockArr[rand][1].color},
				{x: blockArr[rand][2].x, y: blockArr[rand][2].y, color: blockArr[rand][2].color},
				{x: blockArr[rand][3].x, y: blockArr[rand][3].y, color: blockArr[rand][3].color}
			];
		};
		// ����һ������canvas����ĺ���
		var createCanvas = function (parent,tetris) {
			var tetris_canvas = document.createElement("canvas");
			// ��ȡcanvas�ϵĻ�ͼAPI
			var tetris_ctx = tetris_canvas.getContext('2d');
			// ����canvas����ĸ߶ȡ����
			tetris_canvas.width = tetris.cols * tetris.size;
			tetris_canvas.height = tetris.rows * tetris.size;
			// ����canvas����ı߿�
			tetris_canvas.style.border = "1px solid black";

			// ��ʼ����·��
			tetris_ctx.beginPath();
			// ���ƺ��������Ӧ��·��
			for (var i = 1; i < tetris.rows; i++) {
				tetris_ctx.moveTo(0, i * tetris.size);
				tetris_ctx.lineTo(tetris.cols * tetris.size, i * tetris.size);
			}
			// �������������Ӧ��·��
			for (var j = 1; j < tetris.cols; j++) {
				tetris_ctx.moveTo(j * tetris.size, 0);
				tetris_ctx.lineTo(j * tetris.size, tetris.rows * tetris.size);
			}
			tetris_ctx.closePath();
			// ���ñʴ���ɫ
			tetris_ctx.strokeStyle = "#aaa";
			// ����������ϸ
			tetris_ctx.lineWidth = 0.3;
			// ��������
			tetris_ctx.stroke();

			parent.appendChild(tetris_canvas);
			return tetris_ctx;
		};

		// ���ƶ���˹�����״̬
		var drawBlock = function (currentCache) {
			var tetris = currentCache.tetris;
			for (var i = 0; i < tetris.rows; i++) {
				for (var j = 0; j < tetris.cols; j++) {
					// �з���ĵط�������ɫ
					if (currentCache.tetris_status[i][j] !== tetris.noblock) {
						// ���������ɫ
						currentCache.tetris_ctx.fillStyle = tetris.colors[currentCache.tetris_status[i][j]];
						// ���ƾ���
						currentCache.tetris_ctx.fillRect(j * tetris.size + 1, i * tetris.size + 1, tetris.size - 2, tetris.size - 2);
					}
					// û�з���ĵط����ư�ɫ
					else {
						// ���������ɫ
						currentCache.tetris_ctx.fillStyle = 'white';
						// ���ƾ���
						currentCache.tetris_ctx.fillRect(j * tetris.size + 1, i * tetris.size + 1, tetris.size - 2, tetris.size - 2);
					}
				}
			}
		};

		function binding(curScoreEle, curSpeedEle, maxScoreEle){
			// ��ȡLocal Storage���curScore��¼
			var curScore = parseInt(localStorage.getItem("curScore")||'0');
			// ��ȡLocal Storage���maxScore��¼
			var maxScore = parseInt(localStorage.getItem("maxScore")||'0');
			// ��ȡLocal Storage���curSpeed��¼
			var curSpeed = parseInt(localStorage.getItem("curSpeed")||'1');

			curScoreEle.innerHTML = curScore;
			maxScoreEle.innerHTML = maxScore;
			curSpeedEle.innerHTML = curSpeed;
			return {
				addScore: function (score) {
					curScore = curScore + score;
					curScoreEle.innerHTML = score;
					if (score > maxScore) {
						maxScore = score;
						maxScoreEle.innerHTML = score;
						// ��¼��ǰ����
						localStorage.setItem("maxScore", maxScore);
					}
					// ��¼��ǰ����
					localStorage.setItem("curScore", curScore);

					// �����ǰ���ִﵽ�������ޡ�
					if (curScore >= curSpeed * curSpeed * 500) {
						curSpeedEle.innerHTML = curSpeed += 1;
						// ʹ��Local Storage��¼curSpeed��
						localStorage.setItem("curSpeed", curSpeed);
						clearInterval(this.curTimer);
						this.curTimer = setInterval(this.$moveDown, 500 / curSpeed);
					}
				},
				reStartCurTimer: function (can) {
					if (this.curTimer) {
						this.curTimer = clearInterval(this.curTimer);
					}
					if(can){
						this.curTimer = setInterval(this.$moveDown, 500 / curSpeed);
					}
				}
			};
		}

		return function (parent, curScoreEle, curSpeedEle, maxScoreEle) {
			// ��ȡLocal Storage���tetris_status��¼
			var tmpStatus = localStorage.getItem("tetris_status");

			var currentCache = {
				tetris:TETRIS,
				curTimer:null,
				tetris_ctx : createCanvas(parent,TETRIS),
				currentFall:initBlock(TETRIS),// ��ʼ�������µ��ķ���
				update:binding(curScoreEle, curSpeedEle, maxScoreEle),
				tetris_status : tmpStatus?JSON.parse(tmpStatus):initTetrisStatus(TETRIS)
			};

			currentCache.update.$moveDown = function(){moveDown(currentCache);};

			// �ѷ���״̬���Ƴ���
			drawBlock(currentCache);

			// ����ÿ���̶�ʱ��ִ��һ�����¡�����
			currentCache.update.reStartCurTimer(true);

			// Ϊ���ڵİ����¼����¼�������
			window.onkeydown = onkeydown;
			window.focus();

			return {
				suspend: suspend,
				reStart: reStart
			};

			function reStart() {
				localStorage.removeItem("tetris_status");
				localStorage.removeItem("curScore");
				localStorage.removeItem("maxScore");
				localStorage.removeItem("curSpeed");
				currentCache.tetris_status = initTetrisStatus(currentCache.tetris);
				currentCache.update.reStartCurTimer(true);
				drawBlock(currentCache);
			}

			function suspend($suspend) {
				if ($suspend === undefined) {
					if (currentCache.update.curTimer) {
						currentCache.update.reStartCurTimer(false);
					} else {
						// ����ÿ���̶�ʱ��ִ��һ�����¡�����
						currentCache.update.reStartCurTimer(true);
					}
				} else if ($suspend) {
					currentCache.update.reStartCurTimer(false);
				} else {
					currentCache.update.reStartCurTimer(true);
				}
			}

			function onkeydown(evt){
				if(!!currentCache.update.curTimer){
					switch (evt.keyCode) {
						// �����ˡ����¡���ͷ
						case 40:
							return moveDown(currentCache);
						// �����ˡ����󡱼�ͷ
						case 37:
							return moveLeft(currentCache);
						// �����ˡ����ҡ���ͷ
						case 39:
							return moveRight(currentCache);
						// �����ˡ����ϡ���ͷ
						case 38:
							return rotate(currentCache);
					}
				}
			}
		};


		// ���Ʒ������µ���
		function moveDown(currentCache) {
			// ��������¡�����
			if (canDown()) {
				down();
			}
			// �������µ�
			else {
				// ����ÿ������, ��ÿ�������ֵ��¼��tetris_status������
				run();
				// �ж��Ƿ��С�������������
				lineFull(currentCache);
				// ʹ��Local Storage��¼����˹�������Ϸ״̬
				localStorage.setItem("tetris_status", JSON.stringify(currentCache.tetris_status));
				// ��ʼһ���µķ��顣
				currentCache.currentFall =  initBlock(currentCache.tetris);
			}

			// �����ܷ��µ������
			function canDown() {
				// ����ÿ�����飬�ж��Ƿ������µ�
				for (var ii = 0; ii < currentCache.currentFall.length; ii++) {
					// �ж��Ƿ��Ѿ���������¡�
					if (currentCache.currentFall[ii].y >= currentCache.tetris.rows - 1) {
						return false;
					}
					// �ж���һ���Ƿ��з��顱, �����һ���з��飬�������µ�
					if (currentCache.tetris_status[currentCache.currentFall[ii].y + 1][currentCache.currentFall[ii].x] !== currentCache.tetris.noblock) {
						return false;
					}
				}
				return true;
			}

			function down(){
				// ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
				for (var ij = 0; ij < currentCache.currentFall.length; ij++) {
					// ���������ɫ
					currentCache.tetris_ctx.fillStyle = 'white';
					// ���ƾ���
					currentCache.tetris_ctx.fillRect(currentCache.currentFall[ij].x * currentCache.tetris.size + 1, currentCache.currentFall[ij].y * currentCache.tetris.size + 1,
						currentCache.tetris.size - 2, currentCache.tetris.size - 2);
				}
				// ����ÿ������, ����ÿ�������y�����1��
				// Ҳ���ǿ��Ʒ��鶼�µ�һ��
				for (var ik = 0; ik < currentCache.currentFall.length; ik++) {
					currentCache.currentFall[ik].y++;
				}
				// �����ƺ��ÿ������ı���ɫͿ�ɸ÷������ɫֵ
				for (var il = 0; il < currentCache.currentFall.length; il++) {
					// ���������ɫ
					currentCache.tetris_ctx.fillStyle = currentCache.tetris.colors[currentCache.currentFall[il].color];
					// ���ƾ���
					currentCache.tetris_ctx.fillRect(currentCache.currentFall[il].x * currentCache.tetris.size + 1, currentCache.currentFall[il].y * currentCache.tetris.size + 1,
						currentCache.tetris.size - 2, currentCache.tetris.size - 2);
				}
			}

			function run(){
				for (var ji = 0; ji < currentCache.currentFall.length; ji++) {
					var cur = currentCache.currentFall[ji];
					// ����з����Ѿ����������ˣ���������
					if (cur.y < 2) {
						// ���Local Storage�еĵ�ǰ����ֵ����Ϸ״̬����ǰ�ٶ�
						localStorage.removeItem("curScore");
						localStorage.removeItem("tetris_status");
						localStorage.removeItem("curSpeed");
						// �����ʱ��
						currentCache.curTimer = clearInterval(currentCache.curTimer);
						return;
					}
					// ��ÿ�����鵱ǰ����λ�ø�Ϊ��ǰ�������ɫֵ
					currentCache.tetris_status[cur.y][cur.x] = cur.color;
				}
			}
		}
		// �������Ʒ���ĺ���
		function moveLeft(currentCache) {
			// ���������
			if (canLeft()) {
				// ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
				for (var ii = 0; ii < currentCache.currentFall.length; ii++) {
					// ���������ɫ
					currentCache.tetris_ctx.fillStyle = 'white';
					// ���ƾ���
					currentCache.tetris_ctx.fillRect(currentCache.currentFall[ii].x * currentCache.tetris.size + 1, currentCache.currentFall[ii].y * currentCache.tetris.size + 1,
						currentCache.tetris.size - 2, currentCache.tetris.size - 2);
				}
				// �������������µ��ķ���
				for (var ij = 0; ij < currentCache.currentFall.length; ij++) {
					currentCache.currentFall[ij].x--;
				}
				// �����ƺ��ÿ������ı���ɫͿ�ɷ����Ӧ����ɫ
				for (var ik = 0; ik < currentCache.currentFall.length; ik++) {
					var cur = currentCache.currentFall[ik];
					// ���������ɫ
					currentCache.tetris_ctx.fillStyle = currentCache.tetris.colors[currentCache.currentFall[ik].color];
					// ���ƾ���
					currentCache.tetris_ctx.fillRect(currentCache.currentFall[ik].x * currentCache.tetris.size + 1, currentCache.currentFall[ik].y * currentCache.tetris.size + 1,
						currentCache.tetris.size - 2, currentCache.tetris.size - 2);
				}
			}

			// �����ܷ����Ƶ����
			function canLeft(){
				for (var i = 0; i < currentCache.currentFall.length; i++) {
					// ����Ѿ���������ߣ���������
					if (currentCache.currentFall[i].x <= 0) {
						return false;
					}
					// ����ߵ�λ�����з��飬��������
					if (currentCache.tetris_status[currentCache.currentFall[i].y][currentCache.currentFall[i].x - 1] !== currentCache.tetris.noblock) {
						return false;
					}
				}
				return true;
			}
		}
		// �������Ʒ���ĺ���
		function moveRight(currentCache) {

			// ���������
			if (canRight()) {
				// ������ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
				for (var ii = 0; ii < currentCache.currentFall.length; ii++) {
					// ���������ɫ
					currentCache.tetris_ctx.fillStyle = 'white';
					// ���ƾ���
					currentCache.tetris_ctx.fillRect(currentCache.currentFall[ii].x * currentCache.tetris.size + 1, currentCache.currentFall[ii].y * currentCache.tetris.size + 1,
						currentCache.tetris.size - 2, currentCache.tetris.size - 2);
				}
				// �������������µ��ķ���
				for (var ij = 0; ij < currentCache.currentFall.length; ij++) {
					currentCache.currentFall[ij].x++;
				}
				// �����ƺ��ÿ������ı���ɫͿ�ɸ������Ӧ����ɫ
				for (var ik = 0; ik < currentCache.currentFall.length; ik++) {
					// ���������ɫ
					currentCache.tetris_ctx.fillStyle = currentCache.tetris.colors[currentCache.currentFall[ik].color];
					// ���ƾ���
					currentCache.tetris_ctx.fillRect(currentCache.currentFall[ik].x * currentCache.tetris.size + 1, currentCache.currentFall[ik].y * currentCache.tetris.size + 1,
						currentCache.tetris.size - 2, currentCache.tetris.size - 2);
				}
			}

			// �����ܷ����Ƶ����
			function canRight(){
				for (var i = 0; i < currentCache.currentFall.length; i++) {
					// ����ѵ������ұߣ���������
					if (currentCache.currentFall[i].x >= currentCache.tetris.cols - 1) {
						return false;
					}
					// ����ұߵ�λ�����з��飬��������
					if (currentCache.tetris_status[currentCache.currentFall[i].y][currentCache.currentFall[i].x + 1] !== currentCache.tetris.noblock) {
						return false;
					}
				}
				return true;
			}
		}
		// ������ת����ĺ���
		function rotate(currentCache) {

			// �������ת
			if (canRotate()) {
				// ����ת��ǰ��ÿ������ı���ɫͿ�ɰ�ɫ
				for (var ii = 0; ii < currentCache.currentFall.length; ii++) {
					// ���������ɫ
					currentCache.tetris_ctx.fillStyle = 'white';
					// ���ƾ���
					currentCache.tetris_ctx.fillRect(currentCache.currentFall[ii].x * currentCache.tetris.size + 1, currentCache.currentFall[ii].y * currentCache.tetris.size + 1,
						currentCache.tetris.size - 2, currentCache.tetris.size - 2);
				}
				for (var ij = 0; ij < currentCache.currentFall.length; ij++) {
					var preX = currentCache.currentFall[ij].x;
					var preY = currentCache.currentFall[ij].y;
					// ʼ���Ե�����������Ϊ��ת������,
					// i == 2ʱ��˵������ת������
					if (ij !== 2) {
						currentCache.currentFall[ij].x = currentCache.currentFall[2].x + preY - currentCache.currentFall[2].y;
						currentCache.currentFall[ij].y = currentCache.currentFall[2].y + currentCache.currentFall[2].x - preX;
					}
				}
				// ����ת���ÿ������ı���ɫͿ�ɸ������Ӧ����ɫ
				for (var ik = 0; ik < currentCache.currentFall.length; ik++) {
					// ���������ɫ
					currentCache.tetris_ctx.fillStyle = currentCache.tetris.colors[currentCache.currentFall[ik].color];
					// ���ƾ���
					currentCache.tetris_ctx.fillRect(currentCache.currentFall[ik].x * currentCache.tetris.size + 1, currentCache.currentFall[ik].y * currentCache.tetris.size + 1,
						currentCache.tetris.size - 2, currentCache.tetris.size - 2);
				}
			}

			// �����¼�ܷ���ת�����
			function canRotate(){
				for (var i = 0; i < currentCache.currentFall.length; i++) {
					var preX = currentCache.currentFall[i].x;
					var preY = currentCache.currentFall[i].y;
					// ʼ���Ե�����������Ϊ��ת������,
					// i == 2ʱ��˵������ת������
					if (i !== 2) {
						// ���㷽����ת���x��y����
						var afterRotateX = currentCache.currentFall[2].x + preY - currentCache.currentFall[2].y;
						var afterRotateY = currentCache.currentFall[2].y + currentCache.currentFall[2].x - preX;
						// �����ת������λ�����з��飬����������ת
						if (currentCache.tetris_status[afterRotateY][afterRotateX + 1] !== currentCache.tetris.noblock) {
							return false;
						}
						// �����ת��������Ѿ�����������߽߱�
						if (afterRotateX < 0 || currentCache.tetris_status[afterRotateY - 1][afterRotateX] !== currentCache.tetris.noblock) {
							moveRight(currentCache);
							afterRotateX = currentCache.currentFall[2].x + preY - currentCache.currentFall[2].y;
							afterRotateY = currentCache.currentFall[2].y + currentCache.currentFall[2].x - preX;
							break;
						}
						if (afterRotateX < 0 || currentCache.tetris_status[afterRotateY - 1][afterRotateX] !== currentCache.tetris.noblock) {
							moveRight(currentCache);
							break;
						}
						// �����ת��������Ѿ����������ұ߽߱�
						if (afterRotateX >= currentCache.tetris.cols - 1 ||
							currentCache.tetris_status[afterRotateY][afterRotateX + 1] !== currentCache.tetris.noblock) {
							moveLeft(currentCache);
							afterRotateX = currentCache.currentFall[2].x + preY - currentCache.currentFall[2].y;
							afterRotateY = currentCache.currentFall[2].y + currentCache.currentFall[2].x - preX;
							break;
						}
						if (afterRotateX >= currentCache.tetris.cols - 1 ||
							currentCache.tetris_status[afterRotateY][afterRotateX + 1] !== currentCache.tetris.noblock) {
							moveLeft(currentCache);
							break;
						}
					}
				}
				return true;
			}
		}

		// �ж��Ƿ���һ������
		function lineFull(currentCache) {
			// ���α���ÿһ��
			for (var i = 0; i < currentCache.tetris.rows; i++) {
				var flag = true;
				// ������ǰ�е�ÿ����Ԫ��
				for (var j = 0; j < currentCache.tetris.cols; j++) {
					if (currentCache.tetris_status[i][j] === currentCache.tetris.noblock) {
						flag = false;
						break;
					}
				}
				// �����ǰ����ȫ���з�����
				if (flag) {
					// ����ǰ��������100
					currentCache.update.addScore(100);

					// �ѵ�ǰ�е����з�������һ�С�
					for (var k = i; k > 0; k--) {
						for (var l = 0; l < currentCache.tetris.cols; l++) {
							currentCache.tetris_status[k][l] = currentCache.tetris_status[k - 1][l];
						}
					}
					// ������������»���һ�鷽��
					drawBlock(currentCache);      //��
				}
			}
		}
	})();


})(window);