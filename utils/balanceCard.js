const { createCanvas, loadImage } = require("canvas");


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



async function createBalanceCard(user, discordUser) {


    const canvas = createCanvas(
        1200,
        600
    );


    const ctx = canvas.getContext("2d");



    // фон

    const gradient = ctx.createLinearGradient(
        0,
        0,
        1200,
        600
    );


    gradient.addColorStop(
        0,
        "#111827"
    );


    gradient.addColorStop(
        1,
        "#312e81"
    );



    ctx.fillStyle = gradient;


    ctx.fillRect(
        0,
        0,
        1200,
        600
    );





    // главная карточка


    ctx.fillStyle =
        "rgba(255,255,255,0.08)";


    roundRect(
        ctx,
        50,
        50,
        1100,
        500,
        40
    );


    ctx.fill();



    // рамка


    ctx.strokeStyle =
        "rgba(255,255,255,0.2)";


    ctx.lineWidth = 3;


    ctx.stroke();






    // аватар


    const avatar = await loadImage(

        discordUser.displayAvatarURL({

            extension:"png",

            size:512

        })

    );



    ctx.save();



    ctx.beginPath();


    ctx.arc(
        230,
        300,
        110,
        0,
        Math.PI * 2
    );


    ctx.clip();



    ctx.drawImage(

        avatar,

        120,
        190,
        220,
        220

    );


    ctx.restore();





    // круг вокруг аватара


    ctx.beginPath();


    ctx.arc(
        230,
        300,
        120,
        0,
        Math.PI * 2
    );


    ctx.strokeStyle =
        "#ffffff";


    ctx.lineWidth = 5;


    ctx.stroke();







    // ник


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 55px Arial";


    ctx.fillText(

        discordUser.username,

        420,
        180

    );







    // баланс


    ctx.fillStyle =
        "#c7d2fe";


    ctx.font =
        "35px Arial";


    ctx.fillText(

        "Баланс",

        420,
        260

    );







    // деньги


    ctx.fillStyle =
        "#facc15";


    ctx.font =
        "bold 70px Arial";


    ctx.fillText(

        `🪙 ${user.coins.toLocaleString()}`,

        420,
        350

    );







    // нижняя информация


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "28px Arial";



    ctx.fillText(

        "👤 Статус: Пользователь",

        420,
        430

    );



    ctx.fillText(

        "⭐ Уровень: 1",

        420,
        480

    );



    ctx.fillStyle =
        "#a5b4fc";


    ctx.font =
        "24px Arial";


    ctx.fillText(

        "Экономика",

        900,
        500

    );





    return canvas.toBuffer();

}



module.exports = {

    createBalanceCard

};
