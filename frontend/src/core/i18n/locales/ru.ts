import { Translations } from "../translations";

export default class RuTranslations extends Translations {
    readonly add = "Добавить";
    readonly delete = "Удалить";
    readonly cancel = "Отмена";
    readonly create = "Создать";
    readonly update = "Обновить";
    readonly reset = "Сбросить";
    readonly r_u_sure = "Вы уверены?";

    readonly logout = "Выйти";
    readonly login = "Войти";

    readonly dashboard = "Панель";
    readonly products = "Сауны";
    readonly orders = "Заказы";
    readonly media = "Медиа";
    readonly settings = "Настройки";

    readonly mon = "Пн";
    readonly tue = "Вт";
    readonly wed = "Ср";
    readonly thu = "Чт";
    readonly fri = "Пт";
    readonly sat = "Сб";
    readonly sun = "Вс";

    readonly required = "Поле обязательно для заполнения";
    readonly min_length_3 = "Значение должно содержать больше 3 символов";
    readonly min_length_10 = "Значение должно содержать больше 10 символов";
    readonly greater_than_0 = "Значение должно быть больше 0";

    readonly fetch_data_error = "Ошибка при загрузке даных";
    readonly post_data_error = "Ошибка при отправке даных";

    readonly validation_product_error = "Ошибка валидации";

    readonly product_created = "Сауна создана";
    readonly product_updated = "Сауна обновлена";

    readonly product_name = "Название";
    readonly product_description = "Описание";
    readonly product_area = "Площадь";
    readonly product_capacity = "Вместимость";
    readonly product_max_temperature = "Максимальная температура";
    readonly product_image = "Изображение";
    readonly product_price = "Цена";
    readonly product_base_price = "Базовая цена";
    readonly product_prices_by_weekday = "Цены по дню недели";
    readonly product_prices_by_date = "Цены по дате";
    readonly date = "Дата";
}
