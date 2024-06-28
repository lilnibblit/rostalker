const axios = require('axios');
const fs = require('fs');

let users = JSON.parse(fs.readFileSync("users.json", 'utf-8'));

main();
async function main() {
    while (true) {
        await check();
        fs.writeFileSync("users.json", JSON.stringify(users));
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function check() {
    for (const [name, data] of Object.entries(users)) {
        console.log(`tryna get badges for ${name}`);
        let id;
        try {
            id = (await axios.get(`https://badges.roblox.com/v1/users/${data.id}/badges?limit=10&sortOrder=Desc`)).data.data[0].id;
        } catch (error) {
            console.log("an error ocurred");
            return
        }
        if (id != users[name].last)
        {
            console.log(`new for ${name}`);
            users[name].last = id;
            let game = (await axios.get(`https://badges.roblox.com/v1/badges/${id}`)).data.awardingUniverse.rootPlaceId;
            await discordMessage(`<@891310907265810452> У ${name} новый бейдж!\nИгра: <https://www.roblox.com/games/${game}>`);
        }
    };
}

async function discordMessage(msg) {
	await axios.post(
		'https://discord.com/api/webhooks/1086315839860506634/g0CUkaQxVroKj5fpESyrhNopZLBd9UBKxZzHR0jpkFPPngpw8xRcRdFBaaPsI3OAvZE7',
		{
			"content": msg,
		}
    );
}