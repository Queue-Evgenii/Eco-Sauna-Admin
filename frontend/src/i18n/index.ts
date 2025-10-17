import type { App } from "vue";
import { TranslationsManager } from "./manager";

export const TranslationsSymbol = Symbol("TranslationsManager");

const i18n = {
    install(app: App) {
        const manager = new TranslationsManager();
        app.provide(TranslationsSymbol, manager);
    },
};

export default i18n;