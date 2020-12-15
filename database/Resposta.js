const Sequelize = require("sequelize");
const connection = require("./database");

const Resposta = connection.define("respostas", {
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

// NAO RECRIAR TABELA, CASO ELA JA EXISTA:
Resposta.sync({ force: false });

module.exports = Resposta;