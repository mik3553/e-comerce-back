const mongoose = require('mongoose');

const userSchema = mongoose.Schema({

    creationDate : {
        type : Date,  default: Date.now()
    },
    firstName : {
        type : String,  required: 'veuillez saisir un prénom svp!'
    },
    lastName : {
        type : String,  required: 'veuillez saisir un nom svp!'
    },
    email : {
        type : String, 
        required: 'veuillez saisir un email svp!',
        unique : true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ 
    },
    password : {
        type : String,  required: 'un mot de pass svp :)'
    },
    article: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'article'
    }],
    isAdmin : {
        type : Boolean,  default : false
    }
});

module.exports = mongoose.model('user', userSchema);
    

