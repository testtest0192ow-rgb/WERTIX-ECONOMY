// index.js
import { Client, GatewayIntentBits, Collection, REST, Routes } from 'discord.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Конфиг
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const MONGODB_URI = process.env.MONGODB_URI;

// 🔹 Создаём клиента
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers
  ]
});

client.commands = new Collection();

// 🔹 ЗАГРУЗКА КОМАНД (правильный способ для ESM)
const commands = [];
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(process.cwd(), 'commands', folder, file);
    const command = await import(`file://${filePath}`).then(m => m.default || m);
    
    if (command?.data && command?.execute) {
      client.commands.set(command.data.name, command);
      commands.push(command.data.toJSON());
      console.log(`✅ Загружена команда: ${command.data.name}`);
    } else {
      console.log(`⚠️ Ошибка в файле: ${file} — нет data или execute`);
    }
  }
}

// 🔹 РЕГИСТРАЦИЯ СЛЭШ-КОМАНД
const rest = new REST({ version: '10' }).setToken(TOKEN);
try {
  console.log('🔄 Регистрация команд...');
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
  console.log(`✅ Зарегистрировано ${commands.length} команд`);
} catch (error) {
  console.error('❌ Ошибка регистрации:', error);
}

// 🔹 ПОДКЛЮЧЕНИЕ БД
try {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB подключена');
} catch (error) {
  console.error('❌ Ошибка подключения к MongoDB:', error);
}

// 🔹 ОБРАБОТКА КОМАНД
client.on('interactionCreate', async interaction => {
  // Слэш-команды
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`❌ Ошибка в команде ${interaction.commandName}:`, error);
      await interaction.reply({
        content: '❌ Произошла ошибка при выполнении команды',
        ephemeral: true
      });
    }
  }

  // Кнопки
  if (interaction.isButton()) {
    if (interaction.customId === 'love_profile') {
      const loveCommand = await import('./commands/love.js').then(m => m.default || m);
      if (loveCommand?.execute) {
        await loveCommand.execute(interaction);
      }
    }
    
    if (interaction.customId === 'back_to_profile') {
      const profileCommand = await import('./commands/profile.js').then(m => m.default || m);
      if (profileCommand?.execute) {
        await profileCommand.execute(interaction);
      }
    }
  }
});

// 🔹 ЛОГИН
client.login(TOKEN);
console.log('🚀 Бот запускается...');
