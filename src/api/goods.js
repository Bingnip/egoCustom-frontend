import {
  post,
  get
} from '@/utils/request'

// 接口列表
const api = {
  // 管理员相关接口
  goods: 'goods/goods/list'

}

export function ServeGetGoods (data) {
  return post(api.goods, data)
}
