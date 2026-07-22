// utils/loveCard.js
import { createCanvas, loadImage } from 'canvas';

const EMOJIS = {
  money: '<:emoji_1:1529426390267723796>',
  marriage: '<:emoji_2:1529430666792669214>',
  voice: '<:emoji_3:1529430705304768672>',
  level: '<:emoji_4:1529430822820778095>',
  message: '<:emoji_5:1529430867426934874>',
  heart: '<:emoji_6:1529430913396506705>'
};

export async function createLoveCard(user, partner, stats) {
  const canvas = createCanvas(900, 500);
  const ctx = canvas.getContext('2d');

  // 1️⃣ РОМАНТИЧЕСКИЙ ФОН
  const gradient = ctx.createLinearGradient(0, 0, 900, 500);
  gradient.addColorStop(0, '#ff6b9d');
  gradient.addColorStop(0.3, '#c44dff');
  gradient.addColorStop(0.7, '#6b47d6');
  gradient.addColorStop(1, '#3a1c71');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 900, 500);

  // 2️⃣ ДЕКОРАТИВНАЯ РАМКА
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 860, 460);

  // 3️⃣ БОЛЬШОЕ СЕРДЦЕ В ФОНЕ
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.font = '250px Sans';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❤️', 450, 250);

  // 4️⃣ МАЛЕНЬКИЕ СЕРДЕЧКИ
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.font = '40px Sans';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('❤️', 40, 40);
  ctx.textAlign = 'right';
  ctx.fillText('❤️', 860, 40);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'bottom';
  ctx.fillText('❤️', 40, 460);
  ctx.textAlign = 'right';
  ctx.fillText('❤️', 860, 460);

  // 5️⃣ АВАТАР ПОЛЬЗОВАТЕЛЯ
  try {
    const avatar1 = await loadImage(user.displayAvatarURL({ extension: 'png', size: 256 }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(200, 200, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar1, 100, 100, 200, 200);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(200, 200, 102, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(user.globalName || user.username, 200, 320);
  } catch (error) {
    console.error('❌ Ошибка загрузки аватара пользователя:', error);
  }

  // 6️⃣ АВАТАР ПАРТНЁРА
  try {
    const avatar2 = await loadImage(partner.displayAvatarURL({ extension: 'png', size: 256 }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(700, 200, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar2, 600, 100, 200, 200);
    ctx.restore();

    ctx.beginPath();
    ctx.arc(700, 200, 102, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(partner.globalName || partner.username, 700, 320);
  } catch (error) {
    console.error('❌ Ошибка загрузки аватара партнёра:', error);
  }

  // 7️⃣ СЕРДЦЕ ПОСЕРЕДИНЕ
  ctx.fillStyle = '#ff0040';
  ctx.font = '60px Sans';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❤️', 450, 200);

  // 8️⃣ УРОВЕНЬ ЛЮБВИ
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 36px Sans';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${EMOJIS.heart} ${stats.loveLevel || 0}`, 450, 320);

  // 9️⃣ ПОЛОСКА ПРОГРЕССА
  const progress = Math.min((stats.loveXp || 0) / 1000, 1);
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(250, 350, 400, 20);
  
  const gradientBar = ctx.createLinearGradient(250, 0, 650, 0);
  gradientBar.addColorStop(0, '#ff6b9d');
  gradientBar.addColorStop(1, '#ffd700');
  ctx.fillStyle = gradientBar;
  ctx.fillRect(250, 350, 400 * progress, 20);
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(250, 350, 400, 20);

  ctx.fillStyle = '#ffffff';
  ctx.font = '14px Sans';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${stats.loveXp || 0} / 1000 XP ❤️`, 450, 360);

  // 🔟 СТАТИСТИКА ВМЕСТЕ
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '16px Sans';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';

  const voiceHours = Math.floor((stats.voiceTime || 0) / 60);
  const voiceMinutes = (stats.voiceTime || 0) % 60;
  
  ctx.fillText(
    `${EMOJIS.voice} Вместе: ${voiceHours}ч ${voiceMinutes}м    ${EMOJIS.message} Сообщений: ${stats.messages || 0}`,
    450, 400
  );

  // 1️⃣1️⃣ ДАТА ОТНОШЕНИЙ
  if (stats.marriedAt) {
    ctx.fillStyle = '#ffd700';
    ctx.font = '14px Sans';
    ctx.fillText(
      `${EMOJIS.marriage} Вместе с: ${new Date(stats.marriedAt).toLocaleDateString('ru-RU')}`,
      450, 430
    );
  }

  // 1️⃣2️⃣ ФУТЕР
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = '12px Sans';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${EMOJIS.heart} Любовный профиль ${EMOJIS.heart}`, 450, 480);

  return canvas.toBuffer();
}
