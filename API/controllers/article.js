
const User = require("../models/user");
const Article = require('../models/article');
const jwtFunctions = require('../../utils/jwt');

const Article = {};

Article.get = (req, res, next) => {

    Article.find({})
        .then(articles => {
            res.status(200).json(articles);
            next();
        })
        .catch(err => res.status(400).json(err))
};

Article.create = (req, res, next) => {

    jwtFunctions.verify(req.headers.authorization)
        .then(decoded => {
            let { title, price } = req.body;

            if (!title, !price) {
                res.status(404).json('Veuillez remplir tous les champs!'); // @info ne doit pas être 404 (not found) mais 400 (bad request)
            } else {
                const article = new Article({
                    title, price, user: decoded.id
                });

                article.save()
                    .then(article => {
                        User.findById({ _id: decoded.id })
                            .then(user => {
                                user.article.push(article);
                                user.save();
                            })
                    })
                    .catch(err => res.status(400).json('article not registred'))
            }
        }) // @info manque le catch
}

Article.delete = (req, res, next) => {

    jwtFunctions.verify(req.headers.authorization)
        .then(decoded => {
            let { _id } = req.params;

            Article.findByIdAndDelete({ _id })
                .then(article => {
                    res.status(200).json('delete with success');
                })
                .catch(err => res.status(400).json(err));

        }) // @info manque le catch
}

Article.update = (req, res, next) => {
    jwtFunctions.verify(req.headers.authorization)
        .then(() => {
            let { _id } = req.params;
            let { title, price } = req.body;
            Article.findOneAndUpdate({ _id }, { $set: { title, price } }, { upsert: true, returnNewDocument: true })
                .then((user) => {
                    if (user) {
                        res.status(200).json(user);
                        next();
                    } else {
                        res.status(404).json('not exist');
                    }
                })
                .catch(err => res.status(400).json(err));
        })
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        });
}

module.exports = Article;
