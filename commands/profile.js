// commands/profile.js
import { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import User from '../models/User.js';
import { join } from 'path';

const EMOJIS = {
  money: '<:emoji_1:1529426390267723796>',
  marriage: '<:emoji_2:1529430666792669214>',
  voice: '<:emoji_3:1529430705304768672>',
  level: '<:emoji_4:1529430822820778095>',
  message: '<:emoji_5:1529430867426934874>',
  heart: '<:emoji_6:1529430913396506705>'
};

export const data = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('📋 Показать профиль пользователя')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Выберите пользователя')
      .setRequired(false)
  );

export async function execute(interaction) {
  const user = interaction.options.getUser('user') || interaction.user;
  const member = await interaction.guild.members.fetch(user.id);

  let userData = await User.findOne({ userId: user.id, guildId: interaction.guildId });
  if (!userData) {
    userData = new User({ userId: user.id, guildId: interaction.guildId });
    await userData.save();
  }

  const stats = {
    level: userData.level || 0,
    xp: userData.xp || 0,
    xpToNext: (userData.level || 0) * 100 + 100,
    balance: userData.balance || 0,
    bank: userData.bank || 0,
    reputation: userData.reputation || 0,
    voiceTime: userData.voiceTime || 0,
    top: userData.topPosition || 0,
    bg: userData.background || 'default',
    about: userData.about || '',
    partner: userData.partnerId || null,
    messages: userData.messages || 0
  };

  // 🎨 Генерация профиля
  const canvas = createCanvas(900, 500);
  const ctx = canvas.getContext('2d');

  // Фон
  const bgPath = join(process.cwd(), 'assets', `${stats.bg}.png`);
  try {
    const bg = await loadImage(bgPath);
    ctx.drawImage(bg, 0, 0, 900, 500);
  } catch {
    const gradient = ctx.createLinearGradient(0, 0, 900, 500);
    gradient.addColorStop(0, '#23272a');
    gradient.addColorStop(1, '#2c2f33');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 500);
  }

  ctx.strokeStyle = '#5865f2';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 860, 460);

  // Аватар
  const avatar = await loadImage(user.displayAvatarURL({ extension: 'png', size: 256 }));
  ctx.save();
  ctx.beginPath();
  ctx.arc(130, 140, 90, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 40, 50, 180, 180);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(130, 140, 92, 0, Math.PI * 2);
  ctx.strokeStyle = stats.partner ? '#ff6b9d' : '#5865f2';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Имя
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px Sans';
  ctx.fillText(user.globalName || user.username, 250, 110);

  ctx.fillStyle = '#b9bbbe';
  ctx.font = '20px Sans';
  ctx.fillText(`@${user.username}`, 250, 145);

  // Статус
  const status = member.presence?.status || 'offline';
  const statusColors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
  ctx.fillStyle = statusColors[status] || '#747f8d';
  ctx.beginPath();
  ctx.arc(250, 175, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '16px Sans';
  ctx.fillText(status === 'online' ? '🟢 Онлайн' : status === 'idle' ? '🟡 Не активен' : status === 'dnd' ? '🔴 Не беспокоить' : '⚫ Оффлайн', 270, 182);

  // ❤️ Статус отношений
  if (stats.partner) {
    ctx.fillStyle = '#ff6b9d';
    ctx.font = '16px Sans';
    ctx.fillText(`${EMOJIS.marriage} В отношениях`, 500, 140);
  }

  // Уровень с кастомным эмодзи
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 26px Sans';
  ctx.fillText(`${EMOJIS.level} Уровень ${stats.level}`, 250, 240);

  const progress = Math.min(stats.xp / stats.xpToNext, 1);
  ctx.fillStyle = '#2c2f33';
  ctx.fillRect(250, 258, 400, 24);
  ctx.fillStyle = '#5865f2';
  ctx.fillRect(250, 258, 400 * progress, 24);
  ctx.fillStyle = '#ffffff';
  ctx.font = '14px Sans';
  ctx.fillText(`${stats.xp} / ${stats.xpToNext} XP`, 430, 277);

  // Статистика с кастомными эмодзи
  ctx.font = '18px Sans';
  ctx.fillStyle = '#b9bbbe';
  
  ctx.fillText(`${EMOJIS.money} Баланс: ${stats.balance}₽`, 250, 330);
  ctx.fillText(`${EMOJIS.heart} Репутация: ${stats.reputation}`, 250, 365);
  
  ctx.fillText(`${EMOJIS.voice} Время: ${Math.floor(stats.voiceTime / 60)}ч ${stats.voiceTime % 60}м`, 500, 330);
  ctx.fillText(`${EMOJIS.message} Сообщений: ${stats.messages || 0}`, 500, 365);

  // О себе
  if (stats.about) {
    ctx.fillStyle = '#72767d';
    ctx.font = '16px Sans';
    ctx.fillText(`📝 ${stats.about}`, 250, 410);
  }

  // Футер
  ctx.fillStyle = '#4f545c';
  ctx.font = '12px Sans';
  ctx.fillText(`ID: ${user.id}`, 750, 480);

  const buffer = canvas.toBuffer();
  const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' });

  // 🎛 Кнопка с кастомным эмодзи сердечка
  const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
        .setCustomId('love_profile')
        .setLabel('Любовный профиль')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji(EMOJIS.heart) // Твой кастомный эмодзи ❤️
    );

  await interaction.reply({
    files: [attachment],
    components: [row],
    content: `📋 **Профиль ${user.displayName}**`
  });
}
