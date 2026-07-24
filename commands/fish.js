const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');

const fishes = [
    { name: 'Карась', min: 50, max: 200 },
    { name: 'Карп', min: 100, max: 400 },
    { name: 'Лосось', min: 200, max: 600 },
    { name: 'Форель', min: 300, max: 800 },
    { name: 'Золотая рыбка', min: 500, max: 2000 },
    { name: 'Акула', min: 1000, max: 5000 },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fish')
        .setDescription('Рыбалка'),
    
    async execute(interaction) {
        let user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!user) user = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });
        
        const now = new Date();
        if (user.lastFish) {
            const diff = now - user.lastFish;
            const minLeft = 30 - Math.floor(diff / 60000);
            if (minLeft > 0) {
                return interaction.reply({ content: `❌ Жди **${minLeft}** мин`, flags: 64 });
            }
        }
        
        const fish = fishes[Math.floor(Math.random() * fishes.length)];
        const reward = Math.floor(Math.random() * (fish.max - fish.min + 1)) + fish.min;
        
        user.wallet += reward;
        user.lastFish = now;
        user.xp += 15;
        
        const newLevel = Math.floor(user.xp / 1000) + 1;
        if (newLevel > user.level) user.level = newLevel;
        
        await user.save();
        
        const embed = new EmbedBuilder()
            .setColor('#64C8FF')
            .setDescription(`🎣 **${fish.name}**: **+${reward.toLocaleString()}**`);
        
        await interaction.reply({ embeds: [embed] });
    },
};
