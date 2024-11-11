const db = require("../config/db");
const crypto = require("crypto");

class User {
  constructor(nome, email, senha) {
    this.nome = nome;
    this.email = email;
    this.senha = senha;
    this.senhaHash = this.hashPassword(senha);
    this.chaveAES = crypto.randomBytes(16).toString("hex");
  }

  hashPassword(password) {
    return crypto.createHash("sha256").update(password).digest("hex");
  }

  register() {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO Usuarios (nome, email, senha_hash, chave_aes) VALUES (?, ?, ?, ?)`;
      db.query(
        query,
        [this.nome, this.email, this.senhaHash, this.chaveAES],
        (err, results) => {
          if (err) {
            console.error("Erro ao inserir usuário:", err);
            reject("Erro ao registrar usuário");
          } else {
            resolve("Usuário registrado com sucesso");
          }
        }
      );
    });
  }

  static login(email, senha) {
    return new Promise((resolve, reject) => {
      const hashedPassword = crypto
        .createHash("sha256")
        .update(senha)
        .digest("hex");
      const query = `SELECT * FROM Usuarios WHERE email = ? AND senha_hash = ?`;
      db.query(query, [email, hashedPassword], (err, results) => {
        if (err) {
          console.error("Erro ao autenticar usuário:", err);
          reject("Erro ao autenticar");
        } else if (results.length > 0) {
          resolve(results[0]);
        } else {
          reject("Credenciais inválidas");
        }
      });
    });
  }

  static getHashes(email) {
    return new Promise((resolve, reject) => {
      const query = `SELECT senha_hash FROM Usuarios WHERE email = ?`;
      db.query(query, [email], (err, results) => {
        if (err) {
          console.error("Erro ao buscar hashes:", err);
          reject("Erro ao buscar hashes");
        } else if (results.length > 0) {
          resolve(`Hash da senha: ${results[0].senha_hash}`);
        } else {
          reject("Usuário não encontrado");
        }
      });
    });
  }

  static getAESKey(email) {
    return new Promise((resolve, reject) => {
      const query = `SELECT chave_aes FROM Usuarios WHERE email = ?`;
      db.query(query, [email], (err, results) => {
        if (err) {
          console.error("Erro ao buscar a chave AES:", err);
          reject("Erro ao buscar a chave AES");
        } else if (results.length > 0) {
          resolve(results[0].chave_aes || "Chave AES não definida");
        } else {
          reject("Usuário não encontrado");
        }
      });
    });
  }
}

// Controladores que utilizam a classe User
const registerUser = async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send("Nome, email e senha são obrigatórios");
  }

  try {
    const user = new User(nome, email, senha);
    const message = await user.register();
    res.status(201).send(message);
  } catch (error) {
    res.status(500).send(error);
  }
};

const loginUser = async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send("Email e senha são obrigatórios");
  }

  try {
    const user = await User.login(email, senha);
    console.log("Usuário autenticado com sucesso:", user);
    res.status(200).send("Autenticação bem-sucedida");
  } catch (error) {
    res.status(401).send(error);
  }
};

const getUserHashes = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send("Email é obrigatório");
  }

  try {
    const hash = await User.getHashes(email);
    res.status(200).send(hash);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getUserAES = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send("Email é obrigatório");
  }

  try {
    const aesKey = await User.getAESKey(email);
    res.status(200).send(aesKey);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { registerUser, loginUser, getUserHashes, getUserAES };
