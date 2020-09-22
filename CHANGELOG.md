# Change Log

### 0.4.2（2020/09/22）

- [fix] : 更新`epage-core@0.1.8`，修复内部引用大小写不正确问题

### 0.4.1（2020/09/22）

- [feat] : 增加 `checkbox`、`inputNumber`校验能力
- [fix] : 增加`select`弹层校验取消关闭交互

### 0.4.0（2020/09/17）

- [feat] : 增加所有widget `description`展示
- [feat] : 增加 `select` 单选、多选能力
- [feat] : 增加label对齐方式，`right`、`left`、`top`三种方式

### 0.3.1（2020/08/10）

- [feat] : 升级显示模式(`mode: "display"`)样式，支持label等
- [feat] : `Button`支持自定义脚本执行

### 0.3.0（2020/07/09）

- [feat] : 修改核心依赖，由原`epage`替换为`epage-core`
- [feat] : 去除基础widget `Setting`(原因移动端不需要设计，仅渲染)


### 0.2.1（2020/07/03）

- [fix] : 修复inputNumber数字类型校验
- [fix] : 修复未通过updateModel方法更新model的方式

### 0.2.0（2020/06/30）

- [feat] : 增加所有基础widget的显示模式
- [feat] : 增加所有基础表单校验，`timePicker`及`datePicker`区间时由2个vant的`Picker`组合
- [feat] : 支持`upload`组件的上传及显示，由`schema.option.format`适配原生`input`的accept
- [fix] : 修复所有widget的help字段未显示问题
- [fix] : 修复所有widget的help字段未显示问题


### 0.1.2（2020/06/20）

- [feat] : 增加`datePicker`，支持区间选择
- [feat] : 增加cascader支持多级展示及异步获取选项数据
- [fix] : 修复input、textarea校验规则类型及显示优化


### 0.1.1

- [feat] : 修复基础widget展示，使用`van-field`包裹，加入校验


### 0.1.0

- [feat] : 初始化
