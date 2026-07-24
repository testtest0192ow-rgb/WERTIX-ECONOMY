const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

const fishes = [
    { name: 'Маленькая рыбка', icon: '🐟', min: 50, max: 150 },
    { name: 'Карп', icon: '🐠', min: 100, max: 300 },
    { name: 'Лосось', icon: '🐟', min: 150, max: 400 },
    { name: 'Форель', icon: '🐠', min: 200, max: 500 },
    { name: 'Золотая рыбка', icon: '✨', min: 500, max: 1500, rare: true },
    { name: 'Акула', icon: '🦈', min: 800, max: 3000, rare: true },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fish')
        .setDescription('🎣 Рыбалка'),
    
    async execute(interaction) {
        let user = await User.findOne({ userId: interaction.user.id, guildId: interaction.guild.id });
        if (!user) {
            user = await User.create({ userId: interaction.user.id, guildId: interaction.guild.id });
        }
        
        const now = new Date();
        if (user.lastFish) {
            const diff = now - user.lastFish;
            const minutesLeft = 30 - Math.floor(diff / 60000);
            if (minutesLeft > 0) {
                return interaction.reply({
                    content: `❌ Рыба не клюёт! Попробуй через **${minutesLeft}** минут`,
                    ephemeral: true
                });
            }
        }
        
        // Шанс редкой рыбы 10%
        const rareRoll = Math.random();
        const fishPool = rareRoll < 0.10 ? fishes.filter(f => f.rare) : fishes.filter(f => !f.rare);
        const fish = fishPool[Math.floor(Math.random() * fishPool.length)];
        
        let earnings = Math.floor(Math.random() * (fish.max - fish.min + 1)) + fish.min;
        
        user.wallet += earnings;
        user.lastFish = now;
        user.totalEarned += earnings;
        user.xp += 15;
        
        const newLevel = Math.floor(user.xp / 1000) + 1;
        let levelUp = false;
        if (newLevel > user.level) {
            user.level = newLevel;
            levelUp = true;
        }
        
        await user.save();
        
        const embed = new EmbedBuilder()
            .setTitle(`${emojis.fish} Рыбалка`)
            .setColor('#64C8FF')
            .setDescription(`Ты поймал: ${fish.icon} **${fish.name}**!`)
            .addFields(
                { name: 'Заработано', value: `\`\`\`${earnings.toLocaleString()} коинов\`\`\``, inline: true },
                { name: 'Кошелёк', value: `\`\`\`${user.wallet.toLocaleString()}\`\`\``, inline: true }
            );
        
        if (fish.rare) {
            embed.setColor('#FFD700');
            embed.setFooter({ text: '🌟 РЕДКАЯ РЫБА!' });
        }
        
        if (levelUp) {
            embed.addFields({ name: '⭐ Уровень повышен!', value: `\`\`\`${user.level}\`\`\``, inline: false });
        }
        
        await interaction.reply({ embeds: [embed] });
    },
};
