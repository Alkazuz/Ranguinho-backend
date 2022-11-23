import Address from "../model/Address";
import Restaurant from "../model/Restaurant";
import { calc_distance } from "./geoutils";

export const populate_fields : string[] = [
    'updatedAt',
    'createdAt',
    'timeMinMinutes', 
    'timeMaxMinutes', 
    'lat', 
    'fee', 
    'long', 
    'geohash',
    'total_deliveries',
    'total_rate',
    'delivery_price',
    'address'
] 

const calc_delivery = (distance: number, fee: number) => {
    let price = distance * fee;
    if(price == 0) return 0;
    if(price < fee) price = fee;
    
    return price;
}

export const unpopulate_date = (restaurant: typeof Restaurant) => {
    for(const populate of populate_fields){
        delete restaurant[populate];
    }
}

export const process_restaurant_ful = async (restaurant: typeof Restaurant, lat: number, lng: number) => {
    restaurant.distance = calc_distance(restaurant.address.lat, restaurant.address.long, lat, lng);

    const current_date = new Date()
    const isNew = new Date().setDate(current_date.getDate() - 14) < restaurant.createdAt;

    const delivery_info = {
        type: 'DELIVERY',
        timeMinMinutes: restaurant.timeMinMinutes,
        timeMaxMinutes: restaurant.timeMaxMinutes,
        fee: calc_delivery(restaurant.distance, restaurant.delivery_price)
    }

    if(restaurant.total_rate && restaurant.total_rate > 0 && restaurant.total_deliveries && restaurant.total_deliveries > 0){
        restaurant.rate = restaurant.total_rate / restaurant.total_deliveries
    }else{
        restaurant.rate = 0;
    }

    restaurant.isNew = isNew;
    restaurant.delivery_info = delivery_info;

    unpopulate_date(restaurant)

}

