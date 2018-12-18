'use strict'
const forms = require('../src/forms')
const recursivePrompt = require('../src/utils').recursivePrompt

const addTruskers = recursivePrompt([],
    [forms.trusker, forms.addTrusker],
    (answers, data) => data.push(answers.truskerName),
    answers => answers.addTrusker)

addTruskers.then(truskers => console.log(truskers))
