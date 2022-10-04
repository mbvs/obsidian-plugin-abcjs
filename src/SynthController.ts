import {
	AudioControlParams,
    synth, SynthObjectController, SynthVisualOptions, 
  } from "abcjs";
import CursorController from "./CursorController";
import WidgetController from "./WidgetController";

export default class SynthController extends synth.SynthController implements SynthObjectController {


    constructor() {
        super()
		this.disable(true);
        console.log('extended SynthController instantiated')
    }

    init = function(widgetControl: WidgetController, cursorControl: CursorController) {
		this.control = widgetControl;
		this.control.setDelegate(this as AudioControlParams);
		this.cursorControl = cursorControl;

	};

	loopHandler = this.toggleLoop;
	restartHandler = this.restart;
	playPromiseHandler = this.play;
	progressHandler = () => {}; //this.randomAccess;
	warpHandler = this.setWarp;
	afterResume = this.init;
}