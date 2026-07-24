require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

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

// Загружаем команды при старте
client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} запущен!`);
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    try {
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Слеш-команды загружены');
    } catch (error) {
        console.error(error);
    }
});

// Обработка команд
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Произошла ошибка!', ephemeral: true });
    }
});

// Обработка префикс-команд (!bal, !dep и т.д.)
client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (!message.content.startsWith('!')) return;
    
    const args = message.content.slice(1).trim().split(/ +/);
    const cmd = args.shift().toLowerCase();
    
    // !bal → показывает баланс
    if (['bal', 'balance', 'деньги', 'баланс', 'кошелёк'].includes(cmd)) {
        const User = require('./models/User');
        let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!user) {
            user = await User.create({ userId: message.author.id, guildId: message.guild.id });
        }
        const total = user.wallet + user.bank;
        return message.reply(`💰 Кошелёк: **${user.wallet.toLocaleString()}** | 🏦 Банк: **${user.bank.toLocaleString()}** | 💎 Всего: **${total.toLocaleString()}**`);
    }
    
    // !dep 1000 → положить в банк
    if (['dep', 'deposit', 'положить'].includes(cmd)) {
        const User = require('./models/User');
        let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!user) return message.reply('❌ Ты ещё не в системе. Напиши /balance');
        
        let amount = parseInt(args[0]);
        if (args[0] === 'all' || args[0] === 'всё') amount = user.wallet;
        if (!amount || amount <= 0) return message.reply('❌ Укажи сумму: !dep 1000 или !dep all');
        if (amount > user.wallet) return message.reply('❌ Недостаточно денег в кошельке!');
        
        user.wallet -= amount;
        user.bank += amount;
        await user.save();
        return message.reply(`✅ Положено в банк: **${amount.toLocaleString()}** коинов`);
    }
    
    // !with 500 → снять из банка
    if (['with', 'withdraw', 'снять'].includes(cmd)) {
        const User = require('./models/User');
        let user = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!user) return message.reply('❌ Ты ещё не в системе. Напиши /balance');
        
        let amount = parseInt(args[0]);
        if (args[0] === 'all' || args[0] === 'всё') amount = user.bank;
        if (!amount || amount <= 0) return message.reply('❌ Укажи сумму: !with 500 или !with all');
        if (amount > user.bank) return message.reply('❌ Недостаточно денег в банке!');
        
        user.bank -= amount;
        user.wallet += amount;
        await user.save();
        return message.reply(`✅ Снято из банка: **${amount.toLocaleString()}** коинов`);
    }
    
    // !pay @user 1000 → перевести
    if (['pay', 'transfer', 'перевести', 'перевод'].includes(cmd)) {
        const User = require('./models/User');
        const target = message.mentions.users.first();
        if (!target) return message.reply('❌ Укажи пользователя: !pay @user 1000');
        
        const amount = parseInt(args[1]);
        if (!amount || amount <= 0) return message.reply('❌ Укажи сумму: !pay @user 1000');
        
        let sender = await User.findOne({ userId: message.author.id, guildId: message.guild.id });
        if (!sender || sender.wallet < amount) return message.reply('❌ Недостаточно денег!');
        
        let receiver = await User.findOne({ userId: target.id, guildId: message.guild.id });
        if (!receiver) receiver = await User.create({ userId: target.id, guildId: message.guild.id });
        
        sender.wallet -= amount;
        receiver.wallet += amount;
        await sender.save();
        await receiver.save();
        return message.reply(`✅ Переведено **${amount.toLocaleString()}** коинов → ${target.username}`);
    }
});

// Запуск
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB подключена');
        client.login(process.env.DISCORD_TOKEN);
    })
    .catch(err => console.error('❌ MongoDB ошибка:', err));
