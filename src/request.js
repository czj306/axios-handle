/*
 * @Description: request
 * @Author: czj
 * @Github: https://github.com/czj306
 * @Date: 2021-09-23 19:14:21
 * @LastEditors: czj
 * @LastEditDate: 
 * @FilePath: ./request.js
 */
const axios = require('axios');

class UserManage {
    // 存储cancel token
    __axiosPromisArr = [];

    // 提示映射表
    __errorConfig = {
        400: `404:服务器无法理解该请求`,
        401: `401:未登入或登录超时，请重新登入`,
        403: `403:拒绝授权访问`,
        404: `404:接口不存在`,
        499: `499:登录超时,请重新登陆`,
        500: `500:请联系管理员`
    }
    
    constructor() {
        this.setDataMethodDefaults = (baseURL, method, data) => {
            this.baseURL = baseURL;
            this.method = method;
            this.data = data;
        }
        // 创建axios实例
        this.$http = axios.create({
            baseURL: this.baseURL, // api的base_url
            timeout: 60000 // 请求超时时间
        })

        // request拦截器
        this.$http.interceptors.request.use((config) => {
            // 取消请求
            config.cancelToken = new axios.CancelToken((cancel) => {
                this.__axiosPromisArr.push({ cancel });
            })
            return config
        }, (error) => {
            // 错误返回
            return Promise.reject(error);
        })

        // respone拦截器
        this.$http.interceptors.response.use((response) => {
            console.log('response', response);
            return Promise.resolve({ '$response': response });
        }, (error) => {
            console.log('error', error);
            //请求取消时，也会进入error，根据axios.isCancel()：true--请求取消  false--请求失败
            //仅在请求失败时做后续处理
            if (axios.isCancel(error)) {
                console.warn('取消请求');
            } else {
                // 返回接口请求失败提示数据
                // 返回数据结构 {message: 'XXXXX', code: 404}
                console.error(this.__errorConfig[error.code]||error.message)
                return Promise.reject(error.error.data);
            }
        })
        // 通过调用方法将axios的请求停止
        this.$http.handleCancleAxios = () => {
            this.__axiosPromisArr.forEach((item, index) => {
                item.cancel();
                // delete __axiosPromisArr[index];
            })
            this.__axiosPromisArr = []; // 重置队列
        }
    }

    excute () {
        return this.$http(({
            url: this.baseUrl,
            method: this.method,
            data: this.data
        }))
    }
}


// 单例模块
// export default new UserManage();
module.exports = {
    UserManage: new UserManage()
}
