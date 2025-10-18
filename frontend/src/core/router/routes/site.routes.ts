import { RouteName } from "@/core/types/constants/route-name";
import { commonRoutes } from "./common.routes";

export const siteRoutes = [
    ...commonRoutes,
    {
        path: "/auth/sign-in",
        name: RouteName.AUTH.SIGN_IN,
        component: () => import("@/views/auth/sign-in.vue"),
    },
    {
        path: "/",
        component: () => import("@/views/site/index.vue"),
        children: [
            {
                path: "",
                name: RouteName.SITE.ROOT,
                redirect: { name: RouteName.SITE.DASHBOARD },
            },
            {
                path: "dashboard",
                component: () => import("@/views/site/dashboard/index.vue"),
                name: RouteName.SITE.DASHBOARD,
            },
            {
                path: "settings",
                component: () => import("@/views/site/settings/index.vue"),
                name: RouteName.SITE.SETTINGS,
            },
            {
                path: "media",
                component: () => import("@/views/site/media/index.vue"),
                name: RouteName.SITE.MEDIA,
            },
            {
                path: "products",
                component: () => import("@/views/site/products/index.vue"),
                name: RouteName.SITE.PRODUCTS,
            },
            {
                path: "orders",
                component: () => import("@/views/site/orders/index.vue"),
                name: RouteName.SITE.ORDERS,
            },
        ],
    },
];
