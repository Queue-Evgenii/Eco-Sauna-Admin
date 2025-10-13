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
} from "@vicons/material";
import { useThemeVars } from "naive-ui";

const isConfirmationVisible = ref(false);
const store = useUserStore();
const router = useRouter();
const route = useRoute();
const themeVars = useThemeVars();

// Логика выхода
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
        label: "Dashboard",
        key: RouteName.SITE.DASHBOARD,
        icon: () => h(DashboardOutlined),
    },
    {
        label: "Settings",
        key: RouteName.SITE.SETTINGS,
        icon: () => h(SettingsFilled),
    },
];

const handleMenuSelect = (key: string) => {
    router.push({ name: key });
};

const selectedKey = computed(() => route.name);
</script>

<template>
    <div style="display: flex; flex-direction: column;">
        <n-space
            vertical
            style="
                max-width: 1920px;
                padding: 16px 24px;
                background-color: #291b0f;
            "
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
        <n-layout has-sider style="flex:1 1 100%">
            <n-layout-sider bordered width="220">
                <n-menu
                    :options="menuItems"
                    :value="selectedKey"
                    @update:value="handleMenuSelect"
                    :collapsed-width="64"
                />
            </n-layout-sider>

            <n-layout-content style="padding: 16px 24px">
                <slot></slot>
            </n-layout-content>
        </n-layout>
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
</template>
