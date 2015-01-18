// Model IIFE
(function(){
	// Private
	var quiz = []
	var questionCounter = 1

	// Public

	Quizzy.find = function (id){
		for (var i = 0; i < quiz.length; i++){
			if (quiz[i]. id === id){return quiz[i]}
		}
	}

	Quizzy.forEach = function(callback){
		for (var i = 0; i < quiz.length; i++){
			callback( extend({}, quiz[i]))
		}
	}
})()