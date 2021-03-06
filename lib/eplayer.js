'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.isSafari = isSafari;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function getTimeStr(time) {
  var h = Math.floor(time / 3600);
  var m = Math.floor(time % 3600 / 60);
  var s = Math.floor(time % 60);
  h = h >= 10 ? h : '0' + h;
  m = m >= 10 ? m : '0' + m;
  s = s >= 10 ? s : '0' + s;
  return h === '00' ? m + ':' + s : h + ':' + m + ':' + s;
}

function isFullScreen() {
  return document.isFullScreen || document.mozIsFullScreen || document.webkitIsFullScreen;
}

function copyright() {
  console.log('\n %c EPlayer 0.3.8 %c eplayer.js.org \n', 'color: #fff; background: linear-gradient(to right,#57a1fc ,#6beaf7); padding:5px;', 'color: #7192c3; background: #ecfaff; padding:5px 0;');
}

function isSafari() {
  return (/Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)
  );
}

var browser = {
  versions: function () {
    var u = navigator.userAgent,
        app = navigator.appVersion;
    return {
      // 移动终端浏览器版本信息
      trident: u.indexOf('Trident') > -1, // IE内核
      presto: u.indexOf('Presto') > -1, // Opera内核
      webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
      gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/) && u.indexOf('QIHU') && u.indexOf('Chrome') < 0, // 是否为移动终端
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // iOS终端
      android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // Android 终端或者 UC 浏览器
      iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为 iPhone 或者 QQHD 浏览器
      iPad: u.indexOf('iPad') > -1, // 是否 iPad
      webApp: u.indexOf('Safari') == -1, // 是否WEB应该程序，没有头部与底部。
      ua: u
    };
  }(),

  language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

var Init = function Init(el, data) {
  _classCallCheck(this, Init);

  var html = '\n    <link rel="stylesheet" href="//at.alicdn.com/t/font_836948_g9ctpaubgfq.css">\n    <style>\n      .eplayer {\n        background:#000;\n        width: 100%;\n        height: 100%;\n        position: relative;\n        overflow: hidden;\n      }\n\n      #ep-canvas{\n        position:absolute;\n        height: 100%;\n        width: 100%;\n        top: 0\n      }\n\n      .eplayer video {\n        width: 100%;\n        height: 100%;\n      }\n      .eplayer .panel {\n        position: absolute;\n        top: 0\n      }\n      .eplayer .panel .ep-play ,.eplayer .panels .epicon{\n        font-size: 80px;\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        transform: translate(-50%,-50%);\n      }\n      .eplayer .wrap {\n        height: 100%;\n        width: 100%;\n      }\n      .eplayer .controls {\n        width: 100%;\n        position: absolute;\n        bottom: 0;\n        padding: 0 15px;\n        box-sizing: border-box;\n        transition: .3s ease-out;\n      }\n\n      .eplayer .msg{\n        display: none;\n        position: absolute;\n        bottom: 60px;\n        left: 20px;\n        background: rgba(0,0,0,.8);\n        color: #fff;\n        padding: 5px 30px;\n        border-radius: 4px;\n        transition: .5s;\n      }\n      .eplayer .option {\n        position: relative;\n        display:flex;\n        align-items: center;\n        padding: 10px 0;\n      }\n      .eplayer .option-left{\n        display: flex;\n        flex: 1;\n        align-items: center;\n      }\n      .eplayer .option-right{\n        display: flex;\n        flex: 1;\n        align-items: center;\n        justify-content: flex-end\n      }\n      .eplayer .progress-bar {\n        width: 100%;\n        position: relative;\n        cursor: pointer;\n      }\n      .eplayer .volume-progress-bar {\n        width: 100px;\n        position: relative;\n        cursor: pointer;\n      }\n      .eplayer .volume-progress {\n        border-radius:2px;\n        height: 4px;\n        background-color: rgba(255, 255, 255, 0.8);\n      }\n      .eplayer .progress {\n        border-radius:2px;\n        height: 4px;\n        background-color: rgba(255, 255, 255, 0.8);\n      }\n      .eplayer .dot {\n        padding: 20px;\n        position: absolute;\n        top: -18px;\n        left: -18px;\n        transition: 0.01s\n      }\n      .eplayer .dot i {\n        height: 13px;\n        width: 13px;\n        background: ' + data.themeColor + ';\n        position: absolute;\n        border-radius: 50%;\n        top: 50%;\n        left:50%;\n        transform:translate(-50%,-50%)\n      }\n      .eplayer .volume {\n        display: flex;\n        align-items: center;\n        padding-right: 15px;\n      }\n      .eplayer .current-progress {\n        width: 0%;\n        height: 100%;\n        background: ' + data.themeColor + ';\n        position: absolute;\n        border-radius:2px;\n        top: 0;\n        transition: .1s\n      }\n      .eplayer .buffer {\n        width: 0%;\n        height: 100%;\n        background: ' + data.themeColor + ';\n        opacity:.4;\n        position: absolute;\n        border-radius:2px;\n        top: 0;\n        transition: .3s;\n      }\n      .eplayer .time {\n        text-align: center;\n        font-size: 12px;\n        color: #fff;\n        padding-left: 15px;\n      }\n      .eplayer .epicon:hover {\n        color: #fff;\n      }\n      .eplayer .epicon {\n        color: rgba(255, 255, 255, 0.8);\n        cursor: pointer;\n        transition: 0.3s;\n        font-size: 20px;\n      }\n      .eplayer .ep-volume-down,.ep-volume-up,.ep-volume-off {\n        padding-right: 15px\n      }\n      .eplayer .loading {\n        position: absolute;\n        top: 50%;\n        left: 50%;\n        margin:-20px 0 0 -20px;\n        width: 40px;\n        height: 40px;\n        border: 2px solid;\n        border-color: rgba(255, 255, 255, 0.8) rgba(255, 255, 255, 0.8) transparent;\n        border-radius: 50%;\n        box-sizing: border-box;\n        animation: loading 1s linear infinite;\n      }\n      @keyframes loading{\n        0%{\n          transform: rotate(0deg);\n        }\n        100%{\n          transform: rotate(360deg);\n        }  \n      }\n    </style>\n    <div class="eplayer">\n      <video id="ep-video">\n        <source src="' + data.src + '" type="video/' + (data.type ? data.type : 'mp4') + '">\n      </video>\n      <canvas id="ep-canvas"></canvas>\n        <div class="panels">\n        <div class="loading"></div>\n          <div class="panel wrap">\n            <i class="epicon ep-play" style="display:none;"></i>\n          </div>\n          <div class="msg">\n          </div>\n        </div>\n        <div class="controls">\n          <div class="progress-bar">\n            <div class="current-progress"></div>\n            <div class="buffer"></div>\n              <div class="dot">\n                <i></i>\n              </div>\n            <div class="progress"></div>\n          </div>\n          <div class="option">\n            <div class="option-left">\n              <div class="control">\n                <i class="epicon ep-play switch"></i>\n              </div>\n              <div class="time">\n                <span class="current">00:00</span>\n                /\n                <span class="total">00:00</span>\n              </div>\n            </div>\n            <div class="option-right"> \n              <div class="volume">\n                <i class="epicon ep-volume-up volume-button"></i>\n                <div class="volume-progress-bar">\n                  <div class="volume-progress"></div>\n                  <div class="current-progress"></div>\n                  <div class="dot">\n                    <i></i>\n                  </div>\n                </div>\n              </div> \n              <div class="control">\n                <i class="epicon ep-full full"></i>\n              </div>  \n            </div>\n          </div>\n        </div>\n    </div>\n    ';
  el.innerHTML = html;
};

var Hls = function Hls(el, data) {
  _classCallCheck(this, Hls);

  this.src = data.src;
  this.el = el;

  var _Hls = require('hls.js');

  if (_Hls.isSupported()) {
    var hls = new _Hls();
    hls.loadSource(this.src);
    hls.attachMedia(this.el);
  }
};

var Flv = function Flv(el, data) {
  _classCallCheck(this, Flv);

  this.src = data.src;
  this.el = el;

  var flvjs = require('flv.js').default;

  if (flvjs.isSupported()) {
    var flvPlayer = flvjs.createPlayer({
      type: 'flv',
      url: this.src
    });
    flvPlayer.attachMediaElement(this.el);
    flvPlayer.load();
  }
};

var OFFSETDOT = 18;
copyright();

var Eplayer = function () {
  function Eplayer(el, data) {
    var _this = this;

    _classCallCheck(this, Eplayer);

    this.el = el;
    this.data = data;
    this.h = el.clientHeight;
    this.w = el.clientWidth;
    this.cTime = 0;

    new Init(this.el, this.data);

    this.video = document.querySelector('.eplayer video');
    this.ep = document.querySelector('.eplayer');
    this.loading = document.querySelector('.eplayer .loading');
    this.isPlay = document.querySelector('.eplayer .switch');
    this.panel = document.querySelector('.eplayer .panel');
    this.playBtn = document.querySelector('.eplayer .panel .ep-play');
    this.totalTime = document.querySelector('.eplayer .total');
    this.currentTime = document.querySelector('.eplayer .current');
    this.controlWrap = document.querySelector('.eplayer .controls-wrap');
    this.dot = document.querySelector('.eplayer .progress-bar .dot');
    this.vdot = document.querySelector('.eplayer .volume .dot');
    this.full = document.querySelector('.eplayer .full');
    this.progress = document.querySelector('.eplayer .progress');
    this.currentProgress = document.querySelector('.eplayer .current-progress');
    this.currentVolumeProgress = document.querySelector('.eplayer .volume .current-progress');
    this.volumeBtn = document.querySelector('.eplayer .volume-button');
    this.controls = document.querySelector('.eplayer .controls');
    this.buffer = document.querySelector('.eplayer .buffer');
    this.volumeProgress = document.querySelector('.eplayer .volume-progress');
    this.msg = document.querySelector('.eplayer .msg');

    if (data.type === 'hls') new Hls(this.video, this.data);

    if (data.type === 'flv') new Flv(this.video, this.data);

    this.tTime = 0;
    this.x = 0;
    this.l = 0;
    this.nl = 0;
    this.nx = 0;
    this.vx = 0;
    this.vl = 0;
    this.vnl = 0;
    this.vnx = 0;
    this.transTop = 0;
    this.bufferEnd = 0;
    this.isDown = false;
    this.timer = 0;

    this.video.onwaiting = function () {
      return _this.waiting();
    };
    this.video.oncanplay = function () {
      return _this.canplay();
    };
    this.video.ontimeupdate = function () {
      return _this.timeupdate();
    };
    this.progress.onclick = this.currentProgress.onclick = this.buffer.onclick = function (e) {
      return _this.progressClick(e);
    };
    this.volumeProgress.onclick = this.currentVolumeProgress.onclick = function (e) {
      return _this.volumeClick(e);
    };
    this.video.onended = function () {
      return _this.ended();
    };
    this.full.onclick = function () {
      return _this.fullScreen();
    };
    this.dot.onmousedown = function (e) {
      return _this.Dotonmousedown(e);
    };
    this.dot.ontouchstart = function (e) {
      return _this.Dotonmousedown(e);
    };
    this.ep.onmousemove = function (e) {
      return _this.Dotonmousemove(e);
    };
    this.ep.ontouchmove = function (e) {
      return _this.Dotonmousemove(e);
    };
    this.ep.onmouseup = function (e) {
      return _this.Dotonmouseup(e);
    };
    this.ep.ontouchend = function (e) {
      return _this.Dotonmouseup(e);
    };
    this.vdot.onmousedown = function (e) {
      return _this.Volumeonmousedown(e);
    };
    this.vdot.ontouchstart = function (e) {
      return _this.Volumeonmousedown(e);
    };
    this.vdot.onmousemove = function (e) {
      return _this.Volumeonmousemove(e);
    };
    this.vdot.ontouchmove = function (e) {
      return _this.Volumeonmousemove(e);
    };
    this.vdot.onmouseup = function (e) {
      return _this.Volumeonmouseup(e);
    };
    this.vdot.ontouchend = function (e) {
      return _this.Volumeonmouseup(e);
    };
    this.volumeBtn.onclick = function () {
      return _this.isVolume();
    };
    window.onresize = function (e) {
      return _this.windowResize(e);
    };
    window.onkeyup = function (e) {
      return _this.keyup(e);
    };
  }

  _createClass(Eplayer, [{
    key: 'waiting',
    value: function waiting() {
      this.loading.style.display = 'block';
    }
  }, {
    key: 'setMsg',
    value: function setMsg(msg) {
      var _this2 = this;

      if (msg !== '') {
        this.msg.style.display = 'block';
        this.msg.innerHTML = msg;
        setTimeout(function () {
          _this2.msg.style.display = 'none';
        }, 2000);
      }
    }
  }, {
    key: 'keyup',
    value: function keyup(e) {
      if (e && e.keyCode == 39) {
        this.video.currentTime += 10;
        this.setMsg('前进10秒');
      }
      if (e && e.keyCode == 37) {
        this.video.currentTime -= 10;
        this.setMsg('后退10秒');
      }
    }
  }, {
    key: 'canplay',
    value: function canplay() {
      this.tTime = this.video.duration;
      this.loading.style.display = 'none';
      this.playBtn.style.display = 'block';
      var tTimeStr = getTimeStr(this.tTime);
      if (tTimeStr) this.totalTime.innerHTML = tTimeStr;
      var vWidth = this.volumeProgress.clientWidth;
      this.video.volume = 0.5;
      this.currentVolumeProgress.style.width = this.video.volume * vWidth + 'px';
      this.vdot.style.left = this.video.volume * vWidth - OFFSETDOT + 'px';
      this.vl = this.video.volume * vWidth;
    }
  }, {
    key: 'play',
    value: function play() {
      if (this.video.paused) {
        this.video.play();
        this.isPlay.classList.remove('ep-play');
        this.isPlay.classList.add('ep-pause');
        this.playBtn.classList.remove('ep-play');
      } else {
        this.video.pause();
        this.isPlay.classList.remove('ep-pause');
        this.isPlay.classList.add('ep-play');
        this.playBtn.classList.add('ep-play');
      }
    }
  }, {
    key: 'isVolume',
    value: function isVolume() {
      if (this.video.muted) {
        this.video.muted = false;
        this.volumeBtn.classList.remove('ep-volume-off');
        this.volumeBtn.classList.add('ep-volume-up');
      } else {
        this.video.muted = true;
        this.volumeBtn.classList.remove('ep-volume-up');
        this.volumeBtn.classList.add('ep-volume-off');
      }
    }
  }, {
    key: 'timeupdate',
    value: function timeupdate() {
      this.cTime = this.video.currentTime;
      if (this.video.buffered.length) {
        this.bufferEnd = this.video.buffered.end(this.video.buffered.length - 1);
        this.buffer.style.width = this.bufferEnd / this.video.duration * this.progress.clientWidth + 'px';
      }

      var cTimeStr = getTimeStr(this.cTime);
      this.currentTime.innerHTML = cTimeStr;
      var offsetCom = this.cTime / this.tTime;
      if (!this.isDown) {
        this.currentProgress.style.width = offsetCom * this.progress.clientWidth + 'px';
        this.dot.style.left = offsetCom * this.progress.clientWidth - OFFSETDOT + 'px';
        this.l = offsetCom * this.progress.clientWidth;
      }
    }
  }, {
    key: 'progressClick',
    value: function progressClick(e) {
      var event = e || window.event;
      if (!this.isDown) {
        this.video.currentTime = event.offsetX / this.progress.offsetWidth * this.video.duration;
      }
    }
  }, {
    key: 'volumeClick',
    value: function volumeClick(e) {
      var event = e || window.event;
      if (!this.isDown) {
        this.vdot.style.left = event.offsetX - OFFSETDOT + 'px';
        this.currentVolumeProgress.style.width = event.offsetX + 'px';
        this.video.volume = event.offsetX / this.volumeProgress.offsetWidth;
      }
    }
  }, {
    key: 'Dotonmousedown',
    value: function Dotonmousedown(e) {
      if (e.changedTouches) {
        this.x = e.changedTouches[0].clientX;
      } else {
        this.x = e.clientX;
      }
      this.l = this.l ? this.l : 0;

      this.isDown = true;
      return false;
    }
  }, {
    key: 'Dotonmousemove',
    value: function Dotonmousemove(e) {
      var _this3 = this;

      if (this.isDown) {
        if (e.changedTouches) {
          this.nx = e.changedTouches[0].clientX;
        } else {
          this.nx = e.clientX;
        }

        this.nl = this.nx - (this.x - this.l);
        if (this.nl <= 0) this.nl = 0;
        if (this.nl >= this.progress.clientWidth) this.nl = this.progress.clientWidth;
        this.dot.style.left = this.nl - OFFSETDOT + 'px';
        this.currentProgress.style.width = this.nl + 'px';
        this.x = this.nx;
        this.l = this.nl;
      } else {
        clearTimeout(this.timer);
        this.controls.style.bottom = 0;
        this.timer = setTimeout(function () {
          _this3.controls.style.bottom = -60 + 'px';
        }, 5000);
      }
    }
  }, {
    key: 'Dotonmouseup',
    value: function Dotonmouseup(e) {
      if (this.isDown) {
        this.video.currentTime = this.nl / this.progress.offsetWidth * this.video.duration;
      } else {
        this.play();
      }
      this.isDown = false;
    }
  }, {
    key: 'Volumeonmousedown',
    value: function Volumeonmousedown(e) {
      if (e.changedTouches) {
        this.vx = e.changedTouches[0].clientX;
      } else {
        this.vx = e.clientX;
      }
      this.vl = this.vl !== 0 ? this.vl : 0;
      this.isDown = true;
    }
  }, {
    key: 'Volumeonmousemove',
    value: function Volumeonmousemove(e) {
      if (this.isDown) {
        if (e.changedTouches) {
          this.vnx = e.changedTouches[0].clientX;
        } else {
          this.vnx = e.clientX;
        }
        this.vnl = this.vnx - (this.vx - this.vl);
        if (this.vnl <= 0) this.vnl = 0;
        if (this.vnl >= this.volumeProgress.clientWidth) this.vnl = this.volumeProgress.clientWidth;
        this.vdot.style.left = this.vnl - OFFSETDOT + 'px';
        this.currentVolumeProgress.style.width = this.vnl + 'px';
        this.vx = this.vnx;
        this.vl = this.vnl;
      }
      e.stopPropagation();
    }
  }, {
    key: 'Volumeonmouseup',
    value: function Volumeonmouseup(e) {
      this.isDown = false;
      this.video.volume = this.vnl / this.volumeProgress.clientWidth;
      e.stopPropagation();
    }
  }, {
    key: 'ended',
    value: function ended() {
      this.isPlay.classList.remove('ep-pause');
      this.isPlay.classList.add('ep-play');
      this.currentProgress.style.width = 0;
      this.dot.style.left = 0;
      this.currentTime.innerHTML = getTimeStr();
      this.video.currentTime = 0;
      this.x = this.l = this.nx = this.nl = 0;
      this.isDown = false;
    }
  }, {
    key: 'fullScreen',
    value: function fullScreen() {
      if (isFullScreen()) {
        if (browser.versions.mobile && !browser.versions.iPad) {} else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      } else {
        if (browser.versions.mobile && !browser.versions.iPad) {
          this.el.style.position = 'fixed';
          this.el.style.top = '0';
          this.el.style.bottom = '0';
          this.el.style.left = '0';
          this.el.style.right = '0';
          this.el.style.height = '100%';
          this.el.style.width = '100%';
          this.eplayer.style.transform = 'rotate(-90deg) translate(-50%, 50%)';
          this.eplayer.style.transformOrigin = '0 50%';
          this.transTop = this.eplayer.getBoundingClientRect().top;
          var ot = -(this.transTop + window.innerHeight / 2) + 'px';
          this.eplayer.style.transform = 'rotate(-90deg) translate(' + ot + ', 50%)';
          this.eplayer.style.height = window.innerWidth + 'px';
          this.eplayer.style.width = window.innerHeight + 'px';
          var rfs = this.el.requestFullScreen || this.el.webkitRequestFullScreen || this.el.mozRequestFullScreen || this.el.msRequestFullscreen;

          return rfs.call(this.el);
        } else {
          var _rfs = this.el.requestFullScreen || this.el.webkitRequestFullScreen || this.el.mozRequestFullScreen || this.el.msRequestFullscreen;

          return _rfs.call(this.el);
        }
      }
    }
  }, {
    key: 'windowResize',
    value: function windowResize(e) {
      if (browser.versions.mobile && !browser.versions.iPad) {
        return;
      } else {
        if (isFullScreen()) {
          this.el.style.height = '100%';
          this.el.style.width = '100%';
        } else {
          this.el.style.height = this.h + 'px';
          this.el.style.width = this.w + 'px';
        }
      }
    }
  }]);

  return Eplayer;
}();

exports.default = Eplayer;