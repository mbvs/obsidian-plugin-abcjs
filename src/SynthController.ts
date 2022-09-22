import {
    synth, SynthVisualOptions
  } from "abcjs";
import CursorController from "./CursorController";
import SynthWidget from "./SynthWidget";

export default class SynthController extends synth.SynthController {

    constructor() {
        super()
        console.log('extended SynthController instantiated')
    }

    load = function (selector: string | HTMLElement, cursorControl?: CursorController, visualOptions?: SynthVisualOptions) {
		if (!visualOptions)
			visualOptions = {};
		this.control = new SynthWidget(selector, {
			loopHandler: visualOptions.displayLoop ? this.toggleLoop : undefined,
			restartHandler: visualOptions.displayRestart ? this.restart : undefined,
			playPromiseHandler: visualOptions.displayPlay ? this.play : undefined,
			progressHandler: visualOptions.displayProgress ? this.randomAccess : undefined,
			warpHandler: visualOptions.displayWarp ? this.onWarp : undefined,
			afterResume: this.init
		});
		this.cursorControl = cursorControl;
		this.disable(true);
	};
}