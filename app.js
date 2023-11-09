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

const multer = require('multer');

// Configuração de armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
      // Extração da extensão do arquivo original:
      const extensaoArquivo = file.originalname.split('.')[1];

      // Cria um código randômico que será o nome do arquivo
      const novoNomeArquivo = require('crypto')
          .randomBytes(64)
          .toString('hex');

      // Indica o novo nome do arquivo:
      cb(null, `${novoNomeArquivo}.${extensaoArquivo}`)
  }
});

const upload = multer({ storage });

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
          console.error("Erro ao buscar endereço para edição: ", error)
      });
})



app.get("/excluir/:id", async function(req, res){
  let id = req.params.id;
  const result = await Endereco.doc(id).delete()
  res.redirect("/enderecos")
})

app.post("/cadastrar", upload.single('imagem'), function(req, res){
  var result = Endereco.add({
    nome: req.body.nome,
    cep: req.body.cep,
    logradouro: req.body.logradouro,
    bairro: req.body.bairro,
    localidade: req.body.localidade,
    uf: req.body.uf,
    numero: req.body.numero,
    descricao: req.body.descricao,
    imagePath: req.file.filename
  }).then(function(){
      console.log('Added document')
      console.log(req.file.filename)
      res.redirect('/enderecos')
  })
})

app.post("/atualizar", function(req, res){
  var id = req.body.id;

  var result= Endereco.doc(id).update({
    nome: req.body.nome,
    cep: req.body.cep,
    logradouro: req.body.logradouro,
    bairro: req.body.bairro,
    localidade: req.body.localidade,
    uf: req.body.uf,
    descricao: req.body.descricao
  }).then(function(){
      console.log('Atualizado com sucesso')
      res.redirect('/')
  })
  
})





app.listen(8081, function(){
    console.log("Servidor ativo!")
})