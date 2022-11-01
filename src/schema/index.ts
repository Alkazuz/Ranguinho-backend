import * as Yup from 'yup';

// yarn add yup @types/yup

export const restaurantSchema = Yup.object().shape({
    user: Yup.string().required(),
    restaurant: Yup.string().required(),
    rate: Yup.number().required(),
    description: Yup.string()
});

export const rateSchema = Yup.object().shape({
    name: Yup.string().required(),
    category: Yup.string().required(),
    delivery_price: Yup.number().required(),
    lat: Yup.number().required(),
    long: Yup.number().required(),
    logo: Yup.string().required()
});