const { Router } = require('express');

const usersControllers = require('../controllers/usersControllers');

const usersRouter = Router();


function middleware(req, res, next) {
  console.log('Eu sou um middleware');
  next();
}





const usersController = new usersControllers();

usersRouter.post('/', middleware, usersController.create);
usersRouter.put('/:id', usersController.update);

module.exports = usersRouter;