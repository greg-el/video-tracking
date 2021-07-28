import { events } from "../events";
import { properties } from "../properties";
import { trackSelfDescribingEvent } from '@snowplow/browser-tracker';


export default function TrackVideo(videoId) {
  const videoEvents = [];
  const videoProperties = {};

  function findVideoElem() {
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
      console.info("Couldn't find a child element with tag 'VIDEO'");
    }
    // Plyr loads in an initial blank video pointing towards https://cdn.plyr.io/static/blank.mp4
    // so we need to check to see when currentSrc updates
    if (elem.currentSrc === "https://cdn.plyr.io/static/blank.mp4" || elem.currentSrc === "") {
      setTimeout(_ => findVideoElem(), 1000);
    } else {
      getData(elem);
    }
  }

  function eventHandler(e) {
    videoEvents.unshift(e.type);
  }

  function getData(videoElem) {
    for (let v of Object.values(events)) {
      videoElem.addEventListener(v, eventHandler)
    }
    for (let v of Object.values(properties)) {
      videoProperties[v] = () => { return videoElem[v].toString() }
    }
  }

  findVideoElem();
  setInterval(() => console.log(videoEvents), 1000);
  setInterval(() => console.log(videoProperties), 1000)


}
