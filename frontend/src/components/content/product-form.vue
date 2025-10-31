<script setup lang="ts">
import { inject, ref, onMounted, computed } from "vue";
import {
    NForm,
    NFormItem,
    NInput,
    NInputNumber,
    NButton,
    NUpload,
    useMessage,
    type FormRules,
    type UploadFileInfo,
    useThemeVars,
} from "naive-ui";
import type { MediaApi } from "@/core/api/modules/media";
import type { ProductsApi } from "@/core/api/modules/products";
import type { ProductDto } from "@/core/types/models/dto/product-dto";
import { useRouter } from "vue-router";
import { RouteName } from "@/core/types/constants/route-name";
import type { ProductPriceDto } from "@/core/types/models/dto/product-price-dto";
import { AddFilled, DeleteFilled, WarningFilled } from "@vicons/material";
import { useDevice } from "@/composables/use-device";
import type { TranslationsManager } from "@/core/i18n/manager";
import { TranslationsSymbol } from "@/core/i18n";
import WysiwygEditor from "@/components/ui/wysiwyg-editor.vue";

const message = useMessage();
const productsApi = inject<ProductsApi>("ProductsApi")!;
const mediaApi = inject<MediaApi>("MediaApi")!;
const router = useRouter();
const { isMobile } = useDevice();
const { t } = inject<TranslationsManager>(TranslationsSymbol)!;
const themeVars = useThemeVars();

const dateForDelete = ref<string>();

const props = defineProps<{
    product?: ProductDto;
    productId?: number;
    mode: "create" | "edit";
}>();

const emit = defineEmits<{
    (e: "submitted"): void;
}>();

const daysOfWeek = computed(() => [
    { label: t.value?.mon, index: 1 },
    { label: t.value?.tue, index: 2 },
    { label: t.value?.wed, index: 3 },
    { label: t.value?.thu, index: 4 },
    { label: t.value?.fri, index: 5 },
    { label: t.value?.sat, index: 6 },
    { label: t.value?.sun, index: 0 },
]);

const weekdayPrices = ref<Record<number, number | null>>({});
const datePrices = ref<Record<string, number>>({});
const newDate = ref<number | null>(null);
const newPrice = ref<number | null>(null);

const addDatePrice = () => {
    if (!newDate.value || !newPrice.value) return;

    const date = new Date(newDate.value);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const dateStr = `${year}-${month}-${day}`;

    datePrices.value[dateStr] = newPrice.value;
    newDate.value = null;
    newPrice.value = null;
};
const deleteDatePrice = (date: string) => {
    delete datePrices.value[date];
    closeDateDeleteConfirmation();
};

const form = ref<ProductDto & { base_price?: number }>({
    title: "",
    description: "",
    area: undefined,
    capacity: undefined,
    max_temperature: undefined,
    image_id: undefined,
    base_price: undefined,
    prices: [],
});

const productForm = ref();
const uploadedFile = ref<File>();
const fileList = ref<UploadFileInfo[]>([]);

const rules = computed<FormRules>(() => ({
    title: [
        {
            required: true,
            message: t.value?.required,
            trigger: ["blur", "input"],
        },
        { min: 3, message: t.value?.min_length_3, trigger: ["blur", "input"] },
    ],
    description: [
        {
            min: 10,
            message: t.value?.min_length_10,
            trigger: ["blur", "input"],
        },
    ],
    area: [
        {
            type: "number",
            min: 1,
            message: t.value?.greater_than_0,
            trigger: ["blur", "change"],
        },
    ],
    capacity: [
        {
            type: "number",
            min: 1,
            message: t.value?.greater_than_0,
            trigger: ["blur", "change"],
        },
    ],
    max_temperature: [
        {
            type: "number",
            min: 1,
            message: t.value?.greater_than_0,
            trigger: ["blur", "change"],
        },
    ],
    base_price: [
        {
            required: true,
            type: "number",
            min: 1,
            message: t.value?.greater_than_0,
            trigger: ["blur", "change"],
        },
    ],
}));

const fetchProduct = async () => {
    if (props.product) {
        setProduct(props.product);
    } else if (props.productId) {
        try {
            const product = await productsApi.getProductById(props.productId);
            setProduct(product);
        } catch (err) {
            message.error(t.value?.fetch_data_error ?? "");
        }
    }
};

const setProduct = (product: ProductDto) => {
    form.value = {
        ...product,
        area: product.area ? Number(product.area) : undefined,
        base_price: Number(
            product.prices?.find((el) => !el.date && !el.weekday)?.price,
        ),
    };

    product.prices
        ?.filter((el) => el.price && el.weekday && !el.date)
        .forEach((el) => {
            if (el.weekday) {
                weekdayPrices.value[el.weekday] = Number(el.price);
            }
        });

    product.prices
        ?.filter((el) => el.price && el.date && !el.weekday)
        .forEach((el) => {
            if (el.date) {
                datePrices.value[el.date] = Number(el.price);
            }
        });

    if (
        product.image &&
        typeof product.image === "object" &&
        product.image.filename
    ) {
        fileList.value = [
            {
                id: `${product.image_id}`,
                name: "Текущее изображение",
                status: "finished",
                url:
                    import.meta.env.VITE_API_URL +
                    "/uploads/" +
                    product.image.filename,
            },
        ];
    } else {
        fileList.value = [];
    }
};

const handleUploadChange = ({
    file,
    fileList: newFileList,
}: {
    file: UploadFileInfo;
    fileList: UploadFileInfo[];
}) => {
    fileList.value = newFileList;
    if (file.file) {
        uploadedFile.value = file.file;
    }
};

const submitForm = () => {
    console.log(form.value);
    productForm.value?.validate(async (errors: any) => {
        if (errors) {
            message.error(t.value?.validation_product_error ?? "");
            return;
        }

        try {
            let res = undefined;
            if (uploadedFile.value) {
                res = await mediaApi.uploadFile(uploadedFile.value);
            }

            form.value.image_id = res ? res.id : form.value.image_id;

            const prices: ProductPriceDto[] = [];

            if (form.value.base_price) {
                prices.push({
                    price: form.value.base_price,
                    weekday: null,
                    date: null,
                });
            }

            for (const [weekday, price] of Object.entries(
                weekdayPrices.value,
            )) {
                if (price) {
                    prices.push({
                        price: Number(price),
                        weekday: Number(weekday),
                        date: null,
                    });
                }
            }

            for (const [date, price] of Object.entries(datePrices.value)) {
                prices.push({
                    price: Number(price),
                    date,
                    weekday: null,
                });
            }

            const payload = {
                title: form.value.title,
                description: form.value.description,
                area: form.value.area,
                capacity: form.value.capacity,
                max_temperature: form.value.max_temperature,
                image_id: form.value.image_id,
                prices,
            };

            if (props.mode === "create") {
                await productsApi.createProduct(payload);
                message.success(t.value?.product_created ?? "");
            } else {
                await productsApi.updateProduct(props.productId!, payload);
                message.success(t.value?.product_updated ?? "");
            }

            emit("submitted");
            resetForm();
            router.push({ name: RouteName.SITE.PRODUCTS.LIST });
        } catch (err) {
            message.error(t.value?.post_data_error ?? "");
        }
    });
};

const resetForm = () => {
    productForm.value?.restoreValidation();
    uploadedFile.value = undefined;
    fetchProduct();
};

const closeDateDeleteConfirmation = () => (dateForDelete.value = undefined);

onMounted(fetchProduct);
</script>

<template>
    <n-form
        ref="productForm"
        :model="form"
        :rules="rules"
        label-width="120px"
        style="padding-right: 5px"
    >
        <n-form-item :label="t?.product_name" path="title">
            <n-input
                v-model:value="form.title"
                :placeholder="t?.product_name"
            />
        </n-form-item>
        <n-form-item :label="t?.product_description" path="description">
            <wysiwyg-editor
                v-model="form.description"
                :placeholder="t?.product_description"
                :minlines="4"
                :maxlines="8"
            />
        </n-form-item>

        <n-form-item :label="t?.product_area" path="area">
            <n-input-number
                v-model:value="form.area"
                :placeholder="t?.product_area"
                :min="0"
                :step="0.1"
            />
        </n-form-item>

        <n-form-item :label="t?.product_capacity" path="capacity">
            <n-input-number
                v-model:value="form.capacity"
                :placeholder="t?.product_capacity"
                :min="0"
            />
        </n-form-item>

        <n-form-item :label="t?.product_max_temperature" path="max_temperature">
            <n-input-number
                v-model:value="form.max_temperature"
                :placeholder="t?.product_max_temperature"
                :min="0"
            />
        </n-form-item>

        <n-form-item :label="t?.product_image" path="image">
            <n-upload
                v-model:file-list="fileList"
                list-type="image-card"
                :max="1"
                :default-upload="false"
                accept="image/*"
                @change="handleUploadChange"
                class="custom-upload"
            >
                <n-button>{{ t?.add }}</n-button>
            </n-upload>
        </n-form-item>

        <n-form-item :label="t?.product_base_price" path="base_price">
            <n-input-number
                v-model:value="form.base_price"
                :placeholder="t?.product_price"
                :min="0"
                style="width: 375px"
            />
        </n-form-item>

        <n-form-item :label="t?.product_prices_by_weekday">
            <n-space vertical>
                <n-space
                    v-for="day in daysOfWeek"
                    :key="day.index"
                    align="center"
                >
                    <div style="width: 30px">{{ day.label }}:</div>
                    <n-input-number
                        v-model:value="weekdayPrices[day.index]"
                        :placeholder="t?.product_price"
                        :min="0"
                        style="width: 333px"
                    />
                </n-space>
            </n-space>
        </n-form-item>

        <n-form-item :label="t?.product_prices_by_date">
            <n-space vertical>
                <n-flex
                    align="center"
                    v-for="(price, date) in datePrices"
                    :key="date"
                >
                    <n-input :value="date" disabled style="width: 150px" />
                    <n-input-number
                        v-model:value="datePrices[date]"
                        :placeholder="t?.product_price"
                        :min="0"
                        style="width: 150px"
                    />
                    <n-button
                        size="medium"
                        type="error"
                        @click="dateForDelete = date"
                        :style="{ width: isMobile ? '50px' : '125px' }"
                    >
                        <template #icon>
                            <DeleteFilled
                                style="
                                    vertical-align: middle;
                                    transform: translateY(1px);
                                "
                                :style="{
                                    transform: isMobile
                                        ? 'translateX(3px)'
                                        : '',
                                }"
                            />
                        </template>
                        {{ !isMobile ? t?.delete : "" }}
                    </n-button>
                </n-flex>

                <n-flex align="center">
                    <n-date-picker
                        v-model:value="newDate"
                        type="date"
                        :placeholder="t?.date"
                        style="width: 150px"
                    />
                    <n-input-number
                        v-model:value="newPrice"
                        :placeholder="t?.product_price"
                        :min="0"
                        style="width: 150px"
                    />
                    <n-button
                        size="medium"
                        type="primary"
                        @click="addDatePrice"
                        :style="{ width: isMobile ? '50px' : '125px' }"
                    >
                        <template #icon>
                            <AddFilled
                                style="
                                    vertical-align: middle;
                                    transform: translateY(1px);
                                "
                                :style="{
                                    transform: isMobile
                                        ? 'translateX(3px)'
                                        : '',
                                }"
                            />
                        </template>
                        {{ !isMobile ? t?.add : "" }}
                    </n-button>
                </n-flex>
            </n-space>
        </n-form-item>

        <n-form-item>
            <n-button
                type="primary"
                @click="submitForm"
                style="margin-right: 12px"
            >
                {{
                    props.mode === "create"
                        ? t?.create
                        : t?.update
                }}
            </n-button>
            <n-button @click="resetForm" class="ml-2">{{ t?.reset }}</n-button>
        </n-form-item>
    </n-form>

    <n-modal
        v-model:show="dateForDelete"
        :title="t?.delete + ' ' + dateForDelete"
        preset="dialog"
        v-model:on-after-leave="closeDateDeleteConfirmation"
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
                <n-button @click="closeDateDeleteConfirmation">{{
                    t?.cancel
                }}</n-button>
                <n-button
                    type="warning"
                    @click="() => deleteDatePrice(dateForDelete ?? '')"
                    >{{ t?.delete }}</n-button
                >
            </div>
        </div>
    </n-modal>
</template>

<style>
.custom-upload
    .n-upload-file-list
    .n-upload-file.n-upload-file--image-card-type,
.custom-upload .n-upload-trigger.n-upload-trigger--image-card {
    width: 200px;
    height: 200px;
}

.custom-upload img {
    object-fit: contain !important;
}
</style>
