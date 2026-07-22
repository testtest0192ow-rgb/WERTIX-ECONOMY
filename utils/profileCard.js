const { createCanvas, loadImage } = require("canvas");

const EMOJIS = {

    money: "https://cdn.discordapp.com/emojis/1529426390267723796.png",

    timely: "https://cdn.discordapp.com/emojis/1529431365592809614.png",

    marriage: "https://cdn.discordapp.com/emojis/1529430666792669214.png",

    voice: "https://cdn.discordapp.com/emojis/1529430705304768672.png",

    level: "https://cdn.discordapp.com/emojis/1529430822820778095.png",

    love: "https://cdn.discordapp.com/emojis/1529430913396506705.png"

};



function roundRect(ctx, x, y, width, height, radius) {

    ctx.beginPath();

    ctx.moveTo(x + radius, y);

    ctx.lineTo(x + width - radius, y);

    ctx.quadraticCurveTo(
        x + width,
        y,
        x + width,
        y + radius
    );

    ctx.lineTo(
        x + width,
        y + height - radius
    );

    ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width - radius,
        y + height
    );

    ctx.lineTo(
        x + radius,
        y + height
    );

    ctx.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - radius
    );

    ctx.lineTo(
        x,
        y + radius
    );

    ctx.quadraticCurveTo(
        x,
        y,
        x + radius,
        y
    );

    ctx.closePath();

}



async function drawEmoji(ctx, url, x, y, size) {

    const img = await loadImage(url);

    ctx.drawImage(
        img,
        x,
        y,
        size,
        size
    );

}



async function createProfileCard(userData) {


    const canvas = createCanvas(1000, 600);

    const ctx = canvas.getContext("2d");



    // фон

    const gradient = ctx.createLinearGradient(
        0,
        0,
        1000,
        600
    );


    gradient.addColorStop(
        0,
        "#111827"
    );


    gradient.addColorStop(
        1,
        "#020617"
    );


    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        1000,
        600
    );



    // главная карточка

    ctx.fillStyle = "rgba(255,255,255,0.05)";


    roundRect(
        ctx,
        40,
        40,
        920,
        520,
        35
    );


    ctx.fill();



    // аватар


    const avatar = await loadImage(
        userData.avatar
    );


    ctx.save();


    ctx.beginPath();

    ctx.arc(
        150,
        150,
        80,
        0,
        Math.PI * 2
    );


    ctx.clip();


    ctx.drawImage(
        avatar,
        70,
        70,
        160,
        160
    );


    ctx.restore();



    // ник

    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 40px Arial";


    ctx.fillText(
        userData.username,
        280,
        120
    );


    ctx.font = "22px Arial";

    ctx.fillStyle = "#aaaaaa";


    ctx.fillText(
        `Участник с ${userData.joinDate}`,
        280,
        160
    );



    const rows = [

        {
            emoji: EMOJIS.money,
            title: "Баланс",
            value: userData.balance
        },

        {
            emoji: EMOJIS.timely,
            title: "Timely",
            value: `${userData.timely} дней`
        },

        {
            emoji: EMOJIS.marriage,
            title: "Брак",
            value: userData.marriage
        },

        {
            emoji: EMOJIS.voice,
            title: "Голос",
            value: userData.voice
        },

        {
            emoji: EMOJIS.level,
            title: "Уровень",
            value: `${userData.level} | XP ${userData.xp}/${userData.maxXp}`
        }

    ];



    let y = 260;



    for (const row of rows) {


        await drawEmoji(
            ctx,
            row.emoji,
            90,
            y - 25,
            35
        );



        ctx.fillStyle = "#ffffff";

        ctx.font = "bold 24px Arial";


        ctx.fillText(
            row.title,
            150,
            y
        );



        ctx.fillStyle = "#bbbbbb";

        ctx.font = "22px Arial";


        ctx.fillText(
            row.value,
            400,
            y
        );



        y += 55;

    }



    // сообщения

    ctx.fillStyle = "#ffffff";

    ctx.font = "bold 24px Arial";


    ctx.fillText(
        "💬 Сообщения",
        90,
        535
    );


    ctx.fillStyle = "#bbbbbb";


    ctx.fillText(
        userData.messages,
        400,
        535
    );



    return canvas.toBuffer();

}



module.exports = createProfileCard;
