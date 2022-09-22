
import { AudioControlParams } from "abcjs";
import { Selector } from "abcjs";
import { synth } from "abcjs";


export default class SynthWidget extends synth.CreateSynthControl {

    constructor(selector: Selector, opts: AudioControlParams) {
        super(selector, opts)
        console.log('extended SynthWidget instantiated')
    }
}