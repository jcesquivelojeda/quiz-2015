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
{
	busqueda=busqueda.toLowerCase().remueveAcentos();
	models.Quiz.findAll({where: ["pregunta like ?", "%" + busqueda.replace(" ", "%") + "%"]}).then(function(quizes){
	res.render('quizes/index',{quizes:quizes,errors:[]});
	
}).catch(function(error){next(error);});
}
else
models.Quiz.findAll().then(function(quizes){
	res.render('quizes/index',{quizes:quizes,errors:[]});
}).catch(function(error){next(error);});

}

exports.show = function(req,res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render('quizes/show',{quiz:req.quiz,errors:[]})
	})
};


exports.new = function(req,res){
var quiz = models.Quiz.build(
	{tema:"",pregunta:"",respuesta:""}
	);

	res.render('quizes/new',{quiz:quiz,errors:[]})
};


exports.create = function(req,res){
var quiz = models.Quiz.build(req.body.quiz);

var errors = quiz.validate();
if (errors)
{
	var i=0; 
	var errores=new Array();
	
	for (var e in errors) 
		errores[i++] = {message: errors[e]};	

	res.render('quizes/new', {quiz: quiz, errors: errores});
} 
else {
	quiz.save({fields: ["tema","pregunta", "respuesta"]})
		.then( function(){ res.redirect('/quizes')}) ;
}

};

exports.edit = function  (req,res) {
	var quiz = req.quiz;
	res.render('quizes/edit',{quiz:quiz,errors:[]});
}


exports.update = function(req,res){
	req.quiz.tema = req.body.quiz.tema;
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	var errors = req.quiz.validate();

	if (errors)
{
	var i=0; 
	var errores=new Array();
	
	for (var e in errors) 
		errores[i++] = {message: errors[e]};	

	res.render('quizes/edit', {quiz: req.quiz, errors: errores});
} 
else{
		req.quiz
		.save({fields:["tema","pregunta","respuesta"]})
		.then(function  () {
			res.redirect("/quizes");
		});
	}
	
};


exports.destroy = function(req,res){
	req.quiz.destroy().then(function  () {
		res.redirect('/quizes');
	}).catch(function (error) {
		next(error)
	});
};

exports.answer = function(req,res){

var resultado= 'INCORRECTA';
if(req.query.respuesta.toLowerCase().remueveAcentos()=== req.quiz.respuesta.toLowerCase().remueveAcentos()){
		resultado='CORRECTA';
	}	
		res.render('quizes/answer',{quiz:req.quiz,respuesta:resultado,errors:[]});
};
