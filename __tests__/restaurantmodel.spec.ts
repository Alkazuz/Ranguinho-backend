import { connect, Model, Schema, SchemaTypes, Query } from 'firefose';
import admin from 'firebase-admin'

import {
    project_id,
    private_key,
    client_email
 } from '../src/credentials.json'
import { calc_distance, getGeohashRange } from '../src/utils/geoutils';
import Restaurant from '../src/model/Restaurant';
import { populate_fields, unpopulate_date } from '../src/utils/schemautils';


describe('Restaurant Model', () => {

    const geo = {lat: -19.0066077, long: -57.6472559}

    beforeEach(() => {
        if (admin.apps.length === 0) {
            connect({
            project_id,
            private_key,
            client_email
            })
        }
    })

    it('should test nearby restaurants', async () => {
        const range = getGeohashRange(geo.lat, geo.long, 10);

        const query = new Query()
        .where("geohash", ">=", range.lower)
        .where("geohash", "<=", range.upper)
        
        const restaurants = await Restaurant.find(query);
        expect(restaurants).toBeDefined()

        for(const restaurant of restaurants){
            const distance = calc_distance(geo.lat, geo.long, restaurant.lat, restaurant.long);
            expect(distance).toBeLessThanOrEqual(10);
        }

    })

    it('should unpopulate sensitive data', async () => {
        const restaurants = await Restaurant.find(new Query());
        expect(restaurants).toBeDefined()

        for(const restaurant of restaurants){
            unpopulate_date(restaurant);
            for(const fields of populate_fields){
               expect(restaurant).not.toHaveProperty(fields);
            }
        }
        
    })
 
});
