import {
  synth,
  TuneObjectArray,
  TuneObject,
  AudioControlParams,
  SynthVisualOptions,
  NoteMapTrack,
} from "abcjs";
import CursorController from "./CursorController";
import SynthController from "./SynthController";
import WidgetController from "./WidgetController";

export default class ScorePlayer {
  tune: TuneObject;
  rootElement: HTMLElement;

  constructor(visualObjs: TuneObjectArray, rootElement: HTMLElement | string) {
    // only first tune in tunebook supported
    this.tune = visualObjs[0];

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
    console.clear();
    console.log("audio is supported");

    // create placeholder for audio control widget
    // TODO: there seems to be a flash of the css-warning until the css is loaded...
    // TODO: scrubbing the timeline doesn't work

    // create cursorController
    const cursorController = new CursorController(this.rootElement, this.tune);

    // create widgetController
    const widgetOptions: SynthVisualOptions = {
      displayLoop: true,
      displayRestart: true,
      displayPlay: true,
      displayProgress: true,
      displayWarp: true,
    };
    const widgetController = new WidgetController(
      this.rootElement,
      widgetOptions
    );

    // create synthController
    const synthController = new SynthController();
    synthController.init(widgetController, cursorController);
    console.log('visualObj');
    console.log(this.tune);
    // set the tune
    try {
      await synthController.setTune(this.tune, false, {
        sequenceCallback: this.onSequenceGenerated,
      });
      console.log(`tune loaded successfully`);
    } catch (error) {
      console.error(`error while initializing audio ${error}`);
      throw new Error(
        `<strong>Failed to initialize audio</strong>\n\t${error}`
      );
    }
  }

  onSequenceGenerated(sequence: NoteMapTrack[], context: any): NoteMapTrack[] {
    console.log("sequence generated");
    console.log(sequence);
    return sequence;
  }
  // NoteMapTrack:
  // [
  //   [
  //     {
  //       "pitch": 60,
  //       "instrument": "acoustic_grand_piano",
  //       "start": 0,
  //       "end": 0.5,
  //       "volume": 105,
  //       "startChar": 37,
  //       "endChar": 38
  //     },
  //     {
  //       "pitch": 62,
  //       "instrument": "acoustic_grand_piano",
  //       "start": 0.5,
  //       "end": 1,
  //       "volume": 95,
  //       "startChar": 38,
  //       "endChar": 39
  //     },
  //     {
  //       "pitch": 64,
  //       "instrument": "acoustic_grand_piano",
  //       "start": 1,
  //       "end": 1.5,
  //       "volume": 95,
  //       "startChar": 39,
  //       "endChar": 40
  //     },
  //     {
  //       "pitch": 65,
  //       "instrument": "acoustic_grand_piano",
  //       "start": 1.5,
  //       "end": 2,
  //       "volume": 95,
  //       "startChar": 40,
  //       "endChar": 41
  //     }
  //   ]
  // ]
}
