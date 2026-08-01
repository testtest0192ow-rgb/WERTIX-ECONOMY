const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const express = require("express");

// ====== EXPRESS (ДЛЯ RENDER) ======
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Web server started on port ${PORT}`);
});

// ====== DISCORD CLIENT ======
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ====== MONGO ======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB OK"))
  .catch(err => console.log("Mongo error:", err));

// ====== СХЕМА ======
const userSchema = new mongoose.Schema({
  userId: String,
  balance: { type: Number, default: 0 }
});

const User = mongoose.model("User", userSchema);

// ====== READY ======
client.once("clientReady", () => {
  console.log(`Запущен как ${client.user.tag}`);
});

// ====== КОМАНДЫ ======
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/ +/);
  const cmd = args[0].toLowerCase();

  // ====== BALANCE ======
  if (cmd === "!balance") {
    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = new User({ userId: message.author.id });
      await user.save();
    }

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("💰 Баланс")
          .setDescription(`У тебя: **${user.balance}** монет`)
          .setColor("Green")
      ]
    });
  }

  // ====== ADD (ТЕСТ) ======
  if (cmd === "!add") {
    const amount = parseInt(args[1]);
    if (isNaN(amount)) return message.reply("Укажи норм число");

    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = new User({ userId: message.author.id });
    }

    user.balance += amount;
    await user.save();

    return message.reply(`Добавлено ${amount}`);
  }

  // ====== TRANSFER ======
  if (cmd === "!transfer") {
    const target = message.mentions.users.first();
    const amount = parseInt(args[2]);

    if (!target) return message.reply("Отметь пользователя");
    if (isNaN(amount) || amount <= 0) return message.reply("Норм сумму");

    let sender = await User.findOne({ userId: message.author.id });
    let receiver = await User.findOne({ userId: target.id });

    if (!sender || sender.balance < amount)
      return message.reply("Недостаточно денег");

    if (!receiver) {
      receiver = new User({ userId: target.id });
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("💸 Перевод")
          .setDescription(`${message.author} → ${target} : **${amount}**`)
          .setColor("Blue")
      ]
    });
  }

  // ====== TOP ======
  if (cmd === "!top") {
    const users = await User.find().sort({ balance: -1 }).limit(10);

    let text = users
      .map((u, i) => `**${i + 1}.** <@${u.userId}> — ${u.balance}`)
      .join("\n");

    return message.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("🏆 Топ")
          .setDescription(text || "Пусто")
          .setColor("Gold")
      ]
    });
  }

  // ====== WORK ======
  if (cmd === "!work") {
    const amount = Math.floor(Math.random() * 100) + 50;

    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = new User({ userId: message.author.id });
    }

    user.balance += amount;
    await user.save();

    return message.reply(`💼 Ты заработал ${amount} монет`);
  }
});

// ====== ERROR HANDLING ======
process.on("unhandledRejection", console.error);

// ====== LOGIN ======
client.login(process.env.TOKEN);
