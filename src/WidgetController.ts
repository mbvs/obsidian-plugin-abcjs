import { SynthVisualOptions } from "abcjs";
import { AudioControl, AudioControlParams } from "abcjs";
import { Selector } from "abcjs";
import { synth } from "abcjs";

export default class WidgetController {
  parent: HTMLElement;
  widgetRoot: HTMLElement;
  options: SynthVisualOptions = {};
  delegate: AudioControlParams; // SynthConroller

  playBtn: HTMLButtonElement;
  loadingSpn: HTMLButtonElement;
  progressSlider: HTMLInputElement;
  pauseBtn: HTMLButtonElement;
  volumeBtn: HTMLButtonElement;
  volumeSlider: HTMLInputElement;
  moreBtn: HTMLUListElement;
  warpBtns: NodeListOf<HTMLLIElement>;
  elapsedTxt: HTMLElement;

  bpm: number;

  constructor(rootElement: HTMLElement, options: SynthVisualOptions = {}) {
    this.parent = rootElement.parentElement;
    this.options = Object.assign(this.options, options);
    this.buildGUI();
  }

  /**
   * Sets the SynthController as a Delegate
   */
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
    this.bpm = tempo;
    console.log('tempo set: ', this.bpm);
  }

  pushPlay(pause: boolean) {
    console.log("pushplay: ", pause);
    if (pause) {
      this.playBtn.setAttr("style", "display: none");
      this.loadingSpn.setAttr("style", "display: none");
      this.pauseBtn.setAttr("style", "display: block");
    } else {
      this.playBtn.setAttr("style", "display: block");
      this.loadingSpn.setAttr("style", "display: none");
      this.pauseBtn.setAttr("style", "display: none");
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
    //console.log(`${percent} : ${total}`);
    const elapsed = (total * percent) / 1000;
    this.elapsedTxt.innerHTML = `${this.getTimeFormatted(
      elapsed
    )} / ${this.getTimeFormatted(total / 1000)}`;

    this.progressSlider.value = (percent * 100).toString();
    this.progressSlider.style.setProperty(
      "--value",
      `${this.progressSlider.value}%`
    );
  }

  /**
   * Returns a neatly formatted time string
   */
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
    this.playBtn = this.widgetRoot.querySelector(".music-abc-btn-play");
    this.loadingSpn = this.widgetRoot.querySelector(".music-abc-btn-loading");
    this.progressSlider = this.widgetRoot.querySelector(
      ".music-abc-progress"
    ) as HTMLInputElement;
    this.pauseBtn = this.widgetRoot.querySelector(".music-abc-btn-pause");
    this.volumeBtn = this.widgetRoot.querySelector(".music-abc-btn-volume");
    this.volumeSlider = this.widgetRoot.querySelector(
      ".music-abc-volume-slider"
    ) as HTMLInputElement;
    this.moreBtn = this.widgetRoot.querySelector(".music-abc-btn-more");
    this.warpBtns = this.moreBtn.querySelectorAll("li");
    this.elapsedTxt = this.widgetRoot.querySelector(".music-abc-elapsed");
  }

  /**
   * sets the eventListeners for the Btns etc.
   * calls the appropriate delegate methods
   */
  private wireUp(delegate: AudioControlParams) {
    // TODO: second play doesn't work!
    this.playBtn.addEventListener("click", async (e) => {
      this.playBtn.setAttr("style", "display: none");
      this.loadingSpn.setAttr("style", "display: block");
      if (!synth.activeAudioContext()) {
        synth.registerAudioContext();
      }

      const response = await this.delegate.playPromiseHandler(true);
      console.log("play pressed", response);
      // possible: ok, created, loading?
      if (response.status === "ok") {
      }
    });

    this.pauseBtn.addEventListener("click", async (e) => {
      const response = await this.delegate.playPromiseHandler(false);
      console.log("pause pressed", response);
      this.pauseBtn.setAttr("style", "display: none");
      this.playBtn.setAttr("style", "display: block");
    });

    // TODO
    this.progressSlider.addEventListener("input", () => {
      this.progressSlider.style.setProperty(
        "--value",
        `${this.progressSlider.value}%`
      );
    });

    // TODO
    this.volumeBtn.addEventListener("click", (e) => {
      this.volumeBtn.classList.toggle("off");
      this.volumeSlider.value = this.volumeBtn.classList.contains("off")
        ? "0"
        : "100";
    });

    // TODO
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

    // TODO: starts immediatly, sometimes stumbles
    this.warpBtns.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        this.warpBtns.forEach((btn) => {
          btn.classList.remove("selected");
        });
        const current = e.target as HTMLElement;
        const percent = parseFloat(current.innerHTML.slice(0, -1)) * 100;
        current.classList.add("selected");
        this.delegate.warpHandler(percent);
        // const response = await this.delegate.playPromiseHandler();
        // console.log("warp changed", response);
        // // possible: ok, created, loading?
        // if (response.status === "ok") {
        // }
      });
    });
  }
}
