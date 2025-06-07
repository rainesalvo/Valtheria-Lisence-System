const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const config = require("../config.js");

const db = new QuickDB({ file: './json.sqlite' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lisanskullanıcı")
        .setDescription("Belirli bir kullanıcıya lisans kodu atar.")
        .setDMPermission(false)
        .addUserOption(option => 
            option.setName("kullanıcı")
                .setDescription("Lisans kodunu atayacağınız kullanıcıyı seçin.")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("lisanskodu")
                .setDescription("Atayacağınız lisans kodunu girin.")
                .setRequired(true)
        ),

    run: async (client, interaction) => {
        const user = interaction.options.getUser("kullanıcı");
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

            // Lisansı kullanıcıya atama
            await db.set(`license.${lisanskodu}.user`, user.id);

            // Başarı mesajı
            const successEmbed = new EmbedBuilder()
                .setTitle("ʟɪsᴀɴs ᴀᴛᴀɴᴅı")
                .setDescription(`ʟɪsᴀɴs ᴋᴏᴅᴜ ʙᴀşᴀʀıʏʟᴀ ${user} ᴋᴜʟʟᴀɴıᴄısıɴᴀ ᴀᴛᴀɴᴅı: **${lisanskodu}**`)
                .addFields(
                    { name: `${config.useremoji} ᴋᴜʟʟᴀɴıᴄı:`, value: `${user}` },
                    { name: `${config.keyemoji} ʟɪsᴀɴs ᴋᴏᴅᴜ:`, value: lisanskodu }
                )
                .setColor(config.renk)
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

            // Lisans logunu farklı bir sunucuya gönderme
            const logServerID = '1342985823968297022'; // Logların gönderileceği sunucunun ID'si
            const logChannelID = '1342986081196314624'; // Logların gönderileceği kanalın ID'si
            const logGuild = client.guilds.cache.get(logServerID);
            const logChannel = logGuild.channels.cache.get(logChannelID);

            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle("Lisans Atandı")
                    .addFields(
                        { name: `${config.keyemoji} ʟɪsᴀɴs ᴋᴏᴅᴜ:`, value: lisanskodu },
                        { name: `${config.useremoji} ᴋᴜʟʟᴀɴıᴄı:`, value: `${user}` }
                    )
                    .setColor(config.renk)
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error("ʟᴏɢ ᴋᴀɴᴀʟı ʙᴜʟᴜɴᴀᴍᴀᴅı!");
            }
        } catch (error) {
            console.error("ʟɪsᴀɴs ᴀᴛᴀᴍᴀ sıʀᴀsıɴᴅᴀ ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ:", error);
            const errorEmbed = new EmbedBuilder()
                .setTitle("Hata")
                .setDescription("ʟɪsᴀɴs ᴋᴏᴅᴜ ᴀᴛᴀᴍᴀ sıʀᴀsıɴᴅᴀ ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ.")
                .setColor(config.renk)
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
