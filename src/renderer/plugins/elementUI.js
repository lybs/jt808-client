import Vue from 'vue'

import {
  Dialog,
  Input,
  InputNumber,
  Checkbox,
  CheckboxGroup,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Alert,
  Card,
  Row,
  Col,
  Icon,
  Loading,
  MessageBox,
  Message
} from 'element-ui'

Vue.use(Dialog)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Alert)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Icon)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$message = Message
