import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('💰 Баланс')
  .addUserOption(o => o.setName('user').setDescription('Пользователь').setRequired(false));

export async function execute(interaction) {
  const user = interaction.options.getUser('user') || interaction.user;
  
  let data = await User.findOne({ userId: user.id, guildId: interaction.guildId });
  if (!data) {
    data = new User({ userId: user.id, guildId: interaction.guildId });
    await data.save();
  }
  
  const embed = new EmbedBuilder()
    .setColor('#5865f2')
    .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() })
    .setDescription(`💰 **Баланс:** ${data.balance || 0} монет\n🏦 **Банк:** ${data.bank || 0} монет\n❤️ **Репутация:** ${data.reputation || 0}`)
    .setFooter({ text: `ID: ${user.id}` });
  
  await interaction.reply({ embeds: [embed] });
}
