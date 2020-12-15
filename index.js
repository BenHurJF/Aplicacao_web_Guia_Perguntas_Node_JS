const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

// database (BANCO DE DADOS)
connection
.authenticate()
.then(() => {
    console.log("Conexao sucesso com bando de dados!")
})
.catch((msgErro) => {
    console.log(msgErro);
});

//  DIZENDO AO EXPRESS USAR O EJS COMO VIEW ENGINE(RENDERIZADOR DO HTML)
app.set('view engine', 'ejs');
app.use(express.static('public'));

// bodyParser (CAPTURAR OS CAMPOS DE TITULO E DESCRICAO DO FORMULARIO)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// ROTAS DA APLICACAO:
app.get("/", (req, res) => {

    //METODO DE ORDENACAO, IDS MAIS RECENTES FICAM EM PRIMEIRO
    Pergunta.findAll({ raw: true, order:[
        ['id', 'DESC']
    ] }).then(perguntas => {
      //console.log(perguntas);
      res.render("index", {
          perguntas: perguntas
      
        });
    });
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});

app.post("/salvarPergunta", (req, res) => {
     var titulo = req.body.titulo;
     var descricao = req.body.descricao;
     // res.send("Formulario recebido!" + "<br>" +  "Titulo: " + req.body.titulo + "<br>" + "Descricao: " + req.body.descricao);
     
     // Enviando os VALUES DE TITULO E DESCRICAO para BANCO DE DADOS
     Pergunta.create({
        titulo: titulo,
        descricao: descricao
     }).then(() => {
          res.redirect("/");
     });
});

app.get("/pergunta/:id", (req, res) => {
     var id = req.params.id;

     //MANDA EXIBIR PERGUNTA 
     Pergunta.findOne({ 
         where: {id: id}
     }).then (pergunta => {
         if (pergunta != undefined) { // PERGUNTA ENCONTRADA
            
            //EXIBE AS RESPOSTAS
             Resposta.findAll({
                 where: { perguntaId: pergunta.id},
                 order: [ 
                 ['id', 'DESC']
                 ]
               }).then(respostas => {
                  res.render("perguntaFind", {
                 pergunta: pergunta,
                 respostas: respostas
               });
             });
         }else { // NAO ENCONTRADA
             res.redirect("/");
         }
     })
});

app.post("/responder", (req, res) => {
     var corpo = req.body.corpo;
     var perguntaId = req.body.pergunta;

     // CRIANDO A RESPOSTA
     Resposta.create({
         corpo: corpo,
         perguntaId: perguntaId
     }).then(() => {
         
         //REDIRECIONANDO PARA PAGINA DA PROPRIA PERGUNTA RESPONDIDA
         res.redirect("/pergunta/"+perguntaId);
     });
});

app.listen(8080, () => {console.log("App rodando!");});

