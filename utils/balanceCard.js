const { createCanvas, loadImage } = require("canvas");


async function createBalanceCard(user, discordUser) {


    const canvas = createCanvas(1000, 450);

    const ctx = canvas.getContext("2d");



    // фон

    ctx.fillStyle = "#101014";

    ctx.fillRect(
        0,
        0,
        1000,
        450
    );



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

        170,

        225,

        100,

        0,

        Math.PI * 2

    );


    ctx.clip();



    ctx.drawImage(

        avatar,

        70,

        125,

        200,

        200

    );


    ctx.restore();




    // ник пользователя


    ctx.fillStyle = "#ffffff";

    ctx.font =
        "bold 45px Arial";


    ctx.fillText(

        discordUser.username,

        350,

        170

    );





    // слово Баланс


    ctx.fillStyle = "#aaaaaa";

    ctx.font =
        "30px Arial";


    ctx.fillText(

        "Баланс",

        350,

        240

    );





    // количество монет


    ctx.fillStyle = "#ffd700";

    ctx.font =
        "bold 50px Arial";


    ctx.fillText(

        `🪙 ${user.coins.toLocaleString()}`,

        350,

        320

    );





    return canvas.toBuffer();

}



module.exports = {

    createBalanceCard

};
