import { synth, TuneObjectArray, TuneObject, AudioControlParams, SynthVisualOptions } from "abcjs";
import CursorController from "./CursorController";
import SynthController from "./SynthController";
import WidgetController from "./WidgetController";

export default class ScorePlayer {

  visualObj: TuneObject;
  rootElement: HTMLElement;

  constructor(visualObjs: TuneObjectArray, rootElement: HTMLElement | string) {
    // only first tune in tunebook supported
    this.visualObj = visualObjs[0];

    if (typeof rootElement === "string") {
      this.rootElement = document.querySelector(rootElement);
    } else {
      this.rootElement = rootElement as HTMLElement;
    }
  }

  async init() {
    if (!synth.supportsAudio()) {
      throw new Error(`<strong>No Audio Support</strong>\n`);
    }

    console.log("audio is supported");

    // create placeholder for audio control widget
    // TODO: there seems to be a flash of the css-warning until the css is loaded...
    // TODO: scrubbing the timeline doesn't work


    // create cursorController
    const cursorController = new CursorController(this.rootElement);

    // create widgetController
    const widgetOptions: SynthVisualOptions = {
      displayLoop: true,
      displayRestart: true,
      displayPlay: true,
      displayProgress: true,
      displayWarp: true,
    };
    const widgetController = new WidgetController(this.rootElement, widgetOptions);

    // create synthController
    const synthController = new SynthController()
    synthController.init(widgetController, cursorController);

    // set the tune
    try {
      await synthController.setTune(this.visualObj, false, {});
      console.log(`tune loaded successfully`);
    } catch (error) {
      console.error(`error while initializing audio ${error}`);
      throw new Error(`<strong>Failed to initialize audio</strong>\n\t${error}`);
    }
  }
}
