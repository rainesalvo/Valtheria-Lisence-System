const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { QuickDB } = require('quick.db');
const config = require('../config.js');

const db = new QuickDB({ file: './json.sqlite' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lisanslar')
        .setDescription('Aktif ve pasif lisansların detaylarını gösterir.')
        .setDMPermission(false),

    run: async (client, interaction) => {
        try {
            const page = interaction.options.getInteger('page') || 1;
            const perPage = 5; // Sayfa başına gösterilecek lisans sayısı

            // Veritabanından tüm lisansları al
            const licenses = await db.all();
            console.log('Tüm Lisanslar:', licenses);

            // Lisansları sıralama ve tablo oluşturma
            const activeLicenses = [];
            const inactiveLicenses = [];
            const seenLicenses = new Set(); // Tekrar eden lisansları takip et

            for (const license of licenses) {
                if (license.value) {
                    for (const key of Object.keys(license.value)) {
                        const value = license.value[key];
                        if (value && value.status) {
                            if (!seenLicenses.has(key)) {
                                seenLicenses.add(key);
                                if (value.status === 'active') {
                                    activeLicenses.push({ ...value, license: key });
                                } else if (value.status === 'inactive') {
                                    inactiveLicenses.push({ ...value, license: key });
                                }
                            }
                        }
                    }
                }
            }

            // Sayfalamaya uygun olarak lisansları böl
            const paginatedLicenses = {
                active: activeLicenses.slice((page - 1) * perPage, page * perPage),
                inactive: inactiveLicenses.slice((page - 1) * perPage, page * perPage)
            };

            // Embed oluşturma
            let activeTable = '';
            let inactiveTable = '';

            for (const licenseData of paginatedLicenses.active) {
                activeTable += `${config.activeemoji} [${licenseData.license}]\n`;
                activeTable += `${config.keyemoji} **ᴀɴᴀʜᴛᴀʀ:** ${licenseData.key}\n`;
                activeTable += `${config.useremoji} **ᴋᴜʟʟᴀɴıᴄı:** <@${licenseData.user}>\n`;
                activeTable += `${config.tarihemoji} **ʙɪᴛɪş ᴛᴀʀɪʜɪ:** ${new Date(licenseData.expiration).toLocaleString()}\n`;
                activeTable += `${config.progressBar1} 87%\n\n`;
            }

            for (const licenseData of paginatedLicenses.inactive) {
                inactiveTable += `${config.pasifemoji} **[${licenseData.license}]**\n`;
                inactiveTable += `${config.keyemoji} ᴀɴᴀʜᴛᴀʀ: **${licenseData.key}**\n`;
                inactiveTable += `${config.useremoji} ᴋᴜʟʟᴀɴıᴄı: <@${licenseData.user}>\n`;
                inactiveTable += `${config.progressBar} 100%\n\n`;
            }

            const embed = new EmbedBuilder()
                .setAuthor({
                name: 'ᴀᴄᴛɪᴠᴇ ᴀɴᴅ ᴘᴀssɪᴠᴇ ʟɪᴄᴇɴsᴇs',
                iconURL: 'https://cdn.discordapp.com/attachments/1272657569776926750/1272695178485829663/4d0b00a505b6325786aca807407c1b41.jpg?ex=66bbe940&is=66ba97c0&hm=7164e38d6b9f64e676193b3b9cb0ce3d7e3315590c6045b163c072bdf5dbe546&'
            })
                .setThumbnail('https://cdn.discordapp.com/attachments/1272657569776926750/1272695107698819166/Logo.png?ex=66bbe92f&is=66ba97af&hm=7c50ba3e9a5996fce5dcb21ae488c8db8c6425b58c37e055c8a72283accee172&') 
                .setDescription(
                    `${activeLicenses.length ? `**${activeTable}` : '**Aktif Lisans bulunmuyor.**'}\n\n` +
                    `${inactiveLicenses.length ? `**${inactiveTable}` : '**Pasif Lisans bulunmuyor.**'}`
                )
                .setColor(config.renk)
                .setTimestamp();

            // Seçim menüsü oluşturma
            const row = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('pagination')
                        .setPlaceholder('ᴍᴇɴᴜ̈ ʙᴀᴋıᴍᴅᴀ;')
                        .addOptions([
                            {
                                label: 'All Lisence',
                                value: 'prev',
                                description: 'All Lisence Custom URL',
                                disabled: page === 1
                            },

                        ])
                );

            await interaction.reply({ embeds: [embed], components: [row] });
        } catch (error) {
            console.error('Hata:', error);
            await interaction.reply({ content: 'Bir hata oluştu. Lütfen tekrar deneyin.', ephemeral: true });
        }
    }
};
