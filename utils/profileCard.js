import { createCanvas, loadImage } from 'canvas';

export async function createProfileCard(user, member, stats) {
  const canvas = createCanvas(1000, 600);
  const ctx = canvas.getContext('2d');

  // Фон
  const grad = ctx.createRadialGradient(500, 300, 100, 500, 300, 600);
  grad.addColorStop(0, '#2c2f33');
  grad.addColorStop(1, '#1a1c1e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1000, 600);

  // Карточка
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = 'rgba(32,34,37,0.9)';
  ctx.beginPath();
  ctx.roundRect(40, 40, 920, 520, 20);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Рамка
  ctx.strokeStyle = stats.partner ? '#ff6b9d' : '#5865f2';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(40, 40, 920, 520, 20);
  ctx.stroke();

  // Аватар
  try {
    const avatar = await loadImage(user.displayAvatarURL({ extension: 'png', size: 256 }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(140, 160, 100, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(avatar, 40, 60, 200, 200);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(140, 160, 102, 0, Math.PI * 2);
    ctx.strokeStyle = stats.partner ? '#ff6b9d' : '#5865f2';
    ctx.lineWidth = 4;
    ctx.stroke();
  } catch {}

  // Имя
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 36px Sans';
  ctx.fillText(user.globalName || user.username, 280, 120);
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '20px Sans';
  ctx.fillText(`@${user.username}`, 280, 155);

  // Статус
  const statusColors = { online: '#43b581', idle: '#faa61a', dnd: '#f04747', offline: '#747f8d' };
  const status = member.presence?.status || 'offline';
  ctx.fillStyle = statusColors[status];
  ctx.beginPath();
  ctx.arc(290, 190, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '16px Sans';
  ctx.fillText({ online: 'В сети', idle: 'Не активен', dnd: 'Не беспокоить', offline: 'Не в сети' }[status] || 'Не в сети', 310, 196);

  // Уровень
  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 28px Sans';
  ctx.fillText(`🎯 ${stats.level}`, 280, 295);
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '14px Sans';
  ctx.fillText('УРОВЕНЬ', 280, 315);

  // XP
  const progress = Math.min(stats.xp / stats.xpToNext, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.beginPath();
  ctx.roundRect(280, 330, 300, 10, 5);
  ctx.fill();
  const grad2 = ctx.createLinearGradient(280, 0, 580, 0);
  grad2.addColorStop(0, '#5865f2');
  grad2.addColorStop(1, '#ffd700');
  ctx.fillStyle = grad2;
  ctx.beginPath();
  ctx.roundRect(280, 330, 300 * progress, 10, 5);
  ctx.fill();
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '12px Sans';
  ctx.fillText(`${stats.xp} / ${stats.xpToNext} XP`, 430, 355);

  // Статистика справа
  ctx.font = '18px Sans';
  ctx.fillStyle = '#ff6b9d';
  ctx.fillText(`❤️ ${stats.reputation}`, 620, 120);
  ctx.fillStyle = '#72767d';
  ctx.font = '12px Sans';
  ctx.fillText('РЕПУТАЦИЯ', 620, 140);

  ctx.fillStyle = '#43b581';
  ctx.font = '18px Sans';
  ctx.fillText(`💰 ${stats.balance}₽`, 620, 175);
  ctx.fillStyle = '#72767d';
  ctx.font = '12px Sans';
  ctx.fillText('БАЛАНС', 620, 195);

  ctx.fillStyle = '#faa61a';
  ctx.font = '18px Sans';
  ctx.fillText(`🎙 ${Math.floor(stats.voiceTime / 60)}ч ${stats.voiceTime % 60}м`, 620, 230);
  ctx.fillStyle = '#72767d';
  ctx.font = '12px Sans';
  ctx.fillText('ГОЛОС', 620, 250);

  ctx.fillStyle = '#9b59b6';
  ctx.font = '18px Sans';
  ctx.fillText(`💬 ${stats.messages}`, 620, 285);
  ctx.fillStyle = '#72767d';
  ctx.font = '12px Sans';
  ctx.fillText('СООБЩЕНИЙ', 620, 305);

  // О себе
  if (stats.about) {
    ctx.fillStyle = '#b9bbbe';
    ctx.font = '16px Sans';
    ctx.fillText(`📝 ${stats.about}`, 280, 410);
  }

  ctx.fillStyle = '#4f545c';
  ctx.font = '13px Sans';
  ctx.fillText(`Присоединился: ${member.joinedAt.toLocaleDateString('ru-RU')}`, 280, 480);
  ctx.textAlign = 'right';
  ctx.fillText(`ID: ${user.id}`, 940, 540);

  return canvas.toBuffer();
}
