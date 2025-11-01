<script setup lang="ts">
import { ref, onMounted, h, inject } from "vue";
import {
    NDataTable,
    NButton,
    NTag,
    NSpace,
    NIcon,
    useThemeVars,
    NFlex,
} from "naive-ui";
import type { DataTableColumns } from "naive-ui";
import { RouteName } from "@/core/types/constants/route-name";
import {
    AddBoxFilled,
    DeleteFilled,
    EditFilled,
    ImageOutlined,
    WarningFilled,
} from "@vicons/material";
import type { ProductEntity } from "@/core/types/models/entities/product.entity";
import type { ProductsApi } from "@/core/api/modules/products";
import { withErrorHandling } from "@/core/api/api-error-handler";
import { RouterLink } from "vue-router";
import { TranslationsSymbol } from "@/core/i18n";
import type { TranslationsManager } from "@/core/i18n/manager";
import { useDevice } from "@/composables/use-device";
import type { MediaFileEntity } from "@/core/types/models/entities/media-file.entity";
import type { MediaApi } from "@/core/api/modules/media";

const productsApi = inject<ProductsApi>("ProductsApi")!;
const mediaApi = inject<MediaApi>("MediaApi")!;
const products = ref<ProductEntity[]>([]);
const themeVars = useThemeVars();
const { t } = inject<TranslationsManager>(TranslationsSymbol)!;
const { isMobile } = useDevice();
const apiURL = import.meta.env.VITE_API_URL;

const fetchProducts = async () => {
    const res = await withErrorHandling(productsApi.getProducts());
    console.log("Fetched products:", res);
    if (Array.isArray(res)) products.value = res;
};

onMounted(() => {
    fetchProducts();
});


// ========= DELETE MODAL ============
const deletingProduct = ref<ProductEntity>();
const openDeleteModal = (row: ProductEntity) => {
    deletingProduct.value = { ...row };
};
const closeDeleteModal = () => {
    deletingProduct.value = undefined;
};
const deleteProduct = async () => {
    if (deletingProduct.value === undefined) return;
    const id = deletingProduct.value.id;
    await withErrorHandling(productsApi.deleteProduct(id));
    products.value = products.value.filter((p) => p.id !== id);
    closeDeleteModal();
};


// ========= IMAGE MODAL ============
const viewingImage = ref<MediaFileEntity>();
const imageForm = ref<{ alt_text: string; description: string }>({
    alt_text: "",
    description: "",
});

const openImageModal = (image: MediaFileEntity) => {
    viewingImage.value = image;
    imageForm.value = {
        alt_text: image.alt_text || "",
        description: image.description || "",
    };
};

const closeImageModal = () => {
    viewingImage.value = undefined;
};

const saveImageMeta = async () => {
    if (!viewingImage.value?.id) return;
    const res = await withErrorHandling(
        mediaApi.updateFile(viewingImage.value.id, {
                ...viewingImage.value,
                alt_text: imageForm.value.alt_text,
                description: imageForm.value.description,
        })
    );
    const idx = products.value.findIndex(p => p.image?.id === res.id);
    if (idx !== -1 && products.value[idx]) {
        products.value[idx].image = res;
    }
    closeImageModal();
};

const columns: DataTableColumns<ProductEntity> = [
    { title: "ID", key: "id" },
    { title: "Title", key: "title" },
    {
        title: "Area",
        key: "area",
        render(row) {
            return row.area
                ? h(NTag, null, { default: () => `${row.area} m²` })
                : "-";
        },
    },
    {
        title: "Capacity",
        key: "capacity",
        render(row) {
            return row.capacity
                ? h(NTag, null, { default: () => row.capacity?.toString() })
                : "-";
        },
    },
    {
        title: "Max Temp",
        key: "max_temperature",
        render(row) {
            return row.max_temperature
                ? h(NTag, null, { default: () => `${row.max_temperature}°C` })
                : "-";
        },
    },
    {
        title: "Image",
        key: "image",
        render(row) {
            return row.image
                ? h("img", {
                      src: `${apiURL}/uploads/${row.image.filename}`,
                      alt: row.image.alt_text,
                      width: 120,
                      height: 80,
                      style: "object-fit: contain; border: 1px solid #eee; border-radius: 4px;",
                      onClick: () => row.image ? openImageModal(row.image) : () => console.log("No image"),
                  })
                : h(
                      NFlex,
                      {
                            vertical: true,
                            justify: "center",
                            align: "center",
                            style: "width: 120px; height: 80px; border: 1px dashed #ccc; border-radius: 4px;",
                      },
                      {
                          default: () =>
                              h(ImageOutlined, {
                                  style: "font-size: 24px; color: #ccc;",
                              }),
                      },
                  );
        },
    },
    {
        title: "Actions",
        key: "actions",
        width: 220,
        render(row) {
            return h(NSpace, null, () => [
                h(
                    RouterLink,
                    {
                        to: {
                            name: RouteName.SITE.PRODUCTS.EDIT,
                            params: { id: row.id },
                        },
                    },
                    {
                        default: () =>
                            h(
                                NButton,
                                { size: "medium", type: "info" },
                                {
                                    icon: () => h(NIcon, null, { default: () => h(EditFilled) }),
                                    default: () => "Edit",
                                },
                            ),
                    },
                ),
                h(
                    NButton,
                    {
                        size: "medium",
                        type: "error",
                        onClick: () => openDeleteModal(row),
                    },
                    {
                        icon: () => () => h(NIcon, null, { default: () => h(DeleteFilled) }),
                        default: () => "Delete",
                    },
                ),
            ]);
        },
    },
];
</script>

<template>
    <router-link
        :to="{ name: RouteName.SITE.PRODUCTS.ADD }"
        style="display: inline-block; margin-bottom: 16px"
    >
        <n-button ghost type="primary" size="large">
            <template #icon>
                <AddBoxFilled
                    style="vertical-align: middle; transform: translateY(1px)"
                />
            </template>
            Add Product
        </n-button>
    </router-link>

    <div v-if="isMobile" class="mobile-cards">
        <n-space vertical :size="16">
            <n-card
                v-for="product in products"
                :key="product.id"
                hoverable
                style="width: 100%"
            >
                <template #cover>
                    <img
                        v-if="product.image"
                        :src="`${apiURL}/uploads/${product.image?.filename}`"
                        :alt="product.image?.alt_text"
                        style="width: 100%; height: 200px; object-fit: contain"
                        @click="openImageModal(product.image)"
                    />
                    <n-flex
                        vertical
                        align="center"
                        justify="center"
                        v-else
                        style="width: auto; height: 200px"
                    >
                        <ImageOutlined />
                    </n-flex>
                </template>

                <h3>{{ product.title }}</h3>
                <n-flex>
                    <n-tag type="info" v-if="product.area">Area: {{ product.area }} m²</n-tag>
                    <n-tag type="info" v-if="product.capacity">Capacity: {{ product.capacity }}</n-tag>
                    <n-tag type="info" v-if="product.max_temperature">
                        Max Temp: {{ product.max_temperature }}°C
                    </n-tag>
                </n-flex>

                <n-space style="margin-top: 12px">
                    <router-link
                        :to="{
                            name: RouteName.SITE.PRODUCTS.EDIT,
                            params: { id: product.id },
                        }"
                    >
                        <n-button size="large" type="info"> Edit </n-button>
                    </router-link>
                    <n-button
                        size="large"
                        type="error"
                        @click="openDeleteModal(product)"
                    >
                        Delete
                    </n-button>
                </n-space>
            </n-card>
        </n-space>
    </div>

    <n-data-table v-else :columns="columns" :data="products" bordered />

    <n-modal
        v-model:show="deletingProduct"
        :title="`${t?.delete} ${deletingProduct?.title}`"
        preset="dialog"
        v-model:on-after-leave="closeDeleteModal"
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
            <p>{{ t?.r_u_sure }}</p>
            <div style="display: flex; justify-content: flex-end; gap: 0.5rem">
                <n-button @click="closeDeleteModal">{{ t?.cancel }}</n-button>
                <n-button type="error" @click="deleteProduct">{{
                    t?.delete
                }}</n-button>
            </div>
        </div>
    </n-modal>

    <n-modal
        v-model:show="viewingImage"
        preset="card"
        title="Image Preview & Metadata"
        style="max-width: 600px"
        @after-leave="closeImageModal"
    >
        <div style="display: flex; flex-direction: column; gap: 1rem">
            <img
                v-if="viewingImage"
                :src="`${apiURL}/uploads/${viewingImage.filename}`"
                :alt="viewingImage.alt_text"
                style="width: 100%; height: 400px; border-radius: 8px; object-fit: contain;"
            />

            <n-form :model="imageForm" label-placement="top">
                <n-form-item label="Alt text">
                    <n-input v-model:value="imageForm.alt_text" placeholder="Alt text" />
                </n-form-item>
                <n-form-item label="Description">
                    <n-input
                        v-model:value="imageForm.description"
                        type="textarea"
                        placeholder="Description"
                        autosize
                    />
                </n-form-item>
            </n-form>

            <div style="display: flex; justify-content: flex-end; gap: 0.5rem">
                <n-button @click="closeImageModal">Cancel</n-button>
                <n-button type="primary" @click="saveImageMeta">Save</n-button>
            </div>
        </div>
    </n-modal>
</template>
