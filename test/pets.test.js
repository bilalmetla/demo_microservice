const chai = require('chai');
const assert = require('assert');
const expect = chai.expect;

const url = `http://127.0.0.1:3000`;
const request = require('supertest')(url);

describe('Testing Pets', () => {
    
     let owner = ''
     let pet = ''
     it('returns single owner and its pets', (done) => {
          request.post('/graphql')
          .send({ query :'{owner (name: "bilal"){ _id name email phone pets {_id name breed age colour} } }' })
          .expect(200)
          .end((err,res) => {
              if (err) return done(err);
             // console.log(JSON.stringify(res.body))
              owner = res.body.data.owner;
              expect(owner.name).to.be.equal("bilal");
              expect(owner.email).to.be.equal("bilal@gmail.com");
              expect(owner.phone).to.be.equal(3138859654);
              
              done();
            });
       });

       
     it('add pet', (done) => {
        request.post('/graphql')
        .send({ query :`mutation {addPet(name: "cat1" colour: "white" age: 2 breed: "sahiwal" owner: "${owner._id}" ) { _id } }` })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
           // console.log(JSON.stringify(res.body))
            pet = res.body.data.addPet;
            expect(pet._id).not.to.be.undefined;
            done();
          });
     });

     it('edit pet', (done) => {
        request.post('/graphql')
        .send({ query :`mutation {editPet(id: "${pet._id}" name: "cat6" colour: "red" age: 2 breed: "sahiwal" owner: "${owner._id}" ) { name } }` })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
          //  console.log(JSON.stringify(res.body))
            let pet = res.body.data.editPet;
            
            expect(pet.name).not.to.be.undefined;
            expect(pet.name).to.be.equal("cat6");
            done();
          });
     });


});