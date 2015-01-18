// data binding
//////////////////////////////////////////////////
// binding a model value to an input in a template
m('input', {value: 	question.vm.description})

question.vm.init()

question.vm.description()				// empty string
m.render(document, question.view())		// input is blank

question.vm.description('Write Code')
// set the description in the controller

m.render(document. todo.view)

// Bi-Directional binding
/////////////////////////

m('input', {onchange: m.withAttr('value', question.vm.description)})