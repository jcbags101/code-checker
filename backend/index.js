import express, { urlencoded } from "express";
import formatter from "code-formatter";
import * as cheerio from "cheerio";
import axios from "axios";
import cors from "cors";
import jsdom from "jsdom";
const { JSDOM } = jsdom;
const app = express();
const port = 3001;
import DomParser from "dom-parser";
import e from "express";
var parser = new DomParser();
import _ from "lodash";
import hiff from "hiff";

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(express.json());

function codeCleaner(codeToClear) {
  var cleanCode = [];
  for (var i = 0; i < codeToClear.length; i++) {
    if (/\S/.test(codeToClear[i])) {
      cleanCode.push(codeToClear[i].replace(/\s\s+/g, " ").trim());
    }
  }
  return cleanCode;
}

function diffChecker(firstDOM, secondDOM) {
  var firstDOMcode = codeCleaner(firstDOM.split("\n")) || [],
    secondDOMcode = codeCleaner(secondDOM.split("\n")),
    codeLineDifference = [];

  for (var i = 0; i < secondDOMcode.length; i++) {
    if (secondDOMcode[i] !== firstDOMcode[i]) {
      codeLineDifference.push(i);
    }
  }
  return { codeLineDifference, secondDOMcode, firstDOMcode };
}

app.post("/data", async (req, res) => {
  try {
    const url = req.body.site;

    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    // $("*").text().replace("");
    const arr = [];

    $("*").each(function (index, element) {
      // iterate over all elements
      this.attribs = {}; // remove all attributes
      //let words = $(element).text().trim();
      //$(element).text().trim().replace(words, "");
      //console.log($(element).text().trim());
      arr.push(element);
    });

    // console.log(arr);
    var html = $.html();

    //const nn = cheerio.load(arr);

    // const tests = $("*")
    //   .each(function () {
    //     // iterate over all elements
    //     this.attribs = {}; // remove all attributes
    //     return this;
    //   })
    //   .toArray();

    // console.log(tests);

    // const parsedHtml = $.parseHTML();

    const result = formatter(html, {
      method: "html",
    });
    //const dom = new JSDOM(html);
    //console.log(dom.window.document.querySelector("p").textContent);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/diff", async (req, res) => {
  try {
    const url1 = req.body.site1;
    const url2 = req.body.site2;

    const response1 = await axios.get(url1);
    const response2 = await axios.get(url2);

    const $1 = cheerio.load(response1.data);

    $1("*").each(function () {
      // iterate over all elements
      this.attribs = {}; // remove all attributes
    });

    var html1 = $1.html();

    const $2 = cheerio.load(response2.data);

    $2("*").each(function (index, node) {
      // iterate over all elements
      this.attribs = {}; // remove all attributes
    });

    //$2.replace(/\s/g, "");

    var html2 = $2.html();

    const fresult = formatter(html1, {
      method: "html",
    });

    const fresult1 = formatter(html2, {
      method: "html",
    });
    const result = diffChecker(fresult, fresult1);

    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/elements", async (req, res) => {
  try {
    const url = req.body.site;

    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    $("*").each(function () {
      // iterate over all elements
      this.attribs = {}; // remove all attributes
    });

    var html = $.html();

    // const filtered = [];
    // const cleanedCode = codeCleaner(response.data.split("\n"));

    // for (var i = 0, len = cleanedCode.length; i < len; i++) {
    //   var el = removeAttributes(cleanedCode[i]);
    //   filtered.push(el);
    // }

    const result = formatter(html, {
      method: "html",
    });

    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/getNodes", async (req, res) => {
  try {
    const url = req.body.site;

    const response = await axios.get(url);

    const $ = cheerio.load(response.data);

    var html = $.html();

    const newHtml = cheerio.load(`<html>
        <head></head>
        <body>
          <ul id="fruits">
            <li class="apple">Apple</li>
            <li class="orange">Orange</li>
            <li class="pear">Pear</li>
          </ul>
        </body>
      </html>
  `);

    var dom = parser.parseFromString(response.data);

    //var nodeTree = getNodeTree(newHtml);
    console.log(typeof dom.rawHTML);

    function getNodeTree(node) {
      if (node.hasChildNodes()) {
        var children = [];
        for (var j = 0; j < node.childNodes.length; j++) {
          children.push(getNodeTree(node.childNodes[j]));
        }

        return {
          nodeName: node.nodeName,
          parentName: node.parentNode.nodeName,
          children: children,
          content: node.innerText || "",
        };
      }

      return false;
    }

    // let document = response.data;

    // var dom = parser.parseFromString(response.data);

    // const d = html.getElementsByTagName("*");

    console.log(html.length);

    const nodeArray = [];

    // function getChildNodes(element) {
    //   //console.log(element.childNodes.length);
    //   // const cn = [];
    //   $(element.childNodes).map((index, node) => {
    //     if (_.isArray(node.children)) {
    //       getChildNodes(node);
    //     } else {
    //       console.log($(node).name);
    //     }
    //   });
    //   // cn.push(element);

    //   // return cn;
    // }

    // newHtml("*").map((index, el) => {
    //   if (el.childNodes.length > 1) {
    //     getChildNodes(el);
    //   }
    //   nodeArray.push({
    //     index,
    //     name: el.tagName,
    //     //parentNode: el.parentNode,
    //     childNodesCount: el.childNodes.length,
    //     //childNodes: el.childNodes,
    //   });
    // });

    // function getNodes(node, parent = "html") {
    //   for (let i = 0; i < node.childNodes.length; i++) {
    //     nodeArray.push(node.childNodes[i]);
    //   }
    // }

    //getNodes(dom.getElementsByTagName("*"));

    res.send(nodeArray);
  } catch (error) {
    console.log(error);
  }
});

app.post("/hiff", async (req, res) => {
  try {
    const url1 = req.body.site1;
    const url2 = req.body.site2;

    const response1 = await axios.get(url1);
    const response2 = await axios.get(url2);

    // const firstDOM = req.body.dom;
    // const secondDOM = req.body.dom1;
    // const result = hiff.compare(firstDOM, secondDOM);
    const result = hiff.compare(response1.data, response2.data);
    //console.log(result);
    res.send(result);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
