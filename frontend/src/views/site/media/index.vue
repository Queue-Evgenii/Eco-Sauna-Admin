<script setup lang="ts">
import { ref, onMounted, h, inject } from "vue";
import { NCard, NIcon } from "naive-ui";
import { ImageOutlined } from "@vicons/material";
import type { MediaFileEntity } from "@/core/types/models/entities/media-file.entity";
import type { MediaApi } from "@/core/api/modules/media";
import { withErrorHandling } from "@/core/api/api-error-handler";
import EditMediaModal from "@/components/content/edit-media-modal.vue";

const mediaApi = inject<MediaApi>("MediaApi")!;
const files = ref<MediaFileEntity[]>([]);
const apiURL = import.meta.env.VITE_API_URL;

const viewingFile = ref<MediaFileEntity | null>(null);
const fileForm = ref<{ alt_text: string; description: string }>({ alt_text: "", description: "" });

const fetchFiles = async () => {
    const res = await withErrorHandling(mediaApi.getFiles());
    if (Array.isArray(res)) files.value = res;
};

onMounted(fetchFiles);

const openFileModal = (file: MediaFileEntity) => {
    viewingFile.value = file;
    fileForm.value = { alt_text: file.alt_text || "", description: file.description || "" };
};

const onSaveFileMeta = async (updatedMeta: { alt_text: string; description: string }) => {
  if (!viewingFile.value) return;
  const updatedFile = await mediaApi.updateFile(viewingFile.value.id, {
    ...viewingFile.value,
    ...updatedMeta
  });
  const idx = files.value.findIndex(f => f.id === updatedFile.id);
  if (idx !== -1) files.value[idx] = updatedFile;
  viewingFile.value = null;
};

const isImage = (file: MediaFileEntity) => file.mime_type?.startsWith("image/");
</script>

<template>
  <div class="files-grid">
    <n-card
      v-for="file in files"
      :key="file.id"
      hoverable
    >
      <template #cover>
        <div  @click="openFileModal(file)">
          <template v-if="isImage(file)">
            <img :src="`${apiURL}/uploads/${file.filename}`" :alt="file.alt_text" />
          </template>
          <template v-else>
            <n-icon :size="36">
              <ImageOutlined />
            </n-icon>
          </template>
        </div>
      </template>
      <div>{{ file.filename }}</div>
      <div>{{ file.description }}</div>
    </n-card>
  </div>

  <edit-media-modal
    v-model:modelValue="viewingFile"
    :apiURL="apiURL"
    @save="onSaveFileMeta"
  />
</template>

<style scoped>
.files-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.file-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.file-cover {
  width: 100%;
  height: 160px;
  background: #f3f3f3;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.file-cover img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.file-name {
  margin-top: 8px;
  text-align: center;
  font-weight: 500;
}

.file-description {
  margin-top: 4px;
  text-align: center;
  font-size: 12px;
  color: #666;
}
</style>