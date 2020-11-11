


// 转化时间格式
 const format=(shijian)=>{
	    let date = new Date(shijian)
		var y = date.getFullYear(); 
		var m = date.getMonth() + 1;  
			m = m < 10 ? ('0' + m) : m;  
		var d = date.getDate();  
			d = d < 10 ? ('0' + d) : d;  
		var h = date.getHours();  
			h=h < 10 ? ('0' + h) : h;  
		var minute = date.getMinutes();  
			minute = minute < 10 ? ('0' + minute) : minute;  
		var second=date.getSeconds();  
			second=second < 10 ? ('0' + second) : second;  
		return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second; 
}

// 提示方法
const  tip=(title,icon='none')=>{
	uni.showToast({
		title,
		icon
	})
}


// 询问是否要登录
const isLogin=()=>{
	uni.showModal({
		title:'登录失效提示',
		content:"是否要登录",
		success:res=>{
			if(res.confirm){//确定
				// 跳转到登录页面即可
				uni.navigateTo({
					url:'../login/login'
				})
			}else{//取消
				// 怎么判断当前所在页面是哪个页面  ====》url地址  页面栈 (type:array)?
				let pages = getCurrentPages()
				// 如果购物车页面就跳转到首页
				if(pages[pages.length-1].route == 'pages/cart/cart'){
					uni.reLaunch({
						url:'../index/index'
					})
				}
				// console.log(pages[pages.length-1].route)
			}
		}
	})
}


module.exports = {
	format,
	isLogin,
	tip
}