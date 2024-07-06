const { Router } = require('express');

const notesController = require('../controllers/notesController');

const notesRouter = Router();


function middleware(req, res, next) {
  next();
}





const noteController = new notesController();

notesRouter.get('/', noteController.index);
notesRouter.post('/:user_id', noteController.create);
notesRouter.get('/:user_id', noteController.show);
notesRouter.delete('/:id', noteController.delete);

module.exports = notesRouter;