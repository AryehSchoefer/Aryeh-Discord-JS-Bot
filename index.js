const Discord = require('discord.js')
const client = new Discord.Client()

const { token, modlogChannelID } = require('./config.json')
const command = require('./command-handler')

client.on('ready', () => {
    console.log('Discord Bot is ready!')

    command(client, ['ping', 'test'], message => {
        message.channel.send('pong')
    })

    command(client, 'ban', message => {
        const { member, mentions, guild, content, author } = message

        const tag = `<@${member.id}>`

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
            const target = mentions.users.first()
            const reasonArg = content.split(' ').slice(2).join(' ')
            const reason = reasonArg ? reasonArg : 'No ban reason was given'

            if (target) {
                const targetMember = guild.member(target.id)
                targetMember.ban().catch(err => {
                    message.channel.send('Unable to ban member')
                    console.error(err)
                })
                // TODO: put this in a seperate file
                const banConfirmationEmbed = new Discord.MessageEmbed()
                    .setColor('RED')
                    .setDescription(`🔒 ${target} has been successfully banned!`)
                message.channel.send({
                    embed: banConfirmationEmbed
                })

                // const modlogChannelID = 'YOUR ID HERE (IF U DON\'T USE A CONFIG VAR)'
                const modlogChannel = guild.channels.cache.get(modlogChannelID)

                const banConfirmationEmbedModlog = new Discord.MessageEmbed()
                    .setAuthor(`Banned by ${author.username}#${author.discriminator}`, author.displayAvatarURL())
                    .setThumbnail(target.displayAvatarURL())
                    .setColor('RED')
                    .setTimestamp()
                    .setDescription(
                        `**Action**: Ban
                        **User**: ${target.username}#${target.discriminator} (${target.id})
                        **Reason**: ${reason}`
                    )
                modlogChannel.send({
                    embed: banConfirmationEmbedModlog
                })
            } else {
                message.channel.send(`${tag} Please specify a user.`)
            }
        } else {
            message.channel.send(`${tag} You don't have permission to use this command.`)
        }
    })

    command(client, 'unban', message => {
        const { member, guild, content } = message

        const args = content.split(' ').slice(1)
        const target = args.slice(0, 1).join('')
        const reason = args.slice(1).join(' ') ? !undefined : 'No unban reason was given'

        const tag = `<@${member.id}>`

        if (member.hasPermission('ADMINISTRATOR') || member.hasPermission('BAN_MEMBERS')) {
            guild.fetchBans().then(bans => {
                if (bans.some(ban => target === ban.user.id)) {
                    guild.members.unban(target, reason)

                } else if (bans.some(ban => target === ban.user.username)) {
                    const targetInfo = bans.find(ban => target === ban.user.username)
                    guild.members.unban(targetInfo.user.id, reason)

                } else {
                    message.channel.send(`${tag} User isn't banned.`)
                }
            })
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

    // TODO: clear channel command

})

// Basic example: 
// client.on('message', message => {
//     if (message.content === 'ping') {
//         message.channel.send('pong')
//     }
// })

client.login(token)