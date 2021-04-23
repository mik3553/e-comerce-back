
const User = require('../models/user');
const Article = require('../models/article');
const bcrypt = require('bcrypt');
const jwtFunctions = require('../../utils/jwt');

module.exports = {

    register: (req, res, next) => {

        let { firstName, lastName, email, password } = req.body;

        if( !firstName, !lastName, !email, !password ){
            res.status(404).json('Veuillez remplir tous les champs!');
        } else {
            bcrypt.hash(password, 10)
                .then(hash => {
                    const user = new User({
                        firstName , lastName, email, password : hash
                    });
                    user.save()
                        .then(user => {
                            res.status(201).json(user);
                            next();
                        })
                        .catch(err => {
                            res.status(400).json(err)
                            console.log('400',err)
                        });
                })
                .catch(err => {
                    res.status(400).json('hach error');
                    console.log(err);
                })
        }
    },
    logIn : (req ,res, next) => {

        let {email, password} = req.body;

        User.findOne({email}).populate('article')
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result) {
                            let token = jwtFunctions.sign(user);

                            res.status(200).json({message: 'success login', token: token});
                            next();

                        } else {
                            console.log('error');
                            res.status(403).json('identifiants incorrects');
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        res.status(403).json('identifiants incorrects');
                    })
            })
            .catch(err => {
                res.status(403).json('identifiants incorrects');
            })
    },
    getUser: (req, res, next) => {

        jwtFunctions.verify(req.headers.authorization)
            .then(decoded => {
                console.log(decoded)
                User.findById({_id: decoded.id}).populate('article')
                    .then(user => {
                        res.status(200).json(user);
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(403).json('veuillez vous connecter svp');
            })
    },
    updateUser : (req ,res, next) => {

        jwtFunctions.verify(req.headers.authorization)
            .then(decoded => {

                let { firstName, lastName, email, password } = req.body;

                bcrypt.hash(password, 10).then(hash => {

                    User.findOneAndUpdate({_id : decoded.id },{ $set : {firstName, lastName, email, password:hash}},{ upsert:true, returnNewDocument : true })
                        .then( (user) => {
                            if(user){
                                res.status(200).json(user);
                                next();
                            }else {
                                res.status(404).json('not exist');
                            }
                        })
                        .catch(err => res.status(400).json(err));
                })
            })
            .catch(err => {
                console.log(err)
                res.status(404).json(err)
            });

    },
    deleteUser : (req, res, next)=> {

        jwtFunctions.verify(req.headers.authorization)
        .then(decoded => {
            User.findOneAndDelete({_id: decoded.id})
            .then(user => {
                if(user){
                    Article.deleteMany({_id : { $in: user.article}}, (err, article) => {
                        if (err) {
                            res.status(404).json('error');
                        }
                        res.status(200).json('all deleted with cascade');
                        next();
                    })
                }else {
                    res.status(404).json('user not found');
                }
            })
            .catch(err =>  {
                res.status(400).json(err);
                console.log(err);
            });
        })
        .catch(err =>  res.status(404).json('decoded not found') );
    },
}
