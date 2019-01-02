'use strict'
const Promise = require('bluebird')

//TODO (brick): Make it so the recursive prompt gets a way to validate input
async function recursivePromptAsync(forms, push, cond, acc) {
    const answers = await forms()
    acc = push(answers, acc)
    if (cond(answers)) {
        return recursivePromptAsync(forms, push, cond, acc)
    } else {
        return acc
    }
}

async function sequentialPromptAsync(forms, message, push, acc) {
    const n = await require('./forms').askLoop(message)
    return sequentialPrompt(forms, 1, n.askLoop, push, acc)
}

async function sequentialPrompt(forms, i, n, push, acc) {
    const answers = await forms()
    acc = push(answers, acc)
    if (i < n) {
        i++
        return sequentialPrompt(forms, i, n, push, acc)
    } else {
        return acc
    }
}

// Ugly hack
// Get Only Value
function gov(o) {
    return o[Object.keys(o)[0]]
}

function welcome() {
    console.log('Welcome to trusk CLI!\n')
}

async function setupForm(forms, backup) {
    const keys = Object.keys(backup)
    const toAsk = forms.filter(f => keys.indexOf(Object.keys(f)[0]) < 0)
    const backedUp = Object.keys(backup).reduce((acc, k) => {
        //As hacky as it can be.
        const value = forms
            .filter(f => keys.indexOf(Object.keys(f)[0]) >= 0)
            .filter(f => Object.keys(f)[0] == k)[0]
            [k].inflate(backup[k])
        return Object.assign(acc, {
            [k]: value
        })
    }, {})

    return {
        toAsk,
        backedUp
    }
}

module.exports = {
    setupForm,
    recursivePromptAsync,
    welcome,
    sequentialPromptAsync,
    gov
}
