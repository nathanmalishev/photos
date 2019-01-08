import React, { Component } from 'react';
import { title, footer_message, bucket, region, root_photos_key } from './meta.json'
import './App.css';
import StackGrid, { transitions, easings } from "react-stack-grid";
import AWS from 'aws-sdk'
console.log(bucket, region)
AWS.config.update({region, 
  credentials: 
  /* for all you criminals this is a dead key - easiest mandatory auth */
  { accessKeyId: "AKIAJAAUHZHDIIL53BQQ", secretAccessKey: "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"}
})
var s3 = new AWS.S3(
  {
    apiVersion: '2006-03-01'
  }
)
const transition = transitions.scaleDown;


/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 * quick and dirty from - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      photos: [],
    }
  }

  componentDidMount() {
    // fetch all images in root
    var params = {
      Bucket: bucket,
      Prefix: root_photos_key
    }
    s3.listObjectsV2(params, (err, res) => {
      if(err) console.log(err);
      else {
        console.log(res)

        var photos = res.Contents.filter( (photo_meta) => {
          return photo_meta.Key !== `${root_photos_key}/`
        })
        shuffleArray(photos) // make the site a bit interesting - shuffle photos for visitors
        this.setState({photos})
      }
    })

  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            {title}
          </p>
        </header>
      

      <StackGrid
        monitorImagesLoaded
        columnWidth={300}
        duration={600}
        gutterWidth={5}
        gutterHeight={10}
    easing={easings.cubicOut}
    appear={transition.appear}
    appearDelay={60}
    appeared={transition.appeared}
    enter={transition.enter}
    entered={transition.entered}
    leaved={transition.leaved}
 
      >
        {
          this.state.photos.map( (photo) => {
            return (<div className="image2" key={photo.Key}>
              <img src={`https://s3-${region}.amazonaws.com/${bucket}/${photo.Key}`} />
            </div>)
          })
        }
      </StackGrid>


      <footer>
        <p> {footer_message }</p>
      </footer>

      </div>
    );
  }
}

export default App;
