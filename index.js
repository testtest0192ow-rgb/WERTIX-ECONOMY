import { Client, GatewayIntentBits, Collection, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 ПРОВЕРКА ПЕРЕМЕННЫХ
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const MONGODB_URI = process.env.MONGODB_URI;

if (!TOKEN || !CLIENT_ID || !MONGODB_URI) {
  console.error('❌ Не все переменные заданы!');
  process.exit(1);
}

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

// 🔹 ЗАГРУЗКА КОМАНД
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const { data, execute } = await import(`./commands/${file}`);
    if (data && execute) {
      client.commands.set(data.name, { data, execute });
      commands.push(data.toJSON());
      console.log(`✅ ${data.name}`);
    }
  } catch (e) {
    console.log(`❌ ${file}: ${e.message}`);
  }
}

// 🔹 РЕГИСТРАЦИЯ
if (commands.length) {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log(`✅ Зарегистрировано ${commands.length} команд`);
  } catch (e) {
    console.error('❌ Регистрация:', e);
  }
}

// 🔹 ПОДКЛЮЧЕНИЕ БД С ДИАГНОСТИКОЙ
try {
  console.log('🔄 Подключение к MongoDB...');
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  console.log('✅ MongoDB подключена');
  
  // Проверка: создаём тестовую запись
  const User = (await import('./models/User.js')).default;
  const testUser = await User.findOne({ userId: 'test' });
  console.log('✅ Тестовая проверка БД пройдена');
} catch (error) {
  console.error('❌ Ошибка подключения к MongoDB:', error.message);
  console.error('❌ Полная ошибка:', error);
}

// 🔹 ОБРАБОТКА ВЗАИМОДЕЙСТВИЙ
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (e) {
      console.error(`❌ Ошибка в ${interaction.commandName}:`, e);
      await interaction.reply({ content: '❌ Ошибка', flags: 64 }).catch(() => {});
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId.startsWith('love_')) {
      try {
        const userId = interaction.customId.replace('love_', '');
        const user = await client.users.fetch(userId);
        const { createLoveCard } = await import('./utils/loveCard.js');
        const User = (await import('./models/User.js')).default;
        
        let data = await User.findOne({ userId: user.id, guildId: interaction.guildId });
        if (!data) {
          data = new User({ userId: user.id, guildId: interaction.guildId });
          await data.save();
        }
        
        if (!data.partnerId) {
          return interaction.reply({ content: `❤️ У ${user.displayName} нет пары`, flags: 64 });
        }
        
        const partner = await client.users.fetch(data.partnerId);
        const buffer = await createLoveCard(user, partner, {
          loveLevel: data.loveLevel || 0,
          loveXp: data.loveXp || 0,
          voiceTime: data.voiceTime || 0,
          marriedAt: data.marriedAt,
          messages: data.messages || 0
        });
        
        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId(`back_${user.id}`)
            .setLabel('Обычный профиль')
            .setStyle(ButtonStyle.Secondary)
        );
        
        await interaction.reply({
          files: [new AttachmentBuilder(buffer, { name: 'love.png' })],
          components: [row],
          content: `**${user.displayName}** ❤️ **${partner.displayName}**`
        });
      } catch (error) {
        console.error('❌ Ошибка love_profile:', error);
        await interaction.reply({
          content: '❌ Ошибка при открытии любовного профиля',
          flags: 64
        }).catch(() => {});
      }
    }
    
    if (interaction.customId.startsWith('back_')) {
      try {
        const userId = interaction.customId.replace('back_', '');
        const user = await client.users.fetch(userId);
        const profileCommand = await import('./commands/profile.js');
        if (profileCommand?.execute) {
          const fakeInteraction = {
            ...interaction,
            options: {
              getUser: () => user,
              get: () => null
            }
          };
          await profileCommand.execute(fakeInteraction);
        }
      } catch (error) {
        console.error('❌ Ошибка back_to_profile:', error);
        await interaction.reply({
          content: '❌ Ошибка при возврате в профиль',
          flags: 64
        }).catch(() => {});
      }
    }
  }
});

client.login(TOKEN);
console.log('🚀 Бот запускается...');
