let video;
let poseNet;
let poseOptions = {
    architecture: 'ResNet50',
    outputStride: 32,
    inputResolution: { width: 257, height: 200 },
    quantBytes: 2
};
let pose;
let skeleton;

let brain;
let state = 'waiting';
let targetLabel;

function delay(time) {
    return new Promise((resolve, reject) => {
        if (isNaN(time)) {
            reject(new Error('delay requires a valid number.'));
        } else {
            setTimeout(resolve, time);
        }
    });
}

async function keyPressed() {
    if (key == 's') {
        brain.saveData();
    } else {
        targetLabel = key;
        document.getElementById('status').innerHTML = 'waiting';
        console.log(targetLabel);
        document.getElementById('selected_label').innerHTML = targetLabel;

        await delay(5000);
        state = 'collecting';
        console.log(state);
        document.getElementById('status').innerHTML = state;

        await delay(15000);
        state = 'waiting';
        console.log('not collecting');
        document.getElementById('status').innerHTML = state;
    }
}

function setup() {
    let canvas = createCanvas(640, 480);
    let options = {
        inputs: 34,
        output: 4,
        task: 'classification',
        debug: true
    }
    canvas.position(350, 100);
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);
    brain = ml5.neuralNetwork(options);
}

function modelLoaded() {
    console.log('Model Ready');
}

function dataReady() {
    brain.normalizeData();
    brain.train({ epochs: 100 }, finished);
}

function gotPoses(poses) {
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
        if (state == 'collecting') {
            let inputs = [];
            for (let i = 0; i < pose.keypoints.length; i++) {
                let x = pose.keypoints[i].position.x;
                let y = pose.keypoints[i].position.y;
                inputs.push(x);
                inputs.push(y);
            }
            let target = [targetLabel];
            brain.addData(inputs, target);
        }
    }
}

function draw() {
    translate(video.width, 0);
    scale(-1, 1);
    image(video, 0, 0, video.width, video.height);
    if (pose) {
        let eyeR = pose.rightEye;
        let eyeL = pose.leftEye;
        let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);
        for (let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x;
            let y = pose.keypoints[i].position.y;
            if (i >= 0 && i < 5) {
                fill(255, 0, 0);
                ellipse(x, y, d / 3);
            }
            else if (i > 8 && i < 11) {
                fill(0, 0, 255);
                ellipse(x, y, d / 3);
            }
            else if (i > 14 && i < 17) {
                fill(0, 0, 255);
                ellipse(x, y, d / 3);
            }
            else {
                fill(0, 255, 0);
                ellipse(x, y, d / 3);
            }
        }
        for (let i = 0; i < skeleton.length; i++) {
            let a = skeleton[i][0];
            let b = skeleton[i][1];
            strokeWeight(2);
            stroke(255, 255, 0);
            line(a.position.x, a.position.y, b.position.x, b.position.y);
        }
    }
}