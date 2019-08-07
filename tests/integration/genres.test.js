const request = require('supertest')
let server;
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/genres', () => {

    //open Server and close Server
    beforeEach( () => { 
        server = require('../../index');
    })

    afterEach( async () => { 
        await Genre.remove({});
        await server.close();
    })

    describe('Get /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {genre: 'genre1'},
                {genre: 'genre2'},
                {genre: 'genre3'}
            ])
            
            const res = await request(server).get('/api/genres'); // returns promise
            
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some( g => g.genre === 'genre1')).toBeTruthy();
            const result = 1;
            expect(result).toBe(1);
        })
    })
    
    describe('Get /:id', () => {
        it('should return an error status 404 if id does not exist', async () => {
            const res = await request(server).get(`/api/genres/1`);
            
            expect(res.status).toBe(404);
        })

        it('should return an error status 404 if the genre with id does not exist', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(server).get(`/api/genres/${id}`);
            
            expect(res.status).toBe(404);
        })

        it('should return the genre with the id if it exists', async () => {
            const genre = new Genre({genre: 'genre1'});
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('genre', genre.genre);
        })

    

    })

    describe('Post /', () => {

        let token;
        let genre; //this is genre: ... in a Genre object (bad naming)

        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({genre})
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            genre = 'genre1'
        })

        it('should return 401 if client is not logged in', async () => {
            token = '';
            
            const res = await exec();

            expect(res.status).toBe(401);
        })
        
        it('should return 400 if genre less than 4 characters', async () => {
            //set genre to be invalid here
            genre = '123'
            const res = await exec();
           

            expect(res.status).toBe(400); 
        })

        /it('should return 400 if genre more than 50 characters', async () => {
            //set genre to be invalid here
            genre = new Array(52).join('a');
            const res = await exec();
           

            expect(res.status).toBe(400); 
        })

        it('should save the genre if it is valid', async () => {
            
            await exec();

            const genre = Genre.find({genre: 'genre1'})
            expect(genre).not.toBeNull();
        })

        it('should return the genre if it is valid', async () => {
            
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('genre', 'genre1')
        })
    })

    describe("PUT /:id", () => {

       let token;
       let newGenre;
       let id; 
       let genre;

        beforeEach( async () => {
            //create new genre and place in DB
            genre = new Genre({genre: 'genre1'});
            await genre.save();

            token = new User().generateAuthToken();
            id = genre._id;
            newGenre = 'updatedGenre'
        })

        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({genre: newGenre});
        }

        it('should return 401 if client is not logged in', async () => {
            token = ''; 
      
            const res = await exec();
      
            expect(res.status).toBe(401);
        });

        it('should return 400 if genre less than 4 characters', async () => {
            //set genre to be invalid here
            newGenre = '123';
            const res = await exec();
           

            expect(res.status).toBe(400); 
        })

        /it('should return 400 if genre more than 50 characters', async () => {
            //set genre to be invalid here
            newGenre = new Array(52).join('a');
            const res = await exec();
           

            expect(res.status).toBe(400); 
        })
        
        it('should return error status 404 if genre ID is invalid', async () => {
            id = 10;

            const res = await exec();

            expect(res.status).toBe(404)
        })

        it('should update the genre if input is valid', async () => {
            await exec();
      
            const updatedGenre = await Genre.findById(genre._id);
      
            expect(updatedGenre.genre).toBe(newGenre);
        });
      
        it('should return the updated genre if it is valid', async () => {
            const res = await exec();
        
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('genre', newGenre);
        });
    })

    describe("DELETE /:id", () => {
        let genre;
        let id;
        let token;

        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send()
        }

        beforeEach( async () => {
            //create the genre and place it in DB
            genre= new Genre({genre: 'genre1'});
            await genre.save();

            id= genre._id;
            token = new User({ isAdmin: true}).generateAuthToken();
        })

        it('should return error status 401 if client is not logged in', async () => {
            token = ''; 
      
            const res = await exec();
      
            expect(res.status).toBe(401);
        });
      
        it('should return error status 403 if the user is not an admin', async () => {
            token = new User({ isAdmin: false }).generateAuthToken(); 
        
            const res = await exec();
        
            expect(res.status).toBe(403);
        });
      
        it('should return error status 404 if id is invalid', async () => {
            id = 1; 
            
            const res = await exec();
        
            expect(res.status).toBe(404);
        });
    
        it('should return error 404 if no genre with the given id exists', async () => {
            id = mongoose.Types.ObjectId();
        
            const res = await exec();
        
            expect(res.status).toBe(404);
        });
    
        it('should delete the genre if input is valid', async () => {
            await exec();
        
            const existingGenre = await Genre.findById(id);
        
            expect(existingGenre).toBeNull();
        });
    
        it('should return the removed genre', async () => {
            const res = await exec();
        
            expect(res.body).toHaveProperty('_id', genre._id.toHexString());
            expect(res.body).toHaveProperty('genre', genre.genre);
        });

    })
}) 