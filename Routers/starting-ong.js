const express = require('express')
const router = express.Router()
const validations = require("../helpers/validations")
const ngoController = require("../controllers/ngoController")
const causesController = require("../controllers/causesController")
const userNgoController = require("../controllers/userNgoController")

router.get("/", (req, res) => {
    res.render('register/presentation', {dataHeader: req.session.user})
})

router.get("/register", async (req, res) => {
    const categories = await causesController.listCauses()
    res.render('register/addNGO', {data: req.session.user, dataHeader: req.session.user, causes: categories})
})

router.post('/register', async (req, res) => {
    
    req.body.ngoCNPJ = req.body.ngoCNPJ.replace(/\D/g,"")
    req.body.ngoTelephone = req.body.ngoTelephone.replace(/\D/g,"")
    req.body.ngoCEP = req.body.ngoCEP.replace(/\D/g,"")
    
    const dataNgo = req.body

    //validations
    if(!validations.filledField(dataNgo.ngoName)){
        req.flash("error_msg", "O nome deve ter no mínimo 4 caracteres!")
        return res.redirect("/starting-ong/register")
    }

    if(!validations.filledField(dataNgo.ngoAddress)){
        req.flash("error_msg", "O endereço deve ter no mínimo 4 caracteres!")
        return res.redirect("/starting-ong/register")
    }

    if(!validations.isCNPJ(dataNgo.ngoCNPJ)){
        req.flash("error_msg", "CNPJ inválido")
        return res.redirect("/starting-ong/register")
    }

    if(!validations.filledField(dataNgo.ngoTelephone)){
        req.flash("Telefone inválido!")
        return res.redirect("/starting-ong/register")
    }

    if(!validations.email(dataNgo.ngoEmail)){
        req.flash("Email inválido")
        return res.redirect("/starting-ong/register")
    }
    const resp = await ngoController.register(dataNgo, req.session.user.idVolunteer)

    req.flash(resp.type_msg, resp.msg)
    if(resp.type_msg === "success_msg"){
        req.session.ngoUser = await userNgoController.listNgo(req.session.user.idVolunteer)
        return res.redirect("/home")
    }else{
        return res.redirect("/starting-ong/register")
    }
    
})

module.exports = router