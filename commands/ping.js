import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('Проверка работы бота');

export async function execute(interaction) {
  await interaction.reply({
    content: '🏓 Понг! Бот работает!',
    flags: 64
  });
}
