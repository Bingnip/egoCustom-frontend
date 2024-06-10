<template>
  <a-modal
    title="上传商品图"
    :width="550"
  >
    <h1>13213</h1>
  </a-modal>
</template>

<script>
export default {
  name: 'ImageGallery',
  props: {
  },
  watch: {
  },
  data () {
    return {
    visible: {
      type: Boolean,
      required: true
    },
    model: {
      type: Object,
      default: () => null
    }
    }
  },
  created () {},
  mounted () {},
  beforeDestroy () {

  },
  methods: {

  }
}
</script>
