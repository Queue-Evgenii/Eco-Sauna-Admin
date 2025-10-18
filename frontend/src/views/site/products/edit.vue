<script setup lang="ts">
import ProductForm from "@/components/content/product-form.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const productId = Number(route.params.id);

const handleSubmitted = () => {};
</script>

<template>
  <product-form mode="edit" :productId="productId" @submitted="handleSubmitted" />
</template>
