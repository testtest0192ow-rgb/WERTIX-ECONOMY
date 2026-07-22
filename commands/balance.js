import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../models/User.js';

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('Показать баланс пользователя')
  .addUserOption(option =>
    option.setName('user')
      .setDescription('Выберите пользователя')
      .setRequired(false)
  );

export async function execute(interaction) {
  try {
    const user = interaction.options.getUser('user') || interaction.user;
    
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

    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setAuthor({ name: user.displayName, iconURL: user.displayAvatarURL() })
      .setDescription(`💰 **Баланс:** ${userData.balance || 0} монет\n🏦 **Банк:** ${userData.bank || 0} монет\n❤️ **Репутация:** ${userData.reputation || 0}`)
      .setFooter({ text: `ID: ${user.id}` });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('❌ Ошибка в balance.js:', error);
    await interaction.reply({
      content: '❌ Ошибка при получении баланса',
      flags: 64
    });
  }
}
