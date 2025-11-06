import { Translations } from "../translations";

export default class PlTranslations extends Translations {
    readonly save = "Zapisz";
    readonly add = "Dodaj";
    readonly edit = "Edytuj";
    readonly delete = "Usuń";
    readonly cancel = "Anuluj";
    readonly create = "Utwórz";
    readonly update = "Aktualizuj";
    readonly reset = "Zresetuj";
    readonly dnd = "Kliknij lub przeciągnij plik w ten obszar, aby go przesłać";
    readonly r_u_sure = "Czy na pewno?";
    
    readonly logout = "Wyloguj się";
    readonly login = "Zaloguj się";

    readonly dashboard = "Panel";
    readonly products = "Sauny";
    readonly orders = "Zamówienia";
    readonly media = "Media";
    readonly settings = "Ustawienia";

    readonly mon = "Pn";
    readonly tue = "Wt";
    readonly wed = "Śr";
    readonly thu = "Cz";
    readonly fri = "Pt";
    readonly sat = "Sb";
    readonly sun = "Nd";

    readonly required = "Pole jest wymagane";
    readonly email_invalid = "Niepoprawny email";
    readonly min_length_3 = "Wartość powinna mieć więcej niż 3 znaki";
    readonly min_length_10 = "Wartość powinna mieć więcej niż 10 znaków";
    readonly greater_than_0 = "Wartość powinna być większa niż 0";

    readonly fetch_data_error = "Błąd podczas ładowania danych";
    readonly post_data_error = "Błąd podczas wysyłania danych";
    readonly update_success = "Pomyślnie zaktualizowano";
    readonly update_error = "Błąd podczas aktualizacji danych";


    readonly validation_error = "Błąd walidacji";

    readonly product_created = "Sauna została utworzona";
    readonly product_updated = "Sauna została zaktualizowana";

    readonly product_name = "Nazwa";
    readonly product_description = "Opis";
    readonly product_area = "Powierzchnia";
    readonly product_capacity = "Pojemność";
    readonly product_max_temperature = "Maksymalna temperatura";
    readonly product_image = "Obraz";
    readonly product_price = "Cena";
    readonly product_base_price = "Cena podstawowa";
    readonly product_prices_by_weekday = "Ceny według dnia tygodnia";
    readonly product_prices_by_date = "Ceny według daty";
    readonly product_gallery = "Galeria";
    readonly date = "Data";
    
    readonly status = "Status";
    readonly customer = "Klient";
    readonly actions = "Działania";
    readonly phone = "Telefon";
    readonly created_at = "Data utworzenia";
    readonly updated_at = "Data aktualizacji";
    readonly start_date = "Data od";
    readonly end_date = "Data do";
    readonly message = "Komentarz";
    readonly total = "Suma całkowita";

    readonly order_id = "ID zamówienia";
    readonly customer_name = "Imię klienta";
    readonly customer_email = "Email klienta";
    readonly customer_phone = "Telefon klienta";
    readonly admin_email = "Email administratora";
    readonly mail_body = "Treść wiadomości";
    readonly mail_subject = "Temat wiadomości";

    readonly image_meta_popup = "Metadane obrazu";
    readonly image_meta_alt = "Tekst alternatywny, obraz";
    readonly image_meta_description = "Opis, obraz";
}
