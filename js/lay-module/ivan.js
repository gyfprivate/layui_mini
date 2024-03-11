/**
 * 更多或收起按钮
 * @param {*} fid 父元素
 * @param {*} othis 本元素
 * @param {*} overb 超过多少就隐藏
 */
function ivanExplanBtns(fid, othis, overb) {
    var $ = layui.$
    othis = $(othis)
    var show = othis.attr('expand') != undefined
    if (show) {
        // 收缩
        othis.html('展开')
        othis.removeAttr('expand')
        $(fid).children(":gt(" + overb + "):not(:last-child)").hide()
    } else {
        //展开
        $(fid).children().show()
        othis.html('收起')
        othis.attr('expand', '')
    }
    othis.show()
        // console.log(show)
}
/**
 * 
 * 2023 11 30 
 */
layui.define(['jwt', 'form'], function(exports) {
    var $ = layui.$,
        jwt = layui.jwt,
        form = layui.form;
    var layer = layui.layer;
    var ivan = {
        render: function(options) {
            options.serviceUrl = options.serviceUrl || 'http://127.0.0.1:80/';
            layui.data('jwt', {
                key: 'serviceurl',
                value: options.serviceUrl
            });
        },


        /**
         * 树形结构的数组
         * 转换成一个一维数组
         * @param {*} tree 
         * @returns 
         */
        flattenTree: function(tree) {
            let result = [];

            function traverse(node) {
                if (node.children != null && node.children != undefined && Array.isArray(node.children)) {
                    node.children.forEach(traverse);
                }
                node.children = null
                result.push(node);
            }
            tree.forEach(traverse);
            return result;
        },

        /**
         * 显示横排按钮
         * 第一个是 固定为全部
         * @param {*} data 数据 name value 对
         * @param {*} father 父div
         * @param {*} field field + '\',' + data[i].value
         * @param {*} m 是否多选 selectBtns selectBtns_m function(btn, field, v)
         */
        showBtns: function(data, father, field, m, max = 10) {
            if (data == undefined) return;
            for (let i = 0; i < data.length; i++) {
                var hide = i > max - 1 ? 'display: none;' : ''
                if (!m)
                    father.append('<button type="button" class="layui-btn-sm layui-btn layui-btn-primary" style="margin-top: 4px;' + hide + '" onclick="selectBtns(this,\'' + field + '\',\'' + data[i].value + '\')">' + data[i].name + '</button>')
                else
                    father.append('<button type="button" class="layui-btn-sm layui-btn layui-btn-primary" style="margin-top: 4px;' + hide + '" onclick="selectBtns_m(this,\'' + field + '\',\'' + data[i].value + '\')">' + data[i].name + '</button>')
            }
            if (data.length > max) {
                var fid = father.attr("id")
                father.append('<button id="btns' + field + '"  type="button" class="layui-btn-xs layui-btn layui-btn-primary layui-border-blue" style="margin-top: 4px;" onclick="ivanExplanBtns(' + fid + ',this,' + max + ')" >更多</button>')
            }
        },

        /**
         * 处理单选
         * @param {*} btn 
         */
        selectBtns: function(btn) {
            var father = $(btn).parent()
            var index = $(btn).index()
            father.children().not($(btn)).removeClass('layui-border-red')
            father.children().eq(index).addClass('layui-border-red')
        },


        /**
         * 多选
         * @param {*} btn 
         * @returns all 是否点击了全部 index 从1开始 select 是否选中
         */
        selectBtns_m: function(btn) {
            var c = $(btn)
            var father = c.parent()
            var index = c.index()
            var css = 'layui-border-red'
            if (index == 0) {
                father.children().not(c).removeClass(css)
                father.children().eq(0).addClass(css)
                return { all: true }
            } else {
                c.toggleClass(css)
                if (father.children(':gt(0)').not("." + css).length === father.children(':gt(0)').length) {
                    //除了全部，其它都不是 layui-border-red 
                    father.children().eq(0).addClass(css)
                    return { all: true }
                } else {
                    father.children().eq(0).removeClass(css)
                    return { all: false, index, select: c.hasClass(css) }
                }
            }
        },

        /**
         * 通用设置请求
         * @param {*} option 
         */
        set_req: function(arg, title, sf) {
            arg['success'] = function(data) {
                if (data.code != 0) {
                    layer.msg(data.msg, {
                        shift: -1,
                        time: 1500
                    });
                } else {
                    layer.msg(title, {
                        shift: -1,
                        time: 500
                    }, sf);
                }
            }
            arg['error'] = function(e) {
                layer.msg(e.status, {
                    shift: -1,
                    time: 1500
                });
            }
            jwt.req(arg)
                // jwt.req({
                //     ...arg,
                //     ... {
                //         success: function(data) {
                //             if (data.code != 0) {
                //                 layer.msg(data.msg, {
                //                     shift: -1,
                //                     time: 1500
                //                 });
                //             } else {
                //                 layer.msg(title, {
                //                     shift: -1,
                //                     time: 500
                //                 }, sf);
                //             }
                //         },
                //         error: function(e) {
                //             layer.msg(e.status, {
                //                 shift: -1,
                //                 time: 1500
                //             });
                //         }
                //     }
                // })
        },

        /**
         * 获取URL
         * @param {*} url 
         * @returns 
         */
        url: function(url) {
            return jwt.getUrl() + url
        },

        /**
         * 是否有高级权限
         */
        isHighRole: function() {
            var d = jwt.decode()
            var rs = d.userroles || ""
            console.log(rs)
            var rrs = ['管理员', '董事长', '总经理']
            return rs.split(",").some(o => rrs.includes(o))
        },
        /**
         * 是否有高级权限
         */
        isAdmin: function() {
            var d = jwt.decode()
            var rs = d.userroles || ""
            console.log(rs)
            var rrs = ['管理员']
            return rs.split(",").some(o => rrs.includes(o))
        },
        /**
         * 获取客户
         */
        get_download: function() {
            ivan.download(jwt.getUrl() + "crm/cust/download/all", '客户列表.csv')
        },
        /**
         * 下载
         * @param {string} url 
         * @param {string} file 
         */
        download: function(url, file) {
            jwt.req({
                url: url,
                type: 'get',
                xhrFields: { responseType: '' },
                dataType: 'text',
                headers: { accept: '*/*' }
                // , responseType: 'blob' // 这里设置responseType为'blob' 
                ,
                success: function(data) {
                    // 创建 Blob 对象
                    var blob = new Blob([data], { type: 'application/octet-stream' });

                    // 创建虚拟链接
                    var link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob);
                    link.download = file;

                    // 模拟点击链接
                    link.click();

                    // 移除虚拟链接
                    window.URL.revokeObjectURL(link.href);
                },
                error: function() {
                    // 处理下载失败的情况
                    layer.msg('下载失败', { icon: 2 });
                }
            })
        },
        /**  
         * 下载模板
         */
        get_template: function() {
            ivan.download(jwt.getUrl() + "crm/cust/download/Template", '导入模板.csv')
        },

        /**  
         * 获取form中的address nation-province-city： 
         * @param {object} data form数据  
         */
        get_address: function(data) {
            var address = data.field.nation
            if (data.field.province) address = address + "-" + data.field.province
            if (data.field.city) address = address + "-" + data.field.city
            return address
        },
        /**  
         * 渲染select： 
         * 国家
         * @param {object} data  
         * @param {object} data  
         */
        render_select_data_novalue: function(data, name) {
            //  获取要添加option的select元素
            var select = $('select[name="' + name + '"]');
            data.forEach(function(val, index, arr) {
                    select[0].add(new Option(val.name))
                })
                // form.render('select') //很重要，结束后需要重新渲染
        },

        /**  
         * 渲染select： 
         * name 根据form表单name查找数据
         * @param {object} option  
         */
        render_select_data: function(data, name) {
            //  获取要添加option的select元素
            var select = $('select[name="' + name + '"]');
            data.forEach(function(val, index, arr) {
                    select[0].add(new Option(val.name, val.value))
                })
                // form.render('select') //很重要，结束后需要重新渲染
        },
        /**  
         * 渲染select： 
         * @param {object} data  
         */
        render_select_data_reset: function(data, name, title) {

            //  获取要添加option的select元素
            var select = $('select[name="' + name + '"]');
            select.empty() //清空并加上第一层信息
            select[0].add(new Option(title, ""))
            data = data || []
            data.forEach(function(val, index, arr) {
                    select[0].add(new Option(val.name, val.value))
                })
                // form.render('select') //很重要，结束后需要重新渲染
        }
    };
    exports('ivan', ivan);
})