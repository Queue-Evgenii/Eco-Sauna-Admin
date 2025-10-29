<script setup lang="ts">
import { inject, ref, onMounted } from "vue";
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
} from "naive-ui";
import type { MediaApi } from "@/core/api/modules/media";
import type { ProductsApi } from "@/core/api/modules/products";
import type { ProductDto } from "@/core/types/models/dto/product-dto";
import { useRouter } from "vue-router";
import { RouteName } from "@/core/types/constants/route-name";
import type { ProductPriceDto } from "@/core/types/models/dto/product-price-dto";

const message = useMessage();
const productsApi = inject<ProductsApi>("ProductsApi")!;
const mediaApi = inject<MediaApi>("MediaApi")!;
const router = useRouter();

const props = defineProps<{
  product?: ProductDto;
  productId?: number;
  mode: "create" | "edit";
}>();

const emit = defineEmits<{
  (e: "submitted"): void;
}>();

const daysOfWeek = [
  { label: "Пн", index: 1 },
  { label: "Вт", index: 2 },
  { label: "Ср", index: 3 },
  { label: "Чт", index: 4 },
  { label: "Пт", index: 5 },
  { label: "Сб", index: 6 },
  { label: "Вс", index: 0 },
];

const weekdayPrices = ref<Record<number, number | null>>({});
const datePrices = ref<Record<string, number>>({});
const newDate = ref<number | null>(null);
const newPrice = ref<number | null>(null);

const addDatePrice = () => {
  if (!newDate.value || !newPrice.value) return;
  const dateStr = new Date(newDate.value).toISOString().split("T")[0];
  datePrices.value[dateStr] = newPrice.value;
  newDate.value = null;
  newPrice.value = null;
};
const deleteDatePrice = (date: string) => {
  delete datePrices.value[date];
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

const rules: FormRules = {
  title: [
    { required: true, message: "Название обязательно", trigger: ["blur", "input"] },
    { min: 3, message: "Минимум 3 символа", trigger: ["blur", "input"] },
  ],
  description: [
    { min: 10, message: "Минимум 10 символов", trigger: ["blur", "input"] },
  ],
  area: [
    { type: "number", min: 1, message: "Площадь должна быть больше 0", trigger: ["blur", "change"] },
  ],
  capacity: [
    { type: "number", min: 1, message: "Вместимость должна быть больше 0", trigger: ["blur", "change"] },
  ],
  max_temperature: [
    { type: "number", min: 1, message: "Температура должна быть больше 0", trigger: ["blur", "change"] },
  ],
  base_price: [
    { required: true, type: "number", min: 1, message: "Цена должна быть больше 0", trigger: ["blur", "change"] },
  ],
};

const fetchProduct = async () => {
  if (props.product) {
    setProduct(props.product);
  } else if (props.productId) {
    try {
      const product = await productsApi.getProductById(props.productId);
      setProduct(product);
    } catch (err) {
      message.error("Ошибка при загрузке продукта");
    }
  }
};

const setProduct = (product: ProductDto) => {
  form.value = {
    ...product,
    area: product.area ? Number(product.area) : undefined,
  };

  if (product.image && typeof product.image === "object" && product.image.filename) {
    fileList.value = [
      {
        id: `${product.image_id}`,
        name: "Текущее изображение",
        status: "finished",
        url:  import.meta.env.VITE_API_URL + "/uploads/" + product.image.filename,
      },
    ];
  } else {
    fileList.value = [];
  }
};

const handleUploadChange = ({ file, fileList: newFileList }: { file: UploadFileInfo; fileList: UploadFileInfo[] }) => {
  fileList.value = newFileList;
  if (file.file) {
    uploadedFile.value = file.file;
  }
};

const submitForm = () => {

      console.log(form.value);
  productForm.value?.validate(async (errors) => {
    if (errors) {
      message.error("Проверьте правильность заполнения формы.");
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

      for (const [weekday, price] of Object.entries(weekdayPrices.value)) {
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
        prices
      };

      if (props.mode === "create") {
        await productsApi.createProduct(payload);
        message.success("Продукт успешно создан!");
      } else {
        await productsApi.updateProduct(props.productId!, payload);
        message.success("Продукт успешно обновлен!");
      }

      emit("submitted");
      resetForm();
      router.push({ name: RouteName.SITE.PRODUCTS.LIST })
    } catch (err) {
      message.error("Ошибка при отправке формы");
    }
  });
};

const resetForm = () => {
  productForm.value?.restoreValidation();
  uploadedFile.value = undefined;
  fetchProduct();
};

onMounted(fetchProduct);
</script>

<template>
  <n-form ref="productForm" :model="form" :rules="rules" label-width="120px" style="padding-right: 5px;">
    <n-form-item label="Название" path="title">
      <n-input v-model:value="form.title" placeholder="Введите название продукта" />
    </n-form-item>

    <n-form-item label="Описание" path="description">
      <n-input
        v-model:value="form.description"
        type="textarea"
        placeholder="Введите описание"
        :autosize="{ minRows: 3, maxRows: 6 }"
      />
    </n-form-item>

    <n-form-item label="Площадь" path="area">
      <n-input-number v-model:value="form.area" placeholder="Введите площадь" :min="0" :step="0.1" />
    </n-form-item>

    <n-form-item label="Вместимость" path="capacity">
      <n-input-number v-model:value="form.capacity" placeholder="Введите вместимость" :min="0" />
    </n-form-item>

    <n-form-item label="Макс. температура" path="max_temperature">
      <n-input-number v-model:value="form.max_temperature" placeholder="Введите температуру" :min="0" />
    </n-form-item>

    <n-form-item label="Изображение" path="image">
      <n-upload
        v-model:file-list="fileList"
        list-type="image-card"
        :max="1"
        :default-upload="false"
        accept="image/*"
        @change="handleUploadChange"
        class="custom-upload"
      >
        <n-button>Загрузить</n-button>
      </n-upload>
    </n-form-item>

    <n-form-item label="Базовая цена" path="base_price">
      <n-input-number v-model:value="form.base_price" placeholder="Базовая цена" :min="0" style="width: 375px;" />
    </n-form-item>

    <n-form-item label="Цены по дням недели">
      <n-space vertical>
        <n-space v-for="day in daysOfWeek" :key="day.index" align="center">
          <div style="width: 30px;">{{ day.label }}:</div>
          <n-input-number
            v-model:value="weekdayPrices[day.index]"
            placeholder="Цена"
            :min="0"
            style="width: 333px;"
          />
        </n-space>
      </n-space>
    </n-form-item>

    <n-form-item label="Цены по датам">
      <n-space vertical>
        <n-flex align="center"
          v-for="(price, date) in datePrices"
          :key="date"
        >
          <n-input :value="date" disabled style="width: 150px;" />
          <n-input-number v-model:value="datePrices[date]" placeholder="Цена" :min="0" style="width: 150px;" />
          <n-button size="medium" type="error" @click="deleteDatePrice(date)" style="width: 100px;">Удалить</n-button>
        </n-flex>

        <n-flex align="center">
          <n-date-picker v-model:value="newDate" type="date" placeholder="Выберите дату" style="width: 150px;" />
          <n-input-number v-model:value="newPrice" placeholder="Цена" :min="0" style="width: 150px;" />
          <n-button size="medium" type="primary" @click="addDatePrice" style="width: 100px;">Добавить</n-button>
        </n-flex>
      </n-space>
    </n-form-item>

    <n-form-item>
      <n-button type="primary" @click="submitForm" style="margin-right: 12px;">
        {{ props.mode === "create" ? "Создать продукт" : "Сохранить изменения" }}
      </n-button>
      <n-button @click="resetForm" class="ml-2">Сбросить</n-button>
    </n-form-item>
  </n-form>
</template>

<style>
.custom-upload .n-upload-file-list .n-upload-file.n-upload-file--image-card-type,
.custom-upload .n-upload-trigger.n-upload-trigger--image-card {
  width: 200px;
  height: 200px;
}

.custom-upload img {
  object-fit: contain !important;
}
</style>