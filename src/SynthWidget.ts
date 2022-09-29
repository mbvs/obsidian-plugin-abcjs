import { AudioControl, AudioControlParams } from "abcjs";
import { Selector } from "abcjs";
import { synth } from "abcjs";

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
    <div class="music-abc-timer">0:00 / 0:00</div>
    <input class="music-abc-progress" type="range" value="0" min="0" max="100"></input>
    <button class="music-abc-btn music-abc-btn-volume-on"></button>
    <button class="music-abc-btn music-abc-btn-volume-off"></button>
    <button class="music-abc-btn music-abc-btn-more"></button>
    `;
    this.parent.insertAdjacentElement("afterbegin", this.widgetRoot);

    const play = this.widgetRoot.querySelector(".music-abc-btn-play");
    const loading = this.widgetRoot.querySelector(".music-abc-btn-loading");
    const progress = this.widgetRoot.querySelector(".music-abc-progress") as HTMLInputElement;
    const pause = this.widgetRoot.querySelector(".music-abc-btn-pause");
    const volumeOn = this.widgetRoot.querySelector(".music-abc-btn-volume-on");
    const volumeOff = this.widgetRoot.querySelector(
      ".music-abc-btn-volume-off"
    );


    const timer = this.widgetRoot.querySelector(".music-abc-timer");
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
          progress.value = now.toString()
          progress.dispatchEvent(new Event('input'))
          const min = Math.floor(now/60)
          const sec = now - min * 60
          timer.innerHTML = `${min}:${sec < 10 ? 0 : ""}${sec} / 0:00`
        }, 1000)
      }, 500);
    });

    progress.addEventListener('input', () => {
      progress.style.setProperty('--value', `${progress.value}%`);
    })

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

}
