/* 
** component,动作执行这里。
//这个动作是将 child复制一份与vue一样的功能 放置在vue.options[components][keys]里。 */

    function initAssetRegisters(Vue) {
        /**
         * Create asset registration methods.
         *  注册 组件函数，  ASSET_TYPES ＝ 有 component...  
            var ASSET_TYPES = [
                'component',
                'directive',
                'filter'
            ];
         *  缓存在 this.options[id]里。
         */
        ASSET_TYPES.forEach(function(type) {
            Vue[type] = function(
                id, //这个可以是 tag 元素
                definition // 第二个参数 一般对象，
            ) {
                if (!definition) {
                    return this.options[type + 's'][id]
                } else {
                    /* istanbul ignore if */
                    {
                        if (type === 'component' && config.isReservedTag(id)) {
                            warn(
                                'Do not use built-in or reserved HTML elements as component ' +
                                'id: ' + id
                            );
                        }
                    }
                    if (type === 'component' && isPlainObject(definition)) {
                        definition.name = definition.name || id;
                        //复制遗传一份vue,component的。  this.options._base == Vue;
                        definition = this.options._base.extend(definition);
                    }
                    if (type === 'directive' && typeof definition === 'function') {
                        definition = {
                            bind: definition,
                            update: definition
                        };
                    }
                    this.options[type + 's'][id] = definition;
                    //返回一个 合并到options里的 vue函数。
                    return definition
                }
            };
        });
    }