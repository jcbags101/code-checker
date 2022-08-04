import axios from "axios";
import { useState } from "react";
import "./App.css";
import { DiffDOM } from "diff-dom";
import { visualDomDiff } from "visual-dom-diff";

function App() {
  const [dom, setDom] = useState("");
  const [dom1, setDom1] = useState("");
  const [dom2, setDom2] = useState("");
  const [diff, setDiff] = useState({});

  // start visual
  function getLevelNodes(node) {
    return Array.from(node.parentNode.children);
  }

  function getChildIndex(node) {
    return getLevelNodes(node).indexOf(node);
  }

  function tagNodeName(node) {
    node.innerHTML = node.nodeName + node.innerHTML;
  }

  function clearInside(node) {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeName === "#text") {
        child.remove();
      }
    });
  }

  function handleImage(node) {
    if (node.nodeName === "IMG") {
      node.src = "";
      node.alt = "IMG";
    }
  }

  function walk(node, cb) {
    cb(node);
    if (node.children.length) {
      walk(node.children[0], cb);
    }
    if (node.nextElementSibling) {
      walk(node.nextElementSibling, cb);
    }
  }

  function init() {
    var $el = document.getElementById("tree");
    walk($el, (node) => {
      var levelNodes = getLevelNodes(node);
      var childIndex = getChildIndex(node);
      console.log(node);
      var width = 90 / levelNodes.length;
      var leftSlice = 100 / levelNodes.length;
      var left = leftSlice * childIndex;
      clearInside(node);
      tagNodeName(node);
      handleImage(node);
      node.style.cssText += `;
      width: ${width}%;
      left: ${left}%;
    `;
    });

    console.log($el);
  }

  //end visual

  async function setDiffColors(diffResult) {
    const dd = new DiffDOM();

    const lines = diffResult.codeLineDifference;
    const resultDom = diffResult.firstDOMcode;
    const resultDom1 = diffResult.secondDOMcode;
    // const diffNode = visualDomDiff(resultDom, resultDom);
    console.log(resultDom.length);
    const tempDom = [];
    const tempDom1 = [];

    for (var i = 0; i < resultDom.length; i++) {
      if (lines.includes(i)) {
        tempDom.push(<span style={{ color: "red" }}>{resultDom[i]}</span>);
        tempDom1.push(<span style={{ color: "red" }}>{resultDom1[i]}</span>);
      } else {
        tempDom.push(resultDom[i]);
        tempDom1.push(resultDom1[i]);
      }
    }

    //  console.log(tempDom1);

    setDom1(tempDom1);
    setDom(tempDom);
  }

  async function getSiteSource(site, btnNum) {
    try {
      axios.post("http://localhost:3001/data", { site }).then((res) => {
        if (btnNum === 3) {
          setDom(res.data);
        } else if (btnNum === 4) {
          setDom1(res.data);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getSiteElements(site) {
    try {
      axios.post("http://localhost:3001/elements", { site }).then((res) => {
        setDom2(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }
  async function getSiteDiff() {
    try {
      const site1 = "https://www.symph.co";
      const site2 = "https://www.symph.co/about";
      axios.post("http://localhost:3001/diff", { site1, site2 }).then((res) => {
        setDiff(res.data);
        setDiffColors(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function getSiteHiff() {
    try {
      axios.post("http://localhost:3001/hiff", { dom, dom1 }).then((res) => {
        console.log(res.data);
        // setDiff(res.data);
        //setDiffColors(res.data);
      });
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="App">
      <div>
        <button onClick={() => getSiteSource("https://symph.co", 3)}>
          Get Url 1
        </button>
        <button onClick={() => getSiteSource("https://symph.co/hiring", 4)}>
          Get Url 2
        </button>
        <button onClick={getSiteDiff}>Get diff</button>
        <button onClick={getSiteHiff}>Get hiff</button>
        <button onClick={init}>Get Visual</button>
        <button onClick={() => getSiteElements("https://www.symph.co")}>
          Get Element
        </button>
      </div>
      {/* {diff && (
        <div style={{ display: "flex" }}>
          <textarea
            style={{
              width: "100%",
              height: "100vh",
              padding: "5px",
              borderBlockColor: "#f6fafd",
            }}
            value={dom2}
          ></textarea>
        </div>
      )}*/}
      <div style={{ display: "flex" }}>
        <textarea
          style={{
            width: "100%",
            height: "100vh",
            padding: "5px",
            borderBlockColor: "#f6fafd",
          }}
          value={dom2}
        ></textarea>
      </div>
      <div id="tree">
        <div>
          <form>
            <p> Subscribe to our Newsletter </p>
            <div>
              <div>
                {" "}
                <button> Submit </button>{" "}
              </div>
            </div>
            <div>
              <div> </div>
              <div> </div>
            </div>
          </form>
        </div>
      </div>
      <div style={{ display: "flex" }}>
        {/* <code
          style={{
            width: "50%",
            maxWidth: "50%",
            height: "100vh",
            padding: "5px",
            borderBlockColor: "#f6fafd",
          }}
        >
          {dom}
        </code> */}
        <code
          style={{
            width: "50%",
            maxWidth: "50%",
            height: "100vh",
            padding: "5px",
            borderBlockColor: "#f6fafd",
          }}
        >
          {dom}
        </code>
        <code
          style={{
            width: "50%",
            maxWidth: "50%",
            height: "100vh",
            padding: "5px",
            backgroundColor: "#e2edf7",
          }}
        >
          {dom1}
        </code>
      </div>
    </div>
  );
}

export default App;
