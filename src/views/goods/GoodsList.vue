<template>
  <page-header-wrapper :title="false">
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
                <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
                <a-button style="margin-left: 8px" @click="() => (this.queryParam = {})">重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <!-- 表格操作 -->
      <div class="table-operator">
        <a-button type="primary" icon="sync" @click="handleRefresh"></a-button>
        <a-button type="primary" icon="plus" @click="handleAddAdmin">添加<a-icon type="down"/></a-button>
      </div>

      <!-- Table 模板配置 -->
      <s-table
        ref="table"
        size="default"
        rowKey="id"
        :columns="columns"
        :data="loadData"
        :showPagination="true"
        :showPageJump="true"
        :alert="true"
        :scroll="{ x: 1200 }"
        :rowSelection="rowSelection"
      >
        <template slot="statusTitle">
          状态
          <a-tooltip title="【禁用】状态不能进行登录">
            <a-icon type="question-circle" />
          </a-tooltip>
        </template>

        <span slot="action" slot-scope="text, record">
          <span v-action:system:user:edit>
            <a>编辑</a>
            <a-divider type="vertical" />
          </span>

          <a-dropdown placement="bottomCenter" :trigger="['click']">
            <a-menu slot="overlay">
              <a-menu-item @click="deleteConfirm(record)" v-action:system:user:delete><a>删除账号</a></a-menu-item>
            </a-menu>
            <a>更多 <a-icon type="down"/></a>
          </a-dropdown>
        </span>
      </s-table>

    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :is-mobile="isMobile" extra="扩展信息提示" v-show="selectedRows.length > 0">
      <a-button type="primary">批量删除({{ selectedRows.length }})</a-button>
    </footer-tool-bar>
  </page-header-wrapper>
</template>

<script>
import { ServeGetGoods } from '@/api/goods'

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

      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const data = Object.assign({}, parameter, this.queryParam)
        return ServeGetGoods(data).then(res => {
          return res.data
        })
      },
      selectedRowKeys: [],
      selectedRows: []
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
    // 表格刷新
    handleRefresh () {
      this.$refs.table.refresh()
    }
  }
}
</script>
