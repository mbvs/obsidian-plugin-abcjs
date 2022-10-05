import {
  CursorControl,
  NoteTimingEvent,
  TimingCallbacksDebug,
  TimingCallbacksPosition,
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

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
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

    // if nextEvent is on another line
    // we need an event which represents the position of the barline

    // if nextEvent is end
    // we need an event which represents the postiion of the barline

    // where to get the position of the barline?
    const lineEnding = nextEvent.line != currentEvent.line || currentEvent.type == 'end';
    const curX = currentEvent.left;
    const curT = currentEvent.milliseconds;
    const nextX = nextEvent.left;
    const nextT = nextEvent.milliseconds;
    const deltaT = nextT - curT;
    const deltaX = nextX - curX;
    const stepsPerMs = deltaX / deltaT;
    let start: any = undefined;

    console.log("currentEvent:", this.noteTimingEvents[this.currentEventIndex]);
    console.log(
      "nextEvent:",
      this.noteTimingEvents[this.currentEventIndex + 1]
    );
    console.log(`deltaX: ${deltaX}, deltaT: ${deltaT}`);

    const step = (now: any) => {
      start = start == undefined ? now : start;
      const elapsed = now - start;
      // console.log(`elapsed: ${elapsed}`);
      const posX = (
        currentEvent.left +
        elapsed * stepsPerMs +
        currentEvent.width / 2
      ).toString();
      this.cursor.setAttribute("x1", posX);
      this.cursor.setAttribute("x2", posX);
      this.cursor.setAttribute("y1", currentEvent.top.toString());
      this.cursor.setAttribute(
        "y2",
        (currentEvent.top + currentEvent.height).toString()
      );
      this.cursor.setAttribute(
        "style",
        `stroke-width: ${currentEvent.width + 6}`
      );

      if (elapsed < deltaT) this.requestHandle = requestAnimationFrame(step);
    };

    cancelAnimationFrame(this.requestHandle);
    this.requestHandle = requestAnimationFrame(step);
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
}
