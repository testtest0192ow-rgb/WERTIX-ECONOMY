const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Перевести деньги другому пользователю')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Кому перевести')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сколько перевести')
                .setRequired(true)
        ),

    async execute(interaction) {
        const target = interaction.options.getUser('user');
        const amount = interaction.options.getInteger('amount');

        // ❌ нельзя самому себе
        if (target.id === interaction.user.id) {
            return interaction.reply({
                content: `${emojis.error} Нельзя переводить самому себе`,
                ephemeral: true
            });
        }

        // ❌ сумма
        if (amount <= 0) {
            return interaction.reply({
                content: `${emojis.error} Укажи норм сумму`,
                ephemeral: true
            });
        }

        // 👤 отправитель
        let sender = await User.findOne({ userId: interaction.user.id });
        if (!sender) sender = await User.create({ userId: interaction.user.id });

        // 👤 получатель
        let receiver = await User.findOne({ userId: target.id });
        if (!receiver) receiver = await User.create({ userId: target.id });

        // ❌ проверка баланса
        if (sender.balance < amount) {
            return interaction.reply({
                content: `${emojis.error} Недостаточно денег`,
                ephemeral: true
            });
        }

        // 💰 перевод
        sender.balance -= amount;
        receiver.balance += amount;

        await sender.save();
        await receiver.save();

        // 📊 embed
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(`${emojis.money} Перевод`)
            .setDescription(
                `${emojis.success} Ты перевёл **${amount}** ${emojis.money}\n\n` +
                `👤 Получатель: ${target}\n` +
                `${emojis.wallet} Твой баланс: **${sender.balance}**`
            )
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
};
