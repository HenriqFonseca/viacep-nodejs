const Sequelize = require("sequelize")
const sequelize = new Sequelize ("viacep","root","root",{
    host: "localhost",
    dialect:"mysql"
})

const Endereco = sequelize.define("enderecos", {
  nome: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  sobrenome: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

module.exports = {
  Endereco,
  Sequelize: Sequelize,
  sequelize: sequelize
};

Endereco.sync({force:true})