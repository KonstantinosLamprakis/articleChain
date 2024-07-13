import { getArticle } from "../contract/read_data.js";

(async function test() {
    console.log(getArticle(1));
})();
