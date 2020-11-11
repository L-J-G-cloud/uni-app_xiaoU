<template>
	<view class="box">
		<view class="row">
			<text>手机号</text>
			<input type="text" v-model="phone" />
		</view>
		<view class="row">
			<view class="send">
				<text>验证码</text>
				<text @click="getCode">{{str}}</text>
			</view>
			<input type="text" placeholder="- - - -" maxlength="4" v-model="code" />
		</view>
		<view class="row">
			<text style="font-size: 23rpx;">收不到验证码？试试 <text style="color:#00BB00;font-size: 23rpx;"> 语音验证</text></text>
			<button  type="primary" style="width: 90%;border-radius: 80rpx;margin-top: 50rpx;" @click="login">登录</button>
		</view>
		<view class="row">
			<text style="color: #006699;text-align: center;" >通过微信授权登录</text>
		</view>
	</view>
</template>
 
<script>
	let app = getApp();
	export default {
		data() {
			return {
				phone:'',
				code:'',
				str:'获取验证码',
				buffer:true
			}
			
		},
		onLoad() {},
		methods: {
			// 发送短信验证码
			getCode(){
				if(this.buffer){
					// 首先验证手机号格式
						if( !/^1[3456789]\d{9}/.test(this.phone) ){
							uni.showToast({
								title:"手机号格式不正确",
								icon:"none"
							});
							return;
						}
						
						// 执行发送请求获取验证码
						this.$http({
							url:'/api/sms',
							data:{
								phone:this.phone
							}
						})
						.then(res=>{
							if(res.data.code == 200){
								// 关闭开关
								this.buffer=false;
								// 将获取验证码存入本地缓存中已做后期登录校验比对
								uni.setStorageSync('code',{value:res.data.list.code,time:new Date().getTime()})
								// 显示倒计时
								let time = 60;
								let t = setInterval(()=>{
									this.str = time+'s重新获取';
									time--;
									if(time ==0){
										clearInterval(t);
										time=60;
										this.str='获取验证码'
										this.buffer=true
									}
								},1000)
							}else{
								uni.showToast({title:'请重试！',icon:none})
							}
						})
				}else{
					uni.showToast({
						title:'请稍后获取!',
						icon:'none'
					})
				}
			},
			//实现登录
			login(){
				// 首先验证手机号格式
				if( !/^1[3456789]\d{9}/.test(this.phone) ){
					uni.showToast({
						title:"手机号格式不正确",
						icon:"none"
					});
					return;
				}
				// 判断验证码是否合法1000*60 = 30000 一般是5分钟
				let {value,time} = uni.getStorageSync('code');
				if(new Date().getTime() - time >3000000){
					uni.showToast({
						title:'验证码过期，请重新获取！',icon:'none'
					});return;
				}
				if(value != this.code){
					uni.showToast({
						title:'验证码输入有误，请重试！',icon:'none'
					});return;
				}
				
				// 执行登录
				this.$http({
					url:'/api/wxlogin',
					data:{
						phone:this.phone
					}
				})
				.then(res=>{
					if(res.data.code ==200){
						//将登录成功返回的用户信息写入到本地缓存中  token有效期是60分钟
						uni.setStorageSync('userinfo',res.data.list);
						uni.showToast({
							title:'登录成功！'
						});
						
						// 修改全局的登录状态
						app.globalData.loginStatus=true;
						
						// 跳转到个人中心页面
						setTimeout(()=>{
							uni.reLaunch({
								url:'../mine/mine'
							})
						},500)
					}else{
						uni.showToast({
							title:'登录失败，请重试！',icon:'none'
						});
					}
				})
				
			}
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	/* @import url("../../common/css/index.css"); */
	.box{
		position: relative;
	}

	.row{
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 40rpx;
	}
	.send{
		display: flex;
		justify-content: space-between;
	}
	.send text:nth-of-type(2){
		color: #00BB00;
	}
	text{
		font-size: 27rpx;
		margin-bottom: 10rpx;
	}
	input{
		border-bottom: 1rpx solid gray;
		height: 65rpx;
	}
	
</style>
