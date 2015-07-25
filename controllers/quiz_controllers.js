var models = require('../models/models.js');


exports.load = function  (req,res,next,quizId) {
	models.Quiz.find(quizId).then(
			function  (quiz) {
				if (quiz) {
					req.quiz=quiz;
					next();
				}
				else{
				next(new Error("No existe quizId="+quizId));	
				}	
			}
		).catch(function(error){next(error);});
};



exports.index = function(req,res){
var busqueda = req.query.search;
console.log("busqueda:" + busqueda);
if(busqueda !== undefined)
models.Quiz.findAll({where: ["pregunta like ?", "%" + busqueda.replace(" ", "%") + "%"]}).then(function(quizes){
	res.render('quizes/index',{quizes:quizes});
}).catch(function(error){next(error);});
else
models.Quiz.findAll().then(function(quizes){
	res.render('quizes/index',{quizes:quizes});
}).catch(function(error){next(error);});

}

exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz:req.quiz})
	})
};


exports.answer = function(req,res){

var resultado= 'Incorrecto';
if(req.query.respuesta === req.quiz.respuesta){
		resultado='Correcto';
	}
	
		res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado});
};
