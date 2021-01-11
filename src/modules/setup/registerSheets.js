import logger from "../../util/logger.js";
import config from "../../config/index.js";
//import EditorUI from "../../apps/EditorUI.js";
import App from "../editor/App.js";

export default function () {
  let sheetNames = Object.values(CONFIG.Actor.sheetClasses)
    .reduce((arr, classes) => {
      return arr.concat(Object.values(classes).map((c) => c.cls));
    }, [])
    .map((cls) => cls.name);

  logger.info("Registering sheets", sheetNames);

  // register tokenizer on all character (npc and pc) sheets
  sheetNames.forEach((sheetName) => {
    Hooks.on("render" + sheetName, (app, html, data) => {
      logger.info(`Sheet ${sheetName} rendered. Registering Hook`);

      $(html)
        .find(
          config.sheets.profileImageClasses.map((cls) => `img${cls}`).join(", ")
        )
        .each((index, image) => {
          // // create a new editor for this actor
          // const editorUI = new EditorUI({}, app.entity);

          const editor = new App({}, app.entity);
          const headerButton = $(
            `<div class="vtta button"><img src="modules/vtta-core/public/img/vtta-logo.svg">Edit Token</div>`
          );

          $(headerButton).insertBefore(
            $(html).find("header.window-header a").first()
          );

          $(headerButton).on("click", (event) => {
            event.preventDefault();
            if (editor.rendered) {
              editor.bringToTop();
            } else {
              editor.render(true);
            }
          });
        });
    });
  });
}
