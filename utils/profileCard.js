const { createCanvas, loadImage } = require("canvas");


async function createProfileCard(data) {


    const canvas = createCanvas(900, 330);

    const ctx = canvas.getContext("2d");


    // фон

    ctx.fillStyle = "#1a1a1a";

    ctx.beginPath();

    ctx.roundRect(
        0,
        0,
        900,
        330,
        25
    );

    ctx.fill();



    // аватар

    const avatar = await loadImage(data.avatar);


    ctx.save();

    ctx.beginPath();

    ctx.arc(
        100,
        100,
        60,
        0,
        Math.PI * 2
    );

    ctx.clip();


    ctx.drawImage(
        avatar,
        40,
        40,
        120,
        120
    );


    ctx.restore();



    // ник

    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 32px Arial";

    ctx.fillText(
        data.username,
        190,
        80
    );



    // дата входа

    ctx.fillStyle = "#aaaaaa";

    ctx.font = "18px Arial";


    ctx.fillText(
        `Дата входа: ${data.joinDate}`,
        190,
        115
    );



    // информация


    ctx.fillStyle = "#ffffff";

    ctx.font = "22px Arial";



    ctx.fillText(
        `Баланс: ${data.balance}`,
        60,
        200
    );


    ctx.fillText(
        `Timely: ${data.streak} дней`,
        480,
        200
    );



    ctx.fillText(
        `Брак: ${data.marriage}`,
        60,
        245
    );


    ctx.fillText(
        `Голос: ${data.voice}ч`,
        480,
        245
    );



    ctx.fillText(
        `Сообщения: ${data.messages}`,
        60,
        290
    );


    ctx.fillText(
        `Уровень: ${data.level}`,
        480,
        290
    );



    return canvas.toBuffer();

}



module.exports = createProfileCard;
