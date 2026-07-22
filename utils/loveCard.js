const { createCanvas, loadImage } = require("canvas");


async function createLoveCard(data) {

    const canvas = createCanvas(1000, 600);
    const ctx = canvas.getContext("2d");


    // фон

    const gradient = ctx.createLinearGradient(
        0,
        0,
        1000,
        600
    );

    gradient.addColorStop(0, "#2b102f");
    gradient.addColorStop(1, "#120018");


    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1000, 600);



    // заголовок

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 42px Arial";


    ctx.fillText(
        "💖 Профиль любви",
        70,
        90
    );



    // аватар игрока

    const avatar1 = await loadImage(data.avatar);


    ctx.save();

    ctx.beginPath();

    ctx.arc(
        350,
        210,
        80,
        0,
        Math.PI * 2
    );

    ctx.clip();


    ctx.drawImage(
        avatar1,
        270,
        130,
        160,
        160
    );


    ctx.restore();



    ctx.fillStyle = "#ff8bd8";
    ctx.font = "bold 35px Arial";


    ctx.fillText(
        "❤️",
        470,
        220
    );



    ctx.fillStyle = "#ffffff";
    ctx.font = "30px Arial";


    ctx.fillText(
        data.partner || "Нет пары",
        550,
        220
    );



    const info = [

        `💍 Статус: ${data.status}`,

        `📅 Вместе с: ${data.startDate}`,

        `⏳ Вместе: ${data.days} дней`,

        `⭐ Уровень любви: ${data.loveLevel}`,

        `💞 Очки любви: ${data.loveXp}`

    ];



    let y = 330;


    ctx.font = "26px Arial";


    for (const text of info) {

        ctx.fillStyle = "#ffffff";

        ctx.fillText(
            text,
            120,
            y
        );

        y += 45;

    }



    return canvas.toBuffer();

}


module.exports = createLoveCard;
