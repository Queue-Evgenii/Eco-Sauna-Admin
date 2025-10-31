import { Translations } from "../translations";

export default class EnTranslations extends Translations {
    readonly add = "Add";
    readonly delete = "Delete";
    readonly cancel = "Cancel";
    readonly create = "Create";
    readonly update = "Update";
    readonly reset = "Reset";
    readonly r_u_sure = "Are you sure?";

    readonly logout = "Log Out";
    readonly login = "Log In";

    readonly dashboard = "Dashboard";
    readonly products = "Saunas";
    readonly orders = "Orders";
    readonly media = "Media";
    readonly settings = "Settings";

    readonly mon = "Mon";
    readonly tue = "Tue";
    readonly wed = "Wed";
    readonly thu = "Thu";
    readonly fri = "Fri";
    readonly sat = "Sat";
    readonly sun = "Sun";

    readonly required = "Field is required";
    readonly min_length_3 = "Value should be more than 3 symbols";
    readonly min_length_10 = "Value should be more than 10 symbols";
    readonly greater_than_0 = "Value should be more than 0";

    readonly fetch_data_error = "Error while loading data";
    readonly post_data_error = "Error while sending data";

    readonly validation_product_error = "Validation error";
    
    readonly product_created = "Sauna created";
    readonly product_updated = "Sauna updated";

    readonly product_name = "Name";
    readonly product_description = "Description";
    readonly product_area = "Area";
    readonly product_capacity = "Capacity";
    readonly product_max_temperature = "Maximum temperature";
    readonly product_image = "Image";
    readonly product_price = "Price";
    readonly product_base_price = "Base price";
    readonly product_prices_by_weekday = "Prices by weekday";
    readonly product_prices_by_date = "Prices by date";
    readonly date = "Date";
}
