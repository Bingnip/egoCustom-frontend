<template>
  <!-- Sorry, the page you visited does not exist. -->
  <a-result status="404" title="404" sub-title="对不起，您访问的页面不存在！！！">
    <template #extra>
      <a-button type="primary" @click="toHome">
        返回主页
      </a-button>
    </template>
  </a-result>
</template>

<script>
export default {
  name: 'Exception404',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    }
  }
}
</script>
