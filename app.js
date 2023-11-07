const express = require("express")
const app = express()


const handlebars = require("express-handlebars").engine
app.engine("handlebars", handlebars({defaultLayout:"main"}))
app.set("view engine", "handlebars")


const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const db = require("./banco")




const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
var admin = require("firebase-admin");
var serviceAccount = require("./viacep-ec515-firebase-adminsdk-butnq-71e60cba90.json");

initializeApp({
    credential: cert(serviceAccount)
  })
const db = getFirestore()
const Endereco = db.collection("enderecos")

app.listen(8081, function(){
    console.log("Servidor ativo!")
})