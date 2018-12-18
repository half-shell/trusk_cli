'use strict'
const Promise = require('bluebird')
const utils = require('./utils')

const isAlpha = input => {
    // Any suite of non digit characters
    return /\D+/.test(input)
}

const isString = input => {
    return (typeof input === 'string')
}

const isAllowedVolume = input => {
    return (Number(input) > 1 && Number(input) < 26)  
} 

//This is justa stub since the confirm 'type' from inqurier
//is enough make it work
const isConfirm = input => true

/*
 * @Param prompts an array of prompt [{t_employee: () => prompt}]
 * @Param validators an array of validator with prompts name as keys [{t_employee: () => validator}]
 */
async function validateBatch(forms) {
    return Promise.reduce(forms, async (acc, form) => {
	const answer = await validateAsync(form.prompt, form.validator)
	return Object.assign(acc, answer)
    }, {})
}

async function validateAsync(prompt, validator) {
    const answer = await prompt()
    if(validator(utils.gov(answer))) {
	return answer
    } else {
	console.log("Entrée invalide, veuillez réessayer.")
	return validateAsync(prompt, validator)
    }   
}

module.exports = {
    isAlpha,
    isString,
    isConfirm,
    isAllowedVolume,
    validateAsync,
    validateBatch,
}
