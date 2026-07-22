import { createCanvas, loadImage } from '@napi-rs/canvas';

const EMOJIS = {
  money: '<:emoji_1:1529426390267723796>',
  marriage: '<:emoji_2:1529430666792669214>',
  voice: '<:emoji_3:1529430705304768672>',
  level: '<:emoji_4:1529430822820778095>',
  message: '<:emoji_5:1529430867426934874>',
  heart: '<:emoji_6:1529430913396506705>'
};

export async function createProfileCard(user, member, stats) {
  const canvas = createCanvas(1200, 700);
  const ctx = canvas.getContext('2d');

  // ===== ФОН С ДИНАМИЧЕСКИМ ГРАДИЕНТОМ =====
  const time = Date.now() / 1000;
  const hue1 = (time * 0.02) % 360;
  const hue2 = (hue1 + 60) % 360;
  
  const grad = ctx.createRadialGradient(600, 350, 100, 600, 350, 700);
  grad.addColorStop(0, `hsl(${hue1}, 70%, 15%)`);
  grad.addColorStop(0.5, `hsl(${hue2}, 60%, 10%)`);
  grad.addColorStop(1, '#0a0a0a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1200, 700);

  // ===== СВЕТЯЩИЕСЯ ЧАСТИЦЫ =====
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 1200;
    const y = Math.random() * 700;
    const size = Math.random() * 3 + 1;
    const alpha = Math.random() * 0.5 + 0.1;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // ===== ОСНОВНАЯ КАРТОЧКА С НЕОНОВОЙ РАМКОЙ =====
  ctx.shadowColor = stats.partner ? '#ff6b9d' : '#5865f2';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  ctx.fillStyle = 'rgba(20, 22, 26, 0.92)';
  ctx.beginPath();
  ctx.roundRect(40, 40, 1120, 620, 30);
  ctx.fill();
  
  ctx.shadowBlur = 0;

  // ===== НЕОНОВАЯ РАМКА =====
  const borderColor = stats.partner ? '#ff6b9d' : '#5865f2';
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = borderColor;
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(40, 40, 1120, 620, 30);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // ===== АВАТАР С НЕОНОВЫМ СВЕЧЕНИЕМ =====
  try {
    const avatar = await loadImage(user.displayAvatarURL({ extension: 'png', size: 512 }));
    
    ctx.shadowColor = stats.partner ? '#ff6b9d' : '#5865f2';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(160, 190, 110, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 50, 80, 220, 220);
    ctx.restore();
    
    ctx.shadowBlur = 0;
    
    // Двойная обводка аватара
    ctx.beginPath();
    ctx.arc(160, 190, 112, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 4;
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(160, 190, 118, 0, Math.PI * 2);
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.stroke();
  } catch (e) {}

  // ===== ИМЯ С ГРАДИЕНТОМ =====
  const nameGrad = ctx.createLinearGradient(320, 120, 600, 120);
  nameGrad.addColorStop(0, '#ffffff');
  nameGrad.addColorStop(1, '#b9bbbe');
  ctx.fillStyle = nameGrad;
  ctx.font = 'bold 44px Segoe UI, sans-serif';
  ctx.fillText(user.globalName || user.username, 320, 140);

  // ===== ТЕГ =====
  ctx.fillStyle = '#72767d';
  ctx.font = '22px Segoe UI, sans-serif';
  ctx.fillText(`@${user.username}`, 320, 180);

  // ===== СТАТУС С АНИМАЦИЕЙ =====
  const status = member.presence?.status || 'offline';
  const statusColors = { 
    online: '#43b581', 
    idle: '#faa61a', 
    dnd: '#f04747', 
    offline: '#747f8d' 
  };
  const statusTexts = {
    online: '🟢 В сети',
    idle: '🟡 Не активен',
    dnd: '🔴 Не беспокоить',
    offline: '⚫ Не в сети'
  };
  
  ctx.fillStyle = statusColors[status] || '#747f8d';
  ctx.font = '18px Segoe UI, sans-serif';
  ctx.fillText(statusTexts[status] || 'Не в сети', 320, 225);

  // ===== СТАТУС ОТНОШЕНИЙ =====
  if (stats.partner) {
    ctx.fillStyle = '#ff6b9d';
    ctx.font = '18px Segoe UI, sans-serif';
    ctx.fillText(`${EMOJIS.marriage} В отношениях`, 500, 225);
  }

  // ===== УРОВЕНЬ С КРУГОВЫМ ПРОГРЕССОМ =====
  const centerX = 320;
  const centerY = 350;
  const radius = 80;
  
  // Фон круга
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Прогресс
  const progress = Math.min(stats.xp / stats.xpToNext, 1);
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * progress);
  
  const grad2 = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY);
  grad2.addColorStop(0, '#5865f2');
  grad2.addColorStop(1, '#ffd700');
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.strokeStyle = grad2;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Уровень внутри круга
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px Segoe UI, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${stats.level}`, centerX, centerY - 10);
  
  ctx.fillStyle = '#72767d';
  ctx.font = '14px Segoe UI, sans-serif';
  ctx.fillText('УРОВЕНЬ', centerX, centerY + 35);

  // XP текст
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#b9bbbe';
  ctx.font = '14px Segoe UI, sans-serif';
  ctx.fillText(`${stats.xp} / ${stats.xpToNext} XP`, 420, 365);

  // ===== СТАТИСТИКА В ВИДЕ КАРТОЧЕК =====
  const statsData = [
    { icon: EMOJIS.heart, value: stats.reputation, label: 'РЕПУТАЦИЯ', color: '#ff6b9d' },
    { icon: EMOJIS.money, value: stats.balance, label: 'БАЛАНС', color: '#43b581' },
    { icon: EMOJIS.voice, value: `${Math.floor(stats.voiceTime / 60)}ч ${stats.voiceTime % 60}м`, label: 'ГОЛОС', color: '#faa61a' },
    { icon: EMOJIS.message, value: stats.messages, label: 'СООБЩЕНИЙ', color: '#9b59b6' }
  ];

  let x = 520;
  let y = 280;
  
  statsData.forEach((stat, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const posX = x + (col * 280);
    const posY = y + (row * 100);
    
    // Фон карточки
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(posX, posY, 250, 80, 12);
    ctx.fill();
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(posX, posY, 250, 80, 12);
    ctx.stroke();
    
    // Иконка и значение
    ctx.fillStyle = stat.color;
    ctx.font = '24px Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(stat.icon, posX + 20, posY + 30);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Segoe UI, sans-serif';
    ctx.fillText(stat.value, posX + 60, posY + 30);
    
    ctx.fillStyle = '#72767d';
    ctx.font = '12px Segoe UI, sans-serif';
    ctx.fillText(stat.label, posX + 60, posY + 55);
  });

  // ===== О СЕБЕ =====
  if (stats.about) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '18px Segoe UI, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(`📝 ${stats.about}`, 320, 520);
  }

  // ===== ФУТЕР =====
  ctx.fillStyle = '#4f545c';
  ctx.font = '14px Segoe UI, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(`Присоединился: ${member.joinedAt ? member.joinedAt.toLocaleDateString('ru-RU') : 'Неизвестно'}`, 320, 580);
  
  ctx.textAlign = 'right';
  ctx.fillText(`ID: ${user.id}`, 1120, 630);

  return canvas.toBuffer();
                 }
