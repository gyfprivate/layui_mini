/**
 * date:2019/08/16
 * author:Mr.Chung
 * description:此处放layui自定义扩展
 * version:2.0.4
 */

window.rootPath = (function(src) {
    src = document.scripts[document.scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();

layui.config({
    base: rootPath + "lay-module/",
    version: true
}).extend({
    miniAdmin: "layuimini/miniAdmin", // layuimini后台扩展
    miniMenu: "layuimini/miniMenu", // layuimini菜单扩展
    miniTab: "layuimini/miniTab", // layuimini tab扩展
    miniTheme: "layuimini/miniTheme", // layuimini 主题扩展
    miniTongji: "layuimini/miniTongji", // layuimini 统计扩展
    step: 'step-lay/step', // 分步表单扩展
    treetable: 'treetable-lay/treetable', //table树形扩展
    tableSelect: 'tableSelect/tableSelect', // table选择扩展
    iconPickerFa: 'iconPicker/iconPickerFa', // fa图标选择扩展
    echarts: 'echarts/echarts', // echarts图表扩展
    echartsTheme: 'echarts/echartsTheme', // echarts图表主题扩展
    wangEditor: 'wangEditor/wangEditor', // wangEditor富文本扩展
    layarea: 'layarea/layarea', //  省市县区三级联动下拉选择器

    soulTable: 'soulTable/soulTable', //表格扩展
    tableFilter: 'soulTable/tableFilter', //表格扩展
    excel: 'soulTable/excel', //表格扩展
    tableChild: 'soulTable/tableChild', //表格扩展
    tableMerge: 'soulTable/tableMerge', //表格扩展

    jwt: 'auth/jwt', //jwt的解码认证
    ivan: 'ivan', //自行处理
    oms: 'oms_search', //oms
    oms_r: 'oms_search_rundata', //主页搜索
    oms_a: 'oms_search_area', //地图页oms
    inputTags: 'inputTags/inputTags', //标签输入
});