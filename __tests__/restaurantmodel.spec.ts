import { connect, Model, Schema, SchemaTypes, Query } from 'firefose';
import admin from 'firebase-admin'
import geohash from "ngeohash";

import {
    project_id,
    private_key,
    client_email
 } from '../src/credentials.json'
import { calc_distance, getGeohashRange } from '../src/utils/geoutils';
import Restaurant from '../src/model/Restaurant';
import { populate_fields, unpopulate_date } from '../src/utils/schemautils';
import Address from '../src/model/Address';
import { geocoder } from '../src';


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

    it('should remove sensitive data', async () => {
        const restaurants = await Restaurant.find(new Query());
        expect(restaurants).toBeDefined()

        for(const restaurant of restaurants){
            unpopulate_date(restaurant);
            for(const fields of populate_fields){
               expect(restaurant).not.toHaveProperty(fields);
            }
        }
        
    })

    it('should create restaurant with reference address', async () =>{
        const geoh = geohash.encode(geo.lat, geo.long);

        const geodata = JSON.parse(JSON.stringify(await geocoder.reverse({ lat: geo.lat, lon: geo.long })))[0];
        const address = await Address.create({state: geodata.administrativeLevels.level1short, city: geodata.administrativeLevels.level2short, neighborhood : geodata.extra.neighborhood}, 'test')
        
        await Restaurant.create({ 
            name: 'test',
            logo: 'test',
            delivery_price: 1,
            bannerURL: 'test',
            category: 'test',
            lat: geo.lat,
            long: geo.long,
            address: address.id,
            geohash: geoh
        }, 'test');

        const query = new Query()
        query.where('name', '==', 'test').populate('address')
        const result = await Restaurant.find(query)

        expect(result).toHaveLength(1)
        expect(result[0]).toHaveProperty('id')

        // @ts-ignore
        expect(result[0]?.address).toHaveProperty('id')
        // @ts-ignore
        expect(result[0]?.address).toHaveProperty('city')
        // @ts-ignore
        expect(result[0]?.address).toHaveProperty('state')
        // @ts-ignore
        expect(result[0]?.address).toHaveProperty('neighborhood')
    })

    
 
});