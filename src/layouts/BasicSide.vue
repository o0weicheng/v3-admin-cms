<script lang="ts" setup>
defineProps<{
  menus: any[]
  active: string
}>()
</script>

<template>
  <div p-2 rounded>
    <el-menu router rounded="2" class="side-menu-wrap" :default-active="active">
      <template v-for="menu in menus" :key="menu.name">
        <template v-if="menu.children.length">
          <el-menu-item
            v-if="menu.children.length === 1"
            :index="`${menu.path}/${menu.children[0].path}`"
          >
            <el-icon>
              <component :is="menu?.children[0].meta?.icon" />
            </el-icon>
            <span>{{ menu?.children[0].meta?.title }}</span>
          </el-menu-item>
          <el-sub-menu v-else :index="menu.path">
            <template #title>
              <el-icon>
                <component :is="menu?.meta?.icon" />
              </el-icon>
              {{ menu?.meta?.title }}
            </template>
            <el-menu-item v-for="sub in menu.children" :index="`${menu.path}/${sub.path}`">
              <template #title>
                <span>{{ sub?.meta?.title }}</span>
              </template>
            </el-menu-item>
          </el-sub-menu>
        </template>

        <el-menu-item v-else :index="menu.path">
          <el-icon>
            <component :is="menu?.meta?.icon" />
          </el-icon>
          <span>{{ menu?.meta?.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<style lang="scss">
.side-menu-wrap {
  border: none;
  overflow: hidden;
  --menu-active-bg: color-mix(in srgb, #6cb28e 15%, white);
  --el-menu-bg-color: transparent;
  --el-menu-text-color: #f8f9f7;
  --el-menu-hover-bg-color: #ffffff50;
  .el-menu-item {
    border-radius: 6px;
    margin-bottom: 6px;

    &.is-active {
      background-color: var(--menu-active-bg);
      font-weight: 500;
    }
  }

  .el-sub-menu {
    .el-sub-menu__title {
      border-radius: 6px;
      margin-bottom: 6px;
      overflow: hidden;
    }
  }
}
</style>
