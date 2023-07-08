
'use strict';
const base64 = require('base-64')
const bcrypt = require('bcrypt')
const { server } = require('../../server');
const supertest = require("supertest");
const muckReq = supertest(server)
require('dotenv').config();
const { db } = require('../models/index');

beforeAll(async () =>{
  await db.sync()
})
afterAll(async () =>{
  await db.drop()
})

describe('test', () => {
  let token;
  it('POST to /signup Create a new user', async () => {
      const res = await muckReq.post('/signup').send({
          username: "farah12",
          password: "12333",
          role: "admin"
      })

      expect(res.body.user.username).toEqual('farah12');
      expect(res.status).toBe(201);
  });
  it('POST to /signin Create a new user', async () => {
    const res = await muckReq.post('/signin').set('Authorization',`Basic ${await base64.encode('farah12:12333')}`)
    // const val=await base64.encode('farooh:12333')
    token=res.body.user.token
    expect(res.status).toBe(200);
});

 
     it('POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item', async () => {
       const response = await muckReq.post('/api/v2/food').send({
           name: 'a1ppleee',
           calories: 900,
           type: 'fruit',
         })
         .set('Authorization',`Bearer ${token}`);
  
       expect(response.status).toBe(200);
     });
   
     it('GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items', async () => {
       const response = await muckReq.get('/api/v2/food')
       .set('Authorization', `Bearer ${token}`);
   
       expect(response.status).toBe(200);
     });
   
     it('GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID', async () => {
       const response = await muckReq.get(`/api/v2/food/1`) 
        .set('Authorization', `Bearer ${token}`);
      console.log(response)
       expect(response.status).toBe(200);
     });
   
     test('PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID', async () => {
       const response = await muckReq
         .put(`/api/v2/food/1`)
         .send({
           name: 'updatedFood',
           calories: 5000,
           type: 'fruit',
         })  .set('Authorization', `Bearer ${token}`);
   
       expect(response.status).toEqual(200);
       expect(response.body.name).toEqual('updatedFood');
       expect(response.body.calories).toEqual(5000);
       expect(response.body.type).toEqual('fruit');
     });
   
     test('DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
       let response = await muckReq.delete(`/api/v2/food/1`).set('Authorization', `Bearer ${token}`);
   
       expect(response.status).toBe(202);
     });
   });


