const { prefix } = require('./config.json')

module.exports = (client, aliases, callback) => {
    if (typeof aliases === 'string') {
        aliases = [aliases]
        // ex. 'kick' -> ['kick'] 
    }

    client.on('message', message => {
        const { content } = message

        aliases.forEach(alias => {
            const command = `${prefix}${alias}`

            if (content.startsWith(`${command} `) || content === command) {
                console.log(`Running command ${command}`)
                callback(message)
            }
        })
    })
}