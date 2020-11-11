<template>
	<view class="container">
		<!-- s收货地址 -->
		<view class="address">
			<view class="address_info">
				<label for="">收件人:{{ information.name }}</label>	
				<label for="">{{ information.phone }}</label>
			</view>
			<view class="address_res">
				收货地址：<label for="">{{ information.address }}</label>
			</view>
		</view>
		
		<!-- 商品信息 -->
		<view class="carts">
			<view class="cartsInfo" v-for="(item,index) in orders" :key="index">
				<!-- 70px -->
				<view class="carts_detail"> 
					<image :src="item.img" mode="widthFix" style="width:500rpx;"></image>
					<view class="carts_name">
						<view for="" style="font-size: 30rpx;">{{item.goodsname}}</view>
						<view for="" style="font-size: 26rpx; color: #C0C0C0;">规格:不错的商品</view>
					</view>
					<view class="carts_price">
						<label for="">￥ {{item.price}}</label>
					</view>
				</view>
				<!-- 50px -->
				<view class="cart_num">
					<view class="">
						购买数量：
					</view>
					<view class="">
						<label for="" class="jian" @click="changeNum(1,index,item.id)">-</label>
						<label for="" class="num">{{item.num}}</label>
						<label for="" class="jia" @click="changeNum(2,index,item.id)">+</label>
					</view>
				</view>
				<!-- 横线 -->
				<view class="xian"></view>
			</view>			
			<!-- 50px -->
			<view class="kuaidi">
				<label for="">配送方式</label>
				<label for="">XX快递</label>
			</view>
		</view>
		
		<!-- 优惠券 -->
		<view class="yhquan">
			<label for="">优惠券</label>
			<label for="" style="margin-right: 40rpx;">无可用</label>
		</view>
		<!-- jifen积分 -->
		<view class="jifen">
			<view class="use" >
				<label for="">使用积分</label>
			</view>
			<view class="input" style="margin-right: 40rpx;">
				<input type="text" value="" placeholder="输入积分"/>
				<label for="" class="input_use">使用</label>
				<label for="" class="input_keyi">可使用50积分</label>
			</view>
		</view>
		
		<!-- 具体详细 -->
		<view class="resDetail">
			<view class="">
				<label for="">商品金额</label>
				<label for="" style="margin-right:40rpx;color:red">￥200</label>
			</view>
			<view class="">
				<label for="">运费</label>
				<label for="" style="margin-right:40rpx;color:red">+￥0.00</label>
			</view>
			<view class="">
				<label for="">优惠券</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">会员优惠</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
			<view class="">
				<label for="">积分抵扣</label>
				<label for="" style="margin-right:40rpx;color:red">-￥0.00</label>
			</view>
		</view>
		<!-- 实付金额 -->
		<view class="sfje">
			实付金额：<label for="" style="color:red">￥{{jisuan.countMoney}}</label>
		</view>
		
		<!-- 确认订单按钮 -->
		<view class="btn">
			<!-- 点击提交订单按钮，发起支付请求 -->
			<button type="primary" @click="orderadd(jisuan.countMoney,jisuan.countMum)">提交订单</button>
		</view>
	</view>
</template>

<script>
	let app = getApp();
	let {isLogin,tip} = require('../../utils/tip.js')
	export default {
		data() {
			return {
				information: {
					name: 'YouSu',
					phone: '18240279221',
					address: '北京市海淀区隐泉路清林苑6号楼中公优就业总部3层'
				},
				orders:[],//订单数据
				userinfo:{},
				header:{}
			}
		},
		onLoad(option){
			// 获取购物车数据
			this.orders =JSON.parse(option.params);
			
			// 获取用户的缓存数据
			this.userinfo = uni.getStorageSync('userinfo')
			
			// 组装请求header头
			this.header = app.globalData.header;
			console.log(this.header)
		},
		// 计算属性
		computed:{
			jisuan(){
				var countMoney = 0;//总支付金额
				var countMum = 0;//购买商品数量
				this.orders.forEach((item)=>{
					if(item.status){//只计算用户选择情况
						countMoney+=parseFloat(item.price) * parseInt(item.num) 
						countMum+=1;
					}
				})
				return {countMoney,countMum}
			}
		},
		// 页面显示时
		methods: {
			// 提交订单
			orderadd(countmoney,countnumber){
				
				let params={
						uid:this.userinfo.uid,
						username:"YouSu",
						userphone:"18240279221",
						useraddress:"北京市海淀区隐泉路清林苑6号楼中公优就业总部3层",
						countmoney,
						countnumber,
						addtime:new Date()
					};
				// 组装购物车id字符串
				let idstr='';
				this.orders.forEach((item)=>{
					idstr+=item.id+','
				})
				
				
				console.log(params,idstr)
				// this.$http({
				// 	url:'/api/orderadd',
				// 	method:"POST",
				// 	header:this.header,
				// 	data:{
				// 		params,
				// 		idstr:''
				// 	}
				// })
			},
			// 修改购物车商品数量 ++ --
			changeNum(type,index,id){
				
				if(type ==1){//--
					this.orders[index].num = this.orders[index].num <=1 ? 1 : --this.orders[index].num;
				}else{//++
					++this.orders[index].num;
				}
				// 最后操作数据库
				this.$http({
					url:'/api/cartedit',
					method:"POST",
					data:{
						id,
						type
					},
					header:this.header
				})
				.then(res=>{
					if(res.data.code == 403){
						isLogin()//登录提示
					}else if(res.data.code !=200){
						tip('请重试！')
					}
				})
				
			},
			
		}
		
	}
</script>

<style>
	@import url("../../common/css/confirm.css");
</style>
