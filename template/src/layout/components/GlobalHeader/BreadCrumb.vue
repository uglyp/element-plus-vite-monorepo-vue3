<template>
  <el-breadcrumb>
    <template v-for="(routeItem, rotueIndex) in breadcrumbList" :key="routeItem.name">
      <el-breadcrumb-item>
        <span>{{ routeItem.meta.title }}</span>
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'BreadCrumb',
})

const $route = useRoute()
const breadcrumbList = computed(() => $route.matched.slice(1, $route.matched.length))
</script>