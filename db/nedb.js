
const Datastore = require('nedb');
const db = {}

db.owners = new Datastore(__dirname+'/data/owners.db');
db.pets = new Datastore(__dirname+'/data/pets.db');

db.owners.loadDatabase();
db.pets.loadDatabase();

/**
 * converting nedb callback methods to promises and exporting only few methods.
 */
let exportDBMethods = {};

//wrapper on insert method
exportDBMethods.insertDocument = function (collection, doc){
  return new Promise(function (resolve, reject){
    db[collection].insert(doc, (err, doc)=>{
        if(err){ return reject (err) }
        return  resolve(doc)
      })
  });
}

//wrapper on find method
exportDBMethods.findDocument = function (collection, where){
    return new Promise(function (resolve, reject){
      db[collection].find(where, (err, doc)=>{
          if(err){ return reject (err) }
          return  resolve(doc)
        });
    });
  }

  //wrapper on update method
  exportDBMethods.updateDocument = function (collection, where, data, options){
    return new Promise(function (resolve, reject){
      db[collection].update(where, data, options, (err, doc)=>{
          if(err){ return reject (err) }
          return  resolve(doc)
        });
    });
  }

  //wrapper on fineOne method
  exportDBMethods.findOneDocument = function (collection, where){
    return new Promise(function (resolve, reject){
      db[collection].findOne(where, (err, doc)=>{
          if(err){ return reject (err) }
          return  resolve(doc)
        });
    });
  }


module.exports = exportDBMethods;