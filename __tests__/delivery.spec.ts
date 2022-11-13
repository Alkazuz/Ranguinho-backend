
import { connect, Query } from 'firefose';
import admin from 'firebase-admin'
import geohash from "ngeohash";

import {
    project_id,
    private_key,
    client_email
 } from '../src/credentials.json'
import Address from '../src/model/Address';
import DeliveryStatus from '../src/model/DeliveryStatus';
import Delivery from '../src/model/Delivery';
import Product from '../src/model/Product';
import { geocoder } from '../src/utils/geoutils';
import { ProductDeliveryInterface } from '../src/utils/const_interfaces';
import { query } from 'express';


describe('Delivery Model', () => {
    const geo = {lat: -19.0066077, long: -57.6472559}

    const items = [
        {
            id: '7n3Ffi7rtL4EzWj0m3PK',
            count: 2,
            description: 'Descrição do produto 1'
        }
    ]

    beforeEach(() => {
        if (admin.apps.length === 0) {
            connect({
            project_id,
            private_key,
            client_email
            })
        }
    })

    it('should create delivery with existent products and existent restaurant', async () =>{

        const geoh = geohash.encode(geo.lat, geo.long);

        const geodata = JSON.parse(JSON.stringify(await geocoder.reverse({ lat: geo.lat, lon: geo.long })))[0];
        const address = await Address.create({
            state: geodata.administrativeLevels.level1short, 
            city: geodata.administrativeLevels.level2short, 
            neighborhood : geodata.extra.neighborhood,
            entity: 'restaurant',
            geohash: geoh,
            lat: geo.lat,
            long: geo.long,
        }, 'test')

        let price = 0;
        items.forEach( async (item) => {
            const product = await Product.findById(item.id);
            expect(product).toBeDefined()
            expect(product).toHaveProperty('price')
            expect(product).toHaveProperty('description')
            price += product.price * item.count;
        })

        const delivery_status = await DeliveryStatus.findById('lwJNSjMmyBnNhtCU5OSN');
        expect(delivery_status).toBeDefined()
        expect(delivery_status).toHaveProperty('id')

        let delivery = await Delivery.create({
            userid: '3L6Al5wtfnfnDR6vBGrdq4o9obh1',
            restaurant: 'b26713e6-b435-4f21-b985-ba56c4b24a0c',
            address: address.id,
            price: price,
            uid: 'test',
            items: items,
            delivery_status: delivery_status.id
        }, 'test')

        delivery = await Delivery.findById('test')

        expect(delivery).toBeDefined()
        expect(delivery).toHaveProperty('userid')
        expect(delivery).toHaveProperty('restaurant')

        expect(delivery).toHaveProperty('address')
        expect(delivery).toHaveProperty('price')
        expect(delivery?.price).toEqual(41.8)

    });

    

    it('should all items of a delivery order', async () => {
        const delivery = await Delivery.findById('test')

        expect(delivery).toBeDefined()
        expect(delivery).toHaveProperty('items')

        const query = new Query()
        
        delivery.items.forEach((item: ProductDeliveryInterface) => query.where('uid', '==', item.id))
        const products = await Product.find(query)
        
        expect(products).toHaveLength(1)

    })


    it('should delete test delivery', async () => {
        await Delivery.deleteById('test')

        const delivery = await Delivery.findById('test')
        expect(delivery).toBeNull()
    })
});
