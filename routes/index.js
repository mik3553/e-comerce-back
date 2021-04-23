
const userController = require('../API/controllers/user');
const articleController = require('../API/controllers/article');

module.exports = (app) => {
    // // users
    app.post('/register', userController.register);
    app.post('/logIn', userController.logIn);
    app.get('/user', userController.getUser);
    app.put('/user', userController.updateUser);
    app.delete('/user', userController.deleteUser);

    //article
    app.get('/articles', articleController.getArticles);
    app.post('/article', articleController.createArticle);
    app.delete('/article/:_id', articleController.deleteArticle);
    app.put('/article/:_id', articleController.updateArticle);

}