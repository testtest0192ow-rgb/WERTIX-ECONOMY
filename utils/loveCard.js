import { createCanvas, loadImage } from 'canvas';

export async function createLoveCard(user, partner, stats) {
  const canvas = createCanvas(900, 500);
  const ctx = canvas.getContext('2d');

  const grad = ctx.createLinearGradient(0, 0, 900, 500);
  grad.addColorStop(0, '#ff6b9d');
  grad.addColorStop(0.5, '#c44dff');
  grad.addColorStop(1, '#3a1c71');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 900, 500);

  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 3;
  ctx.strokeRect(20, 20, 860, 460);

  ctx.fillStyle = 'rgba(255,255,255,0.05)';
  ctx.font = '250px Sans';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❤️', 450, 250);

  try {
    const av1 = await loadImage(user.displayAvatarURL({ extension: 'png', size: 256 }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(200, 200, 100, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(av1, 100, 100, 200, 200);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(200, 200, 102, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(user.globalName || user.username, 200, 320);
  } catch {}

  try {
    const av2 = await loadImage(partner.displayAvatarURL({ extension: 'png', size: 256 }));
    ctx.save();
    ctx.beginPath();
    ctx.arc(700, 200, 100, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(av2, 600, 100, 200, 200);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(700, 200, 102, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Sans';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(partner.globalName || partner.username, 700, 320);
  } catch {}

  ctx.fillStyle = '#ff0040';
  ctx.font = '60px Sans';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('❤️', 450, 200);

  ctx.fillStyle = '#ffd700';
  ctx.font = 'bold 36px Sans';
  ctx.textBaseline = 'bottom';
  ctx.fillText(`❤️ ${stats.loveLevel || 0}`, 450, 320);

  const progress = Math.min((stats.loveXp || 0) / 1000, 1);
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.fillRect(250, 350, 400, 20);
  const grad2 = ctx.createLinearGradient(250, 0, 650, 0);
  grad2.addColorStop(0, '#ff6b9d');
  grad2.addColorStop(1, '#ffd700');
  ctx.fillStyle = grad2;
  ctx.fillRect(250, 350, 400 * progress, 20);
  ctx.fillStyle = '#fff';
  ctx.font = '14px Sans';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${stats.loveXp || 0} / 1000 XP ❤️`, 450, 360);

  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.font = '16px Sans';
  ctx.textBaseline = 'bottom';
  const h = Math.floor((stats.voiceTime || 0) / 60);
  const m = (stats.voiceTime || 0) % 60;
  ctx.fillText(`🎙 Вместе: ${h}ч ${m}м    💬 Сообщений: ${stats.messages || 0}`, 450, 400);

  if (stats.marriedAt) {
    ctx.fillStyle = '#ffd700';
    ctx.font = '14px Sans';
    ctx.fillText(`💍 Вместе с: ${new Date(stats.marriedAt).toLocaleDateString('ru-RU')}`, 450, 430);
  }

  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '12px Sans';
  ctx.textBaseline = 'bottom';
  ctx.fillText('❤️ Любовный профиль ❤️', 450, 480);

  return canvas.toBuffer();
}
