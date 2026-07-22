const { createCanvas, loadImage } = require("canvas");

async function createProfileCard(user, data) {

    const width = 1200;
    const height = 500;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");


    // Фон карточки
    const gradient = ctx.createLinearGradient(0, 0, width, height);

    gradient.addColorStop(0, "#111111");
    gradient.addColorStop(1, "#2b2b2b");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);



    // Правая панель
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.roundRect(300, 50, 850, 400, 30);
    ctx.fill();



    // Аватар пользователя

    const avatar = await loadImage(
        user.displayAvatarURL({
            extension: "png",
            size: 512
        })
    );


    // Круглый аватар

    ctx.save();

    ctx.beginPath();
    ctx.arc(
        170,
        250,
        120,
        0,
        Math.PI * 2
    );

    ctx.closePath();
    ctx.clip();


    ctx.drawImage(
        avatar,
        50,
        130,
        240,
        240
    );


    ctx.restore();



    // Рамка вокруг аватара

    ctx.beginPath();

    ctx.arc(
        170,
        250,
        125,
        0,
        Math.PI * 2
    );


    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 8;
    ctx.stroke();



    // Ник

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 55px Arial";

    ctx.fillText(
        user.username,
        360,
        130
    );



    // Статистика

    ctx.font = "35px Arial";


    ctx.fillStyle = "#FFD700";
    ctx.fillText(
        `🪙 Монеты: ${(data.coins || 0).toLocaleString()}`,
        360,
        210
    );


    ctx.fillStyle = "#ff5722";
    ctx.fillText(
        `🔥 Стрик: ${data.streak || 0} дней`,
        360,
        270
    );


    ctx.fillStyle = "#4fc3f7";
    ctx.fillText(
        `💬 Сообщения: ${(data.messages || 0).toLocaleString()}`,
        360,
        330
    );


    ctx.fillStyle = "#b388ff";
    ctx.fillText(
        `🎧 ГС: ${data.voiceTime || 0} минут`,
        360,
        390
    );



    // Уровень

    const level = Math.floor((data.messages || 0) / 100) + 1;


    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 30px Arial";

    ctx.fillText(
        `⭐ Уровень ${level}`,
        850,
        390
    );



    // Нижняя подпись

    ctx.font = "25px Arial";
    ctx.fillStyle = "rgba(255,255,255,0.5)";

    ctx.fillText(
        "Профиль игрока",
        360,
        440
    );



    return canvas.toBuffer();

}


module.exports = createProfileCard;
