module.exports = function(sequelize,DataTypes){
	return sequelize.define('Quiz',
	{
		tema:{type:DataTypes.STRING,validate:{notEmpty:{msg:"Campo Tema Requerido"}}},
		pregunta:{type:DataTypes.STRING,validate:{notEmpty:{msg:"Campo Pregunta Requerido"}}},
		respuesta:{type:DataTypes.STRING,validate:{notEmpty:{msg:"Campo Respuesta Requerido"}}}
	});
}