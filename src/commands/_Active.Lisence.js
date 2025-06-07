const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const ms = require("ms")
const { QuickDB } = require("quick.db");
const config = require("../config.js");

const db = new QuickDB();

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lisansaktifet")
        .setDescription("Belirli bir lisans kodunu aktifleştirir.")
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName("lisanskodu")
                .setDescription("Aktifleştirmek istediğiniz lisans kodunu girin.")
                .setRequired(true)
        )
        .addUserOption(option => 
            option.setName("üye")
                .setDescription("Lisansı aktifleştirmek istediğiniz kullanıcıyı seçin.")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("süre")
                .setDescription("Lisansın geçerli olacağı süre (örnek: 1h, 10m).")
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName("anahtar")
                .setDescription("Lisans anahtarını girin.")
                .setRequired(true)
        ),

    run: async (client, interaction) => {
        const lisanskodu = interaction.options.getString("lisanskodu");
        const user = interaction.options.getUser("üye");
        const süre = interaction.options.getString("süre");
        const anahtar = interaction.options.getString("anahtar");

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
                    .setColor("RED")
                    .setTimestamp();

                return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
            }

            // Lisansı aktifleştirme
            await db.set(`license.${lisanskodu}`, { status: 'active', user: user.id, expiration: new Date(Date.now() + ms(süre)), key: anahtar });

            // Başarı mesajı
            const successEmbed = new EmbedBuilder()
                .setTitle("ʟɪsᴀɴs ᴀᴋᴛɪғʟᴇşᴛɪʀɪʟᴅɪ")
                .setDescription(`ʟɪsᴀɴs ᴋᴏᴅᴜ ʙᴀşᴀʀıʏʟᴀ ᴀᴋᴛɪғʟᴇşᴛɪʀɪʟᴅɪ: **${lisanskodu}**`)
                .addFields(
                    { name: `${config.useremoji} ᴋᴜʟʟᴀɴıᴄı:`, value: `${user}` },
                    { name: `${config.tarihemoji} ʙɪᴛɪş ᴛᴀʀɪʜɪ:`, value: süre },
                    { name: `${config.keyemoji} ᴀɴᴀʜᴛᴀʀ:`, value: anahtar }
                )
                .setColor(config.renk)
                .setTimestamp();

            await interaction.reply({ embeds: [successEmbed], ephemeral: true });

            // Lisans logunu farklı bir sunucuya gönderme
            const logServerID = '1281713099396743272'; // Logların gönderileceği sunucunun ID'si
            const logChannelID = '1341869379561984100'; // Logların gönderileceği kanalın ID'si
            const logGuild = client.guilds.cache.get(logServerID);
            const logChannel = logGuild.channels.cache.get(logChannelID);

            if (logChannel) {
                const logEmbed = new EmbedBuilder()
                    .setTitle("Lisans Aktifleştirildi")
                    .addFields(
                        { name: `${config.activeemoji} ʟɪsᴀɴs ᴋᴏᴅᴜ:`, value: lisanskodu },
                        { name: `${config.useremoji} ᴋᴜʟʟᴀɴıᴄı:`, value: `${user}` },
                        { name: `${config.tarihemoji} ʙɪᴛɪş ᴛᴀʀɪʜɪ:`, value: süre },
                        { name: `${config.keyemoji} ᴀɴᴀʜᴛᴀʀ:`, value: anahtar }
                    )
                    .setColor(config.renk)
                    .setTimestamp();

                await logChannel.send({ embeds: [logEmbed] });
            } else {
                console.error("ʟᴏɢ ᴋᴀɴᴀʟı ʙᴜʟᴜɴᴀᴍᴀᴅı!");
            }
        } catch (error) {
            console.error("ʟɪsᴀɴs ᴀᴋᴛɪғʟᴇşᴛɪʀɪʟɪʀᴋᴇɴ ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ:", error);
            const errorEmbed = new EmbedBuilder()
                .setTitle("Hata")
                .setDescription("ʟɪsᴀɴs ᴋᴏᴅᴜ ᴀᴋᴛɪғʟᴇşᴛɪʀɪʟɪʀᴋᴇɴ ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ.")
                .setColor(config.renk)
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }
    }
};
