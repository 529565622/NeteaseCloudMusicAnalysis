// ==UserScript==
// @name         网易云一键解析
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.4
// @description  获取网易云音乐音乐直链(支持VIP)
// @author       Miro(https://vrchat.com/home/user/usr_20b8e0e4-9e16-406a-a61d-8a627ec1a2e3)
// @updateURL    https://raw.githubusercontent.com/529565622/NeteaseCloudMusicAnalysis/main/NeteaseCloudMusicAnalysis.user.js
// @match        https://music.163.com*
// @grant        GM_notification
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// ==/UserScript==

(function () {
  'use strict'
  // 创建右下角解析按钮
  var CloudMusicAnalysisbutton = `<button id="CloudMusicAnalysis" style="z-index:999;width: 45px;height:45px;color: rgb(255, 255, 255); background: rgb(0, 174, 236); border: 1px solid rgb(241, 242, 243); border-radius: 6px; font-size: 14px;top:800px;right:0px;position:fixed;">网易</br>解析</button>`;
  $("body").append(CloudMusicAnalysisbutton)
  document.getElementById('CloudMusicAnalysis').addEventListener('click', clickBotton)
  var CloudMusicAnalysisbutton1 = `<button id="CloudMusicAnalysis1" style="z-index:999;width: 45px;height:45px;color: rgb(255, 255, 255); background: rgb(0, 174, 236); border: 1px solid rgb(241, 242, 243); border-radius: 6px; font-size: 14px;top:100px;left:0px;position:fixed;">网易</br>解析</button>`;
  $("body").append(CloudMusicAnalysisbutton1)
  document.getElementById('CloudMusicAnalysis1').addEventListener('click', clickBotton)
  function a(a) {
    var d, e, b = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", c = "";
    for (d = 0; a > d; d += 1)
      e = Math.random() * b.length,
        e = Math.floor(e),
        c += b.charAt(e);
    return c
  }
  function b(a, b) {
    var c = CryptoJS.enc.Utf8.parse(b)
      , d = CryptoJS.enc.Utf8.parse("0102030405060708")
      , e = CryptoJS.enc.Utf8.parse(a)
      , f = CryptoJS.AES.encrypt(e, c, {
        iv: d,
        mode: CryptoJS.mode.CBC
      });
    return f.toString()
  }
  function c(a, b, c) {
    var d, e;
    return setMaxDigits(131),
      d = new RSAKeyPair(b, "", c),
      e = encryptedString(d, a)
  }
  function d(d, e, f, g) {
    var h = {}
      , i = a(16);
    return h.encText = b(d, g),
      h.encText = b(h.encText, i),
      h.encSecKey = c(i, e, f),
      h
  }
  function e(a, b, d, e) {
    var f = {};
    return f.encText = c(a + e, b, d),
      f
  }
  window.asrsea = d
  function clickBotton() {
    var url = window.location.hash.split("?")[1];
    var urlParams = new URLSearchParams(url)
    var id = urlParams.get("id")
    var data = window.asrsea(JSON.stringify({ "ids": "[" + id + "]", "level": "standard", "encodeType": "aac", "csrf_token": "" }), '010001', '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7', '0CoJUm6Qyw8W8jud')
    var data1 = { params: data.encText, encSecKey: data.encSecKey }
    data1 = Object.keys(data1).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data1[key]);
    }).join('&');
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=", true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(data1);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var json = JSON.parse(xhr.responseText);
        navigator.clipboard.writeText(json.data[0].url).catch(e => console.error(e))
        GM_notification({
          title: "解析成功",
          image: "https://p5.music.126.net/obj/wo3DlcOGw6DClTvDisK1/4874132307/4499/f228/d867/da64b9725e125943ad4e14e4c72d0884.png",
          text: "解析成功",
          highlight: true,
          silent: false,
          timeout: 10000,
          onclick: function () {
          },
          ondone() {
          }
        })
      }
    };
  }
})()
