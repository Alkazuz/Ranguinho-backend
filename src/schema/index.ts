import * as Yup from 'yup';

// yarn add yup @types/yup

export const restaurantSchema = Yup.object().shape({
    name: Yup.string().required(),
    logo: Yup.string().required(),
    delivery_price: Yup.number().required(),
    bannerURL: Yup.string(),
    category: Yup.string().required(),
    lat: Yup.number().required(),
    long: Yup.number().required()
});

export const rateSchema = Yup.object().shape({
    name: Yup.string().required(),
    category: Yup.string().required(),
    delivery_price: Yup.number().required(),
    lat: Yup.number().required(),
    long: Yup.number().required(),
    logo: Yup.string().required()
});

export const startSchema = Yup.object().shape({
    lat: Yup.number().required(),
    long: Yup.number().required()
})

export const deliverySchema = Yup.object().shape({
    lat: Yup.number().required(),
    long: Yup.number().required(),
    restaurant: Yup.string().required()
})