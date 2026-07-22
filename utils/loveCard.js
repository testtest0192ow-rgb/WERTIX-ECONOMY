import { createCanvas, loadImage } from '@napi-rs/canvas';

const EMOJIS = {
  money: '<:emoji_1:1529426390267723796>',
  marriage: '<:emoji_2:1529430666792669214>',
  voice: '<:emoji_3:1529430705304768672>',
  level: '<:emoji_4:1529430822820778095>',
  message: '<:emoji_5:1529430867426934874>',
  heart: '<:emoji_6:1529430913396506705>'
};

export async function createLoveCard(user, partner, stats) {
  const canvas = createCanvas(1200, 700);
  const ctx = canvas.getContext('2d');

  // ===== ФОН С ПАРЯЩИМИ СЕРДЦАМИ =====
  const grad = ctx.createLinearGradient(0, 0, 1200, 700);
  grad.addColorStop(0, '#1a0a2e');
  grad.addColorStop(0.3, '#2d1b69');
  grad.addColorStop(0.7, '#4a1942');
  grad.addColorStop(1, '#1a0a2e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 700);

  // ===== ПАРЯЩИЕ СЕРДЦА =====
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 1200;
    const y = Math.random() * 700;
    const size = Math.random() * 30 + 10;
    const alpha = Math.random() * 0.1 + 0.02;
    ctx.fillStyle = `rgba(255, 0, 100, ${alpha})`;
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('❤️', x, y);
  }

  // ===== ОСНОВНАЯ КАРТОЧКА =====
  ctx.shadowColor = '#ff6b9d';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.fillStyle = 'rgba(20, 10, 30, 0.92)';
  ctx.beginPath();
  ctx.roundRect(40, 40, 1120, 620, 30);
  ctx.fill();
  
  ctx.shadowBlur = 0;

  // ===== НЕОНОВАЯ РАМКА =====
  ctx.strokeStyle = '#ff6b9d';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#ff6b9d';
  ctx.shadowBlur = 30;
  ctx.beginPath();
  ctx.roundRect(40, 40, 1120, 620, 30);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // ===== АВАТАР ПОЛЬЗОВАТЕЛЯ =====
  try {
    const av1 = await loadImage(user.displayAvatarURL({ extension: 'png', size: 512 }));
    
    ctx.shadowColor = '#ff6b9d';
    ctx.shadowBlur = 40;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(250, 250, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(av1, 140, 140, 220, 220);
    ctx.restore();
    
    ctx.shadowBlur = 0;
    
    ctx.beginPath();
    ctx.arc(250, 250, 112, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(user.globalName || user.username, 250, 380);
  } catch (e) {}

  // ===== АВАТАР ПАРТНЁРА =====
  try {
    const av2 = await loadImage(partner.displayAvatarURL({ extension: 'png', size: 512 }));
    
    ctx.shadowColor = '#ff6b9d';
    ctx.shadowBlur = 40;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(950, 250, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(av2, 840, 140, 220, 220);
    ctx.restore();
    
    ctx.shadowBlur = 0;
    
    ctx.beginPath();
    ctx.arc(950, 250, 112, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = '#ff6b9d';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Segoe UI, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(partner.globalName || partner.username, 950, 380);
  } catch (e) {}

  // ===== БОЛЬШОЕ СЕРДЦЕ ПОСЕРЕДИНЕ =====
  ctx.shadowColor = '#ff0040';
  ctx.shadowBlur = 60;
  ctx.fillStyle = '#ff0040';
  ctx.font = '80px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❤️', 600, 250);
  ctx.shadowBlur = 0;

  // ===== УРОВЕНЬ ЛЮБВИ =====
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 44px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`${EMOJIS.heart} ${stats.loveLevel || 0}`, 600, 440);

  // ===== ПОЛОСКА ПРОГРЕССА =====
  const progress = Math.min((stats.loveXp || 0) / 1000, 1);
  
  ctx.shadowColor = 'rgba(255, 215, 0, 0.3)';
  ctx.shadowBlur = 20;
  
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(350, 460, 500, 24, 12);
  ctx.fill();
  
  const grad2 = ctx.createLinearGradient(350, 0, 850, 0);
  grad2.addColorStop(0, '#ff6b9d');
  grad2.addColorStop(0.5, '#ff0040');
  grad2.addColorStop(1, '#ffd700');
  ctx.fillStyle = grad2;
  ctx.beginPath();
  ctx.roundRect(350, 460, 500 * progress, 24, 12);
  ctx.fill();
  
  ctx.shadowBlur = 0;
  
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${stats.loveXp || 0} / 1000 XP ❤️`, 600, 472);

  // ===== СТАТИСТИКА ВМЕСТЕ =====
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '20px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  
  const h = Math.floor((stats.voiceTime || 0) / 60);
  const m = (stats.voiceTime || 0) % 60;
  ctx.fillText(`${EMOJIS.voice} Вместе: ${h}ч ${m}м    ${EMOJIS.message} Сообщений: ${stats.messages || 0}`, 600, 560);

  if (stats.marriedAt) {
    ctx.fillStyle = '#ffd700';
    ctx.font = '18px Segoe UI, sans-serif';
    ctx.fillText(`${EMOJIS.marriage} Вместе с: ${new Date(stats.marriedAt).toLocaleDateString('ru-RU')}`, 600, 600);
  }

  // ===== ФУТЕР =====
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.font = '16px Segoe UI, sans-serif';
  ctx.textBaseline = 'bottom';
  ctx.fillText('❤️ Любовный профиль ❤️', 600, 660);

  return canvas.toBuffer();
}
