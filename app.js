const express = require("express")
const path = require("path")
const app = express()

const handlebars = require("express-handlebars").engine
app.engine("handlebars", handlebars({defaultLayout:"main"}))
app.set("view engine", "handlebars")


const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

const { initializeApp, applicationDefault, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore')
var admin = require("firebase-admin");
var serviceAccount = require("./viacep-ec515-firebase-adminsdk-butnq-71e60cba90.json");

initializeApp({
    credential: cert(serviceAccount)
  })
const db = getFirestore()
const Endereco = db.collection("Enderecos")


//* Rendezirar primeira página
app.get("/", function(req, res){
    
  res.sendFile('./views/index.html', {root: __dirname})
  
})


app.get("/enderecos", async function(req, res){
  let enderecos =[]
  const snapshot= await Endereco.get()
  snapshot.forEach((doc) => {
      enderecos.push({id: doc.id, ...doc.data()})
  });
  res.render("endereco",{post: enderecos})
  
})

app.get("/editar/:id", function(req, res){
  var id = req.params.id;
  const result = Endereco.doc(id).get()
      .then((doc) => {
          if (doc.exists) {
              res.render("editar", { dados: doc.data(), id: id })
          } else {
              res.status(404).send("Endereco não encontrado")
          }
      })
      .catch((error) => {
          console.error("Erro ao buscar agendamento para edição: ", error)
      });
})



app.get("/excluir/:id", async function(req, res){
  let id = req.params.id;
  const result = await Endereco.doc(id).delete()
  res.redirect("/enderecos")
})

app.post("/cadastrar", function(req, res){
  var result = Endereco.add({
    nome: req.body.nome,
    cep: req.body.cep,
    logradouro: req.body.logradouro,
    bairro: req.body.bairro,
    localidade: req.body.localidade,
    uf: req.body.uf,
    descricao: req.body.descricao
  }).then(function(){
      console.log('Added document')
      res.redirect('/')
  })
})

app.post("/atualizar", function(req, res){
  var id = req.body.id;

  var result= Endereco.doc(id).update({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao
  }).then(function(){
      console.log('Atualizado com sucesso')
      res.redirect('/')
  })
  
})





app.listen(8081, function(){
    console.log("Servidor ativo!")
})