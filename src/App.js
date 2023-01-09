import logo from './logo.svg'
// import './App.css'

// Import dependencies
import React, { useRef, useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
// // 1. TODO - Import required model here
// // e.g. import * as tfmodel from "@tensorflow-models/tfmodel";
import * as cocossd from '@tensorflow-models/coco-ssd'
import Webcam from 'react-webcam'
import { io } from 'socket.io-client'

// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";
import { drawRect } from './utilities'

function App() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)
  const socket = io.connect('http://localhost:5000')
  // count Persone
  const [count, setCount] = useState(0)

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network
    // e.g. const net = await cocossd.load();
    const net = await cocossd.load()
    //  Loop and detect hands
    setInterval(() => {
      detect(net)
    }, 10)
  }
  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== 'undefined' &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight
      // Set video width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight
      // Set canvas height and width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight
      // 4. TODO - Make Detections
      // e.g. const obj = await net.detect(video);
      const obj = await net.detect(video)
      setCount(obj.length)

      obj.forEach((element) => {
        console.log(element)
        // console.log(element.class === 'person');
        if (element.class === 'person') {
          socket.emit('ping', true)
          console.log('INi orang')
        } else if (element.class['person'] === '') {
          socket.emit('dead', false)
        } else {
          socket.emit('dead', false)
          console.log('ini bukan orang')
        }
      })
      setCount(obj.length)

      // Draw mesh
      const ctx = canvasRef.current.getContext('2d')
      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)
      drawRect(obj, ctx)
    }
  }
  useEffect(() => {
    runCoco()
  }, [])
  return (
    <>
      <div className="relative container md:mx-auto p-6">
        {/* flex Container */}
        <div className="flex items-center justify-between">
          <div className="pt-2">
            <h2 className="md:text-3xl">Smart Lamp Human Detection</h2>
          </div>
        </div>

        {/* Section Content */}
        <div className="container md:mx-auto">
          <div className="flex flex-col px-4 mx-auto mt-10 space-y-12 md:space-y-0 md:flex-row">
            <div className="w-2/3">
              <canvas ref={canvasRef} className="absolute ml-auto mr-auto" />
              <Webcam ref={webcamRef} muted={true} />
            </div>
            <div className="w-1/3">
              <div className="w-full border-spacing-1">
                <h3 className="font-semibold">
                  Jumlah Object Terdeteksi: {count}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
