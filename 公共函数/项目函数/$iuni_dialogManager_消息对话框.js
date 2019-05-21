/*
函数名称：$iuni_dialogManager
函数描述： 
消息对话框管理组件，提供了类似于QQ对话形式的对话框，用户社区对话

使用：
$iuni_dialogManager.login(uid).注册当前登录用户，如未注册用户，无法获取对话框组件
$iuni_dialogManager.logout(uid)，注销当前登录用户，注销后，所有缓存的当前用户的对话框将销毁
var dialog=$iuni_dialogManager.getInstance(uid)，获得与指定用户对话的对话框，并默认加载历史聊天记录
dialog.show() 显示对话框
dialog.hide() 隐藏对话框
*/ 
$iuni_dialogManager = (function() {
	if(typeof $iuni_dialogManager!='undefined'){
		return $iuni_dialogManager;
	}
	//当前登录用户id，所有对话
	var curUID, allDialogs = {
		//id:dialog
	};
	var tpl = '<div class="s_sns_talk"><h2><div class="s_content cf"><div class="content_left"><img src="<%=avatar%>" sns_dialog_tag="avatar"/></div><div class="content_right"><h3 sns_dialog_tag="nickname"><%=nickname%></h3><p></p></div></div></h2><div class="talk_content_wrap"><div class="talk_content" sns_dialog_tag="view"></div></div><div class="talk_bottom"><form method="get" action="#" target="_blank" sns_dialog_tag="form"><span class="content_box"><textarea name="text"></textarea><span class="s_page"><span sns_dialog_tag="text_num">0</span>/100</span></span><button type="submit" class="talk_btn talk_btn_useless" name="btn">发送</button></form></div><div class="close" sns_dialog_tag="close"></div></div>', 
	fn = $formatTpl(tpl), 
	viewTpl = '<%if(hasOld){%><div class="talk_list"><h3><span class="talk_list_more" sns_dialog_tag="more">查看更多消息</span></div><%}for(var i=0,len=groups.length;i<len;i++){var msgs=groups[i];%><div class="talk_list"><h3><b class="thor_line"><span class="time"><%=formatDate(msgs[0].created)%></span></b></h3><%for(var j=0,len1=msgs.length;j<len1;j++){var msg=msgs[j];%> <p class="<%=(cuid==msg.uid)?"s_me":"s_friend"%> s_<%=msg.mid==-1?"sending":msg.mid==-2?"error":"ok"%>"><span><%=msg.message%><i class="a"></i></span></p><%}%></div><%}%>', 
	viewFn = $formatTpl(viewTpl);
	//销毁对话
	function destroy(dl) {
		//取消定时器
		dl.timer = dl.timer && clearInterval(dl.timer);
		//解绑事件
		$unbindEvent([dl.dom, dl.closeDom, dl.viewDom, dl.formDom, dl.inputDom, dl.submitDom, dl.testNumDom]);
		//移除节点
		dl.dom.parentNode && dl.dom.parentNode.removeChild(dl.dom);
		//解除注册
		allDialogs[dl.uid] && (
		delete allDialogs[dl.uid]);
	}

	//管理器
	var manager = {
		//获取实例
		getInstance : function(uid) {
			if (curUID) {
				if (!allDialogs[uid]) {
					var dialog = Dialog.getInstance(uid);
					allDialogs[uid] = dialog;
				}
				return allDialogs[uid];
			}
		},
		//用户登出
		login : function(uid) {
			if (curUID != uid) {
				//销毁所有对话
				$each($keys(allDialogs), function(fuid) {
					destroy(fuid);
				});
				//重置
				curUID = uid;
				allDialogs = {};
			}
		},
		//用户登录
		logout : function() {
			this.login(0);
		},
		//销毁对话
		destroy : function(uid) {
			if (curUID && allDialogs[uid]) {
				destroy(allDialogs[uid]);
			}
		},
		//设置模版
		setTpl : function(t) {
			fn = $formatTpl(t);
			tpl = t;
		},
		//隐藏所有对话
		hideAll:function(){
			$each($keys(allDialogs), function(fuid) {
				allDialogs[fuid].hide();
			});
		}
	};
	//对话类
	var Dialog = $Class.create(function(uid) {
		var that = this;
		this.sendId=0;
		//uid
		this.uid = uid;
		//消息数组，消息是从新至旧的顺序，新消息append到数组最前面
		this.msgs = [];
		//总消息条数
		this.totalMsgs;
		//新消息条数
		this.newMsgs;
		//最远id
		this.farMid,
		//一小时的间隔，两端对话超过该时间间隔将显示时间条，单位 秒
		this.timeIntval = 60 * 60;
		//是否加载过数据
		this.loaded = false;
		//是否正在加载
		this.loading = false;
		//定时器
		this.timer,
		//是否显示
		this.isShow = false;
		//是否可用
		this.enable = true;
		//dom根节点
		this.dom = document.createElement('div');
		//初始化
		this.dom.innerHTML = fn({
			uid : uid,
			nickname : 'iuni用户',
			avatar : ''
		});
		this.viewDom = $attr('sns_dialog_tag','view',this.dom)[0];
		this.formDom = $attr('sns_dialog_tag','form',this.dom)[0];
		this.testNumDom = $attr('sns_dialog_tag','text_num',this.dom)[0];
		this.inputDom = this.formDom.text;
		this.submitDom = this.formDom.btn;
		this.closeDom = $attr('sns_dialog_tag','close',this.dom)[0];
		this.avatarDom = $attr('sns_dialog_tag','avatar',this.dom)[0];
		this.nicknameDom = $attr('sns_dialog_tag','nickname',this.dom)[0];
		//绑定事件
		$bindEvent(this.formDom, function(event) {
			that.submit();
			//阻止提交
			event.preventDefault();
			return false;
		}, 'submit');
		//修改
		$bindEvent(this.inputDom, function(e) {
			that.__checkInput();
		}, 'change');
		//按键
		$bindEvent(this.inputDom, function(e) {
			//修改检查字数和内容
			var length=that.testNumDom.innerHTML = this.value.length;
			//样式设置
			if(length==0){
				$addClass(that.submitDom,"talk_btn_useless");
			}else{
				$delClass(that.submitDom,"talk_btn_useless");
			}
		}, 'keyup');
		//提交
		$bindEvent(this.inputDom, function(e) {
			//检查alt+s,alt+enter提交
			if (e.altKey && (e.which == 83 || e.which == 13)) {
				that.submit();
				e.preventDefault();
			}
		}, 'keydown');
		//关闭
		$bindEvent(this.closeDom, function() {
			that.hide();
		});
		//滚动，禁止window发生滚动
		$bindEvent(this.viewDom, function(event) {
			if (event.delta < 0) {
				if (this.scrollBottom == 0) {
					event.preventDefault();
				}
			} else if (event.delta > 0) {
				if (this.scrollTop == 0) {
					event.preventDefault();
				}
			}
		}, 'mousewheel');
		//点击事件
		$bindEvent(this.viewDom,function(event){
			var target=$attrParent('sns_dialog_tag',null,event.target,this);
			if(target){
				var tag=target.getAttribute('sns_dialog_tag');
				if(tag=='more'){//加载更多
					target.innerHTML="加载中...";
					that.loadBefore();
				}
			}
		});
		//添加到document
		$display(this.dom, 'none');
		document.body.appendChild(this.dom);
		//初始化位置
		this.dom.style.position = 'absolute';
		this.dom.style.left = this.dom.style.top = 0;
		//加载用户信息
		this.__loadUserInfo();
	}, {
		__loadUserInfo:function(){
			var that=this;
			$jsonp({
				url:'http://town.iuni.com/api/info/get_nickname_avatar?dtype=jsonp',
				data:{
					uid:this.uid
				},
				callback:function(result){
					var data=result.data;
					that.avatarDom.src=data.avatar;
					that.nicknameDom.innerHTML=data.nickname;
				},
				errorback:function(result){
					//noop
				}
			});
		},
		//检查是否有历史消息
		hasOldMsg:function(){
			return !this.loaded||(this.totalMsgs-this.newMsgs-this.msgs.length)>0;
		},
		//检查是否有新消息
		hasNewMsg:function(){
			return !this.loaded||this.newMsgs>0;
		},
		//加载之前的消息
		loadBefore : function() {
			if (!this.enable) {
				return;
			}
			if (this.loading) {
				return;
			}
			//检查是否还有历史消息
			if(!this.hasOldMsg()){
				return;
			}
			var that = this;
			this.loading = true;
			//加载数据
			$jsonp({
				url : 'http://town.iuni.com/api/dialog/detail?dtype=jsonp',
				data : {
					uid : this.uid,
					ps : 20,
					mid : this.farMid || ''
				},
				callback : function(result) {
					that.loading = false;
					//加载新数据
					var msgs = result.data.dataContext;
					var totalMsgLength=result.data.countRow;
					if(!that.loaded){
						//第一次加载，设置初始数据
						that.totalMsgs=totalMsgLength;
						that.newMsgs=0;
					}else{
						//处理总数和新消息
						that.newMsgs+=totalMsgLength-that.totalMsgs;
						that.totalMsgs=totalMsgLength;
					}
					that.loaded = true;
					//处理消息
					if (msgs && msgs.length) {
						that.__append(msgs,'old');
					}
				},
				errorback : function(result) {
					that.loading = false;
					that.loaded = true;
				}
			});
		},
		//过滤信息内容
		__filterMsgContent : function(msg){
			if($isArray(msg)){
				var that=this;
				return $map(msg,function(m){
					return that.__filterMsgContent(m);
				});
			}
			msg.message=this.__filterText(msg.message||'');
			return msg;
		},
		//过滤字符串
		__filterText:function(text){
			return text.replace(/[<>&#\/\\]/g,function(r){
				return {
					'<':'＜',
					'>':'＞',
					'&':'＆',
					'#':'＃',
					'\\':'＼',
					'/':'／'
				}[r];
			});
		},
		__splitMsg : function() {//将消息按时间分组
			var that = this;
			var lastTime, groups = [];
			$each(this.msgs, function(msg) {
				if (!lastTime||lastTime-msg.created > that.timeIntval) {
					groups.unshift([]);
				}
				groups[0].unshift(msg);
				lastTime = msg.created;
			});
			return groups;
		},
		__append : function(msgs,type) {//添加信息
			//过滤信息
			msgs=this.__filterMsgContent(msgs);
			//合并添加信息
			if(type=="send"){
				this.msgs .unshift(msgs);
			}else if(type=="fail"){
				//修改信息为失败
				$each(this.msgs,function(msg){
					if(msg.mid==-1&&msg.sendId==msgs.sendId){
						msg.mid=-2;
						throw $break;
					}
				});
			}else if(type=="succ"){
				//修改信息成功
				$each(this.msgs,function(msg){
					if(msg.mid==-1&&msg.sendId==msgs.sendId){
						msg.mid=msgs.mid;
						throw $break;
					}
				});
			}else if(type=="old"){
				//添加老信息
				this.msgs = this.msgs.concat(msgs);
			}else if(type=="new"){
				//添加新信息
				this.msgs=msgs.concat(this.msgs);
			}
			if(this.msgs.length){
				this.farMid=this.msgs[this.msgs.length-1].mid;
			}
			var scrollHeight=this.viewDom.scrollHeight,scrollTop=this.viewDom.scrollTop;
			//更新html
			this.rendView();
			//设置当前位置
			if(type=='old'){
				//保持显示位置不变
				this.viewDom.scrollTop = this.viewDom.scrollHeight-scrollHeight+scrollTop;
			}else{
				//滚动到底部
				this.viewDom.scrollTop=this.viewDom.scrollHeight;
			}
		},
		//渲染对话
		rendView:function(){
			var groups = this.__splitMsg();
			this.viewDom.innerHTML = viewFn({
				cuid : curUID,
				groups : groups,
				hasOld : this.hasOldMsg(),
				formatDate : function(timestamp){
					return $formatDate(new Date(timestamp*1000),{
					ftin1d:'H:N',
					ftlt1w:'星期wc H:N',
					ft:'Y年m月d日 H:N'
					});
				}
			});
		},
		__checkInput : function() {
			//修改检查字数和内容，进行裁剪，控制100个字符
			var text=this.inputDom.value = this.__filterText(this.inputDom.value.substring(0, 100));
			var length=this.testNumDom.innerHTML = text.length;
			if(length==0){
				$addClass(this.submitDom,"talk_btn_useless");
			}else{
				$delClass(this.submitDom,"talk_btn_useless");
			}
		},
		//提交
		submit : function() {
			if (!this.enable) {
				return;
			}
			if($hasClass(this.submitDom.className,"talk_btn_useless")){
				return;
			}
			this.__checkInput();
			var text=this.inputDom.value;
			//提交数据
			if(text.length>0){
				var that=this;
				var sendId=this.sendId++;
				var msg={
					mid:-1,
					uid:curUID,
					sendId:sendId,
					uid_nick:null,
					uid_avatar:null,
					ruid:this.uid,
					ruid_nick:null,
					ruid_avatar:null,
					message:text,
					created:Math.ceil(new Date().getTime()/1000)
				};
				this.__append(msg,'send');
				$jsonp({
					url:'http://town.iuni.com/api/dialog/add?dtype=jsonp',
					data:{
						ruid:this.uid,
						content:encodeURIComponent(text)
					},
					callback:function(result){
						var mid=result.data.mid;
						msg.mid=mid;
						//发送成功
						that.__append(msg,'succ');
					},
					errorback:function(result){
						//发送失败
						that.__append(msg,'fail');
					}
				});
			}
			//重置输入框
			this.inputDom.value='';
			this.testNumDom.innerHTML=0;
			$addClass(this.submitDom,"talk_btn_useless");
		},
		//显示对话框
		show : function() {
			if (!this.enable) {
				return;
			}
			if (!this.isShow) {
				var that = this;
				//隐藏所有对话
				manager.hideAll();
				this.isShow = true;
				$display(this.dom, '');
				//设置位置
				this.setPos();
				//定时
				this.timer = setInterval(function() {
					that.setPos();
				}, 200);
				if (!this.loaded) {
					//加载历史信息
					this.loadBefore();
				}
			}
		},
		hide : function() {//隐藏对话框
			if (!this.enable) {
				return;
			}
			$display(this.dom, 'none');
			this.isShow = false;
			clearInterval(this.timer);
			this.timer = 0;
		},
		close : function() {//关闭，销毁对话
			if (!this.enable) {
				return;
			}
			this.enable = false;
			manager.destroy(this.uid);
		},
		setPos : function() {//设置位置
			if (!this.enable) {
				return;
			}
			//获取高宽
			var width = this.dom.offsetWidth;
			var height = this.dom.offsetHeight;
			//计算位置
			this.dom.style.top = Math.round(($getWindowHeight() - height) / 2 + $getPageScrollTop()) + 'px';
			this.dom.style.left = Math.round(($getWindowWidth() - width) / 2 + $getPageScrollLeft()) + 'px';
		}
	});
	return manager;
})();
调用示例： 
var dialog = $iuni_dialogManager.getInstance(uid);
	dialog.show();
//参看函数描述
依赖函数： 
$getPageScrollLeft$getWindowWidth$getPageScrollTop$getWindowHeight$hasClass$formatDate$break$map$break$each$isArray$jsonp$extend$getCookie$t33$isArray$addParams$display$id$attrParent$delClass$hasClass$id$setClass$addClass$setClass$bindEvent$incNum$extend$eventNormalize$attr$Class$keys$each$unbindEvent$bindEvent$formatTpl$toJSON