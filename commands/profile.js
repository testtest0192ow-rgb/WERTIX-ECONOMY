import { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import User from '../models/User.js';
import { createProfileCard } from '../utils/profileCard.js';

export const data = new SlashCommandBuilder()
  .setName('profile')
  .setDescription('Показать профиль')
  .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(false));

export async function execute(interaction) {
  const user = interaction.options.getUser('user') || interaction.user;
  const member = await interaction.guild.members.fetch(user.id);
  
  let data = await User.findOne({ userId: user.id, guildId: interaction.guildId });
  if (!data) {
    data = new User({ userId: user.id, guildId: interaction.guildId });
    await data.save();
  }
  
  const stats = {
    level: data.level || 0,
    xp: data.xp || 0,
    xpToNext: (data.level + 1) * 100,
    balance: data.balance || 0,
    bank: data.bank || 0,
    reputation: data.reputation || 0,
    voiceTime: data.voiceTime || 0,
    messages: data.messages || 0,
    partner: data.partnerId,
    about: data.about || ''
  };
  
  const buffer = await createProfileCard(user, member, stats);
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`love_${user.id}`).setLabel('Любовный профиль').setStyle(ButtonStyle.Secondary)
  );
  
  await interaction.reply({
    files: [new AttachmentBuilder(buffer, { name: 'profile.png' })],
    components: [row],
    content: `**Профиль ${user.displayName}**`
  });
}
