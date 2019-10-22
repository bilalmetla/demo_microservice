
const logger = require('../../controllers/logger');
const db = require("../../db/nedb");

const resolveFunctions = {
  Query: {
    updateLevel: (_, args)=>{
      logger.updateLogLevel(args.level);
      return 'Updated log level to '+args.levle;
    },
   //return all owners list.
    owners : async(root, args, context, info)=> {
      await db.load('owners');
      return await db.findDocument('owners', {});
    },
    //return single owner from list, find by owner name & find its pets as well.
    owner : async(root, args, context, info)=> {
      await db.load('owners');
       let owner = await db.findOneDocument('owners', {name: args.name});
       logger.debug('owner')
       logger.debug(JSON.stringify(owner))
       
       let pets = await db.findDocument('pets', {_id: {$in: owner.pets} });
       logger.debug('owner - pets')
       logger.debug(JSON.stringify(pets))
       
       owner.pets = pets;
       return owner;

    }
  },

    Mutation :{
      //return add new owner
      addOwner: async (_, args) =>{
        try{
          await db.load('owners');
            const owner = {
              name: args.name,
              email: args.email,
              address: args.address,
              phone: args.phone,
              pets: []
            }
            logger.debug('addOwner');
            logger.debug(JSON.stringify(owner))
            let new_owner = await db.insertDocument('owners', owner);
            return new_owner;

      }catch(e){
        logger.error(e);
        throw e;
      }
        
      },

      //add new pet
      addPet: async(_, args)=>{
          try{
            await db.load('pets');
            const pet = {
              name: args.name,
              colour: args.colour,
              age: args.age,
              breed: args.breed
            }
            logger.debug('addPet')
            logger.debug(JSON.stringify(pet))
            
            let newPet = await db.insertDocument('pets', pet);
            logger.debug('addPet - newPet')
            logger.debug(JSON.stringify(newPet))
            let pushedRows = await db.updateDocument('owners', {_id: args.owner }, {$push: {pets: newPet._id} } , { multi: true });
            logger.debug('addPet - pushedRows')
            logger.debug(pushedRows)
            
            if(pushedRows == 0){
                return {};
            }

            return newPet;
            
        }catch(e){ logger.error(e); throw e}
      },

      //edit an existing pet by id
      editPet: async(_, args)=>{
          try{
            await db.load('pets');
            const pet = {
              name: args.name,
              colour: args.colour,
              age: args.age,
              breed: args.breed
            }
            logger.debug('editPet')
            logger.debug('args.id :'+args.id)
            logger.debug(JSON.stringify(pet))
            
            let updatedRows = await db.updateDocument('pets', {_id: args.id }, {$set : pet}  , { multi: false });
            logger.debug('editPet - updatedRows')
            logger.debug(updatedRows)

            if(updatedRows == 0){
              return {}
            }
            return pet;            

        }catch(e){logger.error(e); throw e}
      }
    },


  //  Subscription: {}
};


exports.resolveFunctions = resolveFunctions;
