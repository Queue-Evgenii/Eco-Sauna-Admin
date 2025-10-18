<script setup lang="ts">
import { AddBoxOutlined, BookmarkBorderOutlined } from '@vicons/material';
import { RouteName } from '@/core/types/constants/route-name';
import OrdersTable from '@/components/content/orders-table.vue';
import { inject } from 'vue';
import { TranslationsSymbol } from '@/core/i18n';
import type { TranslationsManager } from '@/core/i18n/manager';

const { t } = inject<TranslationsManager>(TranslationsSymbol)!;
</script>

<template>
    <n-space vertical>
        <n-flex justify="space-between" align="stretch" style="gap: 8px;">
            <router-link :to="{ name: RouteName.SITE.PRODUCTS }" style="flex: 1;">
                <n-button ghost type="default" size="large" style="width: 100%; height: 100%;">
                <template #icon>
                    <AddBoxOutlined
                    style="vertical-align: middle; transform: translateY(1px);"
                    />
                </template>
                {{ t?.products }}: 15
                </n-button>
            </router-link>

            <router-link :to="{ name: RouteName.SITE.ORDERS }" style="flex: 1;">
                <n-button ghost type="default" size="large" style="width: 100%; height: 100%;">
                <template #icon>
                    <BookmarkBorderOutlined
                    style="vertical-align: middle; transform: translateY(1px);"
                    />
                </template>
                {{ t?.orders }}: 189
                </n-button>
            </router-link>
        </n-flex>

        <div></div>

        <n-card size="small">
            <div style="font-size: 28px; margin-bottom: 8px;">Latest orders</div>
            <orders-table />
        </n-card>

    </n-space>
</template>
