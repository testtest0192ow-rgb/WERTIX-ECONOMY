// В index.js замени обработчик кнопок на этот:

if (interaction.isButton()) {
  if (interaction.customId.startsWith('love_')) {
    try {
      const userId = interaction.customId.replace('love_', '');
      const user = await client.users.fetch(userId);
      const { createLoveCard } = await import('./utils/loveCard.js');
      const User = (await import('./models/User.js')).default;
      
      let data = await User.findOneAndUpdate(
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
          .setLabel('Обычный профиль')
          .setStyle(ButtonStyle.Secondary)
      );
      
      await interaction.reply({
        files: [new AttachmentBuilder(buffer, { name: 'love.png' })],
        components: [row],
        content: `**${user.displayName}** ❤️ **${partner.displayName}**`
      });
    } catch (error) {
      console.error('❌ Ошибка love_profile:', error);
      await interaction.reply({
        content: '❌ Ошибка при открытии любовного профиля',
        flags: 64
      });
    }
  }
  
  if (interaction.customId.startsWith('back_')) {
    try {
      const userId = interaction.customId.replace('back_', '');
      const user = await client.users.fetch(userId);
      const profileCommand = await import('./commands/profile.js');
      if (profileCommand?.execute) {
        const fakeInteraction = {
          ...interaction,
          options: {
            getUser: () => user,
            get: () => null
          }
        };
        await profileCommand.execute(fakeInteraction);
      }
    } catch (error) {
      console.error('❌ Ошибка back_to_profile:', error);
      await interaction.reply({
        content: '❌ Ошибка при возврате в профиль',
        flags: 64
      });
    }
  }
}
