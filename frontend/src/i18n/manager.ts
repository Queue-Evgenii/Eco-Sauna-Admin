import { reactive, computed } from "vue";
import { Locale } from "../types/models/utils/browser/locale";
import type { Translations } from "./translations";

export type Language = "ru" | "en";

const localeMap: Record<
    Language,
    () => Promise<{ default: new () => Translations }>
> = {
    ru: () => import("./locales/ru"),
    en: () => import("./locales/en"),
};

export class TranslationsManager {
    private state = reactive({
        locale: (Locale.get() as Language) || "ru",
        instance: null as Translations | null,
        loading: false,
        loaded: false,
    });

    public readonly t = computed<Translations | null>(
        () => this.state.instance,
    );
    public readonly locale = computed(() => this.state.locale);
    public readonly loading = computed(() => this.state.loading);
    public readonly availableLocales = Object.keys(localeMap) as Language[];

    constructor() {
        this.load = this.load.bind(this);
        this.setLocale = this.setLocale.bind(this);

        this.load(this.state.locale);
    }

    async load(locale: Language) {
        if (this.state.loading) return;

        this.state.loading = true;
        try {
            const module = await localeMap[locale]();
            this.state.instance = new module.default();
            this.state.locale = locale;
            Locale.set(locale);
            this.state.loaded = true;
        } catch (err) {
            console.error(`[TranslationsManager] Failed to load ${locale}`, err);
        } finally {
            this.state.loading = false;
        }
    }

    async setLocale(locale: Language) {
        console.log(this);
        if (locale !== this.state.locale) {
            await this.load(locale);
        }
    }
}
