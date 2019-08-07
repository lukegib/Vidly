const {Rental} = require('../../models/rental');
const {User} = require('../../models/user');
const {Movie} = require('../../models/movie')
const mongoose = require('mongoose');
let server;
const request = require('supertest');
const moment = require('moment');

describe('/api/returns', () => {
    
    const customerId =  mongoose.Types.ObjectId();
    const movieId = mongoose.Types.ObjectId();
    let rental;
    
    beforeEach( async () => { 
        server = require('../../index');
        
        movie = new Movie({
            _id: movieId,
            title: "movie name",
            genre: {genre: '12345'},
            dailyRentalRate: 3,
            inStock: 10
        })

        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "Billy",
                phone: "12345",
                isGold: false
            },

            movie: {
                _id: movieId,
                title: "Movie Title",
                dailyRentalRate: 2

            }
        })

        await rental.save();
    })
    afterEach( async () => { 
        await Rental.remove({});
        await Movie.remove({});
        await server.close();
    })

    it('should return 401 if client is not logged in', async () => {
        const res = await request(server).post('/api/returns').send({customerId, movieId});

        expect(res.status).toBe(401);
    })

    it('should return 400 if customerId is not provided', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({movieId});

        expect(res.status).toBe(400);
    })

    it('should return 400 if movieId is not provided', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({customerId});

        expect(res.status).toBe(400);
    })

    it('should return 404 if no rental is found for customer', async () => {
        const token = new User().generateAuthToken();

        await Rental.remove({});

        const res = await request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});

        expect(res.status).toBe(404);

    });

    it('should return 400 if movie is already returned', async () => {
        const token = new User().generateAuthToken();

        rental.dateReturned = new Date();
        await rental.save();

        const res = await request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});

        expect(res.status).toBe(400);

    });

    it('should return 200 if return is valid', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});

        expect(res.status).toBe(200);

    });

    it('should set return date if input is valid', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});

        const rental_in_db = await Rental.findById(rental._id);
        const timeDif = new Date() - rental_in_db.dateReturned;
        expect(timeDif).toBeLessThan(10 * 1000); //10 seconds

    });

    it('should set rental fee if input is valid', async () => {
        const token = new User().generateAuthToken();

        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});

        const rental_in_db = await Rental.findById(rental._id);
        expect(rental_in_db.rentalFee).toBe(14);

    });

    it('should increment movie stock by 1 if input is valid', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});

        const movie_in_db = await Movie.findById(movieId);
        expect(movie_in_db.inStock).toBe(11);

    });

    it('should return the rental if input is valid', async () => {
        const token = new User().generateAuthToken();

        const res = await request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});

        const rental_in_db = await Rental.findById(rental._id);
        expect(res.body).toHaveProperty('dateOut'); 
        expect(res.body).toHaveProperty('dateReturned'); 
        expect(res.body).toHaveProperty('rentalFee'); 
        expect(res.body).toHaveProperty('customer'); 
        expect(res.body).toHaveProperty('movie');
        
        //OR USE
        /*
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']);
        )
        */

    });
})