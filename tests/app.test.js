const request = require('supertest');
const { ObjectId } = require('mongodb');
const { app, connectToMongoDB, closeMongoDB } = require('../backend/app');

// MOCKS
jest.mock('google-auth-library', () => ({
  OAuth2Client: jest.fn().mockImplementation(() => ({
    verifyIdToken: jest.fn().mockImplementation(async ({ idToken }) => {
      if (idToken === 'VALID_GOOGLE_TOKEN') {
        return {
          getPayload: () => ({
            email: 'testuser@example.com',
            name: 'Test User',
            picture: 'http://example.com/pic.jpg'
          })
        };
      }
      return null;
    })
  }))
}));

// UPDATED: Mocks cloudinary to avoid network calls
jest.mock('../backend/database/cloudinary', () => ({
    uploadImageQuick: jest.fn().mockResolvedValue("http://mock-image.com/img.jpg")
}));

// UPDATED: Mock DB Structure
const mockDb = { users: [], produce: [] }; // Changed 'events' to 'produce'

const mockCollection = (collectionName) => ({
  createIndex: jest.fn(),
  findOne: jest.fn(async (query) => {
    const col = mockDb[collectionName];
    if (query._id) return col.find(d => d._id.toString() === query._id.toString()) || null;
    if (query.email) return col.find(d => d.email === query.email) || null;
    return null;
  }),
  find: jest.fn(() => ({
    sort: jest.fn(() => ({
      toArray: jest.fn(async () => [...mockDb[collectionName]])
    })),
    toArray: jest.fn(async () => [...mockDb[collectionName]])
  })),
  deleteOne: jest.fn(async (query) => {
    const initialLen = mockDb[collectionName].length;
    mockDb[collectionName] = mockDb[collectionName].filter(d => d._id.toString() !== query._id.toString());
    return { deletedCount: initialLen - mockDb[collectionName].length };
  }),
  findOneAndUpdate: jest.fn(async (query, update, options) => {
    let doc = mockDb[collectionName].find(d => d.email === query.email);
    if (!doc && options.upsert) {
      doc = { _id: new ObjectId(), email: query.email, ...update.$setOnInsert, ...update.$set };
      mockDb[collectionName].push(doc);
    } else if (doc) {
      Object.assign(doc, update.$set);
    }
    return { value: doc };
  }),
  insertOne: jest.fn(async (doc) => {
    const newDoc = { ...doc, _id: new ObjectId() };
    mockDb[collectionName].push(newDoc);
    return { insertedId: newDoc._id };
  }),
  updateOne: jest.fn(async (query, update) => {
    const doc = mockDb[collectionName].find(d => d._id.toString() === query._id.toString());
    let modifiedCount = 0;
    if (doc) {
      if (update.$addToSet) {
        const key = Object.keys(update.$addToSet)[0];
        const val = update.$addToSet[key];
        if (!doc[key]) doc[key] = [];
        if (!doc[key].includes(val)) doc[key].push(val);
        modifiedCount = 1;
      }
      if (update.$push) {
        const key = Object.keys(update.$push)[0];
        const val = update.$push[key];
        if (!doc[key]) doc[key] = [];
        doc[key].push(val);
        modifiedCount = 1;
      }
    }
    return { matchedCount: doc ? 1 : 0, modifiedCount };
  }),
  updateMany: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
});

jest.mock('mongodb', () => {
  const actualMongo = jest.requireActual('mongodb');
  return {
    ...actualMongo,
    MongoClient: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(true),
      db: jest.fn(() => ({ 
          // UPDATED: Map collection names to mockDb keys
          collection: jest.fn((name) => {
              if (name === 'produce_listings') return mockCollection('produce'); 
              if (name === 'users') return mockCollection('users');
              return mockCollection(name);
          }) 
      })),
      close: jest.fn()
    }))
  };
});

// Since mongodb.js isn't in context, we assume getProduceCollection calls db.collection('produce_listings') 
// or similar. For the test to work, we need to mock the exported getters if they are used directly.
// However, the test uses the mocked mongo client, so as long as the collection name matches logic, we are good.

describe('API Integration Flow', () => {
  let authToken;
  let userId;
  let produceId;

  beforeAll(async () => await connectToMongoDB());
  afterAll(async () => await closeMongoDB());

  test('POST /api/auth/google (Login)', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({ token: 'VALID_GOOGLE_TOKEN' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    
    userId = res.body.user._id;
    authToken = res.body.token; 
    expect(authToken).toBeDefined();
  });

  test('POST /api/produce (Create Listing - Authenticated)', async () => {
    const res = await request(app)
      .post('/api/produce') // UPDATED: Correct endpoint
      .set('Authorization', `Bearer ${authToken}`) 
      .send({
        title: "Fresh Tomatoes",
        price: "40",
        quantity: "100",
        unit: "kg",
        location: "Nashik",
        description: "Organic red tomatoes",
      });

    expect(res.statusCode).toBe(201);
    produceId = res.body.id;
  });

  // Note: We cannot test "Interest" as the seller because the code blocks buying own produce.
  // Ideally, we would need a second user. For now, we expect 400 if buying own produce.
  test('POST /api/produce/interest (Interest Logic - Own Produce Block)', async () => {
    const res = await request(app)
      .post('/api/produce/interest') // UPDATED: Correct endpoint
      .set('Authorization', `Bearer ${authToken}`) 
      .send({ produceId });

    expect(res.statusCode).toBe(400); // Expect "You cannot buy your own produce"
  });

  test('POST /api/produce/comment (Add Comment)', async () => {
    const res = await request(app)
      .post('/api/produce/comment') // UPDATED: Correct endpoint
      .set('Authorization', `Bearer ${authToken}`) 
      .send({ produceId, text: "Is this negotiable?" });

    expect(res.statusCode).toBe(200);
  });

  test('GET /api/produce (Verify Data Persistence)', async () => {
    const res = await request(app).get('/api/produce');
    const item = res.body.find(e => e._id.toString() === produceId.toString());
    
    expect(item.sellerName).toBe('Test User'); 
    expect(item.comments[0].text).toBe("Is this negotiable?");
    expect(item.comments[0]._id).toBeDefined(); 
  });

  // REMOVED DELETE COMMENT TEST: api/produce does not support deleting individual comments

  test('DELETE /api/produce/:id (Delete Listing)', async () => {
    const res = await request(app)
      .delete(`/api/produce/${produceId}`) // UPDATED: Correct endpoint
      .set('Authorization', `Bearer ${authToken}`); 

    expect(res.statusCode).toBe(200);

    // Verify
    const fetchRes = await request(app).get('/api/produce');
    const item = fetchRes.body.find(e => e._id.toString() === produceId.toString());
    expect(item).toBeUndefined();
  });
});