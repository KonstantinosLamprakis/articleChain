import { getArticle, isJournalist } from "../contract/read_data.js";
import { addJournalist } from "../contract/write_data.js";

(async function test() {
    getArticle(1);
})();
