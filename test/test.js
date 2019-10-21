const chai = require('chai');
const assert = require('assert');
const expect = chai.expect;

const url = `http://127.0.0.1:3000`;
const request = require('supertest')(url);

describe('GraphQL', () => {
    
    it('owners list should be empty', (done) => {
        request.post('/graphql')
        .send({ query :'{owners{ name } }' })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            console.log(JSON.stringify(res.body))
            let owners = res.body.data.owners;
            expect(owners).to.be.eql([]);
            done();
          });
     });


     it('add owner', (done) => {
        request.post('/graphql')
        .send({ query :'mutation {addOwner(name: "bilal" email: "bilal@gmail.com" address: "khan pur" phone: 3138859654) { name } }' })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            console.log(JSON.stringify(res.body))
            let owner = res.body.data.addOwner;
            
            expect(owner.name).not.to.be.undefined;
            expect(owner.name).to.be.equal("bilal");
            done();
          });
     });

     //return


    it('returns owners List', (done) => {
        request.post('/graphql')
        .send({ query :'{owners{ name email phone address } }' })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            console.log(JSON.stringify(res.body))
            expect(res.body.data.owners[0].name).not.to.be.undefined;
            done();
          });
     });

     it('returns single owner from list', (done) => {
        request.post('/graphql')
        .send({ query :'{owner (name: "bilal"){ name email phone } }' })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            console.log(JSON.stringify(res.body))
            let owner = res.body.data.owner;
            expect(owner.name).to.be.equal("bilal");
            expect(owner.email).to.be.equal("bilal@gmail.com");
            expect(owner.phone).to.be.equal(3138859654);
            done();
          });
     });

     it('add pet', (done) => {
        request.post('/graphql')
        .send({ query :'mutation {addPet(name: "cat1" colour: "white" age: 2 breed: "sahiwal") { name } }' })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            console.log(JSON.stringify(res.body))
            let pet = res.body.data.addPet;
            
            expect(pet.name).not.to.be.undefined;
            expect(pet.name).to.be.equal("cat1");
            done();
          });
     });

     /*
     {
  owner (name : "bilal" ) {
    name
    email
    phone
    pets {
      name
    }
    
  }
}

 mutation{
    addOwner(
      name: "asad ali"
      email: "asad@gmail.com"
      address: "khan pur"
      phone: 3138859654
    ){
      name
    }
  }


     */

});