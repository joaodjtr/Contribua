// Up modules
const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const app = express()
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const user = require('./Routers/user.js')
const ngo = require('./Routers/ngo.js')
const register = require('./Routers/register')
const isLogged = require('./helpers/isLogged')
const search = require('./helpers/doSearch')
const login = require('./Routers/login')
const ajax_checkers = require('./Routers/ajax-checkers')
const home = require("./Routers/home")
const starting_ong = require("./Routers/starting-ong")
const settings = require("./Routers/settings")

//**Configs**//
// Session
app.use(session({
    secret: "anythingthatyoushoudntknow",
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

// Middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.warning_msg = req.flash("warning_msg")
    res.locals.error = req.flash("error")
    next()
})

// body Parser
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// Handlebars
app.engine('handlebars', handlebars({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

//public
app.use(express.static(path.join(__dirname, "public")))

// Routers
app.get("/", (req, res) => {
    if(req.session.user){
        return res.redirect("/home")
    }
    res.render("index")
})

app.use("/login", login)
app.get("/logout", (req, res) => {
    req.session.destroy()
    return res.redirect("/")
})
app.use("/home", isLogged, home)
app.use("/register", register)
app.use("/starting-ong", isLogged, starting_ong)
app.use("/settings", isLogged, settings)
app.use("/ajax-checkers", ajax_checkers)
app.use("/", isLogged, user)

app.post('/search', async function(req,res){
    res.json(await search.doSearch(req.query.key))
})

// Localhost
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
})
