const User = require("../models/Volunteer")
const Rating = require('../models/Rating')
const verifyEmail = require("../helpers/verifyEmail")
const verifyCPF = require("../helpers/verifyCPF")
const verifyUserName = require("../helpers/verifyUserName")
const causesController = require("./causesController")

module.exports = {
    async register(dataUser){
        let type_msg
        let msg
        const hasEmailUser = await verifyEmail.user(dataUser.emailVolunteer)
        const hasCPF = await verifyCPF(dataUser.cpfVolunteer)
        const hasUserName = await verifyUserName.user(dataUser.userNameVolunteer)

        if(hasUserName){
            type_msg = "error_msg"
            msg = "Já existe uma conta com este nome de usuário!"
            return {type_msg, msg}
        }

        if(hasEmailUser){
            type_msg = "error_msg"
            msg = "Já existe uma conta com este e-mail!"
            return {type_msg, msg}
        }

        if(hasCPF){
            type_msg = "error_msg"
            msg = "Já existe uma conta com o CPF informado!"
            return {type_msg, msg}
        }
        const user = await User.create({
                                    nameVolunteer: dataUser.nameVolunteer,
                                    lastNameVolunteer: dataUser.lastNameVolunteer,
                                    cpfVolunteer: dataUser.cpfVolunteer,
                                    emailVolunteer: dataUser.emailVolunteer,
                                    userName: dataUser.userNameVolunteer,
                                    passwordVolunteer: dataUser.passwordVolunteer,
                                    genreVolunteer: "M",
                                    dateBirthVolunteer: dataUser.dateBornVolunteer,
                                    photoVolunteer: "user.svg",
                                    cepVolunteer: dataUser.cepVolunteer,
                                    cityVolunteer: dataUser.cityVolunteer,
                                    districtVolunteer: dataUser.districtVolunteer,
                                    addressVolunteer: dataUser.addressVolunteer,
                                    avarageStarsVolunteer: "0",
                                    activeVolunteer: true
                                })
        if(Array.isArray(dataUser.categories))
            await causesController.registerCausesUser(user.idVolunteer, dataUser.categories)
        else
            await causesController.registerCauseUser(user.idVolunteer, dataUser.categories)
                    

        type_msg = "success_msg"
        msg = "Seja Bem-vindo!"
        return {type_msg, msg, user}
    },
    async edit(dataUser, sessionUser){
        await User.update({
                        nameVolunteer: dataUser.name,
                        lastNameVolunteer: dataUser.lastName,
                        biographyVolunteer: dataUser.biography,
                        dateBirthVolunteer: dataUser.dateBirth,
                        cepVolunteer: dataUser.cep,
                        cityVolunteer: dataUser.city,
                        districtVolunteer: dataUser.district,
                        addressVolunteer: dataUser.address
                    },{where: {idVolunteer: sessionUser.idVolunteer}})

            sessionUser.nameVolunteer = dataUser.name
            sessionUser.lastNameVolunteer = dataUser.lastName
            sessionUser.biographyVolunteer = dataUser.biography
            sessionUser.dateBirthVolunteer = dataUser.dateBirth
            sessionUser.cepVolunteer = dataUser.cep
            sessionUser.cityVolunteer = dataUser.city
            sessionUser.districtVolunteer = dataUser.district
            sessionUser.addressVolunteer = dataUser.address

            return sessionUser
    },
    async editPhoto(dataPhoto, sessionUser){
        await User.update({
            photoVolunteer: dataPhoto.filename
        },{where: {idVolunteer: sessionUser.idVolunteer}})

        sessionUser.photoVolunteer = dataPhoto.filename
        return sessionUser.photoVolunteer
    },
    async changePassword(newPassword, idUser){
        await User.update({passwordVolunteer: newPassword}, {where: {idVolunteer: idUser}})
    },
    async deactivateAccount(idUser){
        await User.update({activeVolunteer: false}, {where: {idVolunteer: idUser}})
    },
    async listOneUser(idUser){
        const user = await User.findOne({where: idUser})
        return user
    },
    async listUsers(idUsers){
        const users = await User.findAll({where: {idVolunteer: idUsers}})
    },
    async updateAverageStars(idVolunteer, idNgo, idAction, value){
        value = parseFloat(value)
        let totalStars = await Rating.findAll({attributes: ['starsVolunteer'], where: {idVolunteer}})
        if(totalStars.length == 0){
            await User.update({
                averageStarsVolunteer: value
            }, {where: {idVolunteer}})
            
            const rating = await Rating.findOne({where: {idAction, idVolunteer}})
            if(rating === null || rating === undefined){
                await Rating.create({
                    idAction,
                    idNgo,
                    idVolunteer,
                    starsVolunteer: value
                })
            }else{
                await Rating.update({
                    idVolunteer,
                    idNgo,
                    starsVolunteer: value
                }, {where: {idAction, idVolunteer}})
            }

            let stars = await User.findOne({attributes: ['averageStarsVolunteer'], where: {idVolunteer}})
            return stars[0]
        }else{
            const rating = await Rating.findOne({where: {idAction, idVolunteer}})
            if(rating === null || rating === undefined){
                await Rating.create({
                    idAction,
                    idNgo,
                    idVolunteer,
                    starsVolunteer: value
                })
            }else{
                await Rating.update({
                    idVolunteer,
                    idNgo,
                    starsVolunteer: value
                }, {where: {idAction, idVolunteer}})
            }

            totalStars = await Rating.findAll({attributes: ['starsVolunteer'], where: {idVolunteer}})
            
            let averageStars = 0
            // let i = 0
            totalStars.map((star,j)=>{
                averageStars += star.starsVolunteer
                i = j + 1
            })
            // i++
            averageStars /= i
            averageStars = averageStars.toFixed(1)

            await User.update({
                averageStarsVolunteer: averageStars
            }, {where: {idVolunteer}})

            return averageStars
        }
    }
}