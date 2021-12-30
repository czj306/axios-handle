/*
 * @Description: request中间处理层
 * @Author: czj
 * @Github: https://github.com/czj306
 * @Date: 2021-09-23 19:14:21
 * @LastEditors: czj
 * @LastEditDate: 
 * @FilePath: ./request.config.js
 */
import Vue from 'vue';
import service from './request'
import authService from '@/utils/auth.service.js'
import { dingtalk } from "@/utils/dingtailk.auth.service.js";
const dd = require('dingtalk-jsapi');

// 提示映射表
const errorConfig = {
  400: `404:服务器无法理解该请求`,
  401: `401:未登入或登录超时，请重新登入`,
  403: `403:拒绝授权访问`,
  404: `404:接口不存在`,
  499: `499:登录超时,请重新登陆`,
  500: `500:请联系管理员`
}

/**
 * @description 展示弹窗作用
 * @param {String} desc 提示信息
 */
const message = (desc) => {
  Vue.prototype.$message.error(desc, 5)
}

/**
 * @description 判断用户登陆，以及给出相应提示
 * @param {*} response 
 */
const messageInfo = (response) => {
  if (response.hasOwnProperty('code')) {
    // 判断接口请求，是否用户已经不在线
    if (response.code === 401) {
      if (dd.env.platform === "notInDingTalk") {
        // 钉钉免登逻辑
          authService.authorize();
      } else {
          // 钉钉登入流程
          dingtalk();
      }
    }
    // 数据弹窗提示
    message(response.message);
  } else {
    // 获取数据内容
    const desc = errorConfig[response.status];
    // 数据弹窗提示
    message(desc);
  }
}

service.interceptors.response.use((response) => {
  // 后端返回数据正常，不做数据处理直接返回api
  return Promise.resolve(response);
}, (error) => {
  // 登陆判断及数据提示款提示用户
  messageInfo(error)
  // 返回数据格式 error.response.data，固定数据方便下request/index.js 使用
  // response.data
  return Promise.reject(error);

})

export default service;