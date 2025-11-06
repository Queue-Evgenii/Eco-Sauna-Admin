<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, inject } from "vue";
import { NForm, NFormItem, NInput, NButton } from "naive-ui";
import type { MediaFileEntity } from "@/core/types/models/entities/media-file.entity";
import { TranslationsSymbol } from "@/core/i18n";
import type { TranslationsManager } from "@/core/i18n/manager";

const { t } = inject<TranslationsManager>(TranslationsSymbol)!;

const props = defineProps<{
    modelValue: MediaFileEntity | null;
    apiURL: string;
    t?: any;
}>();

const emits = defineEmits<{
    (e: "update:modelValue", value: MediaFileEntity | null): void;
    (e: "save", updatedFile: { alt_text: string; description: string }): void;
}>();

const fileForm = ref({ alt_text: "", description: "" });
const visible = ref(false);

watch(
    () => props.modelValue,
    (newVal) => {
        if (newVal) {
            visible.value = true;
            fileForm.value.alt_text = newVal.alt_text || "";
            fileForm.value.description = newVal.description || "";
        } else {
            visible.value = false;
        }
        console.log(visible.value)
    },
    { immediate: true },
);

const save = () => {
    emits("save", { ...fileForm.value });
};

const close = () => {
    emits("update:modelValue", null);
};
</script>

<template>
    <n-modal
        v-model:show="visible"
        preset="card"
        :title="t?.image_meta_popup || 'File metadata'"
        style="max-width: 600px"
        @after-leave="close"
    >
        <div style="display: flex; flex-direction: column; gap: 1rem">
            <img
                v-if="props.modelValue"
                :src="`${apiURL}/uploads/${props.modelValue.filename}`"
                :alt="props.modelValue.alt_text"
                style="
                    width: 100%;
                    height: 400px;
                    border-radius: 8px;
                    object-fit: contain;
                "
            />

            <n-form :model="fileForm" label-placement="top">
                <n-form-item :label="t?.image_meta_alt || 'Alt Text'">
                    <n-input
                        v-model:value="fileForm.alt_text"
                        :placeholder="t?.image_meta_alt || 'Alt text'"
                    />
                </n-form-item>
                <n-form-item
                    :label="t?.image_meta_description || 'Description'"
                >
                    <n-input
                        v-model:value="fileForm.description"
                        type="textarea"
                        :placeholder="
                            t?.image_meta_description || 'Description'
                        "
                        autosize
                    />
                </n-form-item>
            </n-form>

            <div style="display: flex; justify-content: flex-end; gap: 0.5rem">
                <n-button @click="close">{{ t?.cancel || "Cancel" }}</n-button>
                <n-button type="primary" @click="save">{{
                    t?.save || "Save"
                }}</n-button>
            </div>
        </div>
    </n-modal>
</template>
