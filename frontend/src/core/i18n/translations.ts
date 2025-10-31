export abstract class Translations {
    abstract readonly add: string;
    abstract readonly delete: string;
    abstract readonly cancel: string;
    abstract readonly create: string;
    abstract readonly update: string;
    abstract readonly reset: string;
    abstract readonly r_u_sure: string;

    abstract readonly login: string;
    abstract readonly logout: string;

    abstract readonly dashboard: string;
    abstract readonly products: string;
    abstract readonly orders: string;
    abstract readonly media: string;
    abstract readonly settings: string;
    
    abstract readonly mon: string;
    abstract readonly tue: string;
    abstract readonly wed: string;
    abstract readonly thu: string;
    abstract readonly fri: string;
    abstract readonly sat: string;
    abstract readonly sun: string;

    abstract readonly required: string;
    abstract readonly min_length_3: string;
    abstract readonly min_length_10: string;
    abstract readonly greater_than_0: string;

    abstract readonly fetch_data_error: string;
    abstract readonly post_data_error: string;

    abstract readonly validation_product_error: string;

    abstract readonly product_created: string;
    abstract readonly product_updated: string;

    abstract readonly product_name: string;
    abstract readonly product_description: string;
    abstract readonly product_area: string;
    abstract readonly product_capacity: string;
    abstract readonly product_max_temperature: string;
    abstract readonly product_image: string;
    abstract readonly product_price: string;
    abstract readonly product_base_price: string;
    abstract readonly product_prices_by_weekday: string;
    abstract readonly product_prices_by_date: string;
    abstract readonly date: string;
}
