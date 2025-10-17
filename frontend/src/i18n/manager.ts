import { reactive, computed } from "vue";
import { Locale } from "../types/models/utils/browser/locale";
import type { Translations } from "./translations";

export type Language = string;

export class TranslationsManager {
    private localeModules: Record<
        string,
        () => Promise<{ default: new () => Translations }>
    >;
    private state = reactive({
        locale: (Locale.get() as Language) || "ru",
        instance: null as Translations | null,
        loading: false,
        loaded: false,
    });

    constructor() {
        this.localeModules = import.meta.glob("./locales/*.ts", {
            eager: false,
        }) as Record<
            string,
            () => Promise<{ default: new () => Translations }>
        >;
        this.availableLocales = Object.keys(this.localeModules).map(
            (path) => path.match(/\.\/locales\/(.*)\.ts$/)![1],
        ).filter(e => e !== undefined);

        this.load = this.load.bind(this);
        this.setLocale = this.setLocale.bind(this);

        this.load(this.state.locale);
    }

    public readonly t = computed<Translations | null>(
        () => this.state.instance,
    );
    public readonly locale = computed(() => this.state.locale);
    public readonly loading = computed(() => this.state.loading);
    public readonly availableLocales: ReadonlyArray<string>;

    public async load(locale: Language) {
        if (this.state.loading) return;

        const loader = this.localeModules[`./locales/${locale}.ts`];
        if (!loader) {
            console.error(`[TranslationsManager] Locale "${locale}" not found`);
            return;
        }

        this.state.loading = true;
        try {
            const module = await loader();
            this.state.instance = new module.default();
            this.state.locale = locale;
            Locale.set(locale);
            this.state.loaded = true;
        } catch (err) {
            console.error(
                `[TranslationsManager] Failed to load ${locale}`,
                err,
            );
        } finally {
            this.state.loading = false;
        }
    }

    public async setLocale(locale: Language) {
        if (locale !== this.state.locale) {
            await this.load(locale);
        }
    }
}
