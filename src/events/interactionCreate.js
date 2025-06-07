const { EmbedBuilder, InteractionType, ChannelType, ContextMenuCommandBuilder, ApplicationCommandType } = require("discord.js");
const { readdirSync } = require("fs");

 module.exports = {
	name: 'interactionCreate',
	execute: async(interaction) => {
  let client = interaction.client;
   if (interaction.type == InteractionType.ApplicationCommand) {
   if(interaction.user.bot) return;

if(!interaction) return interaction.reply(`**RaineSysteme Söyle Bir Sorun Oluştu!**`)

   if (interaction.channel.type === 1) {

    return interaction.reply({
      embeds: [new Discord.EmbedBuilder()
        .setAuthor({name: `RaineSystem`, iconURL: `https://media.discordapp.net/attachments/1141234490467962890/1141276645630672966/NoxusRoleplaylogo.png?width=676&height=676` })
        .setColor("#0090ff")
        .setDescription(`> **Slash Komutlarımı DM Üzerinden Kullanamazsın :)**`)
        .setTimestamp()
        .setFooter({text: `RaineSystem`, iconURL: `https://media.discordapp.net/attachments/1141234490467962890/1141276645630672966/NoxusRoleplaylogo.png?width=676&height=676` })

      ],
      ephemeral: true
    })
  }


	readdirSync('./src/commands').forEach(file => {
        const command = require(`../../src/commands/${file}`);
        if(interaction.commandName.toLowerCase() === command.data.name.toLowerCase()) {
        command.run(client, interaction)
    }
	})
}
  }}
