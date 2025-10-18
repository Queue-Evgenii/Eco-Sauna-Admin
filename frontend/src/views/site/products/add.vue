<script setup lang="ts">
import ProductForm from '@/components/content/product-form.vue';


const handleSubmitted = () => {};
</script>

<template>
  <product-form mode="create" @submitted="handleSubmitted" />
</template>
