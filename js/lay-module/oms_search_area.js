selectBtns_m = function(btn, field, v) {
    layui.oms_a.selectBtns_m(btn, field, v);
}
keyup_submit = function(e, arg) {
    if (e.which == 13) { //.which属性判断按下的是哪个键，回车键的键位序号为13
        switch (arg) {
            case 'order':
                layui.oms_a.showAll()
                break;
            case 'product':
                layui.oms_a.search_product()
                break;
            case 'content':
                layui.oms_a.search_content()
                break;

        }
    }
}
search_order_store = function() { layui.oms_a.search_order_store() }

// 快捷时间设置
settime = function(index, freash = true) {
    var dis = 0
    switch (index) {
        case 0:
            dis = 31556926000; //年
            break
        case 1:
            dis = 30 * 24 * 60 * 60 * 1000; //月
            break
        case 2:
            dis = 7 * 24 * 60 * 60 * 1000; //星期
            break
        case 3:
            dis = 24 * 60 * 60 * 1000; //日
            break
        default:
            return;
    }
    let now = new Date(); // 获取当前日期和时间  
    let lastYear = new Date(now.getTime() - dis); // 31556926000毫秒等于一年  
    let begin = lastYear.getFullYear() + '-' + (lastYear.getMonth() + 1) + '-' + lastYear.getDate(); // 格式化日期为YYYY-MM-DD的字符串  
    let end = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
    layui.form.val('c_search', {
        s_begin: begin,
        s_end: end
    })
    if (freash)
        layui.oms_a.freashData()
}

/**
 * 
 * 2024 1 29
 * oms 搜索栏模板
 */
layui.define(['jwt', 'form', 'ivan'], function(exports) {
    var $ = layui.$,
        jwt = layui.jwt,
        form = layui.form;
    var layer = layui.layer;
    var laytpl = layui.laytpl;
    var ivan = layui.ivan;
    var laydate = layui.laydate;
    var oms = {
        freashData: function() {},


        /**
         * 移动到同级最后一个
         * @param {string} elem id
         */
        moveToLast: function(elem) {
            // 获取ID为xx的元素  
            var element = $(elem)

            if (element.length > 0) {
                var parent = element.parent()
                element.appendTo(parent)
            }
        },

        /**
         * 初始化显示搜索条
         * @param {string} name 名字 machine store order...
         * @param {array} data 数据 name value
         */
        setSearchList: function(name, data) {
            oms['data_' + name].all = true
            oms['data_' + name].index = []
            $('#c_' + name + ' button:first').addClass('layui-border-red');
            $('#c_' + name + ' button:gt(0)').remove();
            oms['data_' + name].allindex = data.map(o => o.value)
            ivan.showBtns(data, $('#c_' + name), 's_' + name, true) //多选联排按钮


            oms.moveToLast("#search_product")
            oms.moveToLast("#search_content")
        },

        /**
         * 获取搜索资料
         * @returns 
         */
        getSearchParam: function() {
            var d = {
                ...form.val('c_search'),
                ... {
                    data_store: oms.data_store,
                    data_machine: oms.data_machine,
                    data_content: oms.data_content,
                    data_product: oms.data_product,
                    data_order: oms.data_order,
                }
            }
            return d
        },

        // 店铺选择数据
        data_store: {
            index: [],
            all: true
        },

        // 机器选择数据
        data_machine: {
            index: [],
            all: true
        },

        //内容选择数据
        data_content: {
            index: [],
            all: true
        },

        //订单选择数据
        data_order: {
            index: [],
            all: true,
        },

        //产品选择数据
        data_product: {
            index: [],
            all: true
        },

        //显示设备联排按钮
        showMachine: function() {
            // 全选也列出所有数据
            // console.log(oms.data_store)     
            var p = {
                    product: oms.getParam(oms.data_product),
                    store: oms.getParam(oms.data_store),
                }
                // console.log(store)
            jwt.req({
                url: ivan.url('oms/api/selectrundata/machine'),
                type: 'post',
                data: p,
                success: function(response) {
                    var data = response.data
                    if (response.code === 0) {
                        oms.setSearchList('machine', data.machine)
                        oms.setSearchList('content', data.content)
                        oms.freashData() //变化之后重新刷新数据列表
                    }
                }
            })
        },





        /**
         * 获取产品,订单等数据的查询参数
         * @param {object}  data 
         */
        getParam: function(data) {
            var r = []
                // console.log(data);
            if (data.all || data.index.length == 0) { //如果全选 获取一个都没选，当成全选
                r = data.allindex
            } else {
                r = data.index.map(o => data.allindex[o - 1])
            }
            return r
        },

        //显示内容按钮
        showContent: function() {
            // 全选也列出所有数据
            var p = { machine: oms.getParam(oms.data_machine) }
            jwt.req({
                url: ivan.url('oms/api/selectrundata/content'),
                type: 'post',
                data: p,
                success: function(response) {
                    var data = response.data
                    console.log(data)
                    if (response.code === 0) {
                        oms.setSearchList('content', data.content)
                        oms.freashData() //变化之后重新刷新数据列表
                    }
                }
            })
        },

        //多选数据处理
        selectBtns_m: function(btn, field, v) {
            var data = ivan.selectBtns_m(btn)
                // console.log(oms.data_order);
                // console.log(data)
                // console.log(field)
            if (data.all == true) {
                // 全选
                switch (field) {
                    case 's_store':
                        oms.data_store.all = true
                        oms.data_store.index = []
                        oms.showProduct()
                        break
                    case 's_machine':
                        oms.data_machine.all = true
                        oms.data_machine.index = []
                        oms.showContent()
                        break
                    case 's_content':
                        oms.data_content.all = true
                        oms.data_content.index = []
                        oms.freashData() //刷新数据列表
                        break
                    case 's_order':
                        oms.data_order.all = true
                        oms.data_order.index = []
                        oms.showStore() //刷新订单
                        break
                    case 's_product':
                        oms.data_product.all = true
                        oms.data_product.index = []
                        oms.showMachine() //刷新订单
                        break
                }
            } else {
                var index = data.index
                var select = data.select
                    //处理数据
                    // console.log(index)
                    // console.log(select)
                switch (field) {
                    case 's_store':
                        oms.data_store.all = false
                        if (select)
                            oms.data_store.index.push(index)
                        else
                            oms.data_store.index = oms.data_store.index.filter(o => o !== index)
                        if (oms.data_store.index.length == 0)
                            oms.data_store.all = true
                        oms.showProduct()
                        break
                    case 's_machine':
                        oms.data_machine.all = false
                        if (select)
                            oms.data_machine.index.push(index)
                        else
                            oms.data_machine.index = oms.data_machine.index.filter(o => o !== index)
                        if (oms.data_machine.index.length == 0)
                            oms.data_machine.all = true
                        oms.showContent()
                        break
                    case 's_content':
                        oms.data_content.all = false
                        if (select)
                            oms.data_content.index.push(index)
                        else
                            oms.data_content.index = oms.data_content.index.filter(o => o !== index)
                        if (oms.data_content.index.length == 0)
                            oms.data_content.all = true
                        oms.freashData() //刷新数据列表
                        break
                    case 's_order':
                        oms.data_order.all = false
                        if (select)
                            oms.data_order.index.push(index)
                        else
                            oms.data_order.index = oms.data_order.index.filter(o => o !== index)
                        if (oms.data_order.index.length == 0)
                            oms.data_order.all = true
                        oms.showStore() //刷新订单
                        break
                    case 's_product':
                        oms.data_product.all = false
                        if (select)
                            oms.data_product.index.push(index)
                        else
                            oms.data_product.index = oms.data_product.index.filter(o => o !== index)
                        if (oms.data_product.index.length == 0)
                            oms.data_product.all = true
                        oms.showMachine() //刷新订单
                        break
                }
            }
        },

        /**
         * 显示订单及下属列表
         * @param {string} url 请求网址
         */
        showOrder: function(url = 'oms/api/selectrundata/order') {
            form.val('c_search', { s_search_product: '' })
            var p = form.val('c_search')
                // console.log(p)
            jwt.req({
                url: ivan.url(url),
                type: 'get',
                data: p,
                success: function(response) {
                    var data = response.data
                        // console.log(data)
                    if (response.code === 0) {
                        oms.setSearchList("order", data.order) // 订单
                        oms.setSearchList("store", data.store) // 店铺
                        oms.setSearchList("product", data.product) // 产品         
                        oms.setSearchList("machine", data.machine) // 设备
                        oms.setSearchList("content", data.content) // 内容     

                        oms.freashData() //刷新数据列表
                    }
                }
            })
        },

        /**
         * 显示产品及下属数据
         * @param {string} url 请求网址
         */
        showProduct: function(url = 'oms/api/selectrundata/product') {
            var store = oms.getParam(oms.data_store)
                // console.log(order);
            jwt.req({
                url: ivan.url(url),
                type: 'post',
                data: { store },
                success: function(response) {
                    var data = response.data
                    console.log(data)
                    if (response.code === 0) {
                        oms.setSearchList("product", data.product) //产品
                        oms.setSearchList("machine", data.machine) // 设备
                        oms.setSearchList("content", data.content) // 内容

                        oms.freashData() //变化之后重新刷新数据列表
                    }
                }
            })
        },

        /**
         * 显示店铺数据
         * @param {string} url 请求网址
         */
        showStore: function(url = 'oms/api/selectrundata/store') {
            var order = oms.getParam(oms.data_order)
                // console.log(order);
            jwt.req({
                url: ivan.url(url),
                type: 'post',
                data: { order },
                success: function(response) {
                    var data = response.data
                    console.log(data)
                    if (response.code === 0) {
                        oms.setSearchList("store", data.store) // 店铺
                        oms.setSearchList("product", data.product) //产品
                        oms.setSearchList("machine", data.machine) // 设备
                        oms.setSearchList("content", data.content) // 内容

                        oms.freashData() //变化之后重新刷新数据列表
                    }
                }
            })
        },


        /**
         * 选择完区域后显示所有数据
         * @param {string} url 访问地址
         */
        showAll: function() {
            oms.showOrder()
        },

        /**
         * 地址联动
         * @param {Number} level 层级 1国家 2省 3市
         * @param {Number} value 上一级的id pid
         */
        showAddress_All: function(level, value) {
            $('select[name=address' + level + '] option:gt(0)').remove(); //删除原有的，只保留第一个，给后续使用
            jwt.req({
                url: ivan.url('oms/api/address/async?parentId=' + value),
                type: 'get',
                success: function(data) {
                    if (data.code === 0) {
                        var s = $('select[name=address' + level + ']')
                        data.data.forEach(function(d, index) {
                            s[0].add(new Option(d.name, d.id))
                        })
                        form.render('select') //显示
                        if (level < 3) {
                            //下级地址变更
                            form.on('select(address' + level + ')', function(data) {
                                var value = data.value; // 获得被选中的值
                                if (value) {
                                    oms.showAddress_All(level + 1, value)
                                    for (var i = level + 2; i <= 3; i++)
                                        $('select[name=address' + i + '] option:gt(0)').remove();
                                } else {
                                    //消除下级数据
                                    for (var i = level + 1; i <= 3; i++)
                                        $('select[name=address' + i + '] option:gt(0)').remove();
                                }
                                form.render('select') //显示
                                oms.showAll() //刷新下面的数据
                            });
                        } else if (level == 3) {
                            //店铺列表变更
                            form.on('select(address' + level + ')', function(data) {
                                oms.showAll() //刷新店铺
                            });
                        }
                    }
                }
            })
        },




        /**
         * 设置显示列
         * @param {array<int>} list 
         */
        setlist: function(list) {
            for (var i = 1; i <= 8; i++) {
                if (list.includes(i))
                    $('#c_search > div:eq(' + (i - 1) + ')').show()
                else
                    $('#c_search > div:eq(' + (i - 1) + ')').hide()
            }
        },

        /**
         * 区域后面给具margin 给搜索条件
         */
        setSearchTitleStyle: function() {
            // console.log($("#c_search .layui-form-item:eq(0)"));
            $("#c_search .layui-form-item:eq(0)").css({ "margin-right": "150px" })
        },

        /**
         * 搜索订单或店铺
         * 并在前端显示
         */
        search_order_store: function() {
            var s = layui.form.val('c_search').s_search_order_store
            if (s.length == 0) {

            }
        },

        /**
         * 搜索订单或店铺
         * 并在前端显示
         */
        search_product: function() {
            url = 'oms/api/selectrundata/order'
            form.val('c_search', { s_search_order_store: '' })
            var p = form.val('c_search')

            // console.log(p)
            jwt.req({
                url: ivan.url(url),
                type: 'get',
                data: p,
                success: function(response) {
                    var data = response.data
                        // console.log(data)
                    if (response.code === 0) {
                        oms.setSearchList("order", data.order) // 订单
                        oms.setSearchList("store", data.store) // 店铺
                        oms.setSearchList("product", data.product) // 产品         
                        oms.setSearchList("machine", data.machine) // 设备
                        oms.setSearchList("content", data.content) // 内容     

                        oms.freashData() //刷新数据列表
                    }
                }
            })
        },


        /**
         * 区域后面给具margin 给搜索条件
         */
        setSearchTitleStyle: function() {
            // console.log($("#c_search .layui-form-item:eq(0)"));
            $("#c_search .layui-form-item:eq(0)").css({ "margin-right": "150px" })
        },

        /**
         * 搜索订单或店铺
         * 并在前端显示
         */
        search_content: function() {
            var s = layui.form.val('c_search').s_search_content
            console.log(s);
        },

        /**
         * 在区域后面插入搜索
         */
        render_search_order_store: function() {
            const str = `
            <div class="layui-input-group" style="min-width:200px;">
                <div class="layui-input-prefix" >
                    订单/店铺
                </div>
                <input name="s_search_order_store" style="width:120px" onkeyup="keyup_submit(event,'order')" type="text" autocomplete="on" placeholder="" class="layui-input">
                <div class="layui-input-split layui-input-suffix" style="cursor: pointer;" onclick="keyup_submit({which:13},'order')">
                    <i class="layui-icon layui-icon-search"></i>
                </div>
          

                <div class="layui-input-prefix" >
                    产品
                </div>
                <input name="s_search_product" style="width:120px" onkeyup="keyup_submit(event,'product')" type="text" autocomplete="on" placeholder="" class="layui-input">
                <div class="layui-input-split layui-input-suffix" style="cursor: pointer;" onclick="keyup_submit({which:13},'product')">
                    <i class="layui-icon layui-icon-search"></i>
                </div>
            </div>
            `
            $("#c_search .layui-form-item:eq(0) .layui-input-inline:last").after(str); //增加元素    
        },

        /**
         * 在产品后面插入搜索
         */
        render_search_product: function() {
            const str = `
            <div class="layui-input-group" id="search_product" style="width:300px;display:inline-block;margin-left:50px;">             
                <input name="s_search_product" onkeyup="keyup_submit(event,'product')" style="width:150px;display:inline;" type="text" autocomplete="on" placeholder="关键字搜索产品" class="layui-input">
                <div class="layui-input-split layui-input-suffix" style="cursor: pointer;display:inline;" onclick="keyup_submit({which:13},'product')">
                    <i class="layui-icon layui-icon-search"></i>
                </div>
            </div>
                    `
            $("#c_search .layui-form-item:eq(3) .layui-input-block:last").children(":last").after(str); //增加元素
        },

        /**
         * 在内容后面插入搜索
         */
        render_search_content: function() {
            const str = `
            <div class="layui-input-group" id="search_content" style="width:300px;display:inline-block;margin-left:50px;">             
                <input name="s_search_content" onkeyup="keyup_submit(event,'content')" style="width:150px;display:inline;" type="text" autocomplete="on" placeholder="关键字搜索内容" class="layui-input">
                <div class="layui-input-split layui-input-suffix" style="cursor: pointer;display:inline;" onclick="keyup_submit({which:13},'content')">
                    <i class="layui-icon layui-icon-search"></i>
                </div>
            </div>
            `
            $("#c_search .layui-form-item:eq(5) .layui-input-block:last").children(":last").after(str); //增加元素 
        },



        /**
         * 
         * @param {*} div 
         * @param {*} freashData 
         */
        render: function(div, freashData) {
            oms.freashData = freashData || function() {
                console.log(oms.getSearchParam())
            }
            const str = `
<div id="c_search" class="layui-form" style="display: none;" lay-filter="c_search">
<div class="layui-form-item">
    <label class="layui-form-label">搜索</label>
    <div class="layui-input-group" style="min-width:200px;">
        <div class="layui-input-prefix" >
            订单/店铺
        </div>
    <input name="s_search_order_store" style="width:120px" onkeyup="keyup_submit(event,'order')" type="text" autocomplete="on" placeholder="" class="layui-input">
    <div class="layui-input-split layui-input-suffix" style="cursor: pointer;" onclick="keyup_submit({which:13},'order')">
        <i class="layui-icon layui-icon-search"></i>
    </div>


    <div class="layui-input-prefix" >
        产品
    </div>
    <input name="s_search_product" style="width:120px" onkeyup="keyup_submit(event,'product')" type="text" autocomplete="on" placeholder="" class="layui-input">
    <div class="layui-input-split layui-input-suffix" style="cursor: pointer;" onclick="keyup_submit({which:13},'product')">
        <i class="layui-icon layui-icon-search"></i>
    </div>
    </div>

  
</div>
<div class="layui-form-item">
    <label class="layui-form-label">订单</label>
    <div id="c_order" class="layui-input-block">
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-red" style="margin-top: 4px;" onclick="selectBtns_m(this,'s_order')">全部</button>
    </div>
</div>
<div class="layui-form-item">
    <label class="layui-form-label">店铺</label>
    <div id="c_store" class="layui-input-block">
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-red" style="margin-top: 4px;" onclick="selectBtns_m(this,'s_store')">全部</button>
    </div>
</div>
<div class="layui-form-item">
    <label class="layui-form-label">产品</label>
    <div id="c_product" class="layui-input-block">
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-red" style="margin-top: 4px;" onclick="selectBtns_m(this,'s_product')">全部</button>
    </div>
</div>
<div class="layui-form-item">
    <label class="layui-form-label">设备</label>
    <div id="c_machine" class="layui-input-block">
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-red" style="margin-top: 4px;" onclick="selectBtns_m(this,'s_machine')">全部</button>
    </div>
</div>
<div class="layui-form-item">
    <label class="layui-form-label">内容</label>
    <div id="c_content" class="layui-input-block">
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-red" style="margin-top: 4px;" onclick="selectBtns_m(this,'s_content')">不限</button>
    </div>
</div>
<div class="layui-form-item">
    <label class="layui-form-label">日期</label>
    <div class="layui-input-inline">
        <input type="text" name="s_begin" id="s_begin" lay-verify="" placeholder="开始时间" autocomplete="off" class="layui-input">
    </div>
    <!-- <div class="layui-form-mid">-</div> -->
    <div class="layui-input-inline">
        <input type="text" name="s_end" id="s_end" lay-verify="" placeholder="结束时间" autocomplete="off" class="layui-input">
    </div>
    <div class="layui-input-inline" style="width: 360px; ">
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-blue" style="margin-top: 4px;" onclick="settime(0)">最近1年</button>
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-blue" style="margin-top: 4px;" onclick="settime(1)">最近1月</button>
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-blue" style="margin-top: 4px;" onclick="settime(2)">最近1星期</button>
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-blue" style="margin-top: 4px;" onclick="settime(3)">最近1天</button>
    </div>
    <input name="s_show" type="hidden" value="2" />
</div>
</div>`

            $(div).html(str)
            settime(1, false)
            $('#c_search').show()
                //日期
            laydate.render({
                elem: '#s_begin',
                change: function(value, date, endDate) {
                    oms.freashData()
                },
                done: function(value, date, endDate) {
                    oms.freashData()
                }
            });
            laydate.render({
                elem: '#s_end',
                change: function(value, date, endDate) {
                    oms.freashData()
                },
                done: function(value, date, endDate) {
                    oms.freashData()
                }
            });
            oms.showAll()
                // oms.showAddress_All(1, 0)
                // oms.render_search_order_store()
                // oms.render_search_content()
                // oms.render_search_product()
        },
    };
    exports('oms_a', oms);
})