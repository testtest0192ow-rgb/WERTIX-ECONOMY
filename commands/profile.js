// commands/profile.js
import { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import User from '../models/User.js';
import { createProfileCard } from '../utils/profileCard.js';

const EMOJIS = {
  heart: '<:emoji_6:1529430913396506705>'
};

export const data = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('📋 Показать профиль пользователя')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Выберите пользователя')
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    let userData = await User.findOne({ userId: user.id, guildId: interaction.guildId });
    if (!userData) {
      userData = new User({ userId: user.id, guildId: interaction.guildId });
      await userData.save();
    }

    const stats = {
      level: userData.level || 0,
      xp: userData.xp || 0,
      xpToNext: (userData.level || 0) * 100 + 100,
      balance: userData.balance || 0,
      bank: userData.bank || 0,
      reputation: userData.reputation || 0,
      voiceTime: userData.voiceTime || 0,
      top: userData.topPosition || 0,
      bg: userData.background || 'default',
      about: userData.about || '',
      partner: userData.partnerId || null,
      messages: userData.messages || 0
    };

    const buffer = await createProfileCard(user, member, stats);
    const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`love_profile_${user.id}`)
          .setLabel('Любовный профиль')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji(EMOJIS.heart)
      );

    await interaction.reply({
      files: [attachment],
      components: [row],
      content: `📋 **Профиль ${user.displayName}**`
    });
  } catch (error) {
    console.error('❌ Ошибка в profile.js:', error);
    await interaction.reply({
      content: '❌ Произошла ошибка при создании профиля',
      ephemeral: true
    });
  }
}
