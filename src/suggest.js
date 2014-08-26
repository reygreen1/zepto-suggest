/**
 * suggest.js	搜索建议组件
 * @authors guorui (guorui@360.cn)
 * @date    2014-08-26 15:10:02
 * @version 1.0.0
 */
(function($, win){

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

			};
			this.config = $.extend( true , D_conf , U_conf );
			/* 初始化DOM */
			this._initDom();
			/* 初始化事件绑定 */
			this._bindEvent();
		},
		/**
		 * initDom	初始化Dom函数,对dom进行包装，添加一些组件需求的元素
		 */
		_initDom : function(){
		},
		/**
		 * bindEvent 初始化事件绑定操作
		 */
		_bindEvent : function(){
		}

	}
})(Zepto, window);

