#### Attribute
```typescript
interface props {
  rowKey: String
  columns: tableColumnsItem[]
  data: (e:parameter) => Promise<sourceData>
  rowSelection?: (selection:any) => void
  expand?: Boolean
  index?:Boolean
  autoHeight?: Boolean
  startColumnsFixed?: Boolean // 左侧扩展列是否固定 优先级高于 indexFixed selectionFixed expandFixed
  indexFixed?: Boolean // 序号扩展列是否固定
  selectionFixed?: Boolean // 选择扩展列是否固定
  expandFixed?: Boolean // 展开行扩展列是否固定
  showPagination?: Boolean
  keepReload?: Boolean
  pagination?: ElPagination // ElPagination props
}

interface tableColumnsItem {
  label: String,
  prop: String,
  width?: Number | String,
  align?: String // left | center | right
  fixed?: Boolean
  showOverflowTooltip?: Boolean
  slots?: tableColumnsItemSlots
}

interface tableColumnsItemSlots {
  customRender?: String // 内容模板插槽名
  customHeader?: String // 自定义表头插槽名
}

interface parameter {
  currentPage: Number
  pageSize: Number
  sortField: String
  sortOrder: String
}

interface sourceData {
  currentPage: Number
  total: Number
  list: any[]
}

```
#### Event

```typescript
  interface Event {
    expand?: (rows:any, rowList:[]) => volid
    expandClosed: (rows:any, rowList:[]) => volid
    // ...ElementTable Events
  }
```
#### Methods
```typescript
  interface Methods {
    refresh: (bool: Boolean) => volid // 刷新表格数据 bool: { ture: 重置页码 }
    clearSelection: () => volid // 清楚选中状态
    toggleRowSelection: (rowItem:any, flag: Boolean) => volid // 改变数据选中状态
    initRowSelection: (selectRows:[]) => volid // 初始化选中数据
  }
```

```html
<template>
  <SchemaTable
    :ref="setSchemaTableRef"
    autoHeight
    :fixed="['index', 'selection', 'expand']"
    index
    expand
    rowKey="id"
    :data="loadData"
    :columns="columns"
    :rowSelection="onSelectChange"
    @expand="expandHandler"
    @filter-change="onFilterChange"
    @row-click="onRowClick"
  >
    <template #actionHeader>
        <el-input size="mini" placeholder="请输入关键字"></el-input>
      </template>
    <template #action="scope">
      <el-button type="text" @click.stop="editHandler(scope.row)" >编辑</el-button>
      <el-divider direction="vertical"></el-divider>
      <el-popconfirm :title="`确定删除（${scope.row.name}）的信息吗？`">
        <template #reference>
          <el-button type="text" @click.stop="delHandler(scope.row)">删除</el-button >
        </template>
      </el-popconfirm>
    </template>
    <template #expand="scope">
      <span>{{ scope.row.name }}</span>
    </template>
  </SchemaTable>
</template>
```

```javascript
// 表格列 配置项
const columns = [
  {
    width: 50,
    label: "id",
    prop: "id",
    align: "center",
    fixed: true,
  },
  {
    width: 80,
    label: "姓名",
    prop: "name",
    align: "center",
  },
  {
    width: 80,
    label: "性别",
    prop: "gender",
    align: "center",
  },
  {
    width: 80,
    label: "年龄",
    prop: "age",
    align: "center",
  },
  {
    width: 80,
    label: "身高",
    prop: "height",
    align: "center",
  },
  {
    width: 120,
    label: "出生日期",
    prop: "birthday",
    align: "center",
  },
  {
    width: 120,
    label: "用餐时间",
    prop: "eatDinnerTime",
    align: "center",
  },
  {
    width: 120,
    label: "上班时间",
    prop: "workingTime",
    align: "center",
  },
  {
    width: 80,
    label: "是否单身",
    prop: "single",
    align: "center",
  },
  {
    width: 80,
    label: "有无恋爱经验",
    prop: "loveHistory",
    align: "center",
  },
  {
    width: 80,
    label: "主要经济来源",
    prop: "occupation",
    align: "center",
  },
  {
    width: 120,
    label: "兴趣爱好",
    prop: "like",
    align: "center",
  },
  {
    label: "简介",
    prop: "desc",
    align: "center",
    showOverflowTooltip: true,
  },
  {
    width: 150,
    fixed: "right",
    label: "操作",
    prop: "gender",
    align: "center",
    slots: { customRender: "action", customHeader: 'actionHeader' },
  },
];
// 加载数据
const loadData = (parameter) => {
  // getTableList 返回一个 Promise 的请求结果
  return getTableList(Object.assign({}, parameter)).then((res) => {
    return {
      currentPage: res.currentPage || 1,
      total: res.total || 10,
      list: res.list || [],
    };
  });
};
```
