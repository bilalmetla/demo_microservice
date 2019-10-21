

const debug = require('debug')('resolvers');
const db = require("../../db/nedb");

const resolveFunctions = {
  Query: {
   //return all owners list.
    owners : async()=> await db.findDocument('owners', {}),
    //return single owner from list, find by owner name & find its pets as well.
    owner : async(root, args, context, info)=> {
      
       let owner = await db.findOneDocument('owners', {name: args.name});
       debug('owner')
       debug(owner)
       
       let pets = await db.findDocument('pets', {_id: {$in: owner.pets} });
       debug('owner - pets')
       debug(pets)
       
       owner.pets = pets;
       return owner;


    }
 
    },

    Mutation :{
      //return add new owner
      addOwner: async (_, args) =>{
        try{
            const owner = {
              name: args.name,
              email: args.email,
              address: args.address,
              phone: args.phone,
              pets: []
            }
            debug('addOwner');
            debug(owner);
            let new_owner = await db.insertDocument('owners', owner);
            return new_owner;

      }catch(e){
        debug(e);
        throw e;
      }
        
      },

      //add new pet
      addPet: async(_, args)=>{
          try{
            const pet = {
              name: args.name,
              colour: args.colour,
              age: args.age,
              breed: args.breed
            }
            debug('addPet')
            debug(pet)
            
            let newPet = await db.insertDocument('pets', pet);
            let pushedRows = await db.updateDocument('owners', {_id: args.owner }, {$push: {pets: newPet._id} } , { multi: true });
            debug('addPet - pushedRows')
            debug(pushedRows)
            
            if(pushedRows == 0){
                return {};
            }

            return newPet;
            
        }catch(e){ debug(e); throw e}
      },

      //edit an existing pet by id
      editPet: async(_, args)=>{
          try{
            const pet = {
              name: args.name,
              colour: args.colour,
              age: args.age,
              breed: args.breed
            }
            debug('editPet')
            debug(pet)
            
            let updatedRows = await db.updateDocument('pets', {_id: args.id }, {$set : pet}  , { multi: true });
            debug('editPet - updatedRows')
            debug(updatedRows)

            if(updatedRows == 0){
              return {}
            }
            return pet;            

        }catch(e){debug(e); throw e}
      }
    },


  //  Subscription: {}
};


exports.resolveFunctions = resolveFunctions;
