// 指定OBS服务相关信息：AK，SK，EndPoint
const config = {
  // 认证用的ak和sk硬编码到代码中或者明文存储都有很大的安全风险，建议在配置文件或者环境变量中密文存放，使用时解密，确保安全；本示例以ak和sk保存在环境变量中为例，运行本示例前请先在本地环境中设置环境变量AccessKeyId和SecretKey。
  // 前端本身没有process对象，可以使用webpack类打包工具定义环境变量，就可以在代码中运行了。
  // 您可以登录访问管理控制台获取访问密钥AK/SK，获取方式请参见https://support.huaweicloud.com/usermanual-ca/ca_01_0003.html
  AccessKeyId: 'AUTT8SOGHGKCBL7DRSFI',
  SecretKey: 'pYjpuKGkaQB2czSkMgM4tZXfYOkrDAWFoJDw5ptN',
  EndPoint: 'http://testbut.obs.cn-east-3.myhuaweicloud.com'         //完整的桶访问域名
};

export {
	config
}