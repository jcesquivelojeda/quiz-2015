var models = require('../models/models.js');
var Sequelize = require('sequelize');


exports.mostrarEstadisticas = function  (req,res,next) {

	var numeroDePreguntas= 0;
	var numeroDeComentarios= 0;
	var promedioComentariosPorPregunta=0;
	var numeroDePreguntasConComentarios= 0;
	var numeroDePreguntasSinComentarios= 0;


	var ciencia=0;
	var tecnologia=0;
	var ocio=0;
	var otro=0;
	var humanidades=0;
	var geografia=0;

	models.Quiz.count()
	.then(function(numero){
		numeroDePreguntas = numero;
  		//console.log(numero);

  	models.Comment.count()
		.then(function(numero)
		{
			numeroDeComentarios = numero;
			promedioComentariosPorPregunta = Number(numeroDeComentarios/ numeroDePreguntas).truncar(1);
			models.Quiz.findAndCountAll({ include: [{ model:models.Comment, required: true }] })			
			.then(function(datos)
				{
					numeroDePreguntasConComentarios = datos.rows.length;
					numeroDePreguntasSinComentarios= numeroDePreguntas - numeroDePreguntasConComentarios;
					
					models.Quiz.findAndCountAll({ where:{tema:"geografia"} }).then(function  (datos) {				
						geografia=datos.count;
							models.Quiz.findAndCountAll({ where:{tema:"humanidades"} }).then(function  (datos) {						
							humanidades=datos.count;
							models.Quiz.findAndCountAll({ where:{tema:"ciencia"} }).then(function  (datos) {							
								ciencia=datos.count;
								models.Quiz.findAndCountAll({ where:{tema:"tecnologia"} }).then(function  (datos) {						
									tecnologia=datos.count;
									models.Quiz.findAndCountAll({ where:{tema:"ocio"} }).then(function  (datos) {					
										ocio=datos.count;
										models.Quiz.findAndCountAll({ where:{tema:"otro"} }).then(function  (datos) {						
											otro=datos.count;
											res.render('statistics/index',
											{
												datos:
												{"s1":numeroDePreguntas,
												 "s2":numeroDeComentarios,
												 "s3":promedioComentariosPorPregunta,
												 "s4":numeroDePreguntasSinComentarios,
												 "s5":numeroDePreguntasConComentarios,
												 "g1":geografia,	
												 "c1":"#5E4FA2",	
												 "l1":"Geografia",	
												 "g2":tecnologia,
												 "c2":"#3288BD",	
												 "l2":"Tecnologia",		
												 "g3":humanidades,
												 "c3":"#9E3142",	
												 "l3":"Humanidades",		
												 "g4":ocio,
												 "c4":"#96C2A5",	
												 "l4":"Ocio",		
												 "g5":ciencia,
												 "c5":"#aDfE61",	
												 "l5":"Ciencia",	
												 "g6":otro,	
												 "c6":"#f6fa3a",	
												 "l6":"Otro"
												},errors:[]});
										})		

									})		

								})
							})		

						})		


					})		

					
						  	
			  });
		});	  	
	}).catch(function(error){next(error);});

}
