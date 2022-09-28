import { AudioControl, AudioControlParams } from "abcjs";
import { Selector } from "abcjs";
import { synth } from "abcjs";
import loop from "./assets/loop.svg";
import play from "./assets/play.svg";

export default class SynthWidget {
  parent: HTMLElement;
  widgetRoot: HTMLElement;
  options: AudioControlParams = {};

  constructor(selector: Selector, options: AudioControlParams = {}) {
    if (typeof selector === "string") {
      this.parent = document.querySelector(selector);
    } else {
      this.parent = selector as HTMLElement;
    }
    this.options = Object.assign(this.options, options);
    this.buildGUI();
    console.log("SynthWidget instantiated");
  }

  disable(disable: boolean) {
    if (disable) this.widgetRoot.classList.add("abcjs-disabled");
    else {
      this.widgetRoot.classList.remove("abcjs-disabled");
    }
  }

  resetAll() {
    // var pushedButtons = self.parent.querySelectorAll(".abcjs-pushed");
    // for (var i = 0; i < pushedButtons.length; i++) {
    //   var button = pushedButtons[i];
    //   button.classList.remove("abcjs-pushed");
    // }
  }

  setProgress = function (percent: number, totalTime: number) {
    // var progressBackground = self.parent.querySelector(
    //   ".abcjs-midi-progress-background"
    // );
    // var progressThumb = self.parent.querySelector(
    //   ".abcjs-midi-progress-indicator"
    // );
    // if (!progressBackground || !progressThumb) return;
    // var width = progressBackground.clientWidth;
    // var left = width * percent;
    // progressThumb.style.left = left + "px";
    // var clock = self.parent.querySelector(".abcjs-midi-clock");
    // if (clock) {
    //   var totalSeconds = (totalTime * percent) / 1000;
    //   var minutes = Math.floor(totalSeconds / 60);
    //   var seconds = Math.floor(totalSeconds % 60);
    //   var secondsFormatted = seconds < 10 ? "0" + seconds : seconds;
    //   clock.innerHTML = minutes + ":" + secondsFormatted;
    // }
  };

  private buildGUI() {
    this.widgetRoot = document.createElement("div");
    this.widgetRoot.addClass("music-abc-root");
    this.widgetRoot.innerHTML = `
    <button class="music-abc-btn music-abc-btn-play"></button>
    <button class="music-abc-btn music-abc-btn-pause"></button>
    <button class="music-abc-btn music-abc-btn-loading"></button>
    <div class="music-abc-btn-timer">0:00 / 0:00</div>
    <input class="music-abc-progress" type="range"></input>
    <button class="music-abc-btn music-abc-btn-volume-on"></button>
    <button class="music-abc-btn music-abc-btn-volume-off"></button>
    <button class="music-abc-btn music-abc-btn-more"></button>
    `;
    this.parent.insertAdjacentElement("afterbegin", this.widgetRoot);

    const play = this.widgetRoot.querySelector(".music-abc-btn-play");
    const loading = this.widgetRoot.querySelector(".music-abc-btn-loading");
    const pause = this.widgetRoot.querySelector(".music-abc-btn-pause");
    const volumeOn = this.widgetRoot.querySelector(".music-abc-btn-volume-on");
    const volumeOff = this.widgetRoot.querySelector(
      ".music-abc-btn-volume-off"
    );
    const timer = this.widgetRoot.querySelector(".music-abc-btn-timer");

    let timerInterval: NodeJS.Timeout;

    play.addEventListener("click", (e) => {
      play.setAttr("style", "display: none");

      loading.setAttr("style", "display: block");
      setTimeout(() => {
        loading.setAttr("style", "display: none");
        pause.setAttr("style", "display: block");
        let now = 0;
        timerInterval = setInterval(() => {
          now++
          const min = Math.floor(now/60);
          const sec = now - min * 60
          timer.innerHTML = `${min}:${sec < 10 ? 0 : ""}${sec} / 0:00`
        }, 1000)
      }, 500);
    });

    pause.addEventListener("click", (e) => {
      pause.setAttr("style", "display: none");
      play.setAttr("style", "display: block");
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    });

    volumeOn.addEventListener("click", (e) => {
      volumeOn.setAttr("style", "display: none");
      volumeOff.setAttr("style", "display: block");
    });

    volumeOff.addEventListener("click", (e) => {
      volumeOff.setAttr("style", "display: none");
      volumeOn.setAttr("style", "display: block");
    });
  }

  buildDom = function (parent: HTMLElement, options: AudioControlParams) {
    console.log("calling buildDOM");
    var hasLoop = !!options.loopHandler;
    var hasRestart = !!options.restartHandler;
    var hasPlay = !!options.playHandler || !!options.playPromiseHandler;
    var hasProgress = !!options.progressHandler;
    var hasWarp = !!options.warpHandler;
    var hasClock = options.hasClock !== false;

    var html = '<div class="abcjs-inline-audio">\n';
    if (hasLoop) {
      html +=
        '<button type="button" class="abcjs-midi-loop abcjs-btn">' +
        loop +
        "</button>\n";
    }
    // if (hasRestart) {
    //     html += '<button type="button" class="abcjs-midi-reset abcjs-btn">' + reset + '</button>\n';
    // }
    // if (hasPlay) {
    //     html += '<button type="button" class="abcjs-midi-start abcjs-btn">' + loading + '</button>\n';
    // }
    if (hasProgress) {
      html +=
        '<button type="button" class="abcjs-midi-progress-background"><span class="abcjs-midi-progress-indicator"></span></button>\n';
    }
    if (hasClock) {
      html += '<span class="abcjs-midi-clock"></span>\n';
    }
    if (hasWarp) {
      html +=
        '<span class="abcjs-tempo-wrapper"><label><input class="abcjs-midi-tempo" type="number" min="1" max="300" value="100">%</label><span>&nbsp;(<span class="abcjs-midi-current-tempo"></span>BPM)</span></span>\n';
    }
    html += "</div>\n";
    parent.innerHTML = html;
  };
}
