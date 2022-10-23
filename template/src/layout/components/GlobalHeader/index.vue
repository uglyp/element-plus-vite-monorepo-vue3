<template>
  <el-row
    type="flex"
    align="middle"
    justify="space-between"
    style="width: 100%; height: 100%"
  >
    <el-col :span="18">
      <el-row type="flex" align="middle">
        <el-icon class="trigger" @click.native="changeCollapsed">
          <expand v-if="props.collapsed" />
          <fold v-else />
        </el-icon>
        <el-col :span="20">
          <BreadCrumb></BreadCrumb>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="4">
      <div class="right-avatar">
        <el-switch
          :inline-prompt="true"
          :active-icon="Sunny"
          :inactive-icon="Moon"
          active-color="var(--bg-color-mute)"
          v-model="isDark"
          @change="toggleDark"
        ></el-switch>
        <AvatarDropdown></AvatarDropdown>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref } from "vue";
import { Expand, Fold, Sunny, Moon } from "@element-plus/icons-vue";
import AvatarDropdown from "./AvatarDropdown.vue";
import BreadCrumb from "./BreadCrumb.vue";
import { useDark, useToggle } from "@vueuse/core";

defineOptions({
  name: "GlobalHeader",
});

const $emit = defineEmits(["update:collapsed"]);
const props = defineProps({
  collapsed: {
    type: Boolean,
    required: true,
  },
});

const isDark = useDark();
const toggleDark = useToggle(isDark);

const changeCollapsed = () => {
  $emit("update:collapsed", !props.collapsed);
};
</script>

<style lang="scss" scoped>
.trigger {
  display: inline-block;
  font-size: 20px;
  padding-right: 12px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.right-avatar {
  display: flex;
  justify-content: end;
}
</style>
