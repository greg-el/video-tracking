import React from "react";
import './App.css';

import "video.js/dist/video-js.css";

import VideoJS from "./component/VideoJS";
import Plyr from 'plyr-react'
import 'plyr-react/dist/plyr.css'

import { newTracker } from '@snowplow/browser-tracker';
import TrackVideo from "./component/TrackVideo";

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      videoJsOptions: {
        autoplay: false,
        controls: true,
        fluid: true,
        sources: {
          src: 'test_video.mp4'
        },
      },
      plyrSource: {
        type: "video",
        sources: [{
          src: 'test_video.mp4'
        }],
      },
    }
  }
  onSuccess(s) {
    console.log(s);
  }

  componentDidMount() {
    newTracker('sp2', 'localhost:9090', { 
      appId: 'video-tracker',
      plugins: [ ],
    })
    TrackVideo("html5");
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="row-label">HTML5</div>
          <div className="row-content">
            <div className="video-container">
              <video id="html5" width="100%" src="test_video.mp4" controls></video>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="row-label">VideoJs</div>
          <div className="row-content">
            <div className="video-container">
              <VideoJS id="videojs" {...this.state.videoJsOptions} />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="row-label">Plyr</div>
          <div className="row-content">
            <div id="plyr" className="video-container">
              <Plyr source={this.state.plyrSource}></Plyr>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
