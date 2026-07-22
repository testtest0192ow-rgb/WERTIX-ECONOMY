const {
    createCanvas,
    loadImage
} = require("canvas");



async function createLoveCard(data) {


    const canvas = createCanvas(
        1000,
        600
    );


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
        "#ff5fa2"
    );


    gradient.addColorStop(
        1,
        "#5b2cff"
    );


    ctx.fillStyle = gradient;


    ctx.fillRect(
        0,
        0,
        1000,
        600
    );



    // заголовок

    ctx.fillStyle = "#ffffff";


    ctx.font =
        "bold 45px Arial";


    ctx.fillText(
        "💖 ПРОФИЛЬ ЛЮБВИ",
        80,
        90
    );



    // аватар


    const avatar = await loadImage(
        data.avatar
    );


    ctx.save();


    ctx.beginPath();


    ctx.arc(
        180,
        210,
        85,
        0,
        Math.PI * 2
    );


    ctx.clip();



    ctx.drawImage(
        avatar,
        95,
        125,
        170,
        170
    );


    ctx.restore();



    // имя пары


    ctx.font =
        "bold 32px Arial";


    ctx.fillText(
        `${data.username} ❤️ ${data.partner}`,
        320,
        190
    );



    // информация


    const info = [


        `💍 Статус: ${data.status}`,


        `📅 Вместе с: ${data.startDate}`,


        `⏳ Вместе: ${data.days} дней`,


        `⭐ Уровень любви: ${data.loveLevel}`,


        `💞 Опыт любви: ${data.loveXp}`


    ];



    ctx.font =
        "28px Arial";



    let y = 290;



    for (const text of info) {


        ctx.fillText(
            text,
            120,
            y
        );


        y += 45;


    }



    // нижняя часть


    ctx.font =
        "bold 26px Arial";


    ctx.fillText(
        "Берегите свои отношения ❤️",
        120,
        540
    );



    return canvas.toBuffer();

}



module.exports = createLoveCard;
