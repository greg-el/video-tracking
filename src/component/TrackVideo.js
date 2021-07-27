import { events } from "../events";
import { properties } from "../properties";

export default async function TrackVideo(videoId) {
  const videoEvents = [];
  let videoProperties = {};

  function searchChildTreeForVideoTag(children) {
    let queue = [...children];
    while (queue.length >= 1) {
      let c = queue.shift();
      if (c.tagName === "VIDEO") {
        return c;
      } else {
        queue.push(...c.childNodes);
      }
    }
    return false;
  }

  async function findVideoElem() {
    let elem = document.getElementById(videoId);
    if (elem === null) {
      console.info("Couldn't find passed video id");
      return;
    }
    if (elem.tagName !== "VIDEO") {
      // Some libraries i.e. VideoJS won't create the video element
      // on the id given to the component, so we need to search down
      // the DOM tree for the raw HTML5 video tag
      elem = elem.getElementsByTagName("VIDEO")[0];
    }
    if (elem === null) {
      console.info("Couldn't find passed video id");
    }
    // Plyr loads in an initial blank video pointing towards https://cdn.plyr.io/static/blank.mp4
    // so we need to check to see when currentSrc updates
    if (elem.currentSrc === "https://cdn.plyr.io/static/blank.mp4" || elem.currentSrc === "") {
      setTimeout(_ => findVideoElem(), 1000);
    } else {
      return elem;
    }
  }

  function eventHandler(e) {
    videoEvents.unshift(e.type);
  }

  async function getData(videoElem) {
    for (let v of Object.values(events)) {
      videoElem?.addEventListener(v, eventHandler)
    }
    let tempProps = {};
    for (let v of Object.values(properties)) {
      tempProps[v] = () => { return videoElem[v]?.toString() }
    }
    videoProperties = tempProps;
  }

  const setup = async() => {
    await findVideoElem().then(e => console.log(e))
  }

  setup();
  //setInterval(() => console.log(videoEvents), 1000);
  function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('2...');
  await sleep(2000);
  console.log('3...');
}

document.writeln('1...');
demo().then(() => {
    console.log('4.');
});
}
