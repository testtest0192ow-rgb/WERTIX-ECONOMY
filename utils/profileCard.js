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
  const canvas = createCanvas(1000, 600);
  const ctx = canvas.getContext('2d');

  // ===== 1. ФОН С ГРАДИЕНТОМ =====
  const gradient = ctx.createRadialGradient(500, 300, 100, 500, 300, 600);
  gradient.addColorStop(0, '#2c2f33');
  gradient.addColorStop(0.5, '#23272a');
  gradient.addColorStop(1, '#1a1c1e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1000, 600);

  // ===== 2. ДЕКОРАТИВНЫЕ ЛИНИИ =====
  ctx.strokeStyle = 'rgba(88, 101, 242, 0.15)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(i * 50, 0);
    ctx.lineTo(i * 50 + 600, 600);
    ctx.stroke();
  }

  // ===== 3. ОСНОВНАЯ КАРТОЧКА =====
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 10;
  
  ctx.fillStyle = 'rgba(32, 34, 37, 0.9)';
  ctx.beginPath();
  ctx.roundRect(40, 40, 920, 520, 20);
  ctx.fill();
  
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // ===== 4. РАМКА КАРТОЧКИ =====
  ctx.strokeStyle = stats.partner ? '#ff6b9d' : '#5865f2';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(40, 40, 920, 520, 20);
  ctx.stroke();

  // ===== 5. АВАТАР =====
  try {
    const avatar = await loadImage(user.displayAvatarURL({ extension: 'png', size: 256 }));
    
    // Тень аватара
    ctx.shadowColor = 'rgba(88, 101, 242, 0.3)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(140, 160, 100, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 40, 60, 200, 200);
    ctx.restore();
    
    ctx.shadowBlur = 0;
    
    // Обводка аватара
    ctx.beginPath();
    ctx.arc(140, 160, 102, 0, Math.PI * 2);
    ctx.strokeStyle = stats.partner ? '#ff6b9d' : '#5865f2';
    ctx.lineWidth = 4;
    ctx.stroke();
  } catch (error) {
    console.error('❌ Ошибка загрузки аватара:', error);
  }

  // ===== 6. ИМЯ ПОЛЬЗОВАТЕЛЯ =====
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px Segoe UI, Sans';
  ctx.fillText(user.globalName || user.username, 280, 120);

  // Тег
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '20px Segoe UI, Sans';
  ctx.fillText(`@${user.username}`, 280, 155);

  // ===== 7. СТАТУС ОНЛАЙН =====
  const status = member.presence?.status || 'offline';
  const statusColors = { 
    online: '#43b581', 
    idle: '#faa61a', 
    dnd: '#f04747', 
    offline: '#747f8d' 
  };
  ctx.fillStyle = statusColors[status] || '#747f8d';
  ctx.beginPath();
  ctx.arc(290, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '16px Segoe UI, Sans';
  const statusText = {
    online: 'В сети',
    idle: 'Не активен',
    dnd: 'Не беспокоить',
    offline: 'Не в сети'
  };
  ctx.fillText(statusText[status] || 'Не в сети', 310, 196);

  // ===== 8. СТАТУС ОТНОШЕНИЙ =====
  if (stats.partner) {
    ctx.fillStyle = '#ff6b9d';
    ctx.font = '16px Segoe UI, Sans';
    ctx.fillText(`${EMOJIS.marriage} В отношениях`, 280, 235);
  }

  // ===== 9. ЛЕВАЯ ПАНЕЛЬ СТАТИСТИКИ =====
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '18px Segoe UI, Sans';
  
  // Уровень
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 28px Segoe UI, Sans';
  ctx.fillText(`${EMOJIS.level} ${stats.level}`, 280, 295);
  
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '14px Segoe UI, Sans';
  ctx.fillText('УРОВЕНЬ', 280, 315);

  // Полоска XP
  const progress = Math.min(stats.xp / stats.xpToNext, 1);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.roundRect(280, 330, 300, 10, 5);
  ctx.fill();
  
  const grad = ctx.createLinearGradient(280, 0, 580, 0);
  grad.addColorStop(0, '#5865f2');
  grad.addColorStop(1, '#ffd700');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.roundRect(280, 330, 300 * progress, 10, 5);
  ctx.fill();
  
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '12px Segoe UI, Sans';
  ctx.fillText(`${stats.xp} / ${stats.xpToNext} XP`, 430, 355);

  // ===== 10. ПРАВАЯ ПАНЕЛЬ СТАТИСТИКИ =====
  ctx.font = '18px Segoe UI, Sans';
  
  // Репутация
  ctx.fillStyle = '#ff6b9d';
  ctx.fillText(`${EMOJIS.heart} ${stats.reputation}`, 620, 120);
  ctx.fillStyle = '#72767d';
  ctx.font = '12px Segoe UI, Sans';
  ctx.fillText('РЕПУТАЦИЯ', 620, 140);
  
  // Баланс
  ctx.fillStyle = '#43b581';
  ctx.font = '18px Segoe UI, Sans';
  ctx.fillText(`${EMOJIS.money} ${stats.balance}₽`, 620, 175);
  ctx.fillStyle = '#72767d';
  ctx.font = '12px Segoe UI, Sans';
  ctx.fillText('БАЛАНС', 620, 195);

  // Голосовое время
  ctx.fillStyle = '#faa61a';
  ctx.font = '18px Segoe UI, Sans';
  ctx.fillText(`${EMOJIS.voice} ${Math.floor(stats.voiceTime / 60)}ч ${stats.voiceTime % 60}м`, 620, 230);
  ctx.fillStyle = '#72767d';
  ctx.font = '12px Segoe UI, Sans';
  ctx.fillText('ГОЛОСОВОЕ ВРЕМЯ', 620, 250);

  // Сообщения
  ctx.fillStyle = '#9b59b6';
  ctx.font = '18px Segoe UI, Sans';
  ctx.fillText(`${EMOJIS.message} ${stats.messages || 0}`, 620, 285);
  ctx.fillStyle = '#72767d';
  ctx.font = '12px Segoe UI, Sans';
  ctx.fillText('СООБЩЕНИЙ', 620, 305);

  // ===== 11. ПРИВИЛЕГИЯ =====
  if (stats.role) {
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 16px Segoe UI, Sans';
    ctx.fillText(`👑 ${stats.role}`, 820, 120);
  }

  // ===== 12. О СЕБЕ =====
  if (stats.about) {
    ctx.fillStyle = '#b9bbbe';
    ctx.font = '16px Segoe UI, Sans';
    ctx.fillText(`📝 ${stats.about}`, 280, 410);
  }

  // ===== 13. НИЖНЯЯ ИНФОРМАЦИЯ =====
  ctx.fillStyle = '#4f545c';
  ctx.font = '13px Segoe UI, Sans';
  ctx.fillText(`Присоединился: ${member.joinedAt.toLocaleDateString('ru-RU')}`, 280, 480);
  ctx.fillText(`Топ: #${stats.top || '—'}`, 280, 505);

  // ===== 14. ФУТЕР С ID =====
  ctx.fillStyle = '#4f545c';
  ctx.font = '12px Segoe UI, Sans';
  ctx.textAlign = 'right';
  ctx.fillText(`ID: ${user.id}`, 940, 540);
  ctx.textAlign = 'left';

  return canvas.toBuffer();
}
