const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const mongoose = require("mongoose");
const express = require("express");

// ====== EXPRESS (ОБЯЗАТЕЛЬНО ДЛЯ RENDER) ======
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

// ====== MONGODB ======
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
client.once("ready", () => {
  console.log(`Запущен как ${client.user.tag}`);
});

// ====== КОМАНДЫ ======
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const args = message.content.split(" ");
  const cmd = args[0].toLowerCase();

  // ====== БАЛАНС ======
  if (cmd === "!balance") {
    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = new User({ userId: message.author.id });
      await user.save();
    }

    const embed = new EmbedBuilder()
      .setTitle("💰 Баланс")
      .setDescription(`У тебя: **${user.balance}** монет`)
      .setColor("Green");

    return message.reply({ embeds: [embed] });
  }

  // ====== ДОБАВИТЬ (ТЕСТ) ======
  if (cmd === "!add") {
    const amount = parseInt(args[1]);
    if (!amount) return message.reply("Укажи сумму");

    let user = await User.findOne({ userId: message.author.id });

    if (!user) {
      user = new User({ userId: message.author.id });
    }

    user.balance += amount;
    await user.save();

    return message.reply(`Добавлено ${amount}`);
  }

  // ====== ПЕРЕВОД ======
  if (cmd === "!transfer") {
    const target = message.mentions.users.first();
    const amount = parseInt(args[2]);

    if (!target) return message.reply("Укажи пользователя");
    if (!amount || amount <= 0) return message.reply("Укажи сумму");

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

    const embed = new EmbedBuilder()
      .setTitle("💸 Перевод")
      .setDescription(`${message.author} перевёл ${target} **${amount}** монет`)
      .setColor("Blue");

    return message.reply({ embeds: [embed] });
  }

  // ====== ТОП ======
  if (cmd === "!top") {
    const users = await User.find().sort({ balance: -1 }).limit(10);

    let text = users
      .map((u, i) => `**${i + 1}.** <@${u.userId}> — ${u.balance}`)
      .join("\n");

    const embed = new EmbedBuilder()
      .setTitle("🏆 Топ игроков")
      .setDescription(text || "Пусто")
      .setColor("Gold");

    return message.reply({ embeds: [embed] });
  }
});

// ====== LOGIN ======
client.login(process.env.TOKEN);
