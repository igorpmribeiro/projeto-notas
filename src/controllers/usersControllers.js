const AppError = require('../utils/AppError');
const { hash, compare } = require('bcryptjs');
const connectDb = require('../database/sqlite');

class usersControllers {
  async create(req, res) {
    const { name, email, password } = req.body;

    const database = await connectDb();
    const checkUsers = await database.get('SELECT * FROM users WHERE email = (?)', [email]);

    if(!req.body.name || req.body.name === '') {
      throw new AppError(400, 'O nome é obrigatório');
    }
  
    if(!req.body.email || req.body.email === '') {
      throw new AppError(400, 'O email é obrigatório');
    } else if (!/\S+@\S+\.\S+/.test(req.body.email)) {
      throw new AppError(400, 'O email deve ser válido');
    } else if(checkUsers) {
      throw new AppError(400, 'O email já está em uso');
    }
  
    if(!req.body.password || req.body.password === '') {
      throw new AppError(400, 'A senha é obrigatória');
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(req.body.password)) {
      throw new AppError(400, 'A senha deve conter pelo menos um número, uma letra minúscula, uma letra maiúscula e no mínimo 6 caracteres');
    }

    const hashedPassword = await hash(password, 8);

    await database.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword]);
    res.status(201).send();
  }


  async update(req, res) {
    const { name, email, password, old_password } = req.body;
    const { id } = req.params;

    const database = await connectDb();
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [id]);

    if(!user) {
      throw new AppError(404, 'Usuário não encontrado');
    }

    const checkEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email]);

    if(checkEmail && checkEmail.id !== user.id) {
      throw new AppError(400, 'O email já está em uso');
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if(password && !old_password) {
      throw new AppError(400, 'A senha antiga é obrigatória');
    }
    if(password && old_password) {
      const checkPassword = await compare(old_password, user.password);
      if(!checkPassword) {
        throw new AppError(400, 'A senha antiga está incorreta');
      }
      user.password = await hash(password, 8);
    }

    await database.run(`UPDATE users SET name = (?), email = (?), password = (?), updated_at = DATETIME('now', 'localtime') WHERE id = (?)`, [user.name, user.email, user.password, id]);
    res.json();
  }
}


module.exports = usersControllers;