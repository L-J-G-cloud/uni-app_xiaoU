

// 定义URL
let URL = ''

if(process.env.NODE_ENV === 'development'){
   // URL = 'http://localhost:3000'
   // 为了方便测试使用正式地址
   URL = 'https://api.aslegou.top'
}else{
   URL = 'https://api.aslegou.top'
}

export default URL;