import {
  App,
  MarkdownPostProcessor,
  MarkdownPostProcessorContext,
  MarkdownPreviewRenderer,
  MarkdownRenderer,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";
import { signature, renderAbc, AbcVisualParams, synth } from "abcjs";
import CursorController from "CursorController";

const optionsRegex = new RegExp(/(?<options>{.*})\n---\n(?<source>.*)/s);
const defaultOptions: AbcVisualParams = {
  add_classes: true,
  responsive: "resize",
};

export default class MusicPlugin extends Plugin {
  onload() {
    console.log("loading abcjs plugin");
    this.registerMarkdownCodeBlockProcessor(
      "music-abc",

      async (source: string, el: HTMLElement, ctx) => {
        let userOptions: AbcVisualParams = {};
        let error = null;
        const optionsMatch = source.match(optionsRegex);
        if (optionsMatch !== null) {
          source = optionsMatch.groups["source"];
          try {
            userOptions = JSON.parse(optionsMatch.groups["options"]);
          } catch (e) {
            console.error(e);
            error = `<strong>Failed to parse user-options</strong>\n\t${e}`;
          }
        }
        const visualObj = renderAbc(
          el,
          source,
          Object.assign(defaultOptions, userOptions)
        );

        if (synth.supportsAudio) {
          const audioWidget = document.createElement("div");
          const widgetNode = el.parentNode.appendChild(audioWidget);
          var cursorController = new CursorController(el);

          const synthControl = new synth.SynthController();
          synthControl.load(widgetNode, cursorController, {
            displayLoop: true,
            displayRestart: true,
            displayPlay: true,
            displayProgress: true,
            displayWarp: true,
          });

          const createSynth = new synth.CreateSynth();
          try {
            await createSynth.init({
              visualObj: visualObj[0],
              options: {
                callbackContext: this,
                onEnded: function () {
                  console.log("playback has ended");
                },
				soundFontUrl: "https://paulrosen.github.io/midi-js-soundfonts/MusyngKite/"
              },
            });
            console.log("audio successfully initialized");
            const warning =
              document.getElementsByClassName("abcjs-css-warning");
            warning[0].parentNode.removeChild(warning[0]);
            try {
              await synthControl.setTune(visualObj[0], false, {});
              console.log(`audio loaded successfully`);
            } catch (error) {
              console.warn(`error whild loading audio: ${error}`);
            }
          } catch (error) {
            console.log(`error while initializing audio ${error}`);
          }

          if (error !== null) {
            const errorNode = document.createElement("div");
            errorNode.innerHTML = error;
            errorNode.addClass("obsidian-plugin-abcjs-error");
            el.appendChild(errorNode);
          }
        }
      }
    );
  }

  onunload() {
    console.log("unloading abcjs plugin");
  }
}
