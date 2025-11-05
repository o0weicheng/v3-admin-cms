<script lang="ts" setup>
import { User } from '@element-plus/icons-vue'
import { Storage } from '@/types'

const router = useRouter()
const handleDropDowmCommand = () => {
  localStorage.clear()
  router.push('/login')
}
</script>

<template>
  <div h="50px" flex justify-between items-center px-6>
    <div font-bold text-white text-3xl>
      LOGO
    </div>
    <div>
      <el-dropdown @command="handleDropDowmCommand">
        <el-avatar shape="square" size="small" :icon="User"></el-avatar>
        <template #dropdown>
          <el-dropdown-item command="logout">退出登录</el-dropdown-item>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss">
.el-menu-wrap {
  &.ep-menu--horizontal > .ep-menu-item:nth-child(1) {
    margin-right: auto;
  }
}
</style>
