const db = require("./connect")

const Volunteer = db.sequelize.define("tbVolunteer" ,{
    idVolunteer: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: db.Sequelize.INTEGER
    },
    nameVolunteer: {
        allowNull: false,
        type: db.Sequelize.STRING(20)
    },
    lastNameVolunteer: {
        allowNull: false,
        type: db.Sequelize.STRING(40)
    },
    emailVolunteer: {
        allowNull: false,
        type: db.Sequelize.STRING(80)
    },
    passwordVolunteer: {
        allowNull: false,
        type: db.Sequelize.STRING(250)
    },
    biographyVolunteer:{
        type: db.Sequelize.STRING(300)
    },
    genreVolunteer: {
        allowNull: false,
        type: db.Sequelize.STRING(2)
    },
    dateBirthVolunteer: {
        allowNull: false,
        type: db.Sequelize.DATE
    },
    photoVolunteer: {
        type: db.Sequelize.STRING(80)
    },
    addressVolunteer: {
        allowNull: false,
        type: db.Sequelize.STRING(100)
    },
    averageStarsVolunteer: {
        type: db.Sequelize.FLOAT
    }
}, {
    freezeTableName: true,
    charset: "utf8",
    collate: "utf8_general_ci"
})

//Volunteer.sync({force: true})

module.exports = Volunteer