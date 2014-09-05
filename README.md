#Zepto-Suggest

Zepto-Suggest是一个基于Zepto的suggest组件，它为移动端的搜索框提供建议词条。

## 为什么要做这个组件

我在做搜索框的时候有suggest的需求，首先第一个想法肯定是先找找有没有成熟的第三方框架或者组件，[gmu](http://gmu.baidu.com/)和[NovaUI](http://75team.github.io/novaUI/)是我首先考虑的两个库。它们已经实现了我的需求，但是发现依赖了库里很多公用文件，这是我不想看到的。

我只是想要一个基于Zepto简洁实用的suggest组件，仅此而已。

也有其他业务端的suggest组件，简洁，但是业务依赖比较严重，这是我无法忍受的。

正是基于上述两点，我找时间做了这个suggest组件。

## 为什么要用这个组件

* 简单。你指需要按照所需业务需求做几点配置就可以马上得到想要的suggest功能。
* 定制化。你可以按照组件里的规则来任意组织模板，从而实现高度定制化的条目结构。
* 适应性。针对不同数据接口的数据结构多样性和复杂性，组件内部建立了一个简单的数据查找规则，规则内你可以查找获取复杂数据，从而避免以往只能通过修改代码来适配特殊数据接口的问题。

## 基础用例

src目录下有一个suggest的html文件，展示了组件的功能示例，它默认调用的是业务中配置，实例化使用了gmu的suggest数据接口，查询结果跳转的是[so.com](http://www.so.com/)的搜索结果页。

简单用法：

```javascript
var sug = new Suggest();
```

最简单用法实例化一个Suggest对象就可以了，使用默认配置来实现功能。

## 定制

对于具体的业务需求，默认配置一般满足不了需求，需要进行相应的配置。做法是在Suggest实例化时，传入一个对象来覆盖默认配置。一般而言，需要配置的是条目模板和数据接口相关的一些属性信息。

```javascript
	var sug = new Suggest({
		template : {
			item : '<div class="sug-item" data-item="{0}">'+
						'{0}'+
						'<span class="sug-plus"></span>'+
					'</div>'
		},
		requestUrl : 'http://gmu.baidu.com/demo/data/suggestion.php',
		requestQueryKey : 'wd',
		requestCallbackKey : 'cb',
		requestParam : null,
		responseDataPath : 's',
	});
```

如上代码为针对gmu数据接口进行的一些配置信息，具体属性含义可参考：

```javascript
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
	isCache : true
```

## 内部使用的数据解析功能

针对数据接口返回数据的复杂性，一般我们对返回的数据要进行一些处理，找到可以遍历的数据块，进行后续的模板替换等工作。

为实现这样的功能，我们要么是用户修改回调函数的相关代码，指定需要遍历的数组，要么就是组件提供一个接口，让用户可以对返回的数据进行相应操作。但是，这些做法都丧失了组件的灵活性。

这里的组件内容实用了一个`getPathData`的函数，根据`path`来查找数组或者对象中指定path的值。

如，它可以通过`path:'a.1'`来对`data={a:[1,2],b:'ha'}`进行操作，获取想要的`2`。

path可以简单描述为一个索引集合通过分隔符（默认为英文点号）连接而成的字符串。当然连接后的索引是有顺序的概念的，顺序代表了层级，也就是对象里的嵌套。

在Zepto-Suggest组件内，查找遍历对象和渲染模板的时候都使用了上述功能。

## 版本更新历史

* v1.1.0 添加了form外点击list自动隐藏的功能。
* v1.0.2 解决了已发现的一些bug。
