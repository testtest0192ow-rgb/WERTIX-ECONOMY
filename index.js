client.on("interactionCreate", async interaction => {


    // ==========================
    // SLASH КОМАНДЫ
    // ==========================

    if (interaction.isChatInputCommand()) {


        const command = client.commands.get(
            interaction.commandName
        );


        if (!command) return;



        try {


            await command.execute(interaction);



        } catch (error) {


            console.error(error);



            if (interaction.deferred) {


                await interaction.editReply({

                    content: "❌ Произошла ошибка"

                });



            } else if (!interaction.replied) {


                await interaction.reply({

                    content: "❌ Произошла ошибка",

                    ephemeral: true

                });



            }



        }


    }





    // ==========================
    // КНОПКИ
    // ==========================

    if (interaction.isButton()) {



        try {



            // Профиль любви

            if (interaction.customId === "love_profile") {



                await interaction.reply({


                    content: "Профиль любви в разработке",


                    ephemeral: true


                });



            }





            // баланс - доходы

            if (interaction.customId === "balance_income") {



                await interaction.reply({


                    content: "Доходы пользователя",


                    ephemeral: true


                });



            }





            // баланс - расходы

            if (interaction.customId === "balance_expenses") {



                await interaction.reply({


                    content: "Расходы пользователя",


                    ephemeral: true


                });



            }





            // баланс - выход

            if (interaction.customId === "balance_exit") {



                await interaction.message.delete();



            }





        } catch(error) {



            console.error(error);



            if (!interaction.replied) {



                await interaction.reply({


                    content: "❌ Ошибка кнопки",


                    ephemeral: true


                });



            }



        }


    }



});
