import { Client, GatewayIntentBits, Collection, REST, Routes, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } from 'discord.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// Загрузка команд
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

// Регистрация
if (commands.length) {
  const rest = new REST({ version: '10' }).setToken(TOKEN);
  try {
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log(`✅ Зарегистрировано ${commands.length} команд`);
  } catch (e) {
    console.error('❌ Регистрация:', e);
  }
}

// MongoDB
try {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB');
} catch (e) {
  console.error('❌ MongoDB:', e);
}

// Обработка
client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (e) {
      console.error(e);
      await interaction.reply({ content: '❌ Ошибка', flags: 64 });
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId.startsWith('love_')) {
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
        new ButtonBuilder().setCustomId(`back_${user.id}`).setLabel('Обычный профиль').setStyle(ButtonStyle.Secondary)
      );
      
      await interaction.reply({
        files: [new AttachmentBuilder(buffer, { name: 'love.png' })],
        components: [row],
        content: `**${user.displayName}** ❤️ **${partner.displayName}**`
      });
    }
    
    if (interaction.customId.startsWith('back_')) {
      const userId = interaction.customId.replace('back_', '');
      const user = await client.users.fetch(userId);
      const profile = await import('./commands/profile.js');
      await profile.execute({
        ...interaction,
        options: { getUser: () => user }
      });
    }
  }
});

client.login(TOKEN);
console.log('🚀 Запуск...');
