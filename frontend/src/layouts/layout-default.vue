<script setup lang="ts">
import { ref, computed, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Token } from "../types/models/utils/browser/token";
import { useUserStore } from "../stores/user";
import { RouteName } from "../types/constants/route-name";
import {
    LogOutFilled,
    WarningFilled,
    DashboardOutlined,
    SettingsFilled,
    ShoppingCartFilled,
    ViewListFilled,
} from "@vicons/material";
import { useThemeVars } from "naive-ui";
import { useDevice } from "../composables/use-device";

const isConfirmationVisible = ref(false);
const store = useUserStore();
const router = useRouter();
const route = useRoute();
const themeVars = useThemeVars();

const { isMobile } = useDevice()

const logout = () => {
    store.clearState();
    Token.remove();
    isConfirmationVisible.value = false;
    router.push({ name: RouteName.AUTH.SIGN_IN });
};

const openLogoutDialog = () => {
    isConfirmationVisible.value = true;
};

const menuItems = [
    {
        label: () => ((!isMobile.value || (isMobile.value && selectedKey.value === RouteName.SITE.DASHBOARD)) ? "Dashboard" : ""),
        key: RouteName.SITE.DASHBOARD,
        icon: DashboardOutlined,
    },
    {
        label: () => ((!isMobile.value || (isMobile.value && selectedKey.value === RouteName.SITE.SETTINGS)) ? "Settings" : ""),
        key: RouteName.SITE.SETTINGS,
        icon: SettingsFilled,
    },
    {
        label: () => ((!isMobile.value || (isMobile.value && selectedKey.value === RouteName.SITE.PRODUCTS)) ? "Sauna" : ""),
        key: RouteName.SITE.PRODUCTS,
        icon: ViewListFilled,
    },
    {
        label: () => ((!isMobile.value || (isMobile.value && selectedKey.value === RouteName.SITE.ORDERS)) ? "Orders" : ""),
        key: RouteName.SITE.ORDERS,
        icon: ShoppingCartFilled,
    },
];

const handleMenuSelect = (key: string) => {
    router.push({ name: key });
};

const selectedKey = computed(() => route.name);
</script>

<template>
    <div style="display: flex; flex-direction: column; height: 100vh;">
        <n-space
            vertical
            class="_container _header"
        >
            <n-flex :align="'center'" justify="space-between">
                <n-flex :align="'center'">
                    <img width="160" src="../assets/logo.png" />
                    <breadcrumbs />
                </n-flex>
                <n-flex :align="'center'">
                    <n-button @click="openLogoutDialog" type="primary">
                        <template #icon>
                            <LogOutFilled
                                style="
                                    vertical-align: middle;
                                    transform: translateY(1px);
                                "
                            />
                        </template>
                        Log Out
                    </n-button>
                </n-flex>
            </n-flex>
        </n-space>

        <n-layout has-sider style="flex:1 1 100%; position: relative;">
            <n-layout-sider
                v-if="!isMobile"
                bordered
                width="220"
            >
                <n-menu
                    :options="menuItems.map(i => ({
                        label: i.label,
                        key: i.key,
                        icon: () => h(i.icon),
                    }))"
                    :value="selectedKey"
                    @update:value="handleMenuSelect"
                    :collapsed-width="64"
                />
            </n-layout-sider>

            <n-layout-content class="_container">
                <slot></slot>
            </n-layout-content>
        </n-layout>

        <div
            v-if="isMobile"
            style="
                display: flex;
                justify-content: space-around;
                align-items: center;
                border-top: 1px solid #ccc;
                border-radius: 30px 30px 0 0;
                background-color: white;
                padding: 6px 0;
                position: sticky;
                bottom: 0;
                z-index: 100;
            "
        >
            <n-menu
                :options="menuItems.map(i => ({
                    label: i.label,
                    key: i.key,
                    icon: () => h(i.icon),
                }))"
                mode="horizontal"
                :value="selectedKey"
                @update:value="handleMenuSelect"
                :collapsed-width="64"
                style="width: auto;"
            />
        </div>

        <n-modal
            v-model:show="isConfirmationVisible"
            title="Log Out"
            preset="dialog"
        >
            <template #icon>
                <WarningFilled :style="{ color: themeVars.warningColor }" />
            </template>
            <div
                style="
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin-top: 16px;
                "
            >
                <p>Are you sure?</p>
                <div style="display: flex; justify-content: flex-end; gap: 0.5rem">
                    <n-button @click="isConfirmationVisible = false"
                        >Cancel</n-button
                    >
                    <n-button type="warning" @click="logout">Log Out</n-button>
                </div>
            </div>
        </n-modal>
    </div>
</template>
