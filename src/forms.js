'use strict'
const validate = require('./validate')
const inquirer = require('inquirer')

async function addTrusker() {
    return validate.validateAsync(
        () =>
            inquirer.prompt([
                {
                    type: 'input',
                    name: 't_truskerName',
                    message: 'Entrer le nom du trusker: '
                }
            ]),
        validate.isAlpha
    )
}

async function addCompanyName() {
    return validate.validateAsync(
        () =>
            inquirer.prompt([
                {
                    type: 'input',
                    name: 't_companyName',
                    message: 'Entrer le nom de la société:'
                }
            ]),
        validate.isString
    )
}

async function addEmployeePrompt() {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'addEmployee',
            message: 'Voulez-vous rajouter un employe?',
            default: true
        }
    ])
}

async function employeePrompt() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 't_employeeName',
            message: "Entrer le nom de l'employée: "
        }
    ])
}

async function addEmployee() {
    return validate.validateAsync(employeePrompt, validate.isAlpha)
}

async function addEmployees() {
    const forms = [
        {
            prompt: employeePrompt,
            validator: validate.isAlpha
        },
        {
            prompt: addEmployeePrompt,
            validator: validate.isConfirm
        }
    ]

    return validate.validateBatch(forms)
}

async function addTruckPrompt() {
    return validate.validateAsync(
        () =>
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'addTruck',
                    message: 'Voulez-vous rajouter un camion?',
                    default: true
                }
            ]),
        validate.isConfirm
    )
}

async function truckType() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 't_truckType',
            message: 'Entrer le type de véhicule: '
        }
    ])
}

async function truckVolume() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 't_truckVolume',
            message: 'Entrer le volume du camion: '
        }
    ])
}

async function addTrucks() {
    const forms = [
        {
            prompt: truckType,
            validator: validate.isAlpha
        },
        {
            prompt: truckVolume,
            validator: validate.isAllowedVolume
        },
        {
            prompt: addTruckPrompt,
            validator: validate.isConfirm
        }
    ]

    return validate.validateBatch(forms)
}

async function addTruck() {
    return validate.validateBatch([
        {
            prompt: truckType,
            validator: validate.isAlpha
        },
        {
            prompt: truckVolume,
            validator: validate.isAllowedVolume
        }
    ])
}

async function askLoop(message) {
    return validate.validateAsync(
        () =>
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'askLoop',
                    message
                }
            ]),
        validate.isInt
    )
}

module.exports = {
    addEmployees,
    addEmployee,
    addTrucks,
    addTruck,
    addCompanyName,
    addTrusker,
    askLoop
}
