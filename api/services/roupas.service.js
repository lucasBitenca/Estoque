var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('roupas');

var service = {};


service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;

module.exports = service;


function getById(_id) {
    var deferred = Q.defer();

    db.roupas.findById(_id, function (err, roupas) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (roupas) {
            // return rouptas (without hashed password)
            deferred.resolve(roupas);
        } else {
            // roupas not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(roupasParam) {
    var deferred = Q.defer();

    // validation
    db.roupas.findOne(
        { RPCodigo: roupasParam.RPCodigo },
        function (err, roupas) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (roupas) {
                // EstCodigo already exists
                deferred.reject('RPCodigo "' + roupasParam.RPCodigo + '" is already taken');
            } else {
                createRoupas();
            }
        });

    function createRoupas() {
       

        db.roupas.insert(
            roupas,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, roupasParam) {
    var deferred = Q.defer();

    // validation
    db.roupas.findById(_id, function (err, roupas) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (roupas.RPCodigo !== roupasParam.RPCodigo) {
            // EstCodigo has changed so check if the new EstCodigo is already taken
            db.roupas.findOne(
                { RPCodigo: roupasParam.RPCodigo },
                function (err, roupas) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (roupas) {
                        // estoque already exists
                        deferred.reject('RPCodigo "' + req.body.RPCodigo + '" is already taken')
                    } else {
                        updateRoupas();
                    }
                });
        } else {
            updateRoupas();
        }
    });

    function updateRoupas() {
        // fields to update
        var set = {
            RPCodigo: roupasParam.RPCodigo,
            RPCor: roupasParam.RPCor,
            RPValEtiq: roupasParam.RPValEtiq,
            RPValVend: roupasParam.RPValVend,
            RPPrcSug: roupasParam.RPPrcSug,
            RPTamanho: roupasParam.RPTamanho,
            RPMarca: roupasParam.RPMarca,
            RPTipo: roupasParam.RPTipo,
        };


        db.roupas.update(
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

    db.roupas.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}