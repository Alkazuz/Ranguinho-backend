import * as functions from 'firebase-functions'


export default {

    async onDeliveryCreate(event){
        console.log(event);
    },

    async onDeliveryUpdate(event){
        console.log(event);
    }
    
}

export async function sendDeliveryNoitification(snap, context) {
    console.log('fewfewge')
    return console.log(snap)
}

