<script setup lang="ts">
import { AddBoxOutlined, BookmarkBorderOutlined } from '@vicons/material';
import { RouteName } from '@/core/types/constants/route-name';
import OrdersTable from '@/components/content/orders-table.vue';
import { inject, onMounted, ref } from 'vue';
import { TranslationsSymbol } from '@/core/i18n';
import type { TranslationsManager } from '@/core/i18n/manager';
import type { OrdersApi } from '@/core/api/modules/orders';
import { withErrorHandling } from '@/core/api/api-error-handler';
import type { ProductsApi } from '@/core/api/modules/products';
import type { OrderEntity } from '@/core/types/models/entities/order.entity';

const { t } = inject<TranslationsManager>(TranslationsSymbol)!;
const ordersApi = inject<OrdersApi>("OrdersApi")!;
const productsApi = inject<ProductsApi>("ProductsApi")!;

const productsCount = ref<number>(0);
const ordersCount = ref<number>(0);
const latestOrders = ref<OrderEntity[]>([]);

onMounted(async () => {
    productsCount.value = await withErrorHandling(productsApi.getProductsCount());
    ordersCount.value = await withErrorHandling(ordersApi.getOrdersCount());
})
</script>

<template>
    <n-space vertical>
        <n-flex justify="space-between" align="stretch" style="gap: 8px;">
            <router-link :to="{ name: RouteName.SITE.PRODUCTS.LIST }" style="flex: 1;">
                <n-button ghost type="default" size="large" style="width: 100%; height: 100%;">
                <template #icon>
                    <AddBoxOutlined
                    style="vertical-align: middle; transform: translateY(1px);"
                    />
                </template>
                {{ t?.products }}: {{ productsCount }}
                </n-button>
            </router-link>

            <router-link :to="{ name: RouteName.SITE.ORDERS.LIST }" style="flex: 1;">
                <n-button ghost type="default" size="large" style="width: 100%; height: 100%;">
                <template #icon>
                    <BookmarkBorderOutlined
                    style="vertical-align: middle; transform: translateY(1px);"
                    />
                </template>
                {{ t?.orders }}: {{ ordersCount }}
                </n-button>
            </router-link>
        </n-flex>

        <div></div>

        <n-card size="small">
            <div style="font-size: 28px; margin-bottom: 8px;">Latest orders</div>
            <orders-table :per_page="2" />
        </n-card>

    </n-space>
</template>
