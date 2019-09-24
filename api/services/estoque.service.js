var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('estoque');

var service = {};


service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getById(_id) {
    var deferred = Q.defer();

    db.users.findById(_id, function (err, estoque) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (estoque) {
            deferred.resolve(estoque);
        } else {
            // estoque not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(estoqueParam) {
    var deferred = Q.defer();

    // validation
    db.estoque.findOne(
        { EstCodigo: estoqueParam.EstCodigo },
        function (err, estoque) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (estoque) {
                // EstCodigo already exists
                deferred.reject('EstCodigo "' + estoqueParam.EstCodigo + '" is already taken');
            } else {
                createEstoque();
            }
        });

    function createEstoque() {
       

        db.estoque.insert(
            estoque,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, estoqueParam) {
    var deferred = Q.defer();

    // validation
    db.estoque.findById(_id, function (err, estoque) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (estoque.EstCodigo !== estoqueParam.EstCodigo) {
            // EstCodigo has changed so check if the new EstCodigo is already taken
            db.estoque.findOne(
                { EstCodigo: estoqueParam.EstCodigo },
                function (err, estoque) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (estoque) {
                        // estoque already exists
                        deferred.reject('EstCodigo "' + req.body.EstCodigo + '" is already taken')
                    } else {
                        updateEstoque();
                    }
                });
        } else {
            updateEstoque();
        }
    });

    function updateEstoque() {
        // fields to update
        var set = {
            EstCodigo: estoqueParam.EstCodigo,
            EstReserv: estoqueParam.EstReserv,
            EstDisp: estoqueParam.EstDisp,
        };

        db.estoque.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.estoque.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}