const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
const User = require('../models/User');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Баланс')
        .addUserOption(o => o.setName('user').setDescription('Игрок').setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();
        const target = interaction.options.getUser('user') || interaction.user;
        let user = await User.findOne({ userId: target.id, guildId: interaction.guild.id });
        if (!user) user = await User.create({ userId: target.id, guildId: interaction.guild.id });

        const W = 700, H = 340;
        const canvas = createCanvas(W, H);
        const ctx = canvas.getContext('2d');

        // Фон
        ctx.fillStyle = '#0d0d1a';
        ctx.fillRect(0, 0, W, H);

        // Карточка
        ctx.fillStyle = '#151528';
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.roundRect(15, 15, 670, 310, 20); ctx.fill(); ctx.stroke();

        // Аватарка
        const av = await loadImage(target.displayAvatarURL({ format: 'png', size: 128 }));
        ctx.save(); ctx.beginPath(); ctx.arc(80, 80, 45, 0, Math.PI*2); ctx.clip();
        ctx.drawImage(av, 35, 35, 90, 90); ctx.restore();
        ctx.beginPath(); ctx.arc(80, 80, 47, 0, Math.PI*2);
        ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2; ctx.stroke();

        // Имя
        ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 24px Arial'; ctx.fillText(target.username, 145, 70);
        ctx.fillStyle = '#888'; ctx.font = '14px Arial'; ctx.fillText(`@${target.username}`, 145, 95);

        let y = 145;
        const drawSection = (title) => {
            ctx.fillStyle = '#FFD700'; ctx.font = 'bold 14px Arial'; ctx.fillText(title, 30, y);
            ctx.strokeStyle = '#333'; ctx.beginPath(); ctx.moveTo(30, y+5); ctx.lineTo(670, y+5); ctx.stroke();
            y += 25;
        };
        const drawLine = (label, value) => {
            ctx.fillStyle = '#AAA'; ctx.font = '13px Arial'; ctx.fillText(label, 40, y);
            ctx.fillStyle = '#FFF'; ctx.font = 'bold 13px Arial'; ctx.fillText(value, 250, y);
            y += 22;
        };

        drawSection('📊 ИНФОРМАЦИЯ');
        drawLine('⭐ Уровень:', `${user.level}`);
        drawLine('✨ Опыт:', `${user.xp % 1000} / 1000`);
        drawLine('🔥 Серия:', `${user.dailyStreak} дн.`);
        y += 3;

        drawSection('💰 ФИНАНСЫ');
        drawLine('💳 Кошелёк:', `${user.wallet.toLocaleString()} коинов`);
        drawLine('🏦 Банк:', `${user.bank.toLocaleString()} коинов`);
        drawLine('💎 Всего:', `${(user.wallet + user.bank).toLocaleString()} коинов`);

        const buf = canvas.toBuffer('image/png');
        await interaction.editReply({ files: [new AttachmentBuilder(buf, 'balance.png')] });
    }
};
