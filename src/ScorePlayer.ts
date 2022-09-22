import { synth, TuneObjectArray, TuneObject } from "abcjs";
import CursorController from "./CursorController";
import SynthController from "./SynthController";

export default class ScorePlayer {

  visualObj: TuneObject;
  rootElement: HTMLElement;

  widgetOptions = {
    displayLoop: true,
    displayRestart: true,
    displayPlay: true,
    displayProgress: true,
    displayWarp: false,
  };

  constructor(visualObjs: TuneObjectArray, rootElement: HTMLElement) {
    // only first tune in tunebook supported
    this.visualObj = visualObjs[0];
    this.rootElement = rootElement;
  }

  async init() {
    if (!synth.supportsAudio()) {
      throw new Error(`<strong>No Audio Support</strong>\n`);
    }

    console.log("audio is supported");

    // create placeholder for audio control widget
    // TODO: there seems to be a flash of the css-warning until the css is loaded...
    // TODO: scrubbing the timeline doesn't work
    const audioWidget = document.createElement("div");
    const widgetNode = this.rootElement.parentNode.appendChild(audioWidget);

    // create cursorController
    const cursorController = new CursorController(this.rootElement);

    // create synthController
    const synthController = new SynthController()
    
    // const synthController = new synth.SynthController();
    synthController.load(widgetNode, cursorController, this.widgetOptions);

    // set the tune
    try {
      const result = await synthController.setTune(this.visualObj, false, {});
      console.log(`audio initialized successfully`);
    } catch (error) {
      console.error(`error while initializing audio ${error}`);
      throw new Error(`<strong>Failed to initialize audio</strong>\n\t${error}`);
    }
  }
}
