// ==UserScript==
// @name         网易云一键解析
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  try to take over the world!
// @author       Miro
// @match        https://music.163.com*
// @grant        GM_notification
// ==/UserScript==

(function () {
  'use strict'
  var button = document.createElement("button")
  button.textContent = "一键解析"
  button.style.marginLeft = "12px"
  button.style.marginRight = "-40px"
  button.style.height = "32px"
  button.style.width = "90px"
  button.style.align = "center"
  button.style.color = "#FFFFFF"
  button.style.background = "#000000"
  button.style.border = "1px solid #ccc"
  button.style.borderRadius = "20px"
  button.style.fontSize = '12px'
  button.addEventListener("click", clickBotton)
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
    var url = window.location.href
    var id = /(?<=id=).*/
    var id1 = url.match(id)
    // console.log(id1[0])
    var data = window.asrsea(JSON.stringify({ "ids": "[" + id1[0] + "]", "level": "standard", "encodeType": "aac", "csrf_token": "" }), '010001', '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7', '0CoJUm6Qyw8W8jud')
    // console.log(data)
    // console.log(data.encText)
    // console.log(data.encSecKey)
    var data1 = { params: data.encText, encSecKey: data.encSecKey }
    data1 = Object.keys(data1).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(data1[key]);
    }).join('&');

    // console.log(data1)
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token=", true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhr.send(data1);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var json = JSON.parse(xhr.responseText);
        navigator.clipboard.writeText(json.data[0].url).catch(e => console.error(e))
        console.log(json);
      }
    };
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
  setTimeout(function () {
    var like_comment = document.getElementsByClassName('m-tophead f-pr j-tflag')[0]
    // console.log(like_comment);
    like_comment.appendChild(button)
  }, 5000)
})()