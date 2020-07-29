const Discord = require('discord.js')
const client = new Discord.Client()

const { token } = require('./config.json')
const command = require('./command-handler')

client.on('ready', () => {
    console.log('Discord Bot is ready!')

    command(client, ['ping', 'p'], message => {
        message.channel.send('pong')
    })
})

// Basic example: 
// client.on('message', message => {
//     if (message.content === 'ping') {
//         message.channel.send('pong')
//     }
// })

client.login(token)