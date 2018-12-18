const Promise = require('bluebird')

async function insert(client, o) {
    const key = Object.keys(o)[0]
    const value = o[key]
    return new Promise((resolve, reject) => {
        return client.setAsync(key, value)
            .then(m => {
                if(m == 'OK') {
                    resolve(value)
                } else {
                    reject(new Error('Insertion failed.'))
                }
            })
            .catch(e => reject(e))
    })
}

async function restore(client) {
    //NOTE (brick): looking for 't_*' keys in order to avoid a nasty '*'
    const keys = await client.keysAsync('t_*')
    const data = await Promise.reduce(keys, (acc, key) => {
	return client.getAsync(key)
	    .then(value => Object.assign(acc, { [key] : value }))
    }, {})
    return data
}

function inflateTrucks(trucks) {
    return {
	t_trucks: trucks
	    .split(';')
	    .reduce((acc, truck) => {
		return [...acc, {
		    t_truckType: truck.split(':')[0],
		    t_truckVolume: truck.split(':')[1],
		}]
	    }, [])
    }
}

function inflateEmployees(employees) {
    return {
	t_employees: employees
	    .split(';')
	    .reduce((acc, employee) => [...acc, employee], [])
    }
}

module.exports = {
    inflateEmployees,
    inflateTrucks,
    insert,
    restore,
}
