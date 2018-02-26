//通过CommonJS规范导入css模块
require("./main.scss");
//通过CommonJS规范导入json模块
const json = require("./data.json");
//通过CommonJS规范导入show函数
const show = require("./show.js");
//执行show函数
show(json.data);
console.log("demo")