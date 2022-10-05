import {
  AudioControlParams,
  synth,
  SynthObjectController,
  SynthVisualOptions,
} from "abcjs";
import CursorController from "./CursorController";
import WidgetController from "./WidgetController";

export default class SynthController
  extends synth.SynthController
  implements SynthObjectController
{

  constructor() {
    super();
    this.disable(true);
    console.log("extended SynthController instantiated");
  }

  cursorControl: CursorController;

  init = function (
    widgetControl: WidgetController,
    cursorControl: CursorController
  ) {
    this.control = widgetControl;
    this.control.setDelegate(this as AudioControlParams);
    this.cursorControl = cursorControl;
  };

  async playOrPause(play: boolean) {
    const playResponse = await this.play();
	console.log(playResponse);
    if (play) {
      console.log("tempo: ", this.currentTempo);
      console.log("timings: ", this.timer.noteTimings);
	  this.cursorControl.noteTimingEvents = this.timer.noteTimings;
    }
    return playResponse;
  }

  // implement the delegate protocol (i.e. AudioControlParams interface)
  loopHandler = this.toggleLoop;
  restartHandler = this.restart;
  playPromiseHandler = this.playOrPause;
  progressHandler = () => {}; //this.randomAccess;
  warpHandler = this.setWarp;
  afterResume = () => {};
}
