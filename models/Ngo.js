const db = require("./connect")

const Ngo = db.sequelize.define("tbNgo", {
    idNgo: {
        allowNull: false,
        type: db.Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nameNgo: {
        allowNull: false,
        type: db.Sequelize.STRING(70),
    },
    descriptionNgo: {
        type: db.Sequelize.STRING(250)
    },
    cnpjNgo: {
        allowNull: false,
        type: db.Sequelize.STRING(15)
    },
    emailNgo: {
        allowNull: false,
        type: db.Sequelize.STRING(80)
    },
    passwordNgo: {
        allowNull: false,
        type: db.Sequelize.STRING(250)
    },
    siteNgo: {
        type: db.Sequelize.STRING(80)
    },
    addressNgo: {
        allowNull: false,
        type: db.Sequelize.STRING(100)
    },
    averageStarsNgo: {
        type: db.Sequelize.FLOAT
    }
},
{
    freezeTableName: true,
    charset: "utf8",
    collate: "utf8_general_ci"
})

//Ngo.sync({force: true})

module.exports = Ngo