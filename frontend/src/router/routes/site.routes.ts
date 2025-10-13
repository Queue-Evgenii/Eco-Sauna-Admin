import { RouteName } from "../../types/constants/route-name";
import { commonRoutes } from "./common.routes";

export const siteRoutes = [
    {
        path: "/auth/sign-in",
        name: RouteName.AUTH.SIGN_IN,
        component: () => import("../../views/auth/sign-in.vue"),
    },
    {
        path: "/",
        component: () => import("../../views/site/index.vue"),
        children: [
            ...commonRoutes,
            {
                path: "",
                name: RouteName.SITE.ROOT,
                redirect: { name: RouteName.SITE.DASHBOARD },
            },
            {
                path: "dashboard",
                component: () => import("../../views/site/dashboard/index.vue"),
                name: RouteName.SITE.DASHBOARD,
            },
            {
                path: "settings",
                component: () => import("../../views/site/settings/index.vue"),
                name: RouteName.SITE.SETTINGS,
            },
        ],
    },
];
