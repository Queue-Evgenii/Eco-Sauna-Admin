<script setup lang="ts">
import { ref, onMounted, h, inject, computed } from "vue";
import {
    NDataTable,
    NButton,
    NTag,
    NSpace,
    NIcon,
    useThemeVars,
    NSelect,
    useMessage,
    NFlex,
    NDivider,
} from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import {
    DeleteFilled,
    WarningFilled,
    EditFilled,
} from "@vicons/material";
import { withErrorHandling } from "@/core/api/api-error-handler";
import { TranslationsSymbol } from "@/core/i18n";
import type { TranslationsManager } from "@/core/i18n/manager";
import { useDevice } from "@/composables/use-device";
import type { OrdersApi } from "@/core/api/modules/orders";
import { OrderStatus, type OrderEntity } from "@/core/types/models/entities/order.entity";
import { RouterLink } from "vue-router";
import { RouteName } from "@/core/types/constants/route-name";

const message = useMessage();
const ordersApi = inject<OrdersApi>("OrdersApi")!;
const orders = ref<OrderEntity[]>([]);
const themeVars = useThemeVars();
const { t } = inject<TranslationsManager>(TranslationsSymbol)!;
const { isMobile } = useDevice();

const fetchOrders = async () => {
    const res = await withErrorHandling(ordersApi.getOrders());
    if (Array.isArray(res)) orders.value = res;
};

onMounted(() => {
    fetchOrders();
});


// ========= DELETE MODAL ============
const deletingItem = ref<OrderEntity>();
const openDeleteModal = (row: OrderEntity) => {
    deletingItem.value = { ...row };
};
const closeDeleteModal = () => {
    deletingItem.value = undefined;
};
const deleteProduct = async () => {
    if (!deletingItem.value) return;
    const id = deletingItem.value.id;
    await withErrorHandling(ordersApi.deleteOrder(id));
    orders.value = orders.value.filter((p) => p.id !== id);
    closeDeleteModal();
};
// ========= END DELETE MODAL ============

const updateStatus = async (order: OrderEntity, status: OrderStatus) => {
    try {
        const res = await withErrorHandling(ordersApi.updateOrderStatus(order.id, { status }));
        order.status = res.status;
        message.success("Successfully updated");
    } catch {
        message.error("Something went wrong");
    }
};

const columns = computed<DataTableColumns<OrderEntity>>(() => [
    { title: "ID", key: "id" },
    {
        title: t.value?.product_name,
        key: "title",
        width: 150,
        render(row) {
            return row.product.title
                ? h("div", null, { default: () => row.product.title })
                : "-";
        },
    },
    {
        title: t.value?.customer,
        key: "customer_info",
        render(row) {
            return h(
                "div",
                { class: "customer-cell" },
                [
                    h("div", { class: "customer-name" }, row.customer_name),
                    h("div", { class: "customer-phone" }, row.customer_phone),
                    row.customer_email
                        ? h("div", { class: "customer-email" }, row.customer_email)
                        : null,
                ]
            );
        },
    },
    {
        title: t.value?.date,
        key: "date",
        render(row) {
            return h(NTag, null, { default: () => `${new Date(row.start_date).toLocaleDateString() ?? '~'} - ${new Date(row.end_date).toLocaleDateString() ?? '~'}` });
        },
    },
    {
        title: t.value?.created_at,
        key: "created_at",
        render(row) {
            return h(NTag, null, { default: () => new Date(row.created_at).toLocaleString() });
        },
    },
    {
        title: t.value?.actions,
        key: "actions",
        width: 350,
        render(row) {
            return h(
                NFlex,
                { class: "actions-cell" },
                () => [
                    h(
                        NSelect,
                        {
                            size: "small",
                            style: "width: 120px",
                            options: Object.values(OrderStatus).map(el => ({
                                label: el.toUpperCase(),
                                value: el,
                            })),
                            value: row.status as unknown as string,
                            onUpdateValue: (value: OrderStatus) => updateStatus(row, value),
                        }
                    ),
                    h(
                        RouterLink,
                        {
                            to: {
                                name: RouteName.SITE.ORDERS.EDIT,
                                params: { id: row.id },
                            },
                        },
                        {
                            default: () =>
                                h(
                                    NButton,
                                    { size: "small", type: "info" },
                                    {
                                        icon: () => h(NIcon, null, { default: () => h(EditFilled) }),
                                        default: () => t.value?.edit,
                                    },
                                ),
                        },
                    ),
                    h(
                        NButton,
                        {
                            size: "small",
                            type: "error",
                            onClick: () => openDeleteModal(row),
                        },
                        {
                            icon: () => h(NIcon, null, { default: () => h(DeleteFilled) }),
                            default: () => t.value?.delete,
                        }
                    ),
                ]
            );
        },
    },
]);
</script>

<template>
    <div v-if="isMobile" class="orders-cards">
        <div v-for="order in orders" :key="order.id" class="order-card">
            <div><b>ID:</b> {{ order.id }}</div>
            <div><b>{{ t?.product_name }}:</b> {{ order.product.title }}</div>
            <div><b>{{ t?.customer }}:</b> {{ order.customer_name }}</div>
            <div><b>{{ t?.phone }}:</b> {{ order.customer_phone }}</div>
            <div><b>{{ t?.date }}:</b> {{ order.start_date }} - {{ order.end_date }}</div>

            <n-divider style="margin: 12px 0" />

            <n-flex :wrap="false">
                <n-select
                    size="medium"
                    style="width: 100%; flex: 1 1 50%;"
                    :options="Object.values(OrderStatus).map(el => ({ label: el.toUpperCase(), value: el }))"
                    :value="order.status"
                    @update:value="(v) => updateStatus(order, v)"
                />
                <router-link :to="{ name: RouteName.SITE.ORDERS.EDIT, params: { id: order.id } }" style="flex: 1 1 50%;">
                    <n-button size="medium" type="info" block>
                        <template #icon>
                            <n-icon><EditFilled /></n-icon>
                        </template>
                        {{ t?.edit }}
                    </n-button>
                </router-link>
            </n-flex>

            <n-divider style="margin: 12px 0" />

            <n-button size="medium" type="error" block @click="openDeleteModal(order)">
                <template #icon>
                    <n-icon><DeleteFilled /></n-icon>
                </template>
                {{ t?.delete }}
            </n-button>
        </div>
    </div>

    <n-data-table v-else :columns="columns" :data="orders" bordered />

    <n-modal
        v-model:show="deletingItem"
        :title="`${t?.delete}? ID: ${deletingItem?.id}`"
        preset="dialog"
        @after-leave="closeDeleteModal"
    >
        <template #icon>
            <WarningFilled :style="{ color: themeVars.warningColor }" />
        </template>
        <div class="delete-modal-content">
            <p>{{ t?.r_u_sure }}</p>
            <div class="delete-modal-actions">
                <n-button @click="closeDeleteModal">{{ t?.cancel }}</n-button>
                <n-button type="error" @click="deleteProduct">{{ t?.delete }}</n-button>
            </div>
        </div>
    </n-modal>
</template>

<style scoped>
.customer-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  line-height: 1.2;
}

.customer-name {
  font-weight: 600;
}

.customer-phone,
.customer-email {
  font-size: 0.875rem;
  color: var(--n-text-color-disabled);
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.orders-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-card {
  background: var(--n-card-color);
  border: 1px solid var(--n-border-color);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--n-box-shadow);
}

.order-card > div {
  margin-bottom: 4px;
}

@media (max-width: 768px) {
  .actions-cell {
    flex-direction: column;
    align-items: stretch;
  }

  .actions-cell .n-button,
  .actions-cell .n-select {
    width: 100% !important;
  }

  .customer-cell {
    gap: 4px;
  }
}
.delete-modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 16px;
}
.delete-modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
</style>
