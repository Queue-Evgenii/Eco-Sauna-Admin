<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Quill from 'quill'
import 'quill/dist/quill.snow.css'

const props = defineProps<{ modelValue?: string, placeholder?: string, minlines?: number, maxlines?: number, }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

const editor = ref<Quill | null>(null)
const editorContainer = ref<HTMLDivElement>()
const htmlMode = ref(false)
const htmlContent = ref('')

onMounted(() => {
  editor.value = new Quill(editorContainer.value!, {
    theme: 'snow',
    placeholder: props.placeholder,
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ header: 1 }, { header: 2 }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'blockquote', 'code-block'],
        ['clean'],
      ],
    },
  })

  editor.value.root.innerHTML = props.modelValue || ''

  editor.value.on('text-change', () => {
    emit('update:modelValue', editor.value!.root.innerHTML)
  })
})

watch(htmlMode, (val) => {
  if (val) htmlContent.value = editor.value?.root.innerHTML || ''
})

onBeforeUnmount(() => {
  editor.value = null
})

const computedMinHeight = () => {
  if (!props.minlines) return `6rem`
  return `${props.minlines * 1.5}rem`
}

const computedMaxHeight = () => {
  if (!props.maxlines) return `6rem`
  return `${props.maxlines * 1.5}rem`
}
</script>

<template>
  <div class="quill-container">
      <div ref="editorContainer" class="quill-editor" :style="{
        minHeight: computedMinHeight(),
        maxHeight: computedMaxHeight(),
      }"></div>
  </div>
</template>

<style scoped>
.quill-container {
  width: 100%;
}
.quill-editor {
  border-radius: 0 0 8px 8px;
  background: var(--n-card-color);
  overflow: scroll;
}
</style>
