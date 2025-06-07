const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const config = require("../config.js");

const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lisansoluştur")
        .setDescription("Yeni bir lisans kodu oluşturur.")
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName("lisanskodu")
                .setDescription("Oluşturmak istediğiniz lisans kodunu girin.")
                .setRequired(true)
        ),

    run: async (client, interaction) => {
        const lisanskodu = interaction.options.getString("lisanskodu");

        const yetkinyok = new EmbedBuilder()
            .setDescription(`**${interaction.member} Bu komutu kullanmak için yetkin yok!**`)
            .setColor(config.renk);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ embeds: [yetkinyok], ephemeral: true });
        }

        try {
            // Lisans kodunu veritabanına kaydetme
            await db.set(`license.${lisanskodu}`, { status: 'inactive' });

            // Embed şeklinde yanıt verme
            const embed = new EmbedBuilder()
                .setTitle("ʟɪᴄᴇɴsᴇ ᴄʀᴇᴀᴛᴇᴅ")
                .setDescription(`ʟɪsᴀɴs ᴋᴏᴅᴜ ʙᴀşᴀʀıʏʟᴀ ᴏʟᴜşᴛᴜʀᴜʟᴅᴜ: **${lisanskodu}**`)
                .setColor(config.renk)
                .setTimestamp();

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Lisans logunu farklı bir sunucuya gönderme
            const logServerID = '1342985823968297022'; // Logların gönderileceği sunucunun ID'si
            const logChannelID = '1342986109621244035'; // Logların gönderileceği kanalın ID'si
            const logGuild = client.guilds.cache.get(logServerID);
            const logChannel = logGuild.channels.cache.get(logChannelID);

            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle("ʏᴇɴɪ ʟɪsᴀɴs ᴏʟᴜşᴛᴜʀᴜʟᴅᴜ")
                    .addFields(
                        { name: `${config.keyemoji} ʟɪsᴀɴs ᴋᴏᴅᴜ`, value: lisanskodu },
                        { name: `${config.useremoji} ᴏʟᴜşᴛᴜʀᴀɴ`, value: `${interaction.member}` },
                    )
                    .setColor(config.renk)
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error("ʟᴏɢ ᴋᴀɴᴀʟı ʙᴜʟᴜɴᴀᴍᴀᴅı!");
            }
        } catch (error) {
            console.error("ᴠᴇʀɪᴛᴀʙᴀɴıɴᴀ ᴠᴇʀɪ ᴋᴀʏᴅᴇᴅɪʟɪʀᴋᴇɴ ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ:", error);
            const errorEmbed = new EmbedBuilder()
                .setTitle("Hata")
                .setDescription("ʟɪsᴀɴs ᴋᴏᴅᴜ ᴋᴀʏᴅᴇᴅɪʟɪʀᴋᴇɴ ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ.")
                .setColor("RED")
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
