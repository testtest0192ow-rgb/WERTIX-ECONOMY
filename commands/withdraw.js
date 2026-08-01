const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const User = require('../models/User');
const emojis = require('../utils/emojis');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('withdraw')
        .setDescription('Снять деньги из банка')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Сколько снять')
                .setRequired(true)
        ),

    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount <= 0) {
            return interaction.reply({
                content: `${emojis.error} Укажи норм сумму`,
                ephemeral: true
            });
        }

        let user = await User.findOne({ userId: interaction.user.id });

        if (!user) {
            return interaction.reply({
                content: `${emojis.error} У тебя нет аккаунта`,
                ephemeral: true
            });
        }

        if (user.bank < amount) {
            return interaction.reply({
                content: `${emojis.error} Недостаточно в банке`,
                ephemeral: true
            });
        }

        user.bank -= amount;
        user.balance += amount;

        await user.save();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setTitle(`${emojis.bank} Снятие`)
            .setDescription(
                `${emojis.money} Ты снял **${amount}** монет\n\n` +
                `${emojis.wallet} Кошелёк: **${user.balance}**\n` +
                `${emojis.bank} Банк: **${user.bank}**`
            )
            .setTimestamp();

        interaction.reply({ embeds: [embed] });
    }
};
