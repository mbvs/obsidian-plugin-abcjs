import {
  CursorControl,
  NoteTimingEvent,
  TimingCallbacksDebug,
  TimingCallbacksPosition,
} from "abcjs";

export default class CursorController implements CursorControl {
  rootElement: HTMLElement;
  beatSubdivisions: number = 2;
  cursor: SVGLineElement;

  constructor(rootElement: HTMLElement) {
    this.rootElement = rootElement;
  }

  /**
   * Livecycle Event
   * 
   * called when audiocontext is successfully filled
   */
  onReady() {
    console.log("ready");
    if (!this.cursor) {
      // create the cursor and add it to the sheet music's svg.
      this.cursor = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      this.cursor.setAttribute("class", "abcjs-cursor");
      this.rootElement.querySelector("svg").appendChild(this.cursor);
    }
  }

  /**
   * Livecycle Event
   * 
   * called when play button is pressed
   */
  onStart() {
    console.log("start");
    this.cursor.setAttributeNS(null, "x1", "0");
    this.cursor.setAttributeNS(null, "y1", "0");
    this.cursor.setAttributeNS(null, "x2", "0");
    this.cursor.setAttributeNS(null, "y2", "0");

    this.removeHighlights();
  }

  /**
   * Livecycle Event
   * 
   * called when a note/rest event is reached
   */
  onEvent(event: NoteTimingEvent) {
    this.removeHighlights();

    // move the cursor to the location of the current note
    // TODO: animate cursor
    this.cursor.setAttribute("x1", (event.left + event.width / 2).toString());
    this.cursor.setAttribute("x2", (event.left + event.width / 2).toString());
    this.cursor.setAttribute("y1", event.top.toString());
    this.cursor.setAttribute("y2", (event.top + event.height).toString());
    this.cursor.setAttribute("style", `stroke-width: ${event.width + 6}`);

    // highlight the currently selected notes
    for (var i = 0; i < event.elements.length; i++) {
      var note = event.elements[i];
      for (var j = 0; j < note.length; j++) {
        note[j].classList.add("abcjs-highlight");
      }
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
  ) {
  }

  /**
   * Livecycle Event
   * 
   * called only when tune is played until the end
   */
  onFinished() {
    console.log("finish");
    // clean up
    this.removeHighlights();
    this.rootElement.querySelector("svg").removeChild(this.cursor);
    this.cursor = null;
  }

  /**
   * Clear tangeling highlights
   */
  private removeHighlights = function () {
    var lastSelection = this.rootElement.querySelectorAll(".abcjs-highlight");
    for (var k = 0; k < lastSelection.length; k++)
      lastSelection[k].classList.remove("abcjs-highlight");
  };
}
