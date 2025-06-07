const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const config = require("../config.js");

const db = new QuickDB({ file: './json.sqlite' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lisanssil")
        .setDescription("Belirli bir lisans kodunu veritabanından siler.")
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName("lisanskodu")
                .setDescription("Silmek istediğiniz lisans kodunu girin.")
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
            // Lisans kodunu veritabanında kontrol etme
            const license = await db.get(`license.${lisanskodu}`);
            if (!license) {
                const notFoundEmbed = new EmbedBuilder()
                    .setTitle("ʟɪsᴀɴs ʙᴜʟᴜɴᴀᴍᴀᴅı")
                    .setDescription("ʙᴇʟɪʀᴛɪʟᴇɴ ʟɪsᴀɴs ᴋᴏᴅᴜ ᴠᴇʀɪᴛᴀʙᴀɴıɴᴅᴀ ʙᴜʟᴜɴᴀᴍᴀᴅı.")
                    .setColor(config.renk)
                    .setTimestamp();

                return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            // Lisansı silme
            await db.delete(`license.${lisanskodu}`);

            // Başarı mesajı
            const successEmbed = new EmbedBuilder()
                .setTitle("ʟɪsᴀɴs sɪʟɪɴᴅɪ")
                .setDescription(`ʟɪsᴀɴs ᴋᴏᴅᴜ ʙᴀşᴀʀıʏʟᴀ sɪʟɪɴᴅɪ: **${lisanskodu}**`)
                .setColor(config.renk)
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

            // Lisans logunu farklı bir sunucuya gönderme
            const logServerID = '1342985823968297022'; // Logların gönderileceği sunucunun ID'si
            const logChannelID = '1342986063270121594'; // Logların gönderileceği kanalın ID'si
            const logGuild = client.guilds.cache.get(logServerID);
            const logChannel = logGuild.channels.cache.get(logChannelID);

            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle("ʟɪsᴀɴs sɪʟɪɴᴅɪ")
                    .addFields(
                        { name: `${config.keyemoji} ʟɪsᴀɴs ᴋᴏᴅᴜ`, value: lisanskodu }
                    )
                    .setColor(config.renk)
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error("ʟᴏɢ ᴋᴀɴᴀʟı ʙᴜʟᴜɴᴀᴍᴀᴅı!");
            }
        } catch (error) {
            console.error("ʟɪsᴀɴs sɪʟɪɴɪʀᴋᴇɴ ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ:", error);
            const errorEmbed = new EmbedBuilder()
                .setTitle("Hata")
                .setDescription("ʟɪsᴀɴs ᴋᴏᴅᴜ sɪʟɪɴɪʀᴋᴇɴ ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ.")
                .setColor(config.renk)
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
