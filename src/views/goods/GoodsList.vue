<template>
  <div>
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48">
            <a-col :md="6" :sm="24">
              <a-form-item label="登录账号">
                <a-input v-model="queryParam.username" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="状态">
                <a-select v-model="queryParam.status" placeholder="默认(全部)" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">正常</a-select-option>
                  <a-select-option value="2">已禁用</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <span class="table-page-search-submitButtons">
                <a-button type="primary">图库</a-button>
                <a-button style="margin-left: 8px" type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
                <a-button style="margin-left: 8px" type="primary" icon="sync" @click="handleRefresh"></a-button>
                <a-dropdown style="margin-left: 8px" >
                  <template #overlay>
                    <a-menu @click="createGoods">
                      <a-menu-item key="normal_product">
                        普通产品
                      </a-menu-item>
                      <a-menu-item key="shadow_product">
                        影刻产品
                      </a-menu-item>
                      <a-menu-item key="custom_curtain">
                        定制窗帘
                      </a-menu-item>
                      <a-menu-item key="standard_product">
                        标准产品
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button type="primary">
                    创建<a-icon type="down"/>
                  </a-button>
                </a-dropdown>

              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>

    <a-drawer
      :width="1300"
      :visible="createGoodsDrawer.visible"
      :title="createGoodsDrawer.title"
      placement="right"
      :open="createGoodsDrawerOpen"
      @close="createGoodsDrawerClose">
      <a-tabs tab-position="right" animated>
        <a-tab-pane key="1" tab="基础信息">
          <a-form name="basic" v-bind="formItemLayout" autocomplete="off">
            <a-form-item label="SKU" name="sku" :rules="[{ required: true, message: '请输入 SKU!' }]">
              <a-input v-model="createGoodsDrawer.basicInfo.sku" />
            </a-form-item>
            <a-form-item label="商品名称" name="name" :rules="[{ required: true, message: '请输入 名称!' }]">
              <a-input v-model="createGoodsDrawer.basicInfo.name" />
            </a-form-item>
            <a-form-item label="URL KEY" name="urlKey" :rules="[{ required: true, message: '请输入 URL KEY!' }]">
              <a-input v-model="createGoodsDrawer.basicInfo.urlKey" />
            </a-form-item>
            <a-form-item label="商品图片" name="coverImg" :rules="[{ required: true, message: '请输入 URL KEY!' }]">
              <a-upload
                name="avatar"
                list-type="picture-card"
                class="avatar-uploader"
                max-count="1"
                :show-upload-list="false"
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                :before-upload="beforeUpload"
                @change="handleCoverImgChange"
              >
              </a-upload>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" tab="商品详情">Content of Tab 2</a-tab-pane>
        <a-tab-pane key="3" tab="商品分类">Content of Tab 3</a-tab-pane>
        <a-tab-pane key="4" tab="定制项">Content of Tab 3</a-tab-pane>
        <a-tab-pane key="5" tab="选择标签">Content of Tab 3</a-tab-pane>
        <a-tab-pane key="6" tab="物流类型">Content of Tab 3</a-tab-pane>
        <a-tab-pane key="7" tab="贺卡选择">Content of Tab 3</a-tab-pane>
      </a-tabs>
    </a-drawer>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" extra="扩展信息提示" v-show="selectedRows.length > 0">
      <a-button type="primary">批量删除({{ selectedRows.length }})</a-button>
    </footer-tool-bar>

    <image-gallery
      ref="imageGalleryModal"
      :visible="imageGalleryModal.visible"
      :model="imageGalleryModal.model"
      @cancel="() => (this.imageGalleryModal.visible = false)"
    ></image-gallery>
  </div> 
</template>

<script>
import { ServeGetGoods } from '@/api/goods'
import FooterToolBar from '@/components/FooterToolbar'
import ImageGallery from '@/components/ImageGallery'

const statusMap = {
  0: {
    status: 'default',
    text: '禁用'
  },
  10: {
    status: 'processing',
    text: '正常'
  }
}

export default {
  components: {
      FooterToolBar,
      ImageGallery
  },
  name: 'GoodsList',

  data () {
    return {
      columns: [
        {
          title: '登录账号',
          dataIndex: 'username'
        },
        {
          title: '昵称',
          dataIndex: 'nickname',
          customRender: text => (text == '' ? '-' : text)
        },
        {
          title: '邮箱地址',
          dataIndex: 'email',
          customRender: text => (text == '' ? '-' : text)
        },
        {
          dataIndex: 'status',
          slots: { title: 'statusTitle' },
          scopedSlots: {
            customRender: 'status'
          }
        },
        {
          title: '创建时间',
          dataIndex: 'created_at',
          align: 'center',
          sorter: true
        },
        {
          title: '最后登录时间',
          dataIndex: 'last_login_time',
          sorter: true,
          align: 'center'
        },
        {
          title: '最后登录IP',
          dataIndex: 'last_login_ip',
          align: 'center',
          customRender: text => (text == '' ? '-' : text)
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          align: 'right',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      isMobile: false,
      // 查询参数
      queryParam: {},
      // 创建产品
      formItemLayout: { labelCol: { xs: { span: 24 }, sm: { span: 2 } }, wrapperCol: { xs: { span: 24 }, sm: { span: 12 } } },
      createGoodsDrawer: {
        title: 'kkkkk',
        visible: false,
        seriesType: '',
        basicInfo: {
          sku: '',
          name: '',
          urlKey: '',
          coverImg: '',
          hoverImg: ''
        }
      },
      imageGalleryModal: {
        visible: true,
        model: null
      },
      // 加载数据方法 必须为 Promise 对象
      selectedRowKeys: [],
      selectedRows: [],
       loadData: parameter => {
        const data = Object.assign({}, parameter, this.queryParam)
        return ServeGetGoods(data).then(res => {
          return res.data
        })
      }
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    }
  },
  computed: {
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    }
  },
  methods: {
    handleRefresh () { // 表格刷新
      this.$refs.table.refresh()
    },
    createGoods (e) { // 创建商品
      console.log(e)
      this.createGoodsDrawer.visible = true
      this.createGoodsDrawer.seriesType = e.key
      var name = ''
      switch (e.key) {
        case 'normal_product':
            name = '普通产品'
          break
        case 'shadow_product':
            name = '影刻产品'
          break
        case 'custom_curtain':
            name = '定制窗帘'
          break
        case 'standard_product':
            name = '定制窗帘'
          break
        default:
          break
      }
      this.createGoodsDrawer.title = '创建：' + name
    },
    createGoodsDrawerOpen () {

    },
    createGoodsDrawerClose () {
        this.createGoodsDrawer.visible = false
    },
    createGoodsDrawerSubmit () {

    },
    handleCoverImgChange () {

    },
    beforeUpload () {

    }

  }
}
</script>
<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}
.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
