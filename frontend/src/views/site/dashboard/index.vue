<script setup lang="ts">
import { AddBoxOutlined, BookmarkBorderOutlined } from '@vicons/material';
import { RouteName } from '../../../types/constants/route-name';
import OrdersTable from '../../../components/orders-table.vue';

</script>

<template>
    <n-space vertical>
        <n-flex>
            <router-link :to="{ name: RouteName.SITE.PRODUCTS }" style="flex: 1 1 auto;">
                <n-button ghost type="default" size="large" style="width: 100%;">
                    <template #icon>
                        <AddBoxOutlined
                            style="
                                vertical-align: middle;
                                transform: translateY(1px);
                            "
                        />
                    </template>
                    Products: 15
                </n-button>
            </router-link>
            <router-link :to="{ name: RouteName.SITE.ORDERS }" style="flex: 1 1 auto;">
                <n-button ghost type="default" size="large" style="width: 100%;">
                    <template #icon>
                        <BookmarkBorderOutlined
                            style="
                                vertical-align: middle;
                                transform: translateY(1px);
                            "
                        />
                    </template>
                    Orders: 189
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
