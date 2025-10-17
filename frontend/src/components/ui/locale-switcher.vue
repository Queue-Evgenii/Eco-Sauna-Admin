<script setup lang="ts">
import { computed, inject } from 'vue';
import { TranslationsSymbol } from '../../i18n';
import type { TranslationsManager } from '../../i18n/manager';

const { availableLocales, setLocale, locale } = inject<TranslationsManager>(TranslationsSymbol)!;

const localeOptions = computed(() => availableLocales.map((locale: string) => ({
    label: locale.toUpperCase(),
    value: locale
})))
</script>

<template>
    <n-select :value="locale" @update:value="setLocale" :options="localeOptions" style="width: 60px;"></n-select>
</template>