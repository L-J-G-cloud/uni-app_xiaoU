

// 引入域名
import URL from './config.js';

// 定义网络请求方法

export default (options)=>{
	let url = URL+options.url;
	console.log(url)
	return new Promise((resolve,reject)=>{
		uni.request({
			url,
			data:options.data || {},
			method:options.method || 'GET',
			header:options.header || {
				"content-type":"application/json"
			},
			success:resolve,
			fail:reject
		})
	})
}