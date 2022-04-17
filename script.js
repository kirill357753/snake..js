/* создаем блок за отображение на странице очков и очки */
let score = 0;

/* Содержит настройки игры. Объект */
let config = {

    /* step, maxstep чтобы пропускать игровой цикл */
	step: 0, // шаг
	maxStep: 6, // максимальная скорость

	/* sizeCEll размер одной ячейки, а sizeBerry ягода которую будет кушать змейка */
	sizeCell: 16, // размер ячейки
	sizeBerry: 16 / 4, // размер ягоды
}

/* Все что связано со змейкой. Объект */
const snake = {

    /* Координаты */
	x: 160,
	y: 160,

	/* Скорость по вертикали и горизонтали */
	dx: config.sizeCell, // скорость по горизонтали просит у объекта config значение ключа sizeCell
	dy: 0,
	/* массив ячеек под контролем змейки */
	tails: [],
	/* кол-во ячеек */
	maxTails: 3,
}

/* хранит координаты ягоды. Объект */
const berry = {
    x: 0,
    y: 0,
}

/* получаем поле канвас из HTML */
const canvas = document.querySelector('#game-canvas');

/* Создаем контекст для рисования */
const context = canvas.getContext('2d');

/* получаем из HTML наш счетчик */
const scoreBlock = document.querySelector('.game-score .score-count');

drawScore();
randomPositionBerry();


/* в игровой цикл подаем бесконечную функцию отрисовки */
function gameLoop() {

	requestAnimationFrame( gameLoop );
	/* проверка позволяет контролировать скорость отрисовки, 
    если значение из конфига меньше чем максимальное то пропускаем функцию */
	if ( ++config.step < config.maxStep) {
		return;
	}
	config.step = 0;
	//очищаем канвас 
	context.clearRect(0, 0, canvas.clientWidth, canvas.height);

	drawSnake();
	drawBerry();
}
requestAnimationFrame( gameLoop );

//первые функции формирования змейки

/* 1. увеличивает кол-во очки на 1 */
function incScore(){
	score++;//увеличивает на 1
	drawScore();//отрисует его на экран
}

/*2. отображает значки на странице*/
function drawScore(){
	scoreBlock.innerHTML = score;
}



/* 3. рандом в заданом диапозоне возвращает число*/
function getRandomInt(min, max){
	return Math.floor(Math.random() * (max - min) + min);
}

/* 4. отображаем змейку*/
function drawSnake() {
	/* в нутри меняем координаты змейки согласно скорости*/
	snake.x += snake.dx;// snake.x = snake.x + snake.dx
	snake.y += snake.dy;

	collisonBorder()

	// добавляем в массив объект с кординатами
	snake.tails.unshift( { x: snake.x, y: snake.y });
	/*если кол-во дочерних элементов у змейки больше чем разрешено то мы 
	удаляем последний элемент*/
	if (snake.tails.length > snake.maxTails) {
		snake.tails.pop();

	}

	/* перебираем все дочерние элементы  у змейки и отрисовываем их  попутно
	проверяя на соприкосновение друнг с другом и с ягодой*/
	snake.tails.forEach( function(el, index){	
		if(index == 0) {
			context.fillStyle = "#c90234";//красим красный
		} else {
			context.fillStyle = "#ab02c9"//остальное тело  в тусклый
		}
		context.fillRect(el.x, el.y , config.sizeCell, config.sizeCell);

		//проверяем координаты ягоды и змейки, если совпадают то увеличиваем хвост
		if (el.x === berry.x && el.y === berry.y ) {
			snake.maxTails++; //увеличиваем хвост на 1 
			incScore(); // увеличиваем очки
			randomPositionBerry(); //создаем новую ягоду

			//задаем усовия роста скорости 
			if( score === 10 ){
				config.maxStep = 7;
			}else if (score === 20){
				config.maxStep = 6 ;
			}else if ( score === 30) {
				config.maxStep = 5 ;
			}else if (score === 40){
				config.maxStep = 4 ;
			}
		}
				/* нужно проверить змейку с хвостом если совпало то заново запускаем игру*/
		for(let i = index + 1; i < snake.tails.length; i++){
			//усли координаты совпали то запускаем заново
			if ( el.x == snake.tails[i].x && el.y == snake.tails[i].y){
				// функция перезапуска игры 
				refreshGame();
			}
		}		
	})	
}

/* 5 рисование ягоды описание после колизии*/
function drawBerry() {

	context.beginPath(); //начало рисования
	context.fillStyle = "A00034"; // задаем цвет ягоды
	// рисуем окружность на основе координат от ягоды
	context.arc(
		berry.x + ( config.sizeCell / 2), //размер согласно  по x оси
		berry.y + (config.sizeCell / 2), //размер согласно  по y оси
		config.sizeBerry, 0 , 2 * Math.PI); // конец arc
	context.fill();
}


// для назначения координат для этой ягоды
function randomPositionBerry(){
	/* в рандом передаем 0 кол-во ячеек получаем засчет деления ширины канваса
	на размер ячейки и полученый результат умножить на размер ячейкм*/
	berry.x  = getRandomInt( 0, canvas.width / config.sizeCell ) * config.sizeCell;
	berry.y  = getRandomInt( 0, canvas.height  / config.sizeCell ) * config.sizeCell
}

//обработчик события в котором определяем какую клавишу нажали 
document.addEventListener("keydown" , function (e) {
	/////////////////////////////// ДОМАШНИЕ ЗАДАНИЕ // console.log("Подслушиватель" , e);
	// проверяем код который проверяет код клавиши
	/* после нажатия мы должны поменять направление у змейки учитывая что она
	движется постояно мы меняем значение движения с ПОЛОЖИТЕЛЬНОГО на ОТРИЦАТЕЛЬНОЕ
	и наоборот  взависимости от того какую клавишу нажали.
	Помимо того что мы сменили направление нам также нужно обнулить
	движение по горизонтали или вертекали
	в зависимости от клавиши которую нажали*/
	if (e.code == "KeyW") {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyA") {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	}else if ( e.code == "KeyS") {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	}else if ( e.code == "KeyD") {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	}
});

/////////////////////////////////////////////////////////////////////////////////// ДОМАШНИЕ ЗАДАНИЕ
/*document.addEventListener("keydown" , function (e) {

	if (e.code == "ArrowUp") {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "ArrowLeft") {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	}else if ( e.code == "ArrowDown") {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	}else if ( e.code == "ArrowRight") {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	}
});*/

///////////////////////////////////////////////////////////////////////////////// ДОМАШНИЕ ЗАДАНИЕ
/*document.addEventListener("keydown" , function (e) {

	if (e.code == "KeyY") {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
	} else if ( e.code == "KeyG") {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
	}else if ( e.code == "KeyH") {
		snake.dy = config.sizeCell;
		snake.dx = 0;
	}else if ( e.code == "KeyJ") {
		snake.dx = config.sizeCell;
		snake.dy = 0;
	}
});*/

/* 7  колизия для границ если змейка подоша к краю то должна отображаться с другой стороны*/
function collisonBorder(){
	//проверка координат змейки если выходит за границу канваса то меняем координаты

	//если x координаты объкта змейки меньше нуля
	if (snake.x < 0 ) {
		//то тогда ее координаты станут ширина канваса вычесть размер ячеек в объекте конфиг
		snake.x = canvas.width - config.sizeCell;
	}else if (snake.x  >= canvas.width){ // a	 если х больше или равен канвас ширина
		snake.x = 0;
	}

if (snake.y < 0 ) {
	snake.x = canvas.height - config.sizeCell;
}else if (snake.y  >= canvas.height){
	snake.y = 0;
}	
}
//прописываем обнуление всех значений
function refreshGame(){
score = 0;
drawScore();

snake.x = 160;
snake.y = 160;
snake.tails = [];
snake.maxTails = 3;
snake.dx = config.sizeCell;
snake.dy = 0;

randomPositionBerry();
}

