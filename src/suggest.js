/**
 * suggest.js	搜索建议组件
 * @authors guorui (reygreen1@163.com)
 * @date    2014-08-26 15:10:02
 * @version 1.1.1
 */
(function($, win, undefined){

	/* 请求结果缓存，多实例可共用 */
	var _cache = {},
	/* 公共方法 */
	htmlEscape = function(s) {
        if(s == null) return '';
        s = s + '';
        return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "&#39;");
    },
    /* 获取数组或者对象指定路径下的取值 */
    getPathData = function (data , path){
		var type = $.type(data),
			path = path + '',
			dirs = path.split('.'),
			dir;
		/* 非数组或者非对象的data不处理 */
		if(!(type=='array') && !(type=='object')){return 'error data';}
		if(path == 'undefined'){return 'error path';}

		while(dir = dirs.shift()){
			if(data[dir]){
				data = data[dir];
			}else{
				return null;
			}
		}
		return data;
	},
	tmpl = function (tplStr, data) {
		/**
		 * 一般模板替换时data为一个对象或者数组，这样在模板中可以通过制定path来获取相应值，从而个性化渲染模板，但也有可能传入data为string，如历史记录中的情况，这时把它包装成数组，便于在history模板中定制输出
		 */
		if($.type(data) == 'string'){data = [data]}

        return tplStr.replace(/{([^}]*?)}/g, function ($0, $1) {
            return data[$1] == null ? '' : htmlEscape(getPathData(data,$1));
        });
    };

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
					wrap : null,
					/* 输入框 */
					input : null,
					/* 要提交的form表单 */
					form : null,
					/* 清空历史记录的按钮 */
					history : null,
					/* 关闭suggest列表的按钮 */
					close : null,
					/* 快速删除按钮 */
					quickdel : null
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
					item : '<div class="sug-item" data-item="{0}">'+
    							'{0}<i>{1}</i>'+
    							'<span class="sug-plus"></span>'+
    						'</div>',
					/* 历史记录结构模板,历史记录里的变量固定为path:0 */
					history : '<div class="sug-item" data-item="{0}">'+
    							'{0}'+
    							'<span class="sug-plus"></span>'+
    						'</div>'
				},
				/* 是否显示input框快速删除按钮 */
				showQuickDel : true,
				/* 点击页面其他位置时，是否自动隐藏列表 */
				listAutoHide : true,
				/* suggest显示的最大数目 */
				suggestMaxNum : 5,
				/* history显示的最大数目 */
				historyMaxNum : 10,
				/* 远程加载数据的接口url */
				requestUrl : 'http://suggest.h.qhimg.com/index.php',
				/* 请求url中query字符串的键值，如"&kw=123"中的kw，通过它可以灵活适配服务端接口*/
				requestQueryKey : 'word',
				/* 请求url中callback回调的键值，如"&cb=zepto_suggest_123"中的cb，通过它可以灵活适配服务端接口*/
				requestCallbackKey : 'cb',
				/* 请求url中需要额外添加的参数， 通过它可以灵活适配服务端接口*/
				requestParam : 'biz=xiaoshuo_wap&fmt=jsonp',
				/* response数据中所需遍历数据的路径,使用.来分割，类似从{a:['ha']}中通过path:'a.1'来获取ha */
				responseDataPath : '',
				/* 数据请求处理的间隔时间 */
				renderDelayTime : 300,
				/* localstorage关键字 */
				localStorageKey : 'zepto_suggest',
				/* localstorage分隔符 */
				localStorageSeparator : ',',
				/* 清除历史记录是否提示确认框 */
				confirmClearHistory : true,
				/* 是否缓存请求的查询结果 */
				isCache : true			};
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
				sugClassTop = null;

			/* 输入框 */
			!$input && ($input = t.El('input',$('#input')));
			$input.attr('autocomplete','off');
			/* form表单 */
			!$form && ($form = (t.El('form',$input.closest('form'))));

			/* 修正wrap，suggest的外层包裹，可以用户指定，默认在input上外创建一个sug-mask的div */
			if ($wrap) {
				/* wrap存在，所有suggest的结构放入wrap中*/
				$wrap.append(sugTmpl);
			}else{
				/* wrap不存在，默认在input后放置一个suggest list */
				$input.wrap($wrap = $('<div class="sug-mask"></div>'));
				t.El('wrap',$wrap);
				$wrap.css({'position':'relative'});
				sugClassTop = $input.height() + (parseInt( $wrap.css( 'top' ), 10 ) || 0);
				$wrap.append(sugTmpl);
			}

			/* 快速删除按钮 */
			t.config.showQuickDel && ($input.parent().append(t.El('quickdel',$('<div class="sug-quickdel"></div>'))));

			/* suggest list */
			$sug = t.El('sug',$wrap.find('.sug'));
			$sugList = t.El('list',$wrap.find('.sug-list'));
			sugClassTop && $sug.css('top',sugClassTop);

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
				$form = t.El('form'),
				$history = t.El('history'),
				$close = t.El('close'),
				$quickdel = t.El('quickdel'),
				$sug = t.El('sug');
			/* input的相关事件绑定 */
			$input.on('focus',function(){
				!t.isShow() && t._renderList();
			});
			$input.on('input',function(){
				t._renderList();
			});

			/* 历史记录 */
			$history.on('click',function(){
				t.history(null);
			});

			/* form提交 */
			$form.on('submit',function(e){
				/* 存入历史记录 */
				t.history($input.val());
			});

			/* 关闭按钮 */
			$close.on('click',function(){
				t.hide();
			});

			/* 快速删除按钮 */
			if(t.config.showQuickDel){
				var handleDelBtn = function(){
					if($input.val()){
						$quickdel.show();
					}else{
						$quickdel.hide();
					}
				};
				$quickdel.on('click',function(){
					$input.val('').trigger('input');
					$(this).hide();
				});
				$input.on('focus blur input',handleDelBtn);
			}

			/* 快速复制按钮 */
			$sug.delegate('.sug-plus','touchend',function(e){
				$input.val($(this).closest('.sug-item').data('item'));
				$input.trigger('focus');
				e.preventDefault();
                e.stopPropagation();
			});

			/* suggest条目点击 */
			$sug.delegate('.sug-item','click',function(e){
				$(this).find('.sug-plus').trigger('touchend');
				$form.submit();
			});

			/* 点击页面其他区域，列表自动隐藏 */
			if (t.config.listAutoHide) {
				$(document).on('click',function(e){
					t.hide();
				});
				$form.on('click',function(e){
					$input.focus();
					e.stopPropagation();
				});
			}

			return t;
		},

		/*=================视图操作=====================*/

		/**
		 * _renderList 渲染suggest列表
		 * @param callback{Function} 回调函数
		 * @return suggest{Suggest} 当前实例
		 */
		_renderList : function(){
			var t = this,
				$history = t.El('history'),
				kw;

			win.clearTimeout(t.renderTimeout);
			t.renderTimeout = win.setTimeout(function(){
				kw = t._getKeyword();
				if( kw ){
					/* 加载远程数据 */
					$history.hide();
					t._getRemoteData( t._renderSuggestList );
				}else{
					/* 没有关键字加载默认数据（历史记录） */
					$history.show();
					t._renderSuggestList( kw , t.history() , t.config.template.history );
				}
			}, t.renderDelayTime);

			return t;
		},
		/**
		 * _renderSuggestList 根据data渲染suggest列表
		 * @param kw{String} 查询关键字
		 * @param data{Array} suggest数据集
		 * @param tpl{String} 模板字符串
		 * @return suggest{Suggest} 当前实例
		 */
		_renderSuggestList : function( kw , data , tpl ){
			var t = this,
				curKw = t._getKeyword(),
				$list = t.El('list'),
				sugMaxNum = t.config.suggestMaxNum,
				htmlStr = [],
				i,len;

			/* 更新列表前如果发现获取的kw和当前inupt中的kw不一致，则不更新list */
			if(curKw!=kw){return t;}

			if( !data || !data.length ){
				t.hide();
				return t;
			}

			for (i = 0, len = data.length; (i <= len-1)&&(i < sugMaxNum); i++) {
				htmlStr.push(tmpl( tpl , data[i] ));
			}
			$list.html(htmlStr.join(''));
			t.show();

			return t;
		},
		/**
		 * show 显示suggest列表
		 * @return suggest{Suggest} 当前实例
		 */
		show : function(){
			var t = this,
				$sug = t.El('sug');
			if(!t.isShow()){
				$sug.show();
			}
			return t;
		},
		/**
		 * hide 隐藏suggest列表
		 * @return suggest{Suggest} 当前实例
		 */
		hide : function(){
			var t = this,
				$sug = t.El('sug');
			if(t.isShow()){
				$sug.hide();
			}
			return t;
		},
		/**
		 * isShow 判断suggest列表是否显示
		 * @return boolean{Boolean} 布尔值
		 */
		isShow : function(){
			var t = this,
				$sug = t.El('sug');
			return $sug.is(':visible');
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
		 * _getRemoteData 通过远程请求获取数据
		 * @param callback{Function} 回调函数
		 * @return suggest{Suggest} 当前实例
		 */
		_getRemoteData : function( callback ){
			var t = this,
				url = t.config.requestUrl,
				kw = t._getKeyword(),
				queryKey = t.config.requestQueryKey,
				param = t.config.requestParam,
				cbKey = t.config.requestCallbackKey,
				isCache = t.config.isCache,
				cacheData,
				cb;

			if ( isCache && (cacheData = t._cacheData(kw) ) ) {
				/* 使用缓存 */
				callback.call( t, kw, cacheData, t.config.template.item );
				return t;
			}

			/* 请求后回调函数名称 */
			cb = 'zepto_suggest_'+(+new Date());

			/* url添加query */
			url = ( url + '?' + queryKey + '=' + encodeURIComponent( kw ) ).replace(/[&?]{1,2}/,'?');

			/* url添加callback */
			!~url.indexOf( cbKey ) && (url += '&'+ cbKey + '=' + cb);

			/* url其他参数 */
			param && (url += '&' + param);

			/* jsonp的回调处理 */
			win[ cb ] = function( res ){
				/**
				 * res为远程返回的完整数据
				 * 格式：{q:'123',d:['1234','12345']}
				 * q为查询的字符串，d为查询的结果数组
				 */
				 /**
				 * data为需要遍历的结果数组
				 * 格式（res中的d）：['1234','12345']
				 * 使用getPathData的方法是为了从res中获取d，这样通过配置可以适应各种接口数据结构
				 */
				var data = getPathData(res , t.config.responseDataPath);
				/* 回调处理 */
				callback.call( t , kw , data, t.config.template.item );
				/* 缓存查询结果 */
				isCache && t._cacheData( kw , data );
				/* 移除window上的回调函数 */
				delete win[ cb ];
			};

			/* jsonp请求 */
			$.ajax({
				url : url,
				dataType : 'jsonp'
			});
		},
		/**
		 * _cacheData 对suggest请求数据进行缓存(对象存储)，操作(获取|添加|清空)
		 * @param [key]{String} 索引，null为清空操作
		 * @param [value]{String} 值
		 * @return value{String} 返回当前实例或者相应索引值
		 */
		_cacheData : function( key , value ){
			if ( key ) {
				/* 获取|设置 */
				return value !== undefined ? 
						_cache[ key ] = value : 
						_cache[ key ];
			}
			if ( key === null ) {
				/* 清空 */
				return _cache = {};
			}
		},
		/**
		 * _localData 对localstorage的操作(添加|删除|清空)，限定key值为this.localKey
		 * @param [value]{String} 存储的值，null时为清空操作
		 * @return [suggest{Suggest}|value{Array}] 返回当前实例或者相应索引值
		 */
		_localData : function( value ){
			var t = this,
				key = t.config.localStorageKey,
				separator = t.config.localStorageSeparator,
				historyMaxNum = t.config.historyMaxNum,
				localstorage,
				data,
				idx,
				i;

			try{
				localstorage = win.localStorage;
				if (value === undefined) {
					/* 获取localstorage */
					return localstorage[ key ] ? localstorage[ key ].split( separator ) : [];
				}else if (value === null) {
					/* 清空localstorage */
					localstorage[ key ] = '';
				}else{
					/* 空值不存储 */
					if( !value ){
						return t;
					}
					/* 设置localstorage */
					data = localstorage[ key ] ?
							localstorage[ key ].split( separator ) : [];

					if (!~(idx = $.inArray(value , data))) {
						/* value不存在已有记录中 */
						if(data.length >= historyMaxNum){
							/* 历史记录控制在最大数目内 */
							data = data.slice(0, historyMaxNum-1);
						}
						data.unshift( value );
						localstorage[ key ] = data.join( separator );
					}else{
						/* 已存在已有记录中调整顺序 */
						for (i = idx; i > 0; i--) {
							data[i] = data[i-1];
						}
						data[0] = value;
						localstorage[ key ] = data.join( separator );
					}

				}
			}catch(e){
				console.log(e);
			}

			return t;

		},
		/**
		 * history 对历史记录的操作(获取|添加|清空)
		 * @param [value]{String} 存储的值，null时为清空操作，undefined时为获取所有历史记录
		 * @return [suggest{Suggest}|value{String}] 返回当前实例或者相应索引值
		 */
		history : function( value ){
			var t = this;
			return value === null ? (t.config.confirmClearHistory ? 
				win.confirm('清除全部历史记录？') && t._localData( value ).hide() : 
				t._localData( value ) ).hide() : t._localData( value );
		},

		/*=================工具方法=====================*/

		/**
		 * EL 对config上的elements进行操作 (获取|更新)
		 * @param [key]{String} 索引
		 * @param [value]{String} 值
		 * @return [zepto{Zepto}] 返回相应元素
		 */
		El : function( key , value ){
			var t = this;
			if ( value ) {
				/* 设置元素值 */
				return (t.config.elements[key] = value);
			}else{
				/* 获取元素值 */
				return t.config.elements[key];
			}
		}

	};

	win.Suggest = Suggest;
})(Zepto, window);