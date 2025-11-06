<script setup lang="ts">
import { withErrorHandling } from "@/core/api/api-error-handler";
import type { MailerSettingsApi } from "@/core/api/modules/mailer-settings";
import { TranslationsSymbol } from "@/core/i18n";
import type { TranslationsManager } from "@/core/i18n/manager";
import type { MailerSettingsEntity } from "@/core/types/models/entities/mailer-settings.entity";
import { useMessage, NForm, NFormItem, NInput, NButton, NSpin } from "naive-ui";
import { computed, inject, onMounted, ref } from "vue";
import type { FormRules } from "naive-ui";

const message = useMessage();
const mailerSettingsApi = inject<MailerSettingsApi>("MailerSettingsApi")!;
const { t } = inject<TranslationsManager>(TranslationsSymbol)!;

const mailerSetting = ref<MailerSettingsEntity>({
    key: "",
    admin_email: "",
    subject: "",
    body: "",
} as MailerSettingsEntity);

const loading = ref(true);
const saving = ref(false);
const formRef = ref();

const rules = computed<FormRules>(() => ({
    admin_email: [
        { required: true, message: t.value?.required, trigger: "blur" },
        { type: "email", message: t.value?.email_invalid, trigger: "blur" },
    ],
    subject: [{ required: true, message: t.value?.required, trigger: "blur" }],
    body: [{ required: true, message: t.value?.required, trigger: "blur" }],
}));

const fetch = async () => {
    try {
        loading.value = true;
        const res = await withErrorHandling(mailerSettingsApi.getSettings());
        if (res && res.length > 0 && res[0]) {
            mailerSetting.value = res[0];
        }
    } catch (err) {
        message.error(t.value?.fetch_data_error ?? "Error while fetching data");
    } finally {
        loading.value = false;
    }
};

const update = async () => {
    if (!formRef.value) return;

    formRef.value.validate(async (errors: any) => {
        if (errors) {
            message.error(t.value?.validation_error ?? "Validation error");
            return;
        }
        try {
            saving.value = true;
            const res = await withErrorHandling(
                mailerSettingsApi.update(
                    mailerSetting.value.key,
                    mailerSetting.value,
                ),
            );
            mailerSetting.value = res;
            message.success(t.value?.update_success ?? "Successfully saved");
        } catch {
            message.error(t.value?.update_error ?? "Error while saving");
        } finally {
            saving.value = false;
        }
    });
};

onMounted(fetch);

const subjectPlaceholders = computed(() => ([
    { label: "{{order_id}}", description: t.value?.order_id },
]));
const textPlaceholders = computed(() => ([
    { label: "{{product}}", description: t.value?.product_name },
    { label: "{{start_date}}", description: t.value?.start_date },
    { label: "{{end_date}}", description: t.value?.end_date },
    { label: "{{total_price}}", description: t.value?.total },
    { label: "{{customer_name}}", description: t.value?.customer_name },
    { label: "{{customer_email}}", description: t.value?.customer_email },
    { label: "{{customer_phone}}", description: t.value?.customer_phone },
]));
</script>

<template>
    <n-spin :show="loading">
        <n-form
            ref="formRef"
            labelWidth="120px"
            :model="mailerSetting"
            :rules="rules"
        >
            <n-form-item label="Key">
                <n-input v-model:value="mailerSetting.key" disabled />
            </n-form-item>

            <n-form-item :label="t?.admin_email" path="admin_email">
                <n-input
                    v-model:value="mailerSetting.admin_email"
                    :placeholder="t?.admin_email"
                />
            </n-form-item>

            <n-form-item :label="t?.mail_subject" path="subject">
                <n-input
                    v-model:value="mailerSetting.subject"
                    :placeholder="t?.mail_subject"
                />
                <n-popover trigger="click" placement="right">
                    <template #trigger>
                        <n-button
                            size="small"
                            type="default"
                            style="margin-left: 8px"
                            >i</n-button
                        >
                    </template>
                    <div style="max-width: 250px">
                        <p
                            v-for="ph in subjectPlaceholders"
                            :key="ph.label"
                            style="margin: 0; padding: 2px 0"
                        >
                            <code>{{ ph.label }}</code> — {{ ph.description }}
                        </p>
                    </div>
                </n-popover>
            </n-form-item>

            <n-form-item :label="t?.mail_body" path="body">
                <n-input
                    v-model:value="mailerSetting.body"
                    type="textarea"
                    :autosize="{ minRows: 3, maxRows: 8 }"
                    :placeholder="t?.mail_body"
                />
                <n-popover trigger="click" placement="right">
                    <template #trigger>
                        <n-button
                            size="small"
                            type="default"
                            style="margin-left: 8px"
                            >i</n-button
                        >
                    </template>
                    <div style="max-width: 250px">
                        <p
                            v-for="ph in textPlaceholders"
                            :key="ph.label"
                            style="margin: 0; padding: 2px 0"
                        >
                            <code>{{ ph.label }}</code> — {{ ph.description }}
                        </p>
                    </div>
                </n-popover>
            </n-form-item>

            <n-form-item>
                <n-button type="primary" @click="update" :loading="saving">
                    {{ t?.save }}
                </n-button>
            </n-form-item>
        </n-form>
    </n-spin>
</template>
