const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({

    creationDate : {
        type : Date,  default: Date.now()
    },
    title : {
        type : String,  required: 'veuillez saisir un titre svp!'
    },
    price : {
        type : Number,  required: 'inserer un prix'
    },
    images : [{
        type : String
    }],
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
});

module.exports = mongoose.model('article', articleSchema);