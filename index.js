const Discord = require('discord.js')
const client = new Discord.Client()

const { token } = require('./config.json')
const command = require('./command-handler')

client.on('ready', () => {
    console.log('Discord Bot is ready!')

    command(client, ['ping', 'test'], message => {
        message.channel.send('pong')
    })

    command(client, 'ban', message => {
        const { member, mentions, guild } = message

        const tag = `<@${member.id}>`

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = guild.member(target.id)
                targetMember.ban().catch(err => {
                    message.channel.send('Unable to ban member')
                    console.error(err)
                })
            } else {
                message.channel.send(`${tag} Please specify a user.`)
            }
        } else {
            message.channel.send(`${tag} You don't have permission to use this command.`)
        }
    })

    // this unban command isn't working yet
    command(client, 'unban', message => {
        const { member, mentions, guild } = message

        const tag = `<@${member.id}>`

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first()

            if (target) {
                const targetMember = guild.member(target.id)
                guild.fetchBans().then(bans => {
                    console.log(bans)

                })

            } else {
                message.channel.send(`${tag} Please specify a user.`)
            }

        } else {
            message.channel.send(`${tag} You don't have permission to use this command.`)
        }
    })

    command(client, 'kick', message => {
        const { member, mentions, guild } = message

        const tag = `<@${member.id}>`

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('KICK_MEMBERS')) {
            const target = mentions.users.first()
            if (target) {
                const targetMember = guild.member(target.id)
                targetMember.kick().catch(err => {
                    message.channel.send('Unable to kick member')
                    console.error(err)
                })
            } else {
                message.channel.send(`${tag} Please specify a user.`)
            }
        } else {
            message.channel.send(`${tag} You don't have permission to use this command.`)
        }
    })

})

// Basic example: 
// client.on('message', message => {
//     if (message.content === 'ping') {
//         message.channel.send('pong')
//     }
// })

client.login(token)