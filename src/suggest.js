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
				elements : {
					/* 放置suggest的wrap */
					wrap : NULL,
					/*  */
					input : NULL,
					form : Null
				},
				template : {
					/* suggest提示框结构模板 */
					sug  : '',
					/* 每条结果结构模板 */
					item : '',
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
			return this;
		},

		/*=================控制器=====================*/

		/**
		 * bindEvent 初始化事件绑定操作
		 * @return keyword{String} 当前用户输入的关键字
		 * @return suggest{Suggest} 当前实例
		 */
		_bindEvent : function(){
			return this;
		},

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
			return this;
		},
		/**
		 * hide 隐藏suggest列表
		 * @return suggest{Suggest} 当前实例
		 */
		hide : function(){
			return this;
		},

		/*=================数据操作=====================*/

		/**
		 * _getKeyword 获取用户输入框请求的关键字
		 * @return keyword{String} 当前用户输入的关键字
		 */
		_getKeyword : function(){
		},
		/**
		 * _getSuggestData 获取suggest数据(缓存或者请求)
		 * @return suggest{Suggest} 当前实例
		 */
		_getSuggestData : function(){
			return this;
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
		}

	}
})(Zepto, window);

