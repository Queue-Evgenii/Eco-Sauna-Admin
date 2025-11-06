import { Translations } from "../translations";

export default class RuTranslations extends Translations {
    readonly save = "Сохранить";
    readonly add = "Добавить";
    readonly edit = "Изменить";
    readonly delete = "Удалить";
    readonly cancel = "Отмена";
    readonly create = "Создать";
    readonly update = "Обновить";
    readonly reset = "Сбросить";
    readonly dnd = "Нажмите или перетащите файл в эту область для загрузки";
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
    readonly email_invalid = "Некоректный email";
    readonly min_length_3 = "Значение должно содержать больше 3 символов";
    readonly min_length_10 = "Значение должно содержать больше 10 символов";
    readonly greater_than_0 = "Значение должно быть больше 0";

    readonly fetch_data_error = "Ошибка при загрузке даных";
    readonly post_data_error = "Ошибка при отправке даных";
    readonly update_success = "Успешно обновлено";
    readonly update_error = "Ошибка при обновлении данных";

    readonly validation_error = "Ошибка валидации";

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
    readonly product_gallery = "Галерея";
    readonly date = "Дата";

    readonly status = "Статус";
    readonly customer = "Клиент";
    readonly actions = "Действия";
    readonly phone = "Телефон";
    readonly created_at = "Дата создания";
    readonly updated_at = "Дата обновления";
    readonly start_date = "Дата от";
    readonly end_date = "Дата до";
    readonly message = "Комментарий";
    readonly total = "Сумма итого";

    readonly order_id = "ID заказа";
    readonly customer_name = "Имя клиента";
    readonly customer_email = "Email клиента";
    readonly customer_phone = "Телефон клиента";
    readonly admin_email = "Email админа";
    readonly mail_body = "Тело письма";
    readonly mail_subject = "Тема письма";

    readonly image_meta_popup = "Мета данные, изображение";
    readonly image_meta_alt = "Alt text, изображение";
    readonly image_meta_description = "Description, изображение";
}
