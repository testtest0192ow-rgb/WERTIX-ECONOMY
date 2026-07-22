import { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import User from '../models/User.js';
import { createLoveCard } from '../utils/loveCard.js';

export const data = new SlashCommandBuilder()
  .setName('love')
  .setDescription('❤️ Любовный профиль')
  .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(false));

export async function execute(interaction) {
  const user = interaction.options.getUser('user') || interaction.user;
  
  let data = await User.findOne({ userId: user.id, guildId: interaction.guildId });
  if (!data) {
    data = new User({ userId: user.id, guildId: interaction.guildId });
    await data.save();
  }
  
  if (!data.partnerId) {
    return interaction.reply({ content: `❤️ У ${user.displayName} нет пары`, flags: 64 });
  }
  
  const partner = await interaction.client.users.fetch(data.partnerId);
  const buffer = await createLoveCard(user, partner, {
    loveLevel: data.loveLevel || 0,
    loveXp: data.loveXp || 0,
    voiceTime: data.voiceTime || 0,
    marriedAt: data.marriedAt,
    messages: data.messages || 0
  });
  
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`back_${user.id}`).setLabel('Обычный профиль').setStyle(ButtonStyle.Secondary)
  );
  
  await interaction.reply({
    files: [new AttachmentBuilder(buffer, { name: 'love.png' })],
    components: [row],
    content: `**${user.displayName}** ❤️ **${partner.displayName}**`
  });
}
