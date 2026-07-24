const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

const jobs = ['Программист', 'Таксист', 'Пиццайоло', 'Дизайнер', 'Стример', 'Учитель'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Работать'),
    
    async execute(interaction) {
        let user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!user) user = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });
        
        const now = new Date();
        if (user.lastWork) {
            const diff = now - user.lastWork;
            const minLeft = 60 - Math.floor(diff / 60000);
            if (minLeft > 0) {
                return interaction.reply({ content: `❌ Жди **${minLeft}** мин`, flags: 64 });
            }
        }
        
        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const base = Math.floor(Math.random() * 1000) + 500;
        const bonus = Math.floor(base * (user.level * 0.01));
        const total = base + bonus;
        
        user.wallet += total;
        user.lastWork = now;
        user.xp += 20;
        
        const newLevel = Math.floor(user.xp / 1000) + 1;
        if (newLevel > user.level) user.level = newLevel;
        
        await user.save();
        
        const embed = new EmbedBuilder()
            .setColor('#64C8FF')
            .setDescription(`💼 **${job}**: **+${total.toLocaleString()}**`);
        
        await interaction.reply({ embeds: [embed] });
    },
};
