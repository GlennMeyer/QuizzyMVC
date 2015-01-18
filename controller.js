(function(){
	window.Quizzy = {}

	Quizzy.vm = {
		questions: m.prop([]),
		// key is question id, value is the answerIdx that the user picked
		userAnswers: m.prop({}),
		correctStatus: m.prop({
			amount: 0
		}),
		currentUser: m.prop({}),
		userScores: m.prop([]),
		answeredCorrectly: m.prop({
			totalAnswers: 0
		})
	}

	// Transaction Script
	Quizzy.add = function (text, answer, answerIdx){
		if (! text){
			return { error: 'text_required' }
		}
		if (! answer1){
			return { error: 'answer1_required' }
		}
		if (! answer2){
			return { error: 'answer2_required' }
		}
		if (! answerIdx){
			return { error: 'answerIdx_required'}
		}

		var question = {
			id: questionCounter,
			text: text,
			answers: [],
			answerIdx: answerIdx
		}

		Quizzy.vm.questions.push(question)
		questionCounter++

		$(document).trigger('new-question')

		return { success: true }
	}

	Quizzy.vm.questions([
		{id: 1, isAnswered: false, text: "What what?", answers: ["Red", "Blue"], answerIdx: 0},
		{id: 2, isAnswered: false, text: "Who... what... when... where?", answers: ["Brown Chicken", "Brown Cow"], answerIdx: 1},
		{id: 3, isAnswered: false, text: "What came first the chicken or the egg?", answers: ["Tomatoes", "Hash Browns"], answerIdx: 0}
		])

	Quizzy.controller = function(){
		var vm = Quizzy.vm
		var ctrl = this

		ctrl.add = function () {
			var newModel = new Quizzy.model()
			vm.questions().push(newModel)
		}
		ctrl.grade = function () {
			// e.preventDefault()
			var answers = Quizzy.vm.userAnswers()
			Quizzy.vm.correctStatus().amount = 0
			var correct = Quizzy.vm.correctStatus()

			var results = Quizzy.vm.questions().map(function(question){
				var isCorrect = question.answerIdx === answers[question.id]
				correct[question.id] = isCorrect
				if (isCorrect) {
					correct['amount']++
					Quizzy.vm.answeredCorrectly()[question.id] ? Quizzy.vm.answeredCorrectly()[question.id]++ : Quizzy.vm.answeredCorrectly()[question.id] = 1
				}
			})
			var score = Math.round(correct.amount / Quizzy.vm.questions().length * 100)
			alert(Quizzy.vm.currentUser() + " scored a " + score + " out of 100.")

			Quizzy.vm.userScores().push({
				username: Quizzy.vm.currentUser(),
				score: score
			})
			Quizzy.vm.answeredCorrectly().totalAnswers++
		}
		ctrl.remove = function (index){
			vm.questions().splice(index, 1)
		}
		ctrl.reset = function(){
			Quizzy.vm.userAnswers({})
			Quizzy.vm.correctStatus({})
			Quizzy.vm.userAnswers({})
			Quizzy.vm.currentUser({})
		}
		ctrl.selectAnswer = function (questionId, answerIdx){
			var answers = Quizzy.vm.userAnswers()
			answers[questionId] = answerIdx
		}
		ctrl.username = function (name){
			console.log(name)
		}

	}

	Quizzy.markComplete = function (questionId, isAnswered) {
		var question = Quizzy.find(questionId)
		if (question){question.isAnswered = !!isAnswered}
	}
	
	Quizzy.view = function(ctrl) {
		return [m('table.highScores', [m('thead', m('tr', [m('td', 'username'), m('td', 'score')]
			)),
			m('tbody', [
				Quizzy.vm.userScores().map(function(entry){
					return m('tr', [
						m('td', entry.username), m('td', entry.score)
					])
				})
			])
		]),
		m('.questions', [
		Quizzy.vm.questions().map(questionView),
		m('input[type=text]', {
			onchange: m.withAttr("value", Quizzy.vm.currentUser),
			placeholder: "Username"
		}),
		m('button', {
			onclick: function(e){
				e.preventDefault()
				ctrl.reset()
			}
		}, 
		"Reset Quiz" ),
		m('button', {
			onclick: function(e){
				e.preventDefault()
				ctrl.grade()
			}	
		},
		"Submit Quiz")
		])]

		function questionView (question){
			return m('form.question-' + question.id, [
				m('h3', question.text),
				question.answers.map(answerView),
				m('div.redDiv', 
					m('div.greenDiv', {
						style: {width: Quizzy.vm.answeredCorrectly().totalAnswers ? ((Quizzy.vm.answeredCorrectly()[question.id] / Quizzy.vm.answeredCorrectly().totalAnswers) * 300) + "px" : "0px"}
					})
				),
				answerStatus()
			])
			function answerView (answer, idx){
				var answers = Quizzy.vm.userAnswers()
				return [
					m('input[type=radio]',{
						name: question.id,
						// Two-way Data Binding
						// VM -> View
						checked: answers[question.id] === idx,
						// View -> VM
						onchange: ctrl.selectAnswer.bind(null, question.id, idx)
					}),
					m('label', answer),
					m('br')
				]
			}
			function answerStatus () {
				var correct = Quizzy.vm.correctStatus()
				if (correct[question.id] === undefined) return;
				return m('label',
					correct[question.id] ? "You got it right" : "You got it wrong"
				)
			}
		}
	}
})()