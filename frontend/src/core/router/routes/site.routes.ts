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
                children: [
                    {
                        path: "",
                        component: () => import("@/views/site/products/index.vue"),
                        name: RouteName.SITE.PRODUCTS.LIST,
                    },
                    {
                        path: "add",
                        component: () => import("@/views/site/products/add.vue"),
                        name: RouteName.SITE.PRODUCTS.ADD,
                    },
                    {
                        path: "edit/:id",
                        component: () => import("@/views/site/products/edit.vue"),
                        name: RouteName.SITE.PRODUCTS.EDIT,
                    },
                ]
            },
            {
                path: "orders",
                component: () => import("@/views/site/orders/index.vue"),
                name: RouteName.SITE.ORDERS,
            },
        ],
    },
];
