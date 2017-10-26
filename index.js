var mongoose = require('mongoose');
var isArray = require('isarray');

function loadersInit(req, res, next) {

    req.db = {};
    req.loadList = {};

    req.load = function(list, item) {

        if (!isArray(this.loadList[list])) {
            this.loadList[list] = [];
        }
        if (!isArray(this.db[list])) {
            this.db[list] = [];
        }

        var canAdd = true;
        for (var i = 0; i < this.loadList[list].length; i++) {
            if (this.loadList[list][i].toString() === item) {
                canAdd = false;
                break;
            }
        }
        if (canAdd) {
            this.loadList[list].push(mongoose.Types.ObjectId(item));
        }

    };

    req.requestList = function(list) {
        if (!isArray(this.loadList[list])) {
            this.loadList[list] = [];
        }
        if (!isArray(this.db[list])) {
            this.db[list] = [];
        }
        var result = [];
        for (var i = 0; i < this.loadList[list].length; i++) {
            result.push(this.loadList[list][i]);
        }
        this.loadList[list] = [];
        return result;
    };

    next();

}

exports = module.exports = loadersInit;
