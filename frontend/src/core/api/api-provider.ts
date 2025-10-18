import { type App } from "vue";
import axios from "axios";
import { AuthApi } from "./modules/auth";
import { Token } from "@/core/types/models/utils/browser/token";
import { UserApi } from "./modules/user";
import { ProductsApi } from "./modules/products";
import { MediaApi } from "./modules/media";

const apiProvider = {
    install(app: App) {
        const apiClient = axios.create({
            baseURL: import.meta.env.VITE_API_URL + "/api",
            timeout: 10000,
            headers: {
                ContentType: "application/json",
                Accept: "application/json",
            },
        });
        apiClient.interceptors.request.use((config) => {
            if (Token.exists()) {
                config.headers.Authorization = `Bearer ${Token.get()}`;
            }
            return config;
        });

        app.provide("AuthApi", new AuthApi(apiClient));
        app.provide("UserApi", new UserApi(apiClient));
        app.provide("ProductsApi", new ProductsApi(apiClient));
        app.provide("MediaApi", new MediaApi(apiClient));
    },
};

export default apiProvider;
