const { Client,MessageAttachment,Events, Collection,PermissionsBitField, ChannelType ,GatewayIntentBits, AttachmentBuilder, ButtonBuilder, ButtonStyle, Partials,StringSelectMenuBuilder ,EmbedBuilder, ActionRow, ActionRowBuilder, ContextMenuCommandBuilder, SystemChannelFlagsBitField, ModalBuilder, TextInputBuilder } = require("discord.js");
const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.MessageContent], shards: "auto", partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.Reaction, Partials.GuildScheduledEvent, Partials.User, Partials.ThreadMember]});
const config = require("./src/config.js");
const { readdirSync } = require("fs")
const db2 = require("nrc.db");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const ms = require("ms")
const moment = require("moment");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
let token = config.token
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://ofraine:raine3131@ofraine.iqxn0tm.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

client.commands = new Collection()

const rest = new REST({ version: '10' }).setToken(token);

const log = l => { console.log(`[${moment().format("DD-MM-YYYY HH:mm:ss")}] ${l}`) };




//command-handler
const commands = [];
readdirSync('./src/commands').forEach(async file => {
  const command = require(`./src/commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
})

client.on("ready", async () => {
        try {
            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: commands },
            );
        } catch (error) {
            console.error(error);
        }
    log(`${client.user.username} Aktif Edildi!`);
})

//event-handler
readdirSync('./src/events').forEach(async file => {
	const event = require(`./src/events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
})


//nodejs-events
process.on("unhandledRejection", e => { 
   console.log(e)
 }) 
process.on("uncaughtException", e => { 
   console.log(e)
 })  
process.on("uncaughtExceptionMonitor", e => { 
   console.log(e)
 })



//  const adKeywords = ['discord.gg', 'http', 'www.', '.com', '.net', '.org']; // Reklam kelimeleri
//  const exemptRoleId = (reklamrolwl); // Reklam göndermesine izin verilen rolün kimliği

//  client.on('messageCreate', message => {
//     // Botun kendisi veya reklam kontrolünden muaf olan kullanıcıları yok say
//     if (message.author.bot || message.member.roles.cache.has(exemptRoleId)) return;

//     // Mesaj reklam içeriyor mu kontrol et
//     if (adKeywords.some(word => message.content.toLowerCase().includes(word))) {
//         // Mesajı sil
//         message.delete();

//         // Kullanıcıyı uyar
//         message.channel.send(`${message.author}, reklam yapmak yasaktır!`).then(msg => {
//             setTimeout(() => msg.delete(), 5000);
//         });

//         // Loglamak için bir kanal belirtebilirsiniz
//         const logChannel = message.guild.channels.cache.find(channel => channel.name === (reklamlog));
//         if (logChannel) {
//             logChannel.send(`> Mesajınız'da **Reklam** tespit Edildi: <@${message.author.id}> - ${message.content}`);
//         }
//     }
// });


// client.on(Events.InteractionCreate, async interaction =>{

// 	if(!interaction.isStringSelectMenu()) return;


// 	if(interaction.customId === "kayitpuan") {

// 		if (interaction.values[0] == "sıfırlaa2") {
// 			interaction.update({})
// 			return
// 		}
// 		async function getUserKayits(user) {
// 			const userID = user.id;
		  
// 			// Veritabanından kullanıcının coin sayısını alın
// 			const kayitRecord = await Kayit.findOne({ userID });
// 			const Kayits = kayitRecord ? kayitRecord.Kayits : 0;
		  
// 			return Kayits;
// 		  }
		
// 		  const guild = interaction.guild;
		
// 		  const Kayit = require('./src/models/kayit');
		  
// 		  const userKayits = {};
// 		  const usersWithModeratorRole = guild.members.cache.filter(member => member.roles.cache.has(yetkiliekibi)).map(member => member.user.id);
		
// 		  Kayit.find({ userID: { $in: usersWithModeratorRole } }).then(kayits => {
// 			kayits.forEach(kayit => {
// 			  if (!userKayits[kayit.userID]) {
// 				userKayits[kayit.userID] = kayit.kayits;
// 			  } else {
// 				userKayits[kayit.userID] += kayit.kayits;
// 			  }
// 			});
		
// 			const sortedUserKayits = Object.entries(userKayits)
// 			  .sort(([, a], [, b]) => b - a)
// 			  .slice(0, 15);
		  
// 			  if (sortedUserKayits.length === 0) {
// 				return interaction.reply({content: '**Kimsenin Kayıt Puanı Yok Listeliyemem.**', ephemeral: true});
// 			  }
		
// 			  const embed = new EmbedBuilder()
// 			  .setColor(renk)
// 			  .setAuthor({ name: `${interaction.guild.name}`, iconURL: `${interaction.guild.iconURL()}`})
// 			  .setTitle('Kayıt Puan Sıralaması')
// 			  .setImage(`${sunucubanner}`)
// 			  .setDescription(
// 				sortedUserKayits
// 				  .map(([userID, kayits], index) => `> **${index + 1}. <@${userID}> =>** __${kayits} Puan__`)
// 				  .join('\n\n')
// 			  )
// 			  .setTimestamp();
		
		
		
// 			interaction.update({ embeds: [embed], components: [], ephemeral: true });



// 	})
// }

// });


// 	//   client.on("guildMemberAdd", async member => {
    
// 	// 	if (member.user.bot) return;
		
// 	// 	member.roles.add(kayıtsızüyepermi)		
// 	// 	let date = moment(member.user.createdAt)
// 	// 	   const startedAt = Date.parse(date);
// 	// 	   var msecs = Math.abs(new Date() - startedAt);
			 
// 	// 	   const years = Math.floor(msecs / (1000 * 60 * 60 * 24 * 365));
// 	// 	   msecs -= years * 1000 * 60 * 60 * 24 * 365;
// 	// 	   const months = Math.floor(msecs / (1000 * 60 * 60 * 24 * 30));
// 	// 	   msecs -= months * 1000 * 60 * 60 * 24 * 30;
// 	// 	   const weeks = Math.floor(msecs / (1000 * 60 * 60 * 24 * 7));
// 	// 	   msecs -= weeks * 1000 * 60 * 60 * 24 * 7;
// 	// 	   const days = Math.floor(msecs / (1000 * 60 * 60 * 24));
// 	// 	   msecs -= days * 1000 * 60 * 60 * 24;
// 	// 	   const hours = Math.floor(msecs / (1000 * 60 * 60));
// 	// 	   msecs -= hours * 1000 * 60 * 60;
// 	// 	   const mins = Math.floor((msecs / (1000 * 60)));
// 	// 	   msecs -= mins * 1000 * 60;
// 	// 	   const secs = Math.floor(msecs / 1000);
// 	// 	   msecs -= secs * 1000;
			 
// 	// 	   var string = "";
// 	// 	   if (years > 0) string += `${years} yıl ${months} ay`
// 	// 	   else if (months > 0) string += `${months} ay ${weeks > 0 ? weeks+" hafta" : ""}`
// 	// 	   else if (weeks > 0) string += `${weeks} hafta ${days > 0 ? days+" gün" : ""}`
// 	// 	   else if (days > 0) string += `${days} gün ${hours > 0 ? hours+" saat" : ""}`
// 	// 	   else if (hours > 0) string += `${hours} saat ${mins > 0 ? mins+" dakika" : ""}`
// 	// 	   else if (mins > 0) string += `${mins} dakika ${secs > 0 ? secs+" saniye" : ""}`
// 	// 	   else if (secs > 0) string += `${secs} saniye`

			 
// 	// 	   string = string.trim();
	   
// 	// 	   const log3 = client.channels.cache.get(`${hoşgeldinizlog}`);
// 	// 	   let endAt = member.user.createdAt
// 	// 	   let gün = moment(new Date(endAt).toISOString()).format('DD')
// 	// 	   let ay = moment(new Date(endAt).toISOString()).format('MM').replace("01", "Ocak").replace("02", "Şubat").replace("03", "Mart").replace("04", "Nisan").replace("05", "Mayıs").replace("06", "Haziran").replace("07", "Temmuz").replace("08", "Ağustos").replace("09", "Eylül").replace("10", "Ekim").replace("11", "Kasım").replace("12", "Aralık")
// 	// 	   let yıl = moment(new Date(endAt).toISOString()).format('YYYY')
// 	// 	   let saat = moment(new Date(endAt).toISOString()).format('HH:mm')
// 	// 	   let kuruluş = `${gün} ${ay} ${yıl} ${saat}`;
		
// 	// const exampleEmbed = new EmbedBuilder()
// 	// .setThumbnail(member.displayAvatarURL())
// 	// .setColor(renk)
// 	// .setDescription(`**Sunucumuza hoş geldin!** ${member} \n\n **Kuruluş Tarihi:** \`${kuruluş} (${string})\` önce oluşturulmuş. \n\n **Mülakata Girmeye Hazır Olduğunda <#${sesbildirimlogu}> Kanal'ına Giriş Yaparsan,\n\n <@&${yetkiliekibi}> Sizinle İlgilenecektir.** \n\n **Kişinin ID =** ${member.id}`)
// 	// .setImage(`${sunucubanner}`)
// 	// .setTimestamp()
// 	// .setFooter({ text: `${member.guild.name}`, iconURL: `${sunucuiconurl}`})
	 

// 	// log3.send({ embeds: [exampleEmbed]});
		
		   
// 	// });


// 	client.on("voiceStateUpdate", (oldState, newState) => {

// 		const state = newState || oldState

// 		if(state.channelId !== `${sesbildirimlogu}`) {
// 			return;
// 					}

// 		const kanal = client.channels.cache.get(sesbildirimlogu);
// 		const log = client.channels.cache.get(sesbildirimtextkanal)

	

// 		if (oldState.channel && !newState.channel) return 

// 		if (oldState.channel && oldState.selfMute && !newState.selfMute) return 
// 		if (oldState.channel && !oldState.selfMute && newState.selfMute) return 
// 		if (oldState.channel && oldState.selfDeaf && !newState.selfDeaf) return 
// 		if (oldState.channel && !oldState.selfDeaf && newState.selfDeaf) return 
// 		if (oldState.channel && !oldState.streaming && newState.channel && newState.streaming) return 
// 		if (oldState.channel && oldState.streaming && newState.channel && !newState.streaming) return 
// 		if (oldState.channel && !oldState.selfVideo && newState.channel && newState.selfVideo) return 
// 		if (oldState.channel && oldState.selfVideo && newState.channel && !newState.selfVideo) return 


		
// 		const embed = new EmbedBuilder()
// 		.setAuthor({name: `${newState.member.displayName}`, iconURL: `${newState.member.displayAvatarURL()}`})
// 		.setDescription(`**${newState.member} Adlı Kişi Kanala Giriş Yaptı! \n\n ID:** ${newState.member.id}`)
// 		.setTimestamp()
// 		.setColor(renk)
// 		.setFooter({text: `Girilen Kanal: [${kanal.name}]`, iconURL: `${newState.member.displayAvatarURL()}`})

// 		log.send({embeds: [embed], content: `<@&${yetkiliekibi}> `})
	
	

	
	
// 	})




// 	client.on("interactionCreate", async interaction => {
// 		if (interaction.customId  == "kayıtbuton1") {
// 			let süre = await db2.get(`butontıklama_${interaction.user.id}`)
// 				console.log(süre)
// 				let timeout = 1000 * 60 * 60;

// if (süre !== null && (Date.now() - süre) < timeout) {
//   let remainingTime = timeout - (Date.now() - süre);
//   let minutes = Math.floor(remainingTime / (1000 * 60)); // Dakika hesaplaması

//   return interaction.reply({ content: `> **Tekrar Yetkililere Bildirim Göndermek İçin Kalan Süre: __${minutes} Dakika__**`, ephemeral: true });
// }
	
	
// 			if(!interaction.member.roles.cache.has(whitelistpermi)) //WH ROLÜ
// 			{
// 				var serverIcon = interaction.guild.iconURL({dynamic: true});

	
// 			client.channels.cache.get(sesbildirimtextkanal).send(`${interaction.member} **Adlı Kişi Butona Bastı! Mülakatta Kayıt İçin Sizi Bekliyor. <@&${yetkiliekibi}> **`)  // Yetkibi Ekibi rolü
	

// 			const kayıtmesaj = new EmbedBuilder()
// 			.setTitle(`${interaction.guild.name}`)
// 			.setDescription(`**Yetkililere bildirimin gönderildi!**\n Merhaba Hoşgeldin! ${interaction.member}\n Bu Sırada Mülakat Kanalına Geçiş Sağlayıp Bekleyebilirsin. \n **-->** <#${sesbildirimlogu}>`)
// 			.setThumbnail(`${sunucubanner}`)
// 			.setTimestamp()
// 			.setFooter({ text: `${interaction.guild.name}`, iconURL: `${sunucuiconurl}`})

// 				 interaction.reply({ embeds: [kayıtmesaj], ephemeral: true });
	
				 
	
// 			   	 db2.set(`butontıklama_${interaction.user.id}`,Date.now());
// 			}
// 			if(interaction.member.roles.cache.has(whitelistpermi))
// 			return interaction.reply({content:`**Sen zaten kayıtlısın, yetkililere bildirim gönderemezsin!**`,ephemeral:true})
			 
// 		}            
// 	});
	
// 	client.on("messageCreate", async message => {
// 		if (message.content.toLowerCase() === 'mülakatbuton') {
// 		   if (!message.member.permissions.has("ADMINISTRATOR")) return
// 		   const kayıtbutonu1 = new ActionRowBuilder()
// 		   .addComponents(
// 			new ButtonBuilder()
// 			.setCustomId("kayıtbuton1")
// 			.setLabel('Mülakattayım')
// 			.setEmoji(mülakatbutonemoji)
// 			.setStyle(ButtonStyle.Danger)
// 		   )
	
// 		   let embed = new EmbedBuilder()
// 		   .setColor(renk)
// 		   .setTitle("Mülakatta Bekliyorsan Butona Tıkla!")
// 		   .setDescription(`● Öncelikle **${message.guild.name}** Oyuncuları Olmak İçin Hoş Geldiniz. Sizleri Aramızda Görmekten Mutluluk Duyuyoruz.

// 		   ● Siz Değerli Oyuncularımız İçin En Kaliteli ve Güzel Bir Sunucu Ortamı Kurmaktayız.
		   		   
// 		   ● Sunucumuz %60 Sosyal RP %40 GunRP Şeklinde Olucaktır(Siz Değerli Oyuncularımız İçin!).
		   
// 		   ● Mülakatları Geçmek İçin +16 Yaş Ve Kaliteli Rol Bilgisine Sahip Olmanız Gerekmektedir.
		   
// 		   ● En Kaliteli Roller Ve Anlayışlı Yönetim Ekibimiz Sayesinde Sizi Memnun Etmeyeceğimize Dair Bir Kuşkunuz Kesinlikle Olmasın.
		   
// 		   ● Oluşan Sorunlarda Hızlı Ve Doğru Kararlar İle İlerlemekteyiz.`)
// 		   .setImage(`${sunucubanner}`)
// 		   message.channel.send({embeds: [embed], components: [ kayıtbutonu1 ]})
// 		   message.channel.send({content:"||@everyone|| **&** ||@here||", embeds: [embed], components: [ kayıtbutonu1 ]});
// 		   //.messages.fetch("1011619648900452382").then(msg => { msg.edit({ embeds: [embed] , components: [ kayıtbutonu1 ]})
		   
// 		   } });




// client.on('messageDelete', async message => {
// 	if (message.channel.type === 1) {
// 		return;
// 	  }

// 	const { guild, author, content, channel } = message;
  
// 	// Silinen mesaj log kanalı
// 	const logChannel = guild.channels.cache.get('1241472137991028756'); // Silinen mesaj log kanalının ID'sini girin
  
// 	const botUser = await client.users.fetch("708071740571516969")


// try {
	
//     // Eğer mesajı atan kullanıcı bot ise
//     if (message.author === botUser) {
// 		return;
// 	  }
  
// 	  if (author) {
// 		// Mesajı atan kişi
// 		const user = author.username + '#' + author.discriminator;
  
// 		const embed = new EmbedBuilder()
// 		.setAuthor({name: `${message.guild.name}`, iconURL: `${sunucuiconurl}`})
// 		.setTitle(`Kullanıcı Belirtilen Kanalda Mesaj Sildi!`)
// 		.setDescription(`> **${message.member}** Tarafından Mesaj Silindi.\n> \n> **Kanal:** <#${channel.id}>\n> \n> **Silinen Mesaj:** ${content} \n> \n> **Kanal ID:** ${channel.id}\n> \n> **Silen Kişi ID:** ${message.member.id} / ${user}`)
// 		.setThumbnail(`${message.member.displayAvatarURL()}`) 
// 		.setFooter({text: `${message.member.displayName}`, iconURL: `${message.member.displayAvatarURL()}`}) 
// 		.setTimestamp()
// 		.setColor(renk)
// 		logChannel.send({embeds: [embed]});
// 	  } else {
// 		return;
// 	  }

// } catch (error) {
// 	const embed2 = new EmbedBuilder()
// 	.setTitle(`Kullanıcı Belirtilen Kanalda Mesaj Sildi!`)
// 	.setAuthor({name: `${message.guild.name}`, iconURL: `${sunucuiconurl}`})
// 	.setColor(renk)
// 	.setDescription(`> **Bir Sorun Oluştu Yazıları Alamadım!**`)
// 	.setTimestamp();

// 	const logChannel2 = guild.channels.cache.get(mesajsilmelog); // Silinen mesaj log kanalının ID'sini girin

// 	if (!logChannel2) return;

// 	logChannel2.send({ embeds: [embed2] });
// }


//   });


//   client.on("messageUpdate", (oldMessage, newMessage) => {
// 	if (oldMessage.channel.type === 1) {
// 		return;
// 	  }

// 	  if (newMessage.channel.type === 1) {
// 		return;
// 	  }

// 	const { guild, author, content, channel } = oldMessage;

// 	const logChannel = guild.channels.cache.get(mesajsilmelog); // Silinen mesaj log kanalının ID'sini girin
// 	if (!logChannel) return;

// try {
// 	if(oldMessage.member === client.user && newMessage.member === client.user) return;

// 	if(oldMessage.author.bot && newMessage.author.bot) return;

// 	const user = oldMessage.author

// 	const embed = new EmbedBuilder()
// 	  .setTitle("Kullanıcı Belirtilen Kanalda Mesaj Düzenledi!")
// 	  .setAuthor({name: `${oldMessage.guild.name}`, iconURL: `${sunucuiconurl}`})
// 	  .setColor(renk)
// 	  .setThumbnail(`${oldMessage.member.displayAvatarURL()}`) 
// 	  .setDescription(`> **Kullanıcı:** ${oldMessage.author} \n> \n> **Düzenlenen Kanal:** <#${channel.id}>\n> \n> **Önceki Mesajı:** ${oldMessage.content} \n> \n> **Yeni Mesaj:** ${newMessage.content}\n> \n> **Silen Kişi ID:** ${oldMessage.member.id} / ${oldMessage.author.tag}`)
// 	  .setFooter({text: `${oldMessage.member.displayName}`, iconURL: `${oldMessage.member.displayAvatarURL()}`}) 
// 	  .setTimestamp();
  
// 	logChannel.send({ embeds: [embed] });
// } catch (error) {
// 	const embed2 = new EmbedBuilder()
// 	.setTitle("Kullanıcı Belirtilen Kanalda Mesaj Düzenledi!")
// 	.setAuthor({name: `${oldMessage.guild.name}`, iconURL: `${sunucuiconurl}`})
// 	.setColor(renk)
// 	.setDescription(`> **Bir Sorun Oluştu Yazıları Alamadım!**`)
// 	.setTimestamp();

// 	const logChannel2 = guild.channels.cache.get(mesajsilmelog); // Silinen mesaj log kanalının ID'sini girin

// 	if (!logChannel2) return;

// 	logChannel2.send({ embeds: [embed2] });

// }


	
//   });



// 	client.on("voiceStateUpdate", (oldState, newState) => {

//         const log = client.channels.cache.get(sesdeğiştirmelog);
//         if (!log) return;
//         if (!oldState.channel && newState.channel) return log.send(`${newState.member.displayName} kullanıcısı \`${newState.channel.name}\` adlı sesli kanala girdi!`);
//         if (oldState.channel && !newState.channel) return log.send(`${newState.member.displayName} kullanıcısı \`${oldState.channel.name}\` adlı sesli kanaldan ayrıldı!`);
//         if (oldState.channel.id && newState.channel.id && oldState.channel.id != newState.channel.id) return log.send(`${newState.member.displayName} kullanıcısı ses kanalını değiştirdi! (\`${oldState.channel.name}\` => \`${newState.channel.name}\`)`);
//         if (oldState.channel.id && oldState.selfMute && !newState.selfMute) return log.send(`${newState.member.displayName} kullanıcısı \`${newState.channel.name}\` adlı sesli kanalda kendi susturmasını kaldırdı!`);
//         if (oldState.channel.id && !oldState.selfMute && newState.selfMute) return log.send(`${newState.member.displayName} kullanıcısı \`${newState.channel.name}\` adlı sesli kanalda kendini susturdu!`);
//         if (oldState.channel.id && oldState.selfDeaf && !newState.selfDeaf) return log.send(`${newState.member.displayName} kullanıcısı \`${newState.channel.name}\` adlı sesli kanalda kendi sağırlaştırmasını kaldırdı!`);
//         if (oldState.channel.id && !oldState.selfDeaf && newState.selfDeaf) return log.send(`${newState.member.displayName} kullanıcısı \`${newState.channel.name}\` adlı sesli kanalda kendini sağırlaştırdı!`);
//         if (oldState.channel.id && !oldState.streaming && newState.channel.id && newState.streaming) return log.send(`${newState.member.displayName} kullanıcısı \`${newState.channel.name}\` adlı sesli kanalda yayın açtı!`)
//         if (oldState.channel.id && oldState.streaming && newState.channel.id && !newState.streaming) return log.send(`${newState.member.displayName} kullanıcısı \`${newState.channel.name}\` adlı sesli kanalda yayını kapattı!`)
//         if (oldState.channel.id && !oldState.selfVideo && newState.channel.id && newState.selfVideo) return log.send(`${newState.member.displayName} kullanıcısı \`${newState.channel.name}\` adlı sesli kanalda kamerasını açtı!`)
//         if (oldState.channel.id && oldState.selfVideo && newState.channel.id && !newState.selfVideo) return log.send(`${newState.member.displayName} kullanıcısı \`${newState.channel.name}\` adlı sesli kanalda kamerasını kapattı!`)
    
//     module.exports.conf = {
//         name: "voiceStateUpdate"
//     }
//     });







// 	let cooldown2 = new Set();

// 	client.on("messageCreate", async message => {
// 	  if (message.channel.type === "DM") return;
	  
// 	  let data = ["sa", "Sa", "S.a", "s.a", "s.A", "S.A", "sA", "SA", "sea", "Sea", "SEA", "Selamün Aleyküm", "selamün aleyküm", "Selamun Aleykum", "selamun aleykum", "Selamun Aleyküm", "selamun aleykum"];
// 	  if (data.includes(message.content)) {
// 		if (cooldown2.has(message.author.id)) return message.delete(); // Kullanıcı zaten yanıt verildi, devam etmeyin.
		
// 		cooldown2.add(message.author.id); // Kullanıcının cooldown setine eklenmesi
// 		setTimeout(() => {
// 		  cooldown2.delete(message.author.id); // Kullanıcının cooldown setinden kaldırılması
// 		}, 30000); // 10 saniye cooldown süresi
		
// 		message.reply("Aleyküm Selam!");
// 	  }
// 	});




// 		  const { joinVoiceChannel } = require('@discordjs/voice');
// 		  client.on('ready', () => {
// 			let channel = client.channels.cache.get(`${botbağlanmases}`) 
			
		  
// 			if(!channel) return;

// 				const VoiceConnection = joinVoiceChannel({
// 					channelId: channel.id, 
// 					guildId: channel.guild.id,
// 					adapterCreator: channel.guild.voiceAdapterCreator 
// 			});
// 		  })





// 	client.on("messageCreate", async (message) => {
// 		if (message.channel.id !== `${oyundankareler}`) { //ID Yazın
// 		  return;
// 		}
// 		let owner = await message.guild.fetchOwner()
// 		if (message.author === client.user) return;
// 		if(message.content.includes("https://media.discordapp.net/attachments/")) return;
// 		if (message.attachments.size < 1) {
// 		  message.delete()
// 		  message.channel.send(`**${message.author} Bu Kanalda Resim Dışında Başka Bir Şey Atılmıyor!**`)
// 		  .then(msg => {
// 			setTimeout(() => msg.delete(), 10000)
// 		  })
// 		  .catch(console.error);
// 		}
// 	  });

	
		
	

// // 			client.on('guildMemberAdd', async member => {
// //     const accountCreationDate = member.user.createdAt;
// //     const now = new Date();
// //     const accountAgeInDays = Math.floor((now - accountCreationDate) / (1000 * 60 * 60 * 24));

// //     if (accountAgeInDays < 2) {
// //         try {
// //             // Kullanıcıya özel mesaj gönderme
// //             await member.send('Hesabınız 5 günden daha yeni olduğu için bu sunucudan banlandınız.');

// //             // Kullanıcıyı banlama
// //             await member.ban({ reason: 'Hesap 5 günden daha yeni.' });

// //             console.log(`Yeni bir hesap (${member.user.tag}) sunucudan banlandı.`);

// //             // Log kanalına mesaj gönderme
// //             const logChannel = member.guild.channels.cache.get(logChannelId);
// //             if (logChannel) {
// //                 logChannel.send(`Yeni bir hesap sunucudan banlandı: ${member.user.tag} (ID: ${member.user.id})`);
// //             }
// //         } catch (err) {
// //             console.error(`Banlama sırasında bir hata oluştu: ${err}`);
// //         }
// //     }
// // });







// const { AuditLogEvent } = require('discord.js');


// 		client.on("guildMemberUpdate", (oldMember, newMember) => {
// 			const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
// 			const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
			
		  
// 			let botid = config.botid
// 			let rolkanalid = config.rollogu
		


// 			if(newMember.id === `${botid}` && oldMember.id === `${botid}`) return; //Bot ID'si 

// 			// Kimin verdiğini de bul
// 			addedRoles.forEach(role => {
// 			  const auditLogEntry = newMember.guild.fetchAuditLogs({
// 				type: AuditLogEvent.MemberRoleUpdate,
// 				limit: 1
// 			  }).then(logs => {
// 				const log = logs.entries.first();
// 				const executor = log.executor;
// 				if(executor.id === `${botid}`) return;
// 				const embed = new EmbedBuilder()
// 				.setTitle("Kullanıcıya Rol Eklendi")
// 				.setAuthor({name: `${newMember.displayName}`, iconURL: `${newMember.displayAvatarURL()}`})
// 				.setImage(`${sunucubanner}`)
// 				.setThumbnail(`${newMember.displayAvatarURL()}`)
// 				.setColor(`Green`)
// 				.setDescription(`> **Verilen Kullanıcı Bilgileri:** ${newMember}\n \`\`\`${newMember.user.tag} / ${newMember.id}\`\`\`\n> **Verilen Rol ve Rol ID:** ${role} **/** ${role.id}\n> \n> **Veren Kişi Bilgileri:** ${executor} **/** ${executor.id}`)
// 				.setFooter({text: `Rolü Veren Kişi: ${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`}) 
// 				newMember.guild.channels.cache.get(`${rolkanalid}`).send({ embeds: [embed] });
// 			  }).catch(console.error);
// 			});
		  
// 			removedRoles.forEach(role => {
// 			  const auditLogEntry = newMember.guild.fetchAuditLogs({
// 				type: AuditLogEvent.MemberRoleUpdate,
// 				limit: 1
// 			  }).then(logs => {
// 				const log = logs.entries.first();
// 				const executor = log.executor;
// 				if(executor.id === `${botid}`) return;
// 				const embed = new EmbedBuilder()
// 				  .setTitle("Kullanıcıdan Rol Alındı")
// 				  .setAuthor({name: `${newMember.displayName}`, iconURL: `${newMember.displayAvatarURL()}`})
// 				  .setImage(`${sunucubanner}`)
// 				  .setThumbnail(`${newMember.displayAvatarURL()}`)
// 				  .setColor(`#020202`)
// 				  .setDescription(`> **Alınan Kullanıcı Bilgileri:** ${newMember}\n \`\`\`${newMember.user.tag} / ${newMember.id}\`\`\`\n> **Alınan Rol ve Rol ID:** ${role} **/** ${role.id}\n> \n> **Alan Kişi Bilgileri:** ${executor} **/** ${executor.id}`)
// 				  .setFooter({text: `Rolü Alan Kişi: ${executor.tag}`, iconURL: `${executor.displayAvatarURL()}`}) 
// 				newMember.guild.channels.cache.get(`${rolkanalid}`).send({ embeds: [embed] });
// 			  }).catch(console.error);
// 			});
// 		  });





// 		  const VoiceStatModel = require('./src/models/VoiceStatModel');

// const voiceStats = {};

// client.on('voiceStateUpdate', async (oldState, newState) => {
//   const guildId = newState.guild.id;
//   const userId = newState.member.user.id;
//   const voiceChannel = newState.channel;

//   // Sadece belirli bir role sahip kişilerin ses verilerini al
//   const roleId = `${yetkiliekibi}`; // ROL_ID'yi belirttiğiniz role uygun bir şekilde değiştirin

//   if (newState.member.roles.cache.has(roleId)) {
//     if (voiceChannel) {
//       // Kullanıcı bir sesli kanala katıldı
//       console.log(`${newState.member} Sesli Kanala Katıldı!`)
//       const startTime = moment();
//       await VoiceStatModel.updateOne(
//         { userId },
//         { $setOnInsert: { userId }, $inc: { duration: 0 } },
//         { upsert: true }
//       );
//       voiceStats[userId] = startTime;
//     } else {
//       console.log(`${newState.member} Sesli Kanaldan Ayrıldı!`)

//       // Kullanıcı bir sesli kanaldan ayrıldı
//       const endTime = moment();
//       const startTime = voiceStats[userId];
//       if (startTime) {
//         const duration = endTime.diff(startTime, 'seconds');
//         await VoiceStatModel.updateOne(
//           { userId },+
//           { $inc: { duration } }
//         );
//         delete voiceStats[userId];
//       }
//     }
//   }
// });
		

client.login(token)
