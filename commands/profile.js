import { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import User from '../models/User.js';
import { createProfileCard } from '../utils/profileCard.js';

export const data = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('Показать профиль пользователя')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Выберите пользователя')
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    let userData = await User.findOneAndUpdate(
      { userId: user.id, guildId: interaction.guildId },
      { 
        $setOnInsert: { 
          userId: user.id, 
          guildId: interaction.guildId,
          balance: 0,
          bank: 0,
          level: 0,
          xp: 0,
          reputation: 0,
          voiceTime: 0,
          messages: 0,
          loveLevel: 0,
          loveXp: 0
        } 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const stats = {
      level: userData.level || 0,
      xp: userData.xp || 0,
      xpToNext: (userData.level + 1) * 100,
      balance: userData.balance || 0,
      bank: userData.bank || 0,
      reputation: userData.reputation || 0,
      voiceTime: userData.voiceTime || 0,
      messages: userData.messages || 0,
      partner: userData.partnerId,
      about: userData.about || ''
    };

    const buffer = await createProfileCard(user, member, stats);
    const attachment = new AttachmentBuilder(buffer, { name: 'profile.png' });

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`love_${user.id}`)
          .setLabel('Любовный профиль')
          .setStyle(ButtonStyle.Secondary)
      );

    await interaction.reply({
      files: [attachment],
      components: [row],
      content: `**Профиль ${user.displayName}**`
    });
  } catch (error) {
    console.error('❌ Ошибка в profile.js:', error);
    await interaction.reply({
      content: '❌ Ошибка при создании профиля',
      flags: 64
    });
  }
}
