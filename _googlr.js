const Discord = require('discord.js');
const bot = new Discord.Client();
const needle = require('needle');
const config = require('./config.json');

bot.once('ready', () => {
	console.log(`Ready, serving ${bot.guilds.size} guilds with ${bot.users.size} users.`);
});

bot.on('message', (msg) => {
	if (!msg.mentions.users.has(bot.user.id)) return;

	if (msg.cleanContent.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig)) {
		const link = msg.cleanContent.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig)[0];
		const data = { longUrl: link };

		needle.post(`https://www.googleapis.com/urlshortener/v1/url?key=${config.gAPI_key}`, data, { json: true }, (err, resp) => {
			if (err) {
				msg.reply(`something went wrong. Error code ${resp.statuscode}.`);
			} else {
				msg.reply(`${resp.body.id}`);
				console.log(JSON.stringify(resp.body));
			}
		});
	}
});

bot.login(config.token);
