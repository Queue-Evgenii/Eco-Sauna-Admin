
export const RouteName = {
    SITE: {
        ROOT: "site_root",
        DASHBOARD: "dashboard",
        SETTINGS: "settings",
        PRODUCTS: {
            LIST: "products",
            ADD: "add_product",
            EDIT: "edit_product",
        },
        ORDERS: "orders",
        MEDIA: "media"
    },

    AUTH: {
        SIGN_IN: "sign-in",
    },

    NOT_FOUND: "not-found",
    FORBIDDEN: "forbidden",
} as const;