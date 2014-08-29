/**
 * suggest.js	搜索建议组件
 * @authors guorui (guorui@360.cn)
 * @date    2014-08-26 15:10:02
 * @version 1.0.0
 */
(function($, win){
	/* 全局标识 */
	var guid  = 0,
		TRUE  = true,
		FALSE = false,
		NULL  = null;

	var CustEvents = ['afterInitDom'];

	/* 公共方法 */
	htmlEscape = function(s) {
        if(s == NULL) return '';
        s = s + '';
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "&#39;");
    },
	tmpl = function (tplStr, data) {
        return tplStr.replace(/{([^}]*)}/g, function ($0, $1) {
            return data[$1] == NULL ? '' : htmlEscape(data[$1]);
        });
    },
    

	function Suggest( conf ){
		this._init( conf );
	}
	Suggest.prototype = {
		/* 更正构造函数 */
		constructor : Suggest,
		/**
		 * init	初始化函数
		 * @param config{Object} 用户配置
		 */
		_init : function( U_conf ){
			/* 默认配置 */
			var D_conf = {
				/* 是否显示input框快速删除按钮 */
				showQuickDel : true,
				elements : {
					/* 放置suggest的wrap */
					wrap : NULL,
					/* 输入框 */
					input : NULL,
					/* 要提交的form表单 */
					form : NUll,
					/* 清空历史记录的按钮 */
					history : NULL,
					/* 关闭suggest列表的按钮 */
					close : NULL,
					/* 快速删除按钮 */
					quickdel : NULL
				},
				template : {
					/* suggest提示框结构模板 */
					sug  : '<div class="sug">'+
		    					'<div class="sug-list">'+
		    					'</div>'+
		    					'<div class="sug-button">'+
		    						'<span class="sug-clear">清空历史记录</span>'+
		    						'<span class="sug-close">关闭</span>'+
		    					'</div>'+
		    				'</div>',
					/* 每条结果结构模板 */
					item : '<div class="sug-item" data-item="{value}">'+
    							'{value}'+
    							'<span class="sug-plus"></span>'+
    						'</div>',
					/* 历史记录结构模板 */
					history : ''
				}
			};
			this.config = $.extend( true , D_conf , U_conf );
			/* 初始化DOM */
			this._initDom();
			/* 初始化事件绑定 */
			this._bindEvent();
		},

		/*=================初始化=====================*/

		/**
		 * initDom	初始化Dom函数,对dom进行包装，添加一些组件需求的元素
		 * @return suggest{Suggest} 当前实例
		 */
		_initDom : function(){
			var t = this,
				$wrap = t.El('wrap'),
				$input = t.El('input'),
				$form = t.El('form'),
				sugTmpl = t.config.template.sug,
				sugList,
				sugClassTop = NULL;

			/* 输入框 */
			!$input && $input = t.El('input',$('#input'));
			$input.attr('autocomplete','off');
			/* 快速删除按钮 */
			t.config.showQuickDel && ($input.parent().append('<div class="sug-quickdel"></div>'));
			/* form表单 */
			!$form && $form = (t.El('form',$input.closet('form')));

			/* 修正wrap，suggest的外层包裹，可以用户指定，默认在input上外创建一个sug-mask的div */
			if ($wrap) {
				/* wrap存在，所有suggest的结构放入wrap中*/
				$wrap.append(sugTmpl);
			}else{
				/* wrap不存在，默认在input后放置一个suggest list */
				var $wrap = $input.wrap('<div class="sug-mask"></div>');
				$wrap.css({'position':'relative'});
				sugClassTop = $input.height() + (parseInt( t.$wrap.css( 'top' ), 10 ) || 0);
			}
			/* suggest list */
			$sugList = t.El('list',$wrap.find('.sug-list'));
			sugClassTop && $sugList.css('top',sugClassTop);

			/* 按钮 */
			t.El('history',$wrap.find('.sug-clear'));
			t.El('close',$wrap.find('.sug-close'));

			return t;
		},

		/**
		 * bindEvent 初始化事件绑定操作
		 * @return keyword{String} 当前用户输入的关键字
		 * @return suggest{Suggest} 当前实例
		 */
		_bindEvent : function(){
			var t = this,
				$input = t.El('input'),
				$history = t.El('history'),
				$close = t.El('close'),
				$quickdel = t.El('quickdel'),
				$list = t.El('list');
			/* input的相关事件绑定 */
			$input.on('focus',function(){
				!t.isShow() && t._renderSuggestList();
			});
			$input.on('input',function(){
				t._renderSuggestList();
			});

			/* 历史记录 */
			$history.on('click',function(){
				t.history(NULL);
			});

			/* 关闭按钮 */
			$close.on('click',function(){
				t.hide();
			});

			/* 快速删除按钮 */
			if(t.config.showQuickDel){
				$quickdel.on('click',function(){
					$input.val('');
					$(this).hide();
					$input.trigger('focus');
				});
				$input.on('focus',function(){
					if($input.val()){
						$quickdel.show();
					}else{
						$quickdel.hide();
					}
				});
			}

			/* 快速复制按钮 */
			$list.delegate('.sug-plus','click',function(e){
				e.stopPropagation();
				$input.val($(this).closet('.sug-item').data('item'));
				$input.trigger('focus');
			});

			return t;
		},

		/*=================自定义事件=====================*/
		/*_inputControll : function(){
			var t = this,
				$input = t.El('input');

			$intput.on('inputfocus',function(e){

			});
		},
		_suggestControll : function(){
			var t = this,
				$list = t.El('list');
			$list.on('sugshow',function(){

			});
		}*/

		/*=================视图操作=====================*/

		/**
		 * _renderSuggestList 渲染suggest列表
		 * @return suggest{Suggest} 当前实例
		 */
		_renderSuggestList : function(){
			return this;
		},
		/**
		 * _renderSuggestItem 对suggest结果中的单一条目进行渲染
		 * @return html{String} 返回经过数据替换的html字符串
		 */
		_renderSuggestItem : function(){
		},
		/**
		 * show 显示suggest列表
		 * @return suggest{Suggest} 当前实例
		 */
		show : function(){
			var t = this,
				$list = t.El('list');
			if(!t.isShow()){
				$list.show();
			}
			return t;
		},
		/**
		 * hide 隐藏suggest列表
		 * @return suggest{Suggest} 当前实例
		 */
		hide : function(){
			var t = this,
				$list = t.El('list');
			if(t.isShow()){
				$list.hide();
			}
			return t;
		},
		/**
		 * isShow 判断suggest列表是否显示
		 * @return boolean{Boolean} 当前实例
		 */
		isShow : function(){
			var t = this,
				$list = t.El('list');
			return $list.is(':visible') ? TRUE : FALSE;
		},

		/*=================数据操作=====================*/

		/**
		 * _getKeyword 获取用户输入框请求的关键字
		 * @return keyword{String} 当前用户输入的关键字
		 */
		_getKeyword : function(){
			return this.El('input').val().trim();
		},
		/**
		 * _getSuggestData 获取suggest数据(缓存或者请求)
		 * @return suggest{Suggest} 当前实例
		 */
		_getSuggestData : function(){
			var t = this,
				kw = t._getKeyword();

			if( kw ){
				/* 有搜索关键字加载搜索数据 */
			}else{
				/* 没有关键字加载默认数据（历史记录） */
			}

			return t;
		},
		/**
		 * _getRemoteData 通过远程请求获取数据
		 * @return suggest{Suggest} 当前实例
		 */
		_getRemoteData : function(){
			return this;
		},
		/**
		 * _cacheData 对suggest请求数据进行缓存(对象存储)，操作(添加|删除|清空)
		 * @param [key]{String} 索引
		 * @param [value]{String} 值
		 * @return [suggest{Suggest}|value{String}] 返回当前实例或者相应索引值
		 */
		_cacheData : function( key , value ){
		},
		/**
		 * _localData 对localstorage的操作(添加|删除|清空)，限定key值为this.localKey
		 * @param [value]{String} 存储的值，NULL时为清空操作
		 * @return [suggest{Suggest}|value{String}] 返回当前实例或者相应索引值
		 */
		_localData : function( value ){
		},
		/**
		 * history 对历史记录的操作(添加|删除|清空)
		 * @param [value]{String} 存储的值，NULL时为清空操作
		 * @return [suggest{Suggest}|value{String}] 返回当前实例或者相应索引值
		 */
		history : function( value ){
		},

		/*=================工具方法=====================*/

		/**
		 * EL 对config上的elements进行操作 (获取|更新)
		 * @param [key]{String} 索引
		 * @param [value]{String} 值
		 * @return [zepto{Zepto}] 返回相应元素
		 */
		function El( key , value ){
			var t = this;
			if ( value ) {
				/* 设置元素值 */
				t.config.elements[key] = value;
				return t.config.elements[key];
			}else{
				/* 获取元素值 */
				return $(t.config.elements[key]);
			}
		}

	}
})(Zepto, window);

