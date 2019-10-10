const Category = require("../models/Category")
const CategoryVolunteer = require("../models/CategoryVolunteer")
const CategoryNgo = require("../models/CategoryNgo")
const CategoryAction = require("../models/CategoryAction")

module.exports = {

    async listCauses(){
        let category  = await Category.findAll()
        return category
    },

    //USER
    async registerCausesUser(idUser, categories){
        for(let i in categories){
            const category = await Category.findOne({where: {descCategory: categories[i]}})
    
            if(category){
                CategoryVolunteer.create({
                    idCategory: category.idCategory,
                    idVolunteer: idUser
                })
            }
        }
    },
    async registerCauseUser(idUser, descCategory){
        const category = await Category.findOne({where: {descCategory: descCategory}})
        await CategoryVolunteer.create({idCategory: category.idCategory, idVolunteer: idUser})
    },
    async listCausesUser(idUser){
        let categoriesVolunteer = await CategoryVolunteer.findAll({where: {idVolunteer: idUser}})
        let category = []
        for(let i in categoriesVolunteer){
            category[i] = await Category.findOne({where: {idCategory: categoriesVolunteer[i].idCategory}})
        }
        return category
    },
    async listCausesNotParticipeUser(idUser){
        let categoriesUser = await this.listCausesUser(idUser)
        let allCategories = await Category.findAll()

        for(let i in categoriesUser){
            for(let j in allCategories){
                if(categoriesUser[i].idCategory === allCategories[j].idCategory){
                    allCategories.splice(j, 1)
                }
            }
        }
        return allCategories
    },
    async removeCauseUser(idUser, descCategory){
        const category = await Category.findOne({where: {descCategory: descCategory}})
        await CategoryVolunteer.destroy({where: {idCategory: category.idCategory, idVolunteer: idUser}})
    },
    async editCausesUser(idUser, categories){
        let categoriesUser = await this.listCausesUser(idUser)

        //Remove
        for(let i in categoriesUser){
            if(categoriesUser[i].descCategory != categories[i]){
                await this.removeCauseUser(idUser, categoriesUser[i].descCategory)
                categoriesUser.splice(i, 1, "removed")
            }
        }

        //trata array, retira o "removed" dos arrays
        let categories2 = []
        for(let i in categories){
            if(categories[i] != "removed"){
                categories2.push(categories[i])
            }
        }

        let categoriesUser2 = []
        for(let i in categoriesUser){
            if(categoriesUser[i] != "removed"){
                categoriesUser2.push(categoriesUser[i])
            }
        }

        //Create
        for(let i in categories2){
            let qtd = 0
            for(let j in categoriesUser2){
                if(categories2[i] === categoriesUser2[j].descCategory){
                    break
                }else{
                    qtd++
                }
            }
            if(qtd === categoriesUser2.length){
                await this.registerCauseUser(idUser, categories2[i])
            }
        }
    },
    async editCauseUser(idUser, category){
        let categoriesUser = await this.listCausesUser(idUser)
        if(Array.isArray(categoriesUser) && categoriesUser.length > 1){
            for(let i in categoriesUser){
                if(categoriesUser[i].descCategory != category){
                    await this.removeCauseUser(idUser, categoriesUser[i].descCategory)
                }
            }
        }

        if(categoriesUser[0].descCategory != category){
            await this.registerCauseUser(idUser, category)
        }
    },

    //NGO
    async registerCausesNgo(idNgo, categories){
        for(let i in categories){
            const category = await Category.findOne({where: {descCategory: categories[i]}})
    
            if(category){
                CategoryNgo.create({
                    idCategory: category.idCategory,
                    idNgo: idNgo
                })
            }
        }
    },
    async listCausesNgo(idNgo){
        let categoryNgo = await CategoryNgo.findAll({where: {idNgo: idNgo}})
        let category = []
        for(let i in categoryNgo){
            category[i] = await Category.findOne({where: {idCategory: categoryNgo[i].idCategory}})
        }
        return category
    },
    async listCausesNotParticipeNgo(idNgo){
        let categoriesNgo = await this.listCausesNgo(idNgo)
        let allCategories = await Category.findAll()

        for(let i in categoriesNgo){
            for(let j in allCategories){
                if(categoriesNgo[i].idCategory === allCategories[j].idCategory){
                    allCategories.splice(j, 1)
                }
            }
        }
        return allCategories
    },
    async removeCausesNgo(idNgo, categories){

    },
    async editCausesNgo(idNgo, categories){

    },

    //Action
    async registerCausesAction(idAction, categories){
        for(let i in categories){
            const category = await Category.findOne({where: {descCategory: categories[i]}})
    
            if(category){
                CategoryAction.create({
                    idCategory: category.idCategory,
                    idAction: idAction
                })
            }
        }
    }
}