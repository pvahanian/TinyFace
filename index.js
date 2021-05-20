//Global video tag
let vid = document.getElementById('camera-stream')

//Get video loaded once window has loaded
window.onload = function() {
  // Grab all the models from tinyface and face recognition
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models')
    ])
    .then(getMedia)

//***
// 
// Function:Ask user to use camera and set it to video element called 'camera-stream'
// 
//*** 
function getMedia() {
    navigator.mediaDevices.getUserMedia({ 
        audio: false,
        video: true
    }).then(stream =>{
        vid.srcObject = stream
    })
    .catch(console.error) 
}

getMedia()

}

//Once video has loaded we will run the TinyFace Api
vid.addEventListener('play', () => {
    const displaySize = { width: vid.width, height: vid.height }
    const canvas = faceapi.createCanvasFromMedia(vid)
    //***
    // 
    // Function:Creates canvas element on top of our video element,Size is pulled from the vid properties  
    // 
    //*** 

    const createFaceBox =()=>{
        document.body.append(canvas)
        faceapi.matchDimensions(canvas, displaySize)
    }
    createFaceBox()

    setInterval(async () => {
    //Gets our detections results from webcam every 100ms and sets it to detections. 
    //FaceLandmarks and FaceExpressions will also get their respective data from faceapi
    const detections = await faceapi.detectAllFaces(vid, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    
    //This will take detections from faceapi and set them equal to resized values from detections and displaySize we created above
    const resizedDetections = faceapi.resizeResults(detections, displaySize)

    //We need to clear the canvas so the boxes drawing to the screen don't overlap on themselves
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    //Draws the detections,landmarks,and expressions to canvas being passed in.
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
}, 100)

})