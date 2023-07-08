
'use strict';
const base64 = require('base-64')
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
       expect(response.body.name).toBe('a1ppleee');
       expect(response.body.calories).toBe(900);
       expect(response.body.type).toBe('fruit');

     });
   
     it('GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items', async () => {
       const response = await muckReq.get('/api/v2/food')
       .set('Authorization', `Bearer ${token}`);
   
       expect(response.status).toBe(200);
       expect(Array.isArray(response.body)).toBeTruthy()
     });
   
     it('GET /api/v2/:model/ID with a bearer token that has read permissions ', async () => {
       const response = await muckReq.get(`/api/v2/food/1`) 
        .set('Authorization', `Bearer ${token}`);
      console.log(response)
       expect(response.status).toBe(200);
  
     });
   
     it('PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID', async () => {
       const response = await muckReq
         .put(`/api/v2/food/1`)
         .send({
           name: 'banana212',
           calories: 188,
           type: 'fruit',
         })  .set('Authorization', `Bearer ${token}`);
   
       expect(response.status).toBe(200);
       expect(response.body.name).toBe('banana212');
       expect(response.body.calories).toBe(188);
       expect(response.body.type).toBe('fruit');
     });
   
     test('DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
       let response = await muckReq.delete(`/api/v2/food/1`).set('Authorization', `Bearer ${token}`);
   
       expect(response.status).toBe(202);
       expect(response.body).toBe(1);
     });
  
///test v2 clothes

     // const token = jwt.sign({ username: 'farah34', password: 'password' , role : 'admin'} , process.env.SECRET || "f" )
     it('/api/v2/clothes Can create a new model if the role was admin', async () => {
     const res = await muckReq.post('/api/v2/clothes')
     .set('Authorization', `Bearer ${token}`)
     .send({ name: 'jacket', color: 'purple' , size : 'small'})

         expect(res.status).toBe(200);
         expect(res.body.name).toBe('jacket');
       expect(res.body.color).toBe('purple');
       expect(res.body.size).toBe('small');
   });

     it(' Can get all /api/v2/clothes' ,async () =>{
          const res = await muckReq.get('/api/v2/clothes')
          .set('Authorization', `Bearer ${token}`)

         expect(res.status).toBe(200);
         expect(Array.isArray(res.body)).toBeTruthy()

     })

     it('can get one /api/v2/clothes/id' ,async () =>{
          const res = await muckReq.get(`/api/v2/clothes/1`)
          .set('Authorization', `Bearer ${token}`)
          expect(res.status).toBe(200);
     })

     it('can update one /api/v2/clothes/id' ,async () =>{
          const res = await muckReq.put(`/api/v2/clothes/1`).set('Authorization', `Bearer ${token}`)
          .send({ name: 'jacket22', color: "red" , size : 'large'})

          expect(res.status).toBe(200);
          expect(res.body.name).toBe('jacket22');
          expect(res.body.color).toBe('red');
          expect(res.body.size).toBe('large');
     })

     it('can delete one /api/v2/clothes/id' ,async () =>{
          const res = await muckReq.delete(`/api/v2/clothes/1`).set('Authorization', `Bearer ${token}`)
          expect(res.status).toBe(202);
          expect(res.body).toBe(1);

     })
 })
