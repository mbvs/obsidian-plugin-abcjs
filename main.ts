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
        renderAbc(el, source, Object.assign(defaultOptions, userOptions));

        if (synth.supportsAudio) {
          console.log("audio okay");
          const audioWidget = document.createElement("div");
          audioWidget.innerHTML = "here goes the audio widget";
          audioWidget.addClass("obsidian-plugin-abcjs-audio");
          audioWidget.id = "audio-widget";
          const widgetNode = el.parentNode.appendChild(audioWidget);

          const synthControl = new synth.SynthController();
          synthControl.load(widgetNode, {
            displayLoop: true,
            displayRestart: true,
            displayPlay: true,
            displayProgress: true,
            displayWarp: true,
          });
        }

        if (error !== null) {
          const errorNode = document.createElement("div");
          errorNode.innerHTML = error;
          errorNode.addClass("obsidian-plugin-abcjs-error");
          el.appendChild(errorNode);
        }
      }
    );
  }

  onunload() {
    console.log("unloading abcjs plugin");
  }
}
