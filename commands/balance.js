// commands/balance.js
import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import User from '../models/User.js';

const EMOJIS = {
  money: '<:emoji_1:1529426390267723796>',
  heart: '<:emoji_6:1529430913396506705>'
};

export const data = new SlashCommandBuilder()
  .setName('balance')
  .setDescription('💰 Показать баланс пользователя')
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

    const embed = new EmbedBuilder()
      .setColor('#5865f2')
      .setAuthor({ 
        name: `${user.displayName}`, 
        iconURL: user.displayAvatarURL({ dynamic: true }) 
      })
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setDescription(`
        ${EMOJIS.money} **Наличные:** \`${userData.balance || 0}\` монет
        🏦 **В банке:** \`${userData.bank || 0}\` монет
        ${EMOJIS.heart} **Репутация:** \`${userData.reputation || 0}\`
      `)
      .addFields(
        { 
          name: '📊 Общий капитал', 
          value: `\`${(userData.balance || 0) + (userData.bank || 0)}\` монет`, 
          inline: true 
        },
        { 
          name: '🎯 Уровень', 
          value: `\`${userData.level || 0}\``, 
          inline: true 
        }
      )
      .setFooter({ 
        text: `ID: ${user.id} • Запросил ${interaction.user.displayName}`, 
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error('❌ Ошибка в balance.js:', error);
    await interaction.reply({
      content: '❌ Произошла ошибка при получении баланса',
      ephemeral: true
    });
  }
}
