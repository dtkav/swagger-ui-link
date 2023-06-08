const core = require('@actions/core');
const b64 = require("./base64.js") 
const fs = require("fs");
const deflate = require("./rawdeflate.js") 
const yaml = require('js-yaml'),


checksum = function(string) {
  var chk, chr, i;
  chk = 0;
  for (i in string) {
    chr = string[i];
    chk += chr.charCodeAt(0) * (i + 1);
  }
  return chk % 10;
};
 

async function run() {
  console.log("running")
  try {
    const path = core.getInput('openapi_path');
    const base_url = core.getInput('base_url');
    console.log("reading file...")
    console.log(path)
    let openapi_yaml = fs.readFileSync(path).toString();
    console.log("file read...")
    console.log("converting to json...")
    let openapi_obj = yaml.load(openapi_yaml, {encoding: 'utf-8'});
    let openapi_json = JSON.stringify(openapi_obj)
    console.log("file converted")
    console.log("deflating...")
    let deflated = deflate.deflate(openapi_json);
    console.log("encoding...")
    let base64 = b64.Base64.toBase64(deflated);
    console.log("computing checksum...")
    let check = checksum(base64);
    let encoded = base64 + check;
    let url = base_url + '#' + encoded;
    console.log(url)
    core.setOutput('url', url);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
