const chai = require('chai');
const assert = require('assert');
const expect = chai.expect;
const db = require('../db/nedb');

const url = `http://127.0.0.1:3000`;
const request = require('supertest')(url);

describe('Testing Owners', function() {
  this.timeout(30000);
/**
 * testing only insertion and finding directly on db module.
 */
  let newOwner;
  it('add new owner', async ()=>{
    const owner = {
      name: "ali",
      email: "ali@gmail.com",
      phone: 3136654782,
      address: "G11/2 islamabad",
    }
    newOwner = await db.insertDocument('owners', owner);
    
    expect(newOwner).not.to.be.undefined;
    expect(newOwner._id).not.to.be.undefined;
    expect(newOwner.name).to.be.equal(owner.name);
    
  });
  it('find owner', async ()=>{
    
    let owner = await db.findOneDocument('owners', {_id: newOwner._id});
    
    expect(owner).not.to.be.undefined;
    expect(owner._id).not.to.be.undefined;
    expect(owner.name).to.be.equal(newOwner.name);
    
  });


  /**
   * testing end to end, calling api like actual client do. 
   * actually doing behaviour testing.
   * and testing graphql queries and mutations
   */
     it('add owner by api', (done) => {
        request.post('/graphql')
        .send({ query :'mutation {addOwner(name: "bilal" email: "bilal@gmail.com" address: "khan pur" phone: 3138859654) { _id } }' })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            //console.log(JSON.stringify(res.body))
            let owner = res.body.data.addOwner;
            
            expect(owner._id).not.to.be.undefined;
            done();
          });
     });

    


    it('returns owners List', (done) => {
        request.post('/graphql')
        .send({ query :'{owners{ name email phone address pets {name colour age breed } } }' })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            //console.log(JSON.stringify(res.body))
            expect(res.body.data.owners[0].name).not.to.be.undefined;
            done();
          });
     });

     it('returns single owner from list', (done) => {
        request.post('/graphql')
        .send({ query :'{owner (name: "bilal"){ name email phone address pets{name age colour breed} } }' })
        .expect(200)
        .end((err,res) => {
            if (err) return done(err);
            //console.log(JSON.stringify(res.body))
            let owner = res.body.data.owner;
            expect(owner.name).to.be.equal("bilal");
            expect(owner.email).to.be.equal("bilal@gmail.com");
            expect(owner.phone).to.be.equal(3138859654);
            done();
          });
     });

    
});