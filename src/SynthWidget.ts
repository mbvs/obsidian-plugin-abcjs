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
    this.widgetRoot.addClass('music-abc-root');
    let el = document.createElement("div")
    el.addClass("music-abc-play")
    el.innerHTML = play
    this.parent.insertAdjacentElement("afterbegin", this.widgetRoot);
    this.widgetRoot.insertAdjacentElement('afterbegin', el);
    console.log(this.widgetRoot);
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
