'use strict'
const inquirer = require('inquirer')
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

//Ugly hack
// Get Only Value
function gov(o) {
    return o[Object.keys(o)[0]]
}

function welcome() {
    console.log('Welcome to trusk CLI!\n')
}

async function setupForm(client, forms, backup) {
    const keys = Object.keys(backup)
    return {
        toAsk: forms.filter(f => keys.indexOf(Object.keys(f)[0]) < 0),
        backedUp: forms.filter(f => keys.indexOf(Object.keys(f)[0]) >= 0)
    }
}

function inflateBackup(backup, forms) {
    return Object.keys(backup).reduce((acc, k) => {
        //As hacky as it can be.
        const value = forms
            .filter(f => Object.keys(f)[0] == k)[0]
            [k].inflate(backup[k])
        return Object.assign(acc, {
            [k]: value
        })
    }, {})
}

module.exports = {
    setupForm,
    recursivePromptAsync,
    welcome,
    inflateBackup,
    gov
}
