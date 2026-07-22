import { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import User from '../models/User.js';
import { createLoveCard } from '../utils/loveCard.js';

export const data = new SlashCommandBuilder()
  .setName('love')
  .setDescription('Показать любовный профиль пользователя')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Выберите пользователя')
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const user = interaction.options.getUser('user') || interaction.user;

    let userData = await User.findOne({ userId: user.id, guildId: interaction.guildId });
    if (!userData) {
      userData = new User({ userId: user.id, guildId: interaction.guildId });
      await userData.save();
    }

    if (!userData.partnerId) {
      return await interaction.reply({
        content: `❤️ У **${user.displayName}** пока нет второй половинки! 💔`,
        flags: 64
      });
    }

    const partner = await interaction.client.users.fetch(userData.partnerId);
    const partnerData = await User.findOne({
      userId: userData.partnerId,
      guildId: interaction.guildId
    });

    if (!partnerData) {
      return await interaction.reply({
        content: '❌ Данные партнёра не найдены',
        flags: 64
      });
    }

    const stats = {
      loveLevel: userData.loveLevel || 0,
      loveXp: userData.loveXp || 0,
      voiceTime: userData.voiceTime || 0,
      marriedAt: userData.marriedAt || null,
      messages: userData.messages || 0
    };

    const buffer = await createLoveCard(user, partner, stats);
    const attachment = new AttachmentBuilder(buffer, { name: 'love_profile.png' });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`back_${user.id}`)
          .setLabel('Обычный профиль')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({
      files: [attachment],
      components: [row],
      content: `**${user.displayName}** ❤️ **${partner.displayName}**`
    });
  } catch (error) {
    console.error('❌ Ошибка в love.js:', error);
    await interaction.reply({
      content: '❌ Ошибка при создании любовного профиля',
      flags: 64
    });
  }
}
