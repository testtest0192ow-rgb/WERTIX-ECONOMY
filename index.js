// index.js - обработчик кнопок (только нужная часть)

client.on('interactionCreate', async interaction => {
  if (interaction.isChatInputCommand()) {
    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) return;
    try {
      await cmd.execute(interaction);
    } catch (e) {
      console.error(e);
      await interaction.reply({ content: '❌ Ошибка', flags: 64 });
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId.startsWith('love_')) {
      const userId = interaction.customId.replace('love_', '');
      const user = await client.users.fetch(userId);
      const { createLoveCard } = await import('./utils/loveCard.js');
      const User = (await import('./models/User.js')).default;
      
      let data = await User.findOne({ userId: user.id, guildId: interaction.guildId });
      if (!data) {
        data = new User({ userId: user.id, guildId: interaction.guildId });
        await data.save();
      }
      
      if (!data.partnerId) {
        return interaction.reply({ content: `❤️ У ${user.displayName} нет пары`, flags: 64 });
      }
      
      const partner = await client.users.fetch(data.partnerId);
      const buffer = await createLoveCard(user, partner, {
        loveLevel: data.loveLevel || 0,
        loveXp: data.loveXp || 0,
        voiceTime: data.voiceTime || 0,
        marriedAt: data.marriedAt,
        messages: data.messages || 0
      });
      
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`back_${user.id}`)
          .setLabel('Обычный профиль')  // ← БЕЗ ЭМОДЗИ
          .setStyle(ButtonStyle.Secondary)
      );
      
      await interaction.reply({
        files: [new AttachmentBuilder(buffer, { name: 'love.png' })],
        components: [row],
        content: `**${user.displayName}** ❤️ **${partner.displayName}**`
      });
    }
    
    if (interaction.customId.startsWith('back_')) {
      const userId = interaction.customId.replace('back_', '');
      const user = await client.users.fetch(userId);
      const profile = await import('./commands/profile.js');
      await profile.execute({
        ...interaction,
        options: { getUser: () => user }
      });
    }
  }
});
