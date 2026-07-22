const { createCanvas, loadImage } = require("canvas");

const emojis = require("./emojis");

async function createProfileCard(data) {

    const canvas = createCanvas(900, 240);
    const ctx = canvas.getContext("2d");


    // фон
    ctx.fillStyle = "#161616";
    ctx.beginPath();
    ctx.roundRect(0, 0, 900, 240, 25);
    ctx.fill();


    // аватар
    const avatar = await loadImage(data.avatar);

    ctx.save();
    ctx.beginPath();
    ctx.arc(80, 80, 45, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(
        avatar,
        35,
        35,
        90,
        90
    );
    ctx.restore();


    // ник
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 28px Arial";
    ctx.fillText(
        data.username,
        150,
        70
    );


    // дата
    ctx.fillStyle = "#aaaaaa";
    ctx.font = "16px Arial";
    ctx.fillText(
        `Вступил: ${data.joinDate}`,
        150,
        105
    );


    // статы

    ctx.fillStyle = "#ffffff";
    ctx.font = "20px Arial";


    ctx.fillText(
        `${emojis.coin} ${data.balance}`,
        50,
        170
    );


    ctx.fillText(
        `${emojis.fire} ${data.streak} дней`,
        300,
        170
    );


    ctx.fillText(
        `${emojis.marriage} ${data.marriage}`,
        600,
        170
    );


    ctx.fillText(
        `${emojis.voice} ${data.voice}ч`,
        50,
        210
    );


    ctx.fillText(
        `${emojis.level} ${data.level}`,
        300,
        210
    );


    return canvas.toBuffer();
}


module.exports = createProfileCard;
