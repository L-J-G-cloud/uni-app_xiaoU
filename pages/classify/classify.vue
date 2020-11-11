<template>
	<view class="container">
		<!-- left左侧一级分类列表 -->
		<scroll-view scroll-y class="left">
			<!-- 循环遍历的 -->
			<view class="left_list" 
				:class="activeIndex == ind ? 'activeList' : ''" 
				v-for="(item,ind) in cateData" 
				:key="ind" 
				@click="changeCate(ind)"
			>
				<label for="">{{ item.catename }}</label>
			</view>
		</scroll-view>
		<!-- right右侧二级分类详情 -->
		<scroll-view scroll-y class="right">
			<view class="row" >
				<view class="row_list" v-for="(item,index) in classify" :key="index" @click="getlist(item.id)">
					<image :src="item.img" mode="widthFix"></image>
					<text>{{item.catename}}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				activeIndex:0,//默认选中下标
				cateData:[],//左侧一级分类数据
				classify:[]//右侧二级分类详情	
			}
		},
		onLoad() {
			this.getcates();
		},
	
		methods:{
			
			// 跳转到商品列表页面
			getlist(id){
				uni.navigateTo({
					url:'../product/product?type=2&id='+id
				})
			},
			
			// 切换一级分类
			changeCate(index){
				this.activeIndex = index;
				// 给二级分类重新赋值
				this.classify = this.cateData[index].children;
			},
			
			// 定义获取分类的方法
			getcates(){
				this.$http({
					url:"/api/getcates"
				})	
				.then(res=>{
					if(res.data.code ==200){
						let data = res.data.list;
						// 循环处理二级分类中额图片路径
						data.forEach((item)=>{
							if(item.children){
								item.children.forEach((item)=>{
									item.img = this.$URL+item.img
								})
							}
						})
						// 给一级分类赋值
						this.cateData = data;
						// 给二级分类赋值
						this.classify = this.cateData[this.activeIndex].children
					}else{
						uni.showToast({
							title:"请刷新重试！"
						})
					}
				})
			},
			
		}
	}
</script>

<style>
	/* 导入外部的样式文件 */
	@import url("../../common/css/classify.css");
	
	/* 点击左侧导航，显示动态样式 */
	.activeList{
		border-left: 6rpx solid #f26b11;
		color: #f26b11;
	}
</style>
