var path = require('path');

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);					  
//console.log(process.env.DATABASE_URL);
//console.log(process.env.DATABASE_STORAGE);
//console.log(url);

var DB_name		=	(url[6]||null);
var user		=	(url[2]||null);
var pwd			=	(url[3]||null);
var protocol	=	(url[1]||null);
var dialect		=	(url[1]||null);
var port 		=	(url[5]||null);
var host 		=	(url[4]||null);
var storage 	=	process.env.DATABASE_STORAGE;


//cargar modelo ORM
var Sequelize = require('sequelize');

//utilizar BD sqlite o postgress
var sequelize = new Sequelize(DB_name,user,pwd,
	{dialect:protocol,
	protocol:protocol,
	port:port,
	host:host,
	storage:storage,
	native:true,
	omitNull:true
});

//importar definicion de tabla quiz  en quiz.js
var quiz_path = path.join(__dirname,'quiz');
var Quiz = sequelize.import(quiz_path);

//exportar definicion de tabla quiz
exports.Quiz = Quiz;
//crear en inicializr tabla de preguntas en BD
sequelize.sync().success(function (){
Quiz.count().success(function (count){
	//si la tabla esta vacia se inicializa con esta pregunta
	if (count === 0) {
		Quiz.create({
			tema:'geografia',
			pregunta:'Capital de Italia',
			respuesta:'Roma'
		});
		Quiz.create({
			tema:'geografia',
			pregunta:'Capital de Portugal',
			respuesta:'Lisboa'
		})
		.success(function  () {
			console.log('Base de datos inicializada');
		});
	};
});
});