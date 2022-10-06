import {
  AbsoluteElement,
  CursorControl,
  NoteTimingEvent,
  TimingCallbacksDebug,
  TimingCallbacksPosition,
  TimingEvent,
  TuneObject,
  VoiceItem,
} from "abcjs";
import SynthController from "./SynthController";

export default class CursorController implements CursorControl {
  rootElement: HTMLElement;
  beatSubdivisions: number = 2;
  cursor: SVGLineElement;
  tempo: Number;
  noteTimingEvents: NoteTimingEvent[];
  currentEventIndex: number;
  requestHandle: any;
  tune: TuneObject;
  animateCursor = true;
  voices: Array<Array<{measureNumber: number, elem: AbsoluteElement}>>;

  constructor(rootElement: HTMLElement, tune: TuneObject) {
    this.rootElement = rootElement;
    this.tune = tune;
  }

  /**
   * Livecycle Event
   *
   * called when audiocontext is successfully filled
   * (actually called with SynthController as arg, but missing in interface)
   */
  onReady() {
    if (!this.cursor) {
      // create the cursor and add it to the sheet music's svg.
      this.cursor = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      this.cursor.setAttribute("class", "music-abc-cursor hide");
      this.rootElement
        .querySelector("svg")
        .insertAdjacentElement("afterbegin", this.cursor);
    }
  }

  /**
   * Livecycle Event
   *
   * called when play button is pressed
   */
  onStart() {
    console.log("start");
    this.currentEventIndex = -1;
    this.cursor.setAttributeNS(null, "x1", "0");
    this.cursor.setAttributeNS(null, "y1", "0");
    this.cursor.setAttributeNS(null, "x2", "0");
    this.cursor.setAttributeNS(null, "y2", "0");
    this.cursor.classList.remove("hide");
    this.removeHighlights();
  }

  /**
   * Livecycle Event
   *
   * called when a note/rest event is reached
   */
  onEvent(currentEvent: NoteTimingEvent) {
    let jump: boolean = false;

    // handle note highlights
    this.removeHighlights();
    for (var i = 0; i < currentEvent.elements.length; i++) {
      var note = currentEvent.elements[i];
      for (var j = 0; j < note.length; j++) {
        note[j].classList.add("music-abc-note-highlight");
      }
    }

    this.currentEventIndex++;
    let nextEvent = this.noteTimingEvents[this.currentEventIndex + 1];

    // console.log("currentEvent:", this.noteTimingEvents[this.currentEventIndex]);
    // console.log(
    //   "nextEvent:",
    //   this.noteTimingEvents[this.currentEventIndex + 1]
    // );
    jump = currentEvent.line != nextEvent.line;
    jump =
      jump ||
      (nextEvent.measureNumber != currentEvent.measureNumber &&
        nextEvent.measureNumber - currentEvent.measureNumber != 1);
    jump = jump || currentEvent.type === "end";

    const curX = currentEvent.left;
    const curT = currentEvent.milliseconds;
    const nextX = !jump
      ? nextEvent.left
      : this.getEndBarlinePos(currentEvent.measureNumber) - 12;
    const nextT = nextEvent.milliseconds;
    const deltaT = nextT - curT;
    const deltaX = nextX - curX;
    const stepsPerMs = deltaX / deltaT;
    let start: any = undefined;

    // animate cursor
    if (this.animateCursor) {
      const step = (now: any) => {
        start = start == undefined ? now : start;
        const elapsed = now - start;
        const posX = (currentEvent.left + elapsed * stepsPerMs + 6).toString();
        this.cursor.setAttribute("x1", posX);
        this.cursor.setAttribute("x2", posX);
        this.cursor.setAttribute("y1", currentEvent.top.toString());
        this.cursor.setAttribute(
          "y2",
          (currentEvent.top + currentEvent.height).toString()
        );

        if (elapsed < deltaT) this.requestHandle = requestAnimationFrame(step);
      };
      cancelAnimationFrame(this.requestHandle);
      this.requestHandle = requestAnimationFrame(step);
    } else {
      const posX = (currentEvent.left + 6).toString();
      this.cursor.setAttribute("x1", posX);
      this.cursor.setAttribute("x2", posX);
      this.cursor.setAttribute("y1", currentEvent.top.toString());
      this.cursor.setAttribute(
        "y2",
        (currentEvent.top + currentEvent.height).toString()
      );
    }
  }

  /**
   * Livecycle Event
   *
   * called beatsubdivision times for every beat
   */
  onBeat(
    beatNumber: number,
    totalBeats: number,
    totalTime: number,
    position: TimingCallbacksPosition,
    debugInfo: TimingCallbacksDebug
  ) {}

  /**
   * Livecycle Event
   *
   * called only when tune is played until the end
   */
  onFinished() {
    //console.log("finish");
    // clean up
    this.removeHighlights();
    this.cursor.classList.add("hide");
    // this.rootElement.querySelector("svg").removeChild(this.cursor);
    // this.cursor = null;
  }

  /**
   * Clear tangeling highlights
   */
  private removeHighlights = function () {
    var lastSelection = this.rootElement.querySelectorAll(
      ".music-abc-note-highlight"
    );
    for (var k = 0; k < lastSelection.length; k++)
      lastSelection[k].classList.remove("music-abc-note-highlight");
  };

  private getEndBarlinePos(measure: number) {
    this.voices = this.voices || this.tune.makeVoicesArray();
    const measureItems = this.voices[0].filter((item) => {
      return item.measureNumber === measure;
    });

    console.log(measureItems);

    if (measureItems.last().elem.type === "bar") {
      console.log(measureItems.last().elem.x);
      return measureItems.last().elem.x;
    } else {
      console.error("could not find EndBarLine");
    }
    return 0;
  }
}
