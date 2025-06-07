const { ActivityType, Client } = require("discord.js")
module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		client.user.setPresence({
			activities: [{ name: `LİSENCE created by rainereal`, type: ActivityType.Playing }],
			status: 'dnd',
		  });
}};
