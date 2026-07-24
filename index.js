require('dotenv').config();
const http = require('http');
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// HTTP сервер ПЕРВЫМ чтобы Render не ругался
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('SECTOR ECONOMY ONLINE');
});
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log(`🌐 Порт ${PORT}`));

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]
});

client.commands = new Collection();

// Загружаем команды
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} запущен!`);
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    try {
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Команды загружены');
    } catch (error) {
        console.error('❌ Ошибка команд:', error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error('❌ Ошибка:', error);
        const reply = { content: '❌ Ошибка!', flags: 64 };
        if (!interaction.replied && !interaction.deferred) {
            await interaction.reply(reply);
        } else {
            await interaction.editReply(reply);
        }
    }
});

// Префикс-команды
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;
    
    const args = message.content.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    const User = require('./models/User');
    
    // !bal
    if (['bal', 'balance', 'деньги', 'баланс', 'кошелёк'].includes(cmd)) {
        let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!user) user = await User.create({ userId: message.author.id, guildId: message.guild.id });
        const total = user.wallet + user.bank;
        return message.reply(`💰 Кошелёк: **${user.wallet.toLocaleString()}** | 🏦 Банк: **${user.bank.toLocaleString()}** | 💎 Всего: **${total.toLocaleString()}**`);
    }
    
    // !dep
    if (['dep', 'deposit', 'положить'].includes(cmd)) {
        let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!user) return message.reply('❌ Напиши **!bal** сначала');
        let amount = parseInt(args[0]);
        if (args[0] === 'all' || args[0] === 'всё') amount = user.wallet;
        if (!amount || amount <= 0) return message.reply('❌ **!dep 1000** или **!dep all**');
        if (amount > user.wallet) return message.reply('❌ Недостаточно в кошельке!');
        user.wallet -= amount;
        user.bank += amount;
        await user.save();
        return message.reply(`✅ В банк: **${amount.toLocaleString()}**`);
    }
    
    // !with
    if (['with', 'withdraw', 'снять'].includes(cmd)) {
        let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!user) return message.reply('❌ Напиши **!bal** сначала');
        let amount = parseInt(args[0]);
        if (args[0] === 'all' || args[0] === 'всё') amount = user.bank;
        if (!amount || amount <= 0) return message.reply('❌ **!with 500** или **!with all**');
        if (amount > user.bank) return message.reply('❌ Недостаточно в банке!');
        user.bank -= amount;
        user.wallet += amount;
        await user.save();
        return message.reply(`✅ Снято: **${amount.toLocaleString()}**`);
    }
    
    // !pay @user 1000
    if (['pay', 'transfer', 'перевести', 'перевод'].includes(cmd)) {
        const target = message.mentions.users.first();
        if (!target) return message.reply('❌ **!pay @user 1000**');
        const amount = parseInt(args[1]);
        if (!amount || amount < 10) return message.reply('❌ Минимум 10!');
        if (target.id === message.author.id) return message.reply('❌ Нельзя себе!');
        
        let sender = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!sender || sender.wallet < amount) return message.reply('❌ Недостаточно денег!');
        
        let receiver = await User.findOne({ userId: target.id, guildId: message.guild.id });
        if (!receiver) receiver = await User.create({ userId: target.id, guildId: message.guild.id });
        
        const tax = Math.floor(amount * 0.06);
        const final = amount - tax;
        
        sender.wallet -= amount;
        receiver.wallet += final;
        await sender.save();
        await receiver.save();
        return message.reply(`✅ **${final.toLocaleString()}** → ${target.username} (налог: ${tax})`);
    }
    
    // !daily
    if (['daily', 'бонус', 'награда'].includes(cmd)) {
        let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!user) user = await User.create({ userId: message.author.id, guildId: message.guild.id });
        
        const now = new Date();
        if (user.lastDaily) {
            const diff = now - user.lastDaily;
            const hoursLeft = 24 - Math.floor(diff / 3600000);
            if (hoursLeft > 0) return message.reply(`❌ Жди **${hoursLeft}** ч`);
        }
        
        const reward = Math.floor(Math.random() * 1000) + 500 + (user.dailyStreak * 50);
        user.wallet += reward;
        user.dailyStreak += 1;
        user.lastDaily = now;
        await user.save();
        return message.reply(`🎁 **+${reward.toLocaleString()}**! Серия: **${user.dailyStreak}** дн`);
    }
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB');
        client.login(process.env.DISCORD_TOKEN);
    })
    .catch(err => console.error('❌ MongoDB:', err));
