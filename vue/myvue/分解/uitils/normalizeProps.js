    /**
     * Ensure all props option syntax are normalized into the
     * Object-based format.
     * Jane 转换统一的形式 props, 如果是数组必须是字符串。
     * 示例：
     1）props: ['message'] 。
     2）props: {
            data: Array,     //限制父组件给过来的类型要符合这array.
            columns: Array,
            filterKey: String
          }
     * {
        
     }
     */
     // 统一如下：
     // {
     //    'message':{
     //        'type':null
     //    }
     // }
     // {
     //    'data':{
     //        'type':Array
     //    },
     //    'columns':{
     //        'type':Array
     //    },
     // }
    function normalizeProps(options) {
        var props = options.props;
        if (!props) {
            return
        }
        var res = {};
        var i, val, name;
        // Jane, 数组必须是 字符串。
        if (Array.isArray(props)) {
            i = props.length;
            while (i--) {
                val = props[i];
                if (typeof val === 'string') {
                    name = camelize(val);
                    res[name] = {
                        type: null
                    };
                } else {
                    warn('props must be strings when using array syntax.');
                }
            }
        } else if (isPlainObject(props)) {
            for (var key in props) {
                val = props[key];
                name = camelize(key);
                res[name] = isPlainObject(val) ? val : {
                    type: val
                };
            }
        }
        options.props = res;
    }