/*
 * @Description: request 通用函数封装
 * @Author: czj
 * @Github: https://github.com/czj306
 * @Date: 2021-09-23 19:14:21
 * @LastEditors: czj
 * @LastEditDate: 
 * @FilePath: ./index.js
 */
import request from './request.config'
import qs from 'qs';

/**
* 参数数据处理
* @export
* @param {Object} pramas q语句内部参数, 非q外部
* @returns query 数据为object
*/
const getParams = (pramas) => {
    // 获取指定参数进行特殊处理
    const { q, ...external } = pramas;

    // 目的将 q: ?q=xxx.dd=23,cc=23，external: xxx=123&ww.dd=333
    // 将使用qs处理方法
    // qs.stringify({ a: null, b: undefined })，返回 'a='
    const options = {
        // 允许使用.
        allowDots: true, 
        // 排序
        sort: alphabeticalSort,
        // 忽略Null值
        skipNulls: true,
        // encodeValuesOnly: true,
    }
    // 构建新的一个对象，用于接收所有参数，便于统一生成一个新的字符串
    // 对 external 参数数据进行处理
    let obj = { ...external };

    // 对q查询参数进行处理
    // 转成xx=12,xxsd=333格式，使用allowDots: true
    // 按字母顺序排序，使用sort: alphabeticalSort
    // 如果没值就设置undefined，便于最后取消q的查询
    obj.q = qs.stringify(q, Object.assign({ delimiter: ',', encode: false }, options)) || undefined;

    // 对external参数数据进行处理
    // 将 obj 对象转?a=b&c=d，使用 addQueryPrefix: true, 
    const query = qs.stringify(obj, Object.assign({ addQueryPrefix: true, encode: true, skipNulls: true }, options));

    return query;
}

/**
 * @description 对数据请求返回成功失败进行处理
 * @param {*} response 
 * @returns 
 */
const promise = (response) => {
    // 返回数据请求成功的数据，保留特殊处理入口
    if (response && [200, 201].includes(response.$response.status)) {
        return Promise.resolve(response.$response.data)
    } else {
        return Promise.reject(response)
    }
}

/**
* @description 系统接口处理函数
* @param {String} url 链接url
* @param {String} method 方法有：get、post、put、deleted、patch
* @param {Object} data 数据对象，初始值为 undefined
* @param {Object} params q语句内部参数，外部参数对象
* @returns
*/
const methods = (url, method, data, params) => {
    // 避免重复调用函数消耗内存
    const baseUrl = url + (params ? getParams(params) :'');
    return request({
        url: baseUrl,
        method,
        data
    }).then(promise)
}

/**
 * @description 字母顺序（排序）
 * @param {*} a 第一字
 * @param {*} b 第二字
 * @returns 从a到z顺序
 */
const alphabeticalSort = (a, b) => a.localeCompare(b);

/**
 * 详情数据获取
 * @export
 * @param {any} url 链接url
 * @param {any} params q语句内部参数 对象
 * @param {any} external 外部参数 对象
 */
export const get = (url, params = {}) => methods(url, 'get', undefined, params);

/**
*
* 数据上传函数
* @param {any} url  链接url
* @param {any} data 需要上传数据字段
* @returns
*/
export const post = (url, data) => methods(url, 'post', data);

/**
*
* 数据删除函数
* @param {any} url  链接url
* @param {any} data 需要上传数据字段
* @returns
*/
export const deleted = (url, data) => methods(url, 'delete', data);

/**
*
* 数据修改函数
* @param {any} url  链接url
* @param {any} data 需要上传数据字段
* @returns
*/
export const patch = (url, data) => methods(url, 'patch', data);

/**
*
* 更新或创建数据
* @param {any} url  链接url
* @param {any} data 需要上传数据字段
* @returns
*/
export const put = (url, data) => methods(url, 'put', data);

