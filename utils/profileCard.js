// utils/profileCard.js
import { createCanvas, loadImage } from 'canvas';
import { join } from 'path';

const EMOJIS = {
  money: '<:emoji_1:1529426390267723796>',
  marriage: '<:emoji_2:1529430666792669214>',
  voice: '<:emoji_3:1529430705304768672>',
  level: '<:emoji_4:1529430822820778095>',
  message: '<:emoji_5:1529430867426934874>',
  heart: '<:emoji_6:1529430913396506705>'
};

export async function createProfileCard(user, member, stats) {
  const canvas = createCanvas(900, 500);
  const ctx = canvas.getContext('2d');

  // 1️⃣ ФОН
  try {
    const bg = await loadImage(join(process.cwd(), 'assets', `${stats.bg || 'default'}.png`));
    ctx.drawImage(bg, 0, 0, 900, 500);
  } catch {
    // Если фона нет — градиент
    const gradient = ctx.createLinearGradient(0, 0, 900, 500);
    gradient.addColorStop(0, '#23272a');
    gradient.addColorStop(1, '#2c2f33');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 900, 500);
  }

  // 2️⃣ РАМКА
  ctx.strokeStyle = stats.partner ? '#ff6b9d' : '#5865f2';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, 860, 460);

  // 3️⃣ АВАТАР (круглый)
  const avatar = await loadImage(user.displayAvatarURL({ extension: 'png', size: 256 }));
  ctx.save();
  ctx.beginPath();
  ctx.arc(130, 140, 90, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(avatar, 40, 50, 180, 180);
  ctx.restore();

  // Обводка аватара
  ctx.beginPath();
  ctx.arc(130, 140, 92, 0, Math.PI * 2);
  ctx.strokeStyle = stats.partner ? '#ff6b9d' : '#5865f2';
  ctx.lineWidth = 4;
  ctx.stroke();

  // 4️⃣ ИМЯ И ТЕГ
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 34px Sans';
  ctx.fillText(user.globalName || user.username, 250, 110);

  ctx.fillStyle = '#b9bbbe';
  ctx.font = '20px Sans';
  ctx.fillText(`@${user.username}`, 250, 145);

  // 5️⃣ СТАТУС (онлайн/оффлайн)
  const status = member.presence?.status || 'offline';
  const statusColors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
  ctx.fillStyle = statusColors[status] || '#747f8d';
  ctx.beginPath();
  ctx.arc(250, 175, 10, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '16px Sans';
  const statusText = {
    online: '🟢 Онлайн',
    idle: '🟡 Не активен',
    dnd: '🔴 Не беспокоить',
    offline: '⚫ Оффлайн'
  };
  ctx.fillText(statusText[status] || '⚫ Оффлайн', 270, 182);

  // 6️⃣ СТАТУС ОТНОШЕНИЙ (если есть партнёр)
  if (stats.partner) {
    ctx.fillStyle = '#ff6b9d';
    ctx.font = '16px Sans';
    ctx.fillText(`${EMOJIS.marriage} В отношениях`, 500, 140);
  }

  // 7️⃣ УРОВЕНЬ С КАСТОМНЫМ ЭМОДЗИ
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 26px Sans';
  ctx.fillText(`${EMOJIS.level} Уровень ${stats.level}`, 250, 240);

  // Полоска XP
  const progress = Math.min(stats.xp / stats.xpToNext, 1);
  ctx.fillStyle = '#2c2f33';
  ctx.fillRect(250, 258, 400, 24);
  ctx.fillStyle = '#5865f2';
  ctx.fillRect(250, 258, 400 * progress, 24);
  ctx.fillStyle = '#ffffff';
  ctx.font = '14px Sans';
  ctx.fillText(`${stats.xp} / ${stats.xpToNext} XP`, 430, 277);

  // 8️⃣ СТАТИСТИКА (с кастомными эмодзи)
  ctx.font = '18px Sans';
  ctx.fillStyle = '#b9bbbe';
  
  // Левая колонка
  ctx.fillText(`${EMOJIS.money} Баланс: ${stats.balance}₽`, 250, 330);
  ctx.fillText(`${EMOJIS.heart} Репутация: ${stats.reputation}`, 250, 365);
  
  // Правая колонка
  ctx.fillText(`${EMOJIS.voice} Время: ${Math.floor(stats.voiceTime / 60)}ч ${stats.voiceTime % 60}м`, 500, 330);
  ctx.fillText(`${EMOJIS.message} Сообщений: ${stats.messages || 0}`, 500, 365);

  // 9️⃣ О СЕБЕ (если есть)
  if (stats.about) {
    ctx.fillStyle = '#72767d';
    ctx.font = '16px Sans';
    ctx.fillText(`📝 ${stats.about}`, 250, 410);
  }

  // 🔟 ФУТЕР С ID
  ctx.fillStyle = '#4f545c';
  ctx.font = '12px Sans';
  ctx.fillText(`ID: ${user.id}`, 750, 480);

  // Возвращаем буфер
  return canvas.toBuffer();
}
