<script>
export default {
  name: 'RouteView',
  props: {
    keepAlive: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  render () {
    const {
      $route: { meta },
      $store: { getters }
    } = this
    const inKeep = (
      <keep-alive>
        <router-view />
      </keep-alive>
    )
    const notKeep = <router-view />

    return meta.keepAlive ? inKeep : notKeep
  }
}
</script>
