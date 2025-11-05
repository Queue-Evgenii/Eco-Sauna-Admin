<script setup lang="ts">
import { withErrorHandling } from "@/core/api/api-error-handler";
import type { OrdersApi } from "@/core/api/modules/orders";
import { TranslationsSymbol } from "@/core/i18n";
import type { TranslationsManager } from "@/core/i18n/manager";
import {
    OrderStatus,
    type OrderEntity,
} from "@/core/types/models/entities/order.entity";
import { AttachmentOutlined } from "@vicons/material";
import {
    useMessage,
    NCard,
    NDescriptions,
    NDescriptionsItem,
    NTag,
    NSkeleton,
} from "naive-ui";
import { inject, onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";

const message = useMessage();
const route = useRoute();
const orderId = Number(route.params.id);
const ordersApi = inject<OrdersApi>("OrdersApi")!;
const { t } = inject<TranslationsManager>(TranslationsSymbol)!;
const order = ref<OrderEntity>();
const loading = ref(true);

const fetchOrder = async () => {
    try {
        loading.value = true;
        order.value = await withErrorHandling(ordersApi.getOrderById(orderId));
    } catch (err) {
        message.error(t.value?.fetch_data_error ?? "Ошибка загрузки данных");
    } finally {
        loading.value = false;
    }
};

const updateStatus = async (status: OrderStatus) => {
    if (order.value === undefined) return;
    try {
        const res = await withErrorHandling(
            ordersApi.updateOrderStatus(orderId, { status }),
        );
        order.value.status = res.status;
        message.success("Successfully updated");
    } catch {
        message.error("Something went wrong");
    }
};

onMounted(fetchOrder);
</script>

<template>
    <div>
        <n-card
            v-if="!loading && order"
            :title="`№${order.id}`"
            bordered
            size="small"
        >
            <n-descriptions
                label-placement="left"
                :column="1"
                bordered
                size="small"
                label-style="min-width: 140px; max-width: 200px;"
            >
                <n-descriptions-item :label="t?.status">
                    <div style="display: inline-block; min-width: 120px;">
                        <n-select
                          size="small"
                          :options="
                              Object.values(OrderStatus).map((el) => ({
                                  label: el.toUpperCase(),
                                  value: el,
                              }))
                          "
                          :value="order.status"
                          @update:value="(v: OrderStatus) => updateStatus(v)"
                      />
                    </div>
                </n-descriptions-item>

                <n-descriptions-item :label="t?.product_name">
                    {{ order.product?.title }}
                </n-descriptions-item>

                <n-descriptions-item :label="t?.customer">
                    {{ order.customer_name }}
                </n-descriptions-item>

                <n-descriptions-item :label="t?.phone">
                    {{ order.customer_phone }}
                </n-descriptions-item>

                <n-descriptions-item label="Email">
                    {{ order.customer_email }}
                </n-descriptions-item>

                <n-descriptions-item :label="t?.message">
                    {{ order.customer_message || "-" }}
                </n-descriptions-item>

                <n-descriptions-item :label="t?.start_date">
                    {{ new Date(order.start_date).toLocaleDateString() }}
                </n-descriptions-item>

                <n-descriptions-item :label="t?.end_date">
                    {{ new Date(order.end_date).toLocaleDateString() }}
                </n-descriptions-item>

                <n-descriptions-item :label="t?.created_at">
                    {{ new Date(order.created_at).toLocaleString() }}
                </n-descriptions-item>

                <n-descriptions-item :label="t?.updated_at">
                    {{ new Date(order.updated_at).toLocaleString() }}
                </n-descriptions-item>

                <n-descriptions-item
                    :label="t?.total"
                    v-if="order.total_price"
                >
                    {{ order.total_price.toLocaleString() }} ₽
                </n-descriptions-item>
            </n-descriptions>
        </n-card>

        <div v-else-if="loading">
            <n-card>
                <n-skeleton text :repeat="8" />
            </n-card>
        </div>

        <div v-else>Заказ не найден</div>
    </div>
</template>

<style scoped></style>
