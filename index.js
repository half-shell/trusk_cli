'use strict'
const Promise = require('bluebird')
const inquirer = require('inquirer')
const redis = require('redis')

const forms = require('./src/forms')
const utils = require('./src/utils')
const validate = require('./src/validate')
const serialize = require('./src/serialize')

Promise.promisifyAll(redis)

const questions = [
    {
        t_truskerName: {
            prompt: forms.addTrusker,
            serialization: t => t.t_truskerName,
            inflate: t => t
        }
    },
    {
        t_companyName: {
            prompt: forms.addCompanyName,
            serialization: t => t.t_companyName,
            inflate: t => t
        }
    },
    {
        t_employees: {
            prompt: () =>
                utils.sequentialPromptAsync(
                    forms.addEmployee,
                    "Rentrer le nombre d'employés à renseigner: ",
                    (answers, acc) => [...acc, answers],
                    []
                ),
            serialization: employees =>
                employees
                    .reduce((acc, e) => (acc += e.t_employeeName + ';'), '')
                    .slice(0, -1),
            inflate: employees => serialize.inflateEmployees(employees)
        }
    },
    {
        t_trucks: {
            prompt: () =>
                utils.sequentialPromptAsync(
                    forms.addTruck,
                    'Rentrer le nombre de camions à renseigner: ',
                    (answers, acc) => [...acc, answers],
                    []
                ),
            serialization: trucks =>
                trucks
                    .reduce(
                        (acc, t) =>
                            (acc +=
                                t.t_truckType + ':' + t.t_truckVolume + ';'),
                        ''
                    )
                    .slice(0, -1),
            inflate: trucks => serialize.inflateTrucks(trucks)
        }
    }
]

async function ask(client, forms, backup) {
    const input = await Promise.reduce(
        forms,
        async (acc, form) => {
            var data = await utils.gov(form).prompt()

            serialize.insert(client, {
                [Object.keys(form)[0]]: utils.gov(form).serialization(data)
            })

            if (Array.isArray(data)) {
                data = Object.assign(acc, { [Object.keys(form)[0]]: data })
            } else {
                data => Object.assign(acc, data)
            }
            return Object.assign(acc, data)
        },
        {}
    )
    return Object.assign(backup, input)
}

async function main(questions) {
    //TOFIX (brick): retry_strategy doen't work as expected
    //Ugly hack meanwhile
    //https://github.com/NodeRedis/node_redis/issues/1202
    const client = redis.createClient({
        retry_strategy: ({ error }) => client.emit('error', error)
    })

    client.on('error', function(err) {
        console.log("Le CLI n'arrive pas à contacter le serveur Redis.")
    })

    client.on('ready', async () => {
        utils.welcome()

        const backup = await serialize.restore(client)
        const forms = await utils.setupForm(client, questions, backup)
        const answers = await ask(
            client,
            forms.toAsk,
            utils.inflateBackup(backup, forms.backedUp)
        )

        //Cache can be emptied
        client.flushall()

        console.log(answers)

        client.quit()
    })
}

main(questions)
