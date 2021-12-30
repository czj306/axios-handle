/*
 * @Description: request
 * @Author: czj
 * @Github: https://github.com/czj306
 * @Date: 2021-09-23 19:14:21
 * @LastEditors: czj
 * @LastEditDate: 
 * @FilePath: ./request.js
 */
import axios from 'axios'
// 存储cancel token
let axiosPromisArr = [];

// 创建axios实例
const service = axios.create({
    baseURL: '/api', // api的base_url
    timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use((config) => {
    // 取消请求
    config.cancelToken = new axios.CancelToken((cancel) => {
        axiosPromisArr.push({ cancel });
    })
    return config
}, (error) => {
    // 错误返回
    return Promise.reject(error);
})

// respone拦截器
service.interceptors.response.use((response) => {
    return Promise.resolve({ '$response': response });
}, (error) => {
    //请求取消时，也会进入error，根据axios.isCancel()：true--请求取消  false--请求失败
    //仅在请求失败时做后续处理
    if (axios.isCancel(error)) {
        console.warn('取消请求');
    } else {
        // 返回接口请求失败提示数据
        // 返回数据结构 {message: 'XXXXX', code: 404}
        return Promise.reject(error.response.data);
    }
})
// 通过调用方法将axios的请求停止
service.handleCancleAxios = () => {
    axiosPromisArr.forEach((item, index) => {
        item.cancel();
        // delete axiosPromisArr[index];
    })
    axiosPromisArr = []; // 重置队列
}
export default service
