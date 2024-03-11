selectBtns_m = function(btn, field, v) {
    layui.oms.selectBtns_m(btn, field, v);
}

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
        layui.oms.freashData()
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

        //显示设备联排按钮
        showMachine: function() {
            // 全选也列出所有数据
            console.log(oms.data_store)
            var store = []
            if (oms.data_store.all || oms.data_store.index.length == 0) { //如果全选 获取一个都没选，当成全选
                store = oms.data_store.allindex
            } else {
                store = oms.data_store.index.map(o => oms.data_store.allindex[o - 1])
            }
            // console.log(store)
            jwt.req({
                url: ivan.url('oms/api/select/getmachine'),
                type: 'post',
                data: {
                    store
                },
                success: function(response) {
                    var data = response.data
                    if (response.code === 0) {
                        oms.data_machine.all = true
                        oms.data_machine.index = []
                        $('#c_machine button:first').addClass('layui-border-red');
                        $('#c_machine button:gt(0)').remove();
                        ivan.showBtns(data.machine, $('#c_machine'), 's_machine', true) //多选联排按钮
                        oms.data_machine.allindex = data.machine.map(o => o.value)

                        oms.data_content.all = true
                        oms.data_content.index = []
                        $('#c_content button:first').addClass('layui-border-red');
                        $('#c_content button:gt(0)').remove();
                        ivan.showBtns(data.content, $('#c_content'), 's_content', true) //多选联排按钮
                        oms.data_content.allindex = data.content.map(o => o.value)
                        oms.freashData() //变化之后重新刷新数据列表
                    }
                }
            })
        },

        //显示内容按钮
        showContent: function() {
            // 全选也列出所有数据
            var store = []
            if (oms.data_store.all || oms.data_store.index.length == 0) {
                store = oms.data_store.allindex
            } else {
                store = oms.data_store.index.map(o => oms.data_store.allindex[o - 1])
            }
            var machine = []
            if (oms.data_machine.all || oms.data_machine.index.length == 0) {
                machine = oms.data_machine.allindex
            } else {
                machine = oms.data_machine.index.map(o => oms.data_machine.allindex[o - 1])
            }
            jwt.req({
                url: ivan.url('oms/api/select/getcontent'),
                type: 'post',
                data: {
                    store: store,
                    machine: machine
                },
                success: function(response) {
                    var data = response.data
                    console.log(data)
                    if (response.code === 0) {
                        oms.data_content.all = true
                        oms.data_content.index = []
                        $('#c_content button:first').addClass('layui-border-red');
                        $('#c_content button:gt(0)').remove();
                        ivan.showBtns(data.content, $('#c_content'), 's_content', true) //多选联排按钮
                        oms.data_content.allindex = data.content.map(o => o.value)
                        oms.freashData() //变化之后重新刷新数据列表
                    }
                }
            })
        },

        //多选数据处理
        selectBtns_m: function(btn, field, v) {
            var data = ivan.selectBtns_m(btn)
                // console.log(data)
                // console.log(field)
            if (data.all == true) {
                // 全选
                switch (field) {
                    case 's_store':
                        oms.data_store.all = true
                        oms.data_store.index = []
                        oms.showMachine()
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
                        oms.showMachine()
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
                }
            }
        },

        //刷新店铺
        showStore: function(url = 'oms/api/select/store') {
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
                        oms.data_store.all = true
                        oms.data_store.index = []
                        $('#c_store button:first').addClass('layui-border-red');
                        $('#c_store button:gt(0)').remove();
                        if (data.store.length > 0)
                            ivan.showBtns(data.store, $('#c_store'), 's_store', true) //多选联排按钮
                        oms.data_store.allindex = data.store.map(o => o.value)

                        oms.data_machine.all = true
                        oms.data_machine.index = []
                        $('#c_machine button:first').addClass('layui-border-red');
                        $('#c_machine button:gt(0)').remove();
                        if (data.machine.length > 0)
                            ivan.showBtns(data.machine, $('#c_machine'), 's_machine', true) //多选联排按钮
                        oms.data_machine.allindex = data.machine.map(o => o.value)

                        oms.data_content.all = true
                        oms.data_content.index = []
                        $('#c_content button:first').addClass('layui-border-red');
                        $('#c_content button:gt(0)').remove();
                        if (data.content.length > 0)
                            ivan.showBtns(data.content, $('#c_content'), 's_content', true) //多选联排按钮
                        oms.data_content.allindex = data.content.map(o => o.value)
                        oms.freashData() //刷新数据列表
                    }
                }
            })
        },


        //地址联动
        showAddress: function(level, value, done) {
            $('select[name=address' + level + '] option:gt(0)').remove();
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
                                var elem = data.elem; // 获得 select 原始 DOM 对象
                                var value = data.value; // 获得被选中的值
                                var othis = data.othis; // 获得 select 元素被替换后的 jQuery 对象
                                if (value) {
                                    oms.showAddress(level + 1, value)
                                    for (var i = level + 2; i <= 3; i++)
                                        $('select[name=address' + i + '] option:gt(0)').remove();
                                    // layer.msg(this.innerHTML + ' 的 value: ' + value); // this 为当前选中 <option> 元素对象
                                } else {
                                    //消除下级数据
                                    for (var i = level + 1; i <= 3; i++)
                                        $('select[name=address' + i + '] option:gt(0)').remove();
                                }
                                form.render('select') //显示
                                if (done)
                                    done() //刷新店铺
                            });
                        } else if (level == 3) {
                            //店铺列表变更
                            form.on('select(address' + level + ')', function(data) {
                                if (done)
                                    done(data) //刷新店铺
                            });
                        }
                    }
                }
            })
        },

        //地址联动
        showAddress_store: function(level, value) {
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
                                var elem = data.elem; // 获得 select 原始 DOM 对象
                                var value = data.value; // 获得被选中的值
                                var othis = data.othis; // 获得 select 元素被替换后的 jQuery 对象
                                if (value) {
                                    oms.showAddress_store(level + 1, value)
                                    for (var i = level + 2; i <= 3; i++)
                                        $('select[name=address' + i + '] option:gt(0)').remove();
                                    // layer.msg(this.innerHTML + ' 的 value: ' + value); // this 为当前选中 <option> 元素对象
                                } else {
                                    //消除下级数据
                                    for (var i = level + 1; i <= 3; i++)
                                        $('select[name=address' + i + '] option:gt(0)').remove();
                                }
                                form.render('select') //显示
                                oms.showStore() //刷新店铺
                            });
                        } else if (level == 3) {
                            //店铺列表变更
                            form.on('select(address' + level + ')', function(data) {
                                oms.showStore() //刷新店铺
                            });
                        }
                    }
                }
            })
        },
        // 不显示店铺地址选择
        render_no_address: function(div, freashData, url) {
            oms.freashData = freashData || function() {
                console.log(oms.getSearchParam())
            }
            const str = `
<div id="c_search" class="layui-form" style="display: none;" lay-filter="c_search">
<div class="layui-form-item">
    <label class="layui-form-label">店铺</label>
    <div id="c_store" class="layui-input-block">
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-red" style="margin-top: 4px;" onclick="selectBtns_m(this,'s_store')">全部</button>
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
            oms.showStore(url)
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
    <label class="layui-form-label">区域</label>
    <div class="layui-input-inline">
        <select name="address1" lay-search lay-filter="address1">
            <option value="">所有国家</option>
        </select>
    </div>
    <div class="layui-input-inline">
        <select name="address2" lay-search lay-filter="address2">
            <option value="">所有省</option>
        </select>
    </div>
    <div class="layui-input-inline">
        <select name="address3" lay-search lay-filter="address3">
            <option value="">所有市</option>
        </select>
    </div>
</div>
<div class="layui-form-item">
    <label class="layui-form-label">店铺</label>
    <div id="c_store" class="layui-input-block">
        <button type="button" class="layui-btn-sm layui-btn layui-btn-primary layui-border-red" style="margin-top: 4px;" onclick="selectBtns_m(this,'s_store')">全部</button>
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
                    // type: 'datetime',
                    // fullPanel: true
            });
            laydate.render({
                elem: '#s_end',
                change: function(value, date, endDate) {
                    oms.freashData()
                },
                done: function(value, date, endDate) {
                        oms.freashData()
                    }
                    // type: 'datetime',
                    // fullPanel: true
            });
            oms.showStore()
            oms.showAddress_store(1, 0)
        },
    };
    exports('oms', oms);
})