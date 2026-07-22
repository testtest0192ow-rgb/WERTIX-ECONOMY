// commands/love.js
import { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import User from '../models/User.js';
import { createLoveCard } from '../utils/loveCard.js';

const EMOJIS = {
  heart: '<:emoji_6:1529430913396506705>',
  marriage: '<:emoji_2:1529430666792669214>'
};

export const data = new SlashCommandBuilder()
  .setName('love')
  .setDescription('❤️ Показать любовный профиль')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Выберите пользователя')
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    let user = interaction.options?.getUser('user');
    
    if (!user && interaction.customId?.startsWith('love_profile_')) {
      const userId = interaction.customId.replace('love_profile_', '');
      user = await interaction.client.users.fetch(userId);
    }
    
    if (!user) {
      user = interaction.user;
    }

    let userData = await User.findOne({ userId: user.id, guildId: interaction.guildId });
    if (!userData) {
      userData = new User({ userId: user.id, guildId: interaction.guildId });
      await userData.save();
    }

    if (!userData.partnerId) {
      return await interaction.reply({
        content: `${EMOJIS.heart} У **${user.displayName}** пока нет второй половинки! 💔`,
        ephemeral: true
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
        ephemeral: true
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
          .setCustomId(`back_to_profile_${user.id}`)
          .setLabel('Обычный профиль')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('📋')
      );

    await interaction.reply({
      files: [attachment],
      components: [row],
      content: `${EMOJIS.heart} **${user.displayName}** ${EMOJIS.marriage} **${partner.displayName}**`
    });
  } catch (error) {
    console.error('❌ Ошибка в love.js:', error);
    await interaction.reply({
      content: '❌ Произошла ошибка при создании любовного профиля',
      ephemeral: true
    });
  }
}
