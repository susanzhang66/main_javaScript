/**
 * H5日志页面逻辑
 *
 */
require(['zepto', 'underscore', 'libs/h5_log'], function($, _, H5Log) {
    'use strict';

    var TEMPLATE_LOG_ITEM = _.template($('#template_log_item').html()), //模板
        $RESULT_CONTENT = $('.result_list dl'),
        $CLEAR_INPUT = $('.clear_input'),
        $INPUT_KW = $('#keyword'),
        LEVELS = ['debug', 'info', 'warn', 'error'],
        QUERY_LEV = '6', //默认查询所有日志级别
        Page;

    //高亮关键字
    var highKey = function(obj, keyword) {
        var enRegExp = new RegExp('(' + keyword + ')', 'ig'),
            highText = '<span class="yellow">$1</span>',
            deRegExp = /<span\s+class=.?yellow.?>([^<>]*)<\/span>/g,
            $dt = obj.find('dt'),
            $logPageTime = obj.find('.log-page-time'),
            $logPageContent = obj.find('.log-page-content'),
            enTextDt = $dt.html().replace(deRegExp, '$1'),
            enTimeTextDd = $logPageTime.html().replace(deRegExp, '$1'),
            enContentTextDd = $logPageContent.html().replace(deRegExp, '$1');

        if (keyword.length == 0) {
            $dt.html(enTextDt);
            $logPageTime.html(enTimeTextDd);
            $logPageContent.html(enContentTextDd);
            return;
        }

        var tmpDtText = enTextDt.replace(enRegExp, highText),
            tmpLogTimeText = enTimeTextDd.replace(enRegExp, highText),
            tmpLogContent = enContentTextDd.replace(enRegExp, highText);

        $dt.html(tmpDtText);
        $logPageTime.html(tmpLogTimeText);
        $logPageContent.html(tmpLogContent);
    };

    //过滤关键字 显示内容
    var filterKey = _.debounce(function(keyWord) {
        var $content = $RESULT_CONTENT.children(),
            regExp = new RegExp(keyWord, 'im');

        keyWord ? $CLEAR_INPUT.css('display', 'block') : $CLEAR_INPUT.hide();

        $content.each(function() {
            if (regExp.test($(this).text()) && QUERY_LEV == H5Log.ALL_LEV || LEVELS[QUERY_LEV] == $(this).find('dt').attr('class').split('_')[1]) {
                highKey($(this), keyWord);
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }, 300);

    Page = {
        init: function() {
            //初始化
            var items = H5Log.readLog();
            $RESULT_CONTENT.html(TEMPLATE_LOG_ITEM({
                items: items,
                LEVELS: LEVELS
            }));
            //注册订阅  新增日志自动显示到页面
            H5Log.subscribe(function(log) {
                $RESULT_CONTENT.prepend(TEMPLATE_LOG_ITEM({
                    items: [log],
                    LEVELS: LEVELS
                }));
                filterKey($('#keyword').val());
            });

            this.bind();
        },
        bind: function() {
            //清除keyword图标
            $CLEAR_INPUT.click(function() {
                $INPUT_KW.val('');
                $INPUT_KW.trigger('input');
                $(this).hide();
            });

            //input事件延迟300ms执行（防反跳）
            $INPUT_KW.on('input', function() {
                filterKey($(this).val());
            });

            //按tag过滤
            $RESULT_CONTENT.on('click', 'dt', function() {
                $INPUT_KW.val($(this).html());
                $INPUT_KW.trigger('input');
            });

            //隐藏显示日志详情
            $RESULT_CONTENT.on('click', 'dd', function() {
                $(this).toggleClass('ellipsis_content3');
            });

            //日志级别及颜色
            $('.levels li').click(function() {
                var _s = $(this);

                if (_s.attr('sel')) {
                    return;
                }
                //颜色反显
                _s.css('backgroundColor', _s.css('color')).css('color', '#FFFFFF');
                _s.siblings().attr({
                    'style': '',
                    'sel': ''
                });
                _s.attr('sel', '1');

                QUERY_LEV = _s.attr('lev');

                filterKey($('#keyword').val());
            });
            $('.levels .color_all').trigger('click');

            //页面开关 x轴滑动超过300px打开/关闭页面
            $(document.body).on('touchstart', function(event) {
                var startX = (event || window.event).touches[0].clientX;
                $(document.body).on('touchmove', function(event) {
                    var endX = (event || window.event).targetTouches[0].pageX;
                    if (Math.abs(endX - startX) > 200) {
                        $('#H5log_content').toggle();
                        $(document.body).off('touchmove');
                    }
                });
                $(document.body).on('touchend', function() {
                    $(document.body).off('touchmove');
                    $(document.body).off('touchend');
                });
            });
        }
    };

    $(function() {
        Page.init();
    });
});
