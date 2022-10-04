import { SynthVisualOptions } from "abcjs";
import { AudioControl, AudioControlParams } from "abcjs";
import { Selector } from "abcjs";
import { synth } from "abcjs";

export default class WidgetController {
  parent: HTMLElement;
  widgetRoot: HTMLElement;
  options: SynthVisualOptions = {};
  delegate: AudioControlParams; // SynthConroller

  play: HTMLButtonElement;
  loading: HTMLButtonElement;
  progress: HTMLInputElement;
  pause: HTMLButtonElement;
  volumeBtn: HTMLButtonElement;
  volumeSlider: HTMLInputElement;
  moreBtn: HTMLUListElement;
  warpBtns: NodeListOf<HTMLLIElement>;
  elapsed: HTMLElement;

  constructor(rootElement: HTMLElement, options: SynthVisualOptions = {}) {
    this.parent = rootElement.parentElement;
    this.options = Object.assign(this.options, options);
    this.buildGUI();
  }

  setDelegate(delegate: AudioControlParams) {
    this.delegate = delegate;
    this.wireUp(this.delegate);
  }

  resetAll() {
    // var pushedButtons = self.parent.querySelectorAll(".abcjs-pushed");
    // for (var i = 0; i < pushedButtons.length; i++) {
    //   var button = pushedButtons[i];
    //   button.classList.remove("abcjs-pushed");
    // }
  }

  disable(isDisabled: boolean) {
    // var el = self.parent.querySelector(".abcjs-inline-audio");
    // if (isDisabled)
    // 	el.classList.add("abcjs-disabled");
    // else
    // 	el.classList.remove("abcjs-disabled");
  }
  setWarp(tempo: any, warp: any) {
    // var el = self.parent.querySelector(".abcjs-midi-tempo");
    // el.value = Math.round(warp);
    // self.setTempo(tempo)
  }
  setTempo(tempo: any) {
    // var el = self.parent.querySelector(".abcjs-midi-current-tempo");
    // if (el)
    // 	el.innerHTML = Math.round(tempo);
  }

  pushPlay(pause: boolean) {
    console.log("pushplay: ", pause);
    if (pause) {
      this.play.setAttr("style", "display: none");
      this.loading.setAttr("style", "display: none");
      this.pause.setAttr("style", "display: block");
    } else {
      this.play.setAttr("style", "display: block");
      this.loading.setAttr("style", "display: none");
      this.pause.setAttr("style", "display: none");
    }
  }
  pushLoop(push: boolean) {
    // var loopButton = self.parent.querySelector(".abcjs-midi-loop");
    // if (!loopButton)
    // 	return;
    // if (push)
    // 	loopButton.classList.add("abcjs-pushed");
    // else
    // 	loopButton.classList.remove("abcjs-pushed");
  }

  setProgress(percent: number, total: number) {
    console.log(`${percent} : ${total}`);
    const elapsed = (total * percent) / 1000;
    this.elapsed.innerHTML = `${this.getTimeFormatted(elapsed)} / ${this.getTimeFormatted(total/1000)}`

    this.progress.value = (percent * 100).toString();
    this.progress.style.setProperty("--value", `${this.progress.value}%`);
  }

  private getTimeFormatted(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
  }

  /**
   * Constructs the player GUI
   * and wires up the buttons and sliders
   */
  private buildGUI() {
    // build GUI as string
    this.widgetRoot = document.createElement("div");
    this.widgetRoot.addClass("music-abc-root");
    this.widgetRoot.id = "music-abc-root";
    this.widgetRoot.innerHTML = `
    <button class="music-abc-btn music-abc-btn-play"></button>
    <button class="music-abc-btn music-abc-btn-pause"></button>
    <button class="music-abc-btn music-abc-btn-loading"></button>
    <div class="music-abc-elapsed">0:00 / 0:00</div>
    <input class="music-abc-progress" type="range" value="0" min="0" max="100"></input>
    <div class="music-abc-volume">
      <input class="music-abc-volume-slider" type="range" value="100" min="0" max="100"></input>
      <button class="music-abc-btn music-abc-btn-volume"></button>
    </div>
    <button class="music-abc-btn music-abc-btn-more">
      <ul>
        <li>2x</li>
        <li>1.5x</li>
        <li class="selected">1x</li>
        <li>0.75x</li>
        <li>.5x</li>
      </ul>
    </button>
    `;
    this.parent.insertAdjacentElement("beforeend", this.widgetRoot);
    this.play = this.widgetRoot.querySelector(".music-abc-btn-play");
    this.loading = this.widgetRoot.querySelector(".music-abc-btn-loading");
    this.progress = this.widgetRoot.querySelector(
      ".music-abc-progress"
    ) as HTMLInputElement;
    this.pause = this.widgetRoot.querySelector(".music-abc-btn-pause");
    this.volumeBtn = this.widgetRoot.querySelector(".music-abc-btn-volume");
    this.volumeSlider = this.widgetRoot.querySelector(
      ".music-abc-volume-slider"
    ) as HTMLInputElement;
    this.moreBtn = this.widgetRoot.querySelector(".music-abc-btn-more");
    this.warpBtns = this.moreBtn.querySelectorAll("li");
    this.elapsed = this.widgetRoot.querySelector(".music-abc-elapsed");
  }

  private wireUp(delegate: AudioControlParams) {

    // TODO: second play doesn't work!
    this.play.addEventListener("click", async (e) => {
      this.play.setAttr("style", "display: none");
      this.loading.setAttr("style", "display: block");
      if (!synth.activeAudioContext()) {
        synth.registerAudioContext();
      }
      const response = await this.delegate.playPromiseHandler();
      console.log("play pressed", response);
      // possible: ok, created, loading?
      if (response.status === "ok") {
      }

      // playBtn.addEventListener("click", function(ev){
      //   acResumerMiddleWare(
      //     self.options.playPromiseHandler || self.options.playHandler,
      //     ev,
      //     playBtn,
      //     self.options.afterResume,
      //     !!self.options.playPromiseHandler)
      // });

      // function acResumerMiddleWare(next, ev, playBtn, afterResume, isPromise) {
      //   var needsInit = true;
      //   if (!activeAudioContext()) {
      //     registerAudioContext();
      //   } else {
      //     needsInit = activeAudioContext().state === "suspended";
      //   }
      //   if (!supportsAudio()) {
      //     throw { status: "NotSupported", message: "This browser does not support audio."};
      //   }

      //   if ((needsInit || isPromise) && playBtn)
      //     playBtn.classList.add("abcjs-loading");

      //   if (needsInit) {
      //     activeAudioContext().resume().then(function () {
      //       if (afterResume) {
      //         afterResume().then(function (response) {
      //           doNext(next, ev, playBtn, isPromise);
      //         });
      //       } else {
      //         doNext(next, ev, playBtn, isPromise);
      //       }
      //     });
      //   } else {
      //     doNext(next, ev, playBtn, isPromise);
      //   }
      // }
    });

    this.pause.addEventListener("click", async (e) => {
      const response = await this.delegate.playPromiseHandler();
      console.log("pause pressed", response);
      this.pause.setAttr("style", "display: none");
      this.play.setAttr("style", "display: block");
    });

    this.progress.addEventListener("input", () => {
      this.progress.style.setProperty("--value", `${this.progress.value}%`);
    });

    this.volumeBtn.addEventListener("click", (e) => {
      this.volumeBtn.classList.toggle("off");
      this.volumeSlider.value = this.volumeBtn.classList.contains("off")
        ? "0"
        : "100";
    });

    this.volumeSlider.addEventListener("input", (e) => {
      this.volumeSlider.style.setProperty(
        "--value",
        `${this.volumeSlider.value}%`
      );
      if (
        this.volumeSlider.value === "0" ||
        this.volumeBtn.classList.contains("off")
      ) {
        this.volumeBtn.classList.toggle("off");
      }
    });

    this.moreBtn.addEventListener("mouseover", (e) => {
      this.moreBtn.querySelector("ul").classList.toggle("active");
    });

    this.moreBtn.addEventListener("mouseout", (e) => {
      this.moreBtn.querySelector("ul").classList.toggle("active");
    });

    this.warpBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.warpBtns.forEach((btn) => {
          btn.classList.remove("selected");
        });
        const current = e.target as HTMLElement;
        const percent = parseFloat(current.innerHTML.slice(0, -1)) * 100;
        current.classList.add("selected");
        this.delegate.warpHandler(percent);
      });
    });
  }
}
