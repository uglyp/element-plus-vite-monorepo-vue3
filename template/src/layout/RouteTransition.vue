<template>
  <div class="route__transition__view">
    <router-view v-slot="{ Component, route }">
      <transition name="slide-fade" mode="out-in" appear>
        <keep-alive :include="keepAliveComponents">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAppStore } from "@/store/modules/app";

defineOptions({
  name: 'route-transition',
})

const appStore = useAppStore();
const keepAliveComponents = computed(() => appStore.keepAliveComponents);
</script>
