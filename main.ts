import { Plugin } from "obsidian";
import { renderAbc, AbcVisualParams } from "abcjs";
import ScorePlayer from "src/ScorePlayer";

const optionsRegex = new RegExp(/(?<options>{.*})\n---\n(?<source>.*)/s);
const defaultOptions: AbcVisualParams = {
  add_classes: true,
  responsive: "resize",
};

export default class MusicPlugin extends Plugin {
  onload() {
    this.registerMarkdownCodeBlockProcessor(
      "music-abc",

      async (source: string, el: HTMLElement, ctx) => {

        // parse options
        let userOptions: AbcVisualParams = {};
        const errors = [];
        const optionsMatch = source.match(optionsRegex);
        if (optionsMatch !== null) {
          source = optionsMatch.groups["source"];
          try {
            userOptions = JSON.parse(optionsMatch.groups["options"]);
          } catch (e) {
            console.error(e);
            errors.push(
              `<strong>Failed to parse user-options</strong>\n\t${e}`
            );
          }
        }

        // render score
        const visualObj = renderAbc(
          el,
          source,
          Object.assign(defaultOptions, userOptions)
        );

        // init score player
        try {
          const scorePlayer = new ScorePlayer(visualObj, el);
          await scorePlayer.init();
        } catch (error) {
          errors.push(error);
        }

        if (errors.length > 0) {
          const errorNode = document.createElement("div");
          errorNode.innerHTML = errors.join("\n");
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
