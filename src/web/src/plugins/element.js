import Vue from 'vue'
import {
    Button, Form, FormItem, Input, RadioGroup, RadioButton,
    Message,
    Container, Header, Aside, Main,
    Menu, MenuItem, Submenu,
    Breadcrumb, BreadcrumbItem,
    Card, Row, Col,
    Table, TableColumn,
    Switch, Pagination,
    Dialog, Cascader, Select, Option,
    MessageBox, Tooltip,
    Tree, Popover, Tag,
    Upload, Steps, Step, Dropdown, DropdownMenu, DropdownItem
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)

Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)

Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)

Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)

Vue.use(Card)
Vue.use(Row)
Vue.use(Col)

Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Cascader)
Vue.use(Select)
Vue.use(Option)
Vue.use(Tooltip)
Vue.use(Tree)
Vue.use(Popover)
Vue.use(Tag)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Upload)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
// Vue.use(DropdownItem)

Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm