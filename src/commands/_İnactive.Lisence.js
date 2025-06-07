const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require("discord.js");
const { QuickDB } = require("quick.db");
const config = require("../config.js");

const db = new QuickDB({ file: './json.sqlite' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lisansiptal")
        .setDescription("Belirli bir lisans kodunu pasif duruma getirir.")
        .addStringOption(option =>
            option.setName("lisans_kodu")
                .setDescription("Pasif duruma getirmek istediğiniz lisans kodu.")
                .setRequired(true)
        )
        .setDMPermission(false),

    run: async (client, interaction) => {
        const licenseCode = interaction.options.getString("lisans_kodu");

        try {
            // Veritabanından lisansları al
            const licenses = await db.all();
            console.log("ᴛᴜ̈ᴍ ʟɪsᴀɴsʟᴀʀ:", licenses); // Debug: Tüm lisansları logla

            // Lisans kodunu veritabanındaki uygun kayıtla eşleştir
            let found = false;
            for (const license of licenses) {
                if (license.value[licenseCode]) {
                    found = true;
                    const licenseData = license.value[licenseCode];

                    if (licenseData.status === 'inactive') {
                        return await interaction.reply({ content: `ʙᴜ ʟɪsᴀɴs ᴢᴀᴛᴇɴ ᴘᴀsɪғ ᴅᴜʀᴜᴍᴅᴀ. ${config.useremoji}`, ephemeral: true });
                    }

                    licenseData.status = 'inactive';

                    // Veritabanına güncellenmiş lisansı kaydet
                    await db.set(license.id, license.value);

                    // Embed oluşturma
                    const embed = new EmbedBuilder()
                        .setTitle("ʟɪsᴀɴs ᴅᴜʀᴜᴍᴜ ɢᴜ̈ɴᴄᴇʟʟᴇɴᴅɪ")
                        .setDescription(`**${licenseCode}** ᴋᴏᴅʟᴜ ʟɪsᴀɴs ᴘᴀsɪғ ᴅᴜʀᴜᴍᴀ ɢᴇᴛɪʀɪʟᴅɪ.`)
                        .setColor(config.renk)
                        .setTimestamp();

                    await interaction.reply({ embeds: [embed] });
                    break;
                }
            }

            if (!found) {
                await interaction.reply({ content: "ʙᴜ ʟɪsᴀɴs ᴋᴏᴅᴜ ʙᴜʟᴜɴᴀᴍᴀᴅı.", ephemeral: true });
            }

        } catch (error) {
            console.error("Hata:", error);
            await interaction.reply({ content: "ʙɪʀ ʜᴀᴛᴀ ᴏʟᴜşᴛᴜ. ʟᴜ̈ᴛғᴇɴ ᴛᴇᴋʀᴀʀ ᴅᴇɴᴇʏɪɴ.", ephemeral: true });
        }
    }
};
