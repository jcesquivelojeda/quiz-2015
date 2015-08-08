var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controllers');
var commentController = require('../controllers/comment_controllers');
var sessionController = require('../controllers/session_controllers');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz',errors:[] });
});

//middleware autoload de comandos  con quizId
router.param('quizId',quizController.load);

//middleware autoload de comandos  con commentId
router.param('commentId',commentController.load);

//definicion de rutas de sesion
router.get('/login',sessionController.new);
router.post('/login',sessionController.create);
router.get('/logout',sessionController.destroy);

router.get('/quizes',quizController.index);
router.get('/quizes/:quizId(\\d+)',quizController.show);
router.get('/quizes/:quizId(\\d+)/answer',quizController.answer);

router.get('/quizes/new',sessionController.loginRequired,quizController.new);
router.post	('/quizes/create',sessionController.loginRequired,quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',sessionController.loginRequired,quizController.edit);
router.put('/quizes/:quizId(\\d+)',sessionController.loginRequired,quizController.update);
router.delete('/quizes/:quizId(\\d+)',sessionController.loginRequired,quizController.destroy);

router.get('/author', function(req, res) {
  res.render('author',{errors:[]});
});


router.get('/quizes/:quizId(\\d+)/comments/new',commentController.new);
router.post	('/quizes/:quizId(\\d+)/comments/',commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',sessionController.loginRequired,commentController.publish);

module.exports = router;

//Agregar funcion a String para remover acentos
String.prototype.remueveAcentos = function()
{
	var __r =
	{
		'À':'A','Á':'A','Â':'A','Ã':'A','Ä':'A','Å':'A','Æ':'E',
		'È':'E','É':'E','Ê':'E','Ë':'E',
		'Ì':'I','Í':'I','Î':'I',
		'Ò':'O','Ó':'O','Ô':'O','Ö':'O',
		'Ù':'U','Ú':'U','Û':'U','Ü':'U',
		'Ñ':'N'
	};


	return this.replace(/[ÀÁÂÃÄÅÆÈÉÊËÌÍÎÒÓÔÖÙÚÛÜÑ]/gi, function(m)
	{
		var ret = __r[m.toUpperCase()];

		if (m === m.toLowerCase())
			ret = ret.toLowerCase();
		return ret;
	});

};

