const { createCanvas, loadImage } = require("canvas");



function roundRect(ctx, x, y, width, height, radius) {

    ctx.beginPath();

    ctx.moveTo(x + radius, y);

    ctx.lineTo(
        x + width - radius,
        y
    );

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
        "#0f172a"
    );


    gradient.addColorStop(
        0.5,
        "#1e293b"
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






    // карточка


    ctx.fillStyle =
        "rgba(255,255,255,0.07)";


    roundRect(
        ctx,
        60,
        60,
        1080,
        480,
        45
    );


    ctx.fill();




    ctx.strokeStyle =
        "rgba(255,255,255,0.25)";


    ctx.lineWidth = 3;


    ctx.stroke();







    // аватар


    const avatar = await loadImage(

        discordUser.displayAvatarURL({

            extension: "png",

            size: 512

        })

    );



    ctx.save();


    ctx.beginPath();


    ctx.arc(

        250,

        300,

        115,

        0,

        Math.PI * 2

    );


    ctx.clip();



    ctx.drawImage(

        avatar,

        135,

        185,

        230,

        230

    );



    ctx.restore();






    // рамка аватара


    ctx.beginPath();


    ctx.arc(

        250,

        300,

        125,

        0,

        Math.PI * 2

    );


    ctx.strokeStyle =
        "#818cf8";


    ctx.lineWidth =
        6;


    ctx.stroke();







    // ник


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "bold 55px Arial";


    ctx.fillText(

        discordUser.username,

        430,

        180

    );






    // заголовок


    ctx.fillStyle =
        "#cbd5e1";


    ctx.font =
        "32px Arial";


    ctx.fillText(

        "Баланс",

        430,

        250

    );







    // деньги


    ctx.fillStyle =
        "#facc15";


    ctx.font =
        "bold 75px Arial";


    ctx.fillText(

        user.coins
        .toLocaleString(),

        430,

        350

    );







    // подпись


    ctx.fillStyle =
        "#94a3b8";


    ctx.font =
        "28px Arial";


    ctx.fillText(

        "Монеты",

        435,

        395

    );







    // нижняя информация


    ctx.fillStyle =
        "#ffffff";


    ctx.font =
        "26px Arial";



    ctx.fillText(

        "Уровень 1",

        430,

        470

    );



    ctx.fillText(

        "Активный пользователь",

        650,

        470

    );







    return canvas.toBuffer();

}





module.exports = {

    createBalanceCard

};
