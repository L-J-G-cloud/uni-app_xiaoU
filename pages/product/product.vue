<template>
	<view>
		<view class="search">
			<icon type="search" color="white" size="10"></icon>
			<input type="text" value="" placeholder="搜索商品" placeholder-class="placeholder" />
		</view>
		<view class="list">
			<view class="row" v-for="(item,index) in list" :key="index" @click="getdesc(item.id)">
				<image :src="item.img" mode="widthFix"></image>
				<view class="info">
					<text>{{item.goodsname}}</text>	
					<text>￥{{item.price}}</text>	
					<text>3565评论</text>	
				</view>
			</view>
		</view>
		<!-- <view class="api">
			暂无商品数据！
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 初始化页码
				page:1,
				// 初始化分页偏移量
				size:6,
				// 初始化分类id
				cateId:'',
				// 初始化分类请求地址
				url:'',
				// 初始化请求类型 1一级分类 2二级分类
				type:1,
				//初始化总页码数
				totalPages:0,
				// 初始化商品列表数据
				list:[]
				
			}
		},
		onLoad(options){
			// 获取参数
			let {id,type} = options;
			this.cateId = id;
			this.type = type
			if(type == 1){//根据一级分类查询
				this.url = '/api/getcategoodPage'
			}else{
				this.url = '/api/getsecondcategoodPage'
			}
			
			// 请求商品列表数据
			this.getGoodsList();
		},
		// 监听上拉事件
		onReachBottom(){
			// 只有当前页面小于总页码数
			if(this.page<this.totalPages){
				uni.showLoading({
					title:'数据拉取中...'
				});
				++this.page;
				setTimeout(()=>{
					this.getGoodsList()
				},500)
			}else{
				uni.showToast({
					title:'没有数据了！',
					icon:'none'
				})
			}
		},
		methods: {
			// 获取商品详情
			getdesc(id){
				uni.navigateTo({
					url:'../details/details?id='+id
				})
			},
			// 根据分类id查询商品列表
			getGoodsList(){
				// 根据type类型组装请求参数
				let data={};
				if(this.type == 1){
					data= {
						fid:this.cateId,
						page:this.page,
						size:this.size
					}
				}else{
					data={
						sid:this.cateId,
						page:this.page,
						size:this.size
					}
				}
				this.$http({
					url:this.url,
					data
				})
				.then(res=>{
					// 处理请求结果
					this.totalPages = res.data.list[0];
					let data = res.data.list[1];
					// 循环处理图片路径
					data.forEach((item)=>{
						item.img = this.$URL+item.img
					})
					this.list =this.list.concat(data);
					
					// 关闭提示
					uni.hideLoading()
				})
			},
		}
		
	}
</script>

<style>
	.search{
		margin: 65rpx;
		height: 75rpx;
		background-color: #f26b11;
		border-radius: 80rpx;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	icon{
		margin:0 10rpx 0 250rpx;
	}
	.placeholder{
		color: white;
		font-size: 25rpx;
	}
	.row{
		position: relative;
		margin: 10rpx 20rpx;
		height: 190rpx;
		border-bottom: 1rpx solid #AAAAAA;
	}
	image{
		position: absolute;
		top: 0;
		left:10rpx;
		width: 160rpx;
	}
	.info{
		height: 85%;
		width: 100%;
		position: absolute;
		top: 0;
		left: 200rpx;
		display: flex;
		justify-content: space-around;
		flex-direction: column;
		font-size: 25rpx;
	}
	.info text:nth-of-type(2){
		color: red;
	}
	.info text:nth-of-type(3){
		font-size: 20rpx;
		color: #AAAAAA;
	}
	.api{
		line-height: 200rpx;
		text-align: center;
		font-size: 40rpx;
		color: #006699;
	}
</style>
