let video, bodyPose, poses = [];
let armadura, espada, corona, vestido, sombrero, cetro, alas, fuego;
let instructionVideo;
let showCamera = false; // Controla cuándo mostrar la cámara

function preload() {
  armadura = loadImage("assets/armadura.png");
  espada = loadImage("assets/espada.png");
  corona = loadImage("assets/corona.png");
  vestido = loadImage("assets/vestido.png");
  sombrero = loadImage("assets/sombrero.png");
  cetro = loadImage("assets/cetro.png");
  alas = loadImage("assets/alas.png");
  fuego = loadImage("assets/fuego.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  instructionVideo = createVideo(['assets/instrucciones.mp4'], videoReady);
  instructionVideo.size(width, height);
  instructionVideo.hide(); // Ocultar para dibujar manualmente
}

function videoReady() {
  instructionVideo.volume(0); // Silenciar
  instructionVideo.play();
  instructionVideo.onended(startCamera); // Cuando termine, iniciar cámara
}

function startCamera() {
  showCamera = true;

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  bodyPose = ml5.bodyPose(video, { flipped: false }, modelReady); // Ojo: flipped en false
}

function modelReady() {
  console.log("BodyPose cargado");
  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  background(0);

  if (!showCamera) {
    // Mostrar el video de instrucciones respetando 16:9
    let videoAspect = 16 / 9;
    let windowAspect = width / height;
    let drawWidth, drawHeight;

    if (windowAspect > videoAspect) {
      drawHeight = height;
      drawWidth = height * videoAspect;
    } else {
      drawWidth = width;
      drawHeight = width / videoAspect;
    }

    let x = (width - drawWidth) / 2;
    let y = (height - drawHeight) / 2;

    image(instructionVideo, x, y, drawWidth, drawHeight);
    return;
  }

  // Mostrar la cámara SIN espejo
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  if (poses.length > 0) {
    let pose = poses[0].keypoints;

    if (pose.length >= 11) {
      let codoIzq = pose[7];
      let codoDer = pose[8];
      let munecaIzq = pose[9];
      let munecaDer = pose[10];

      // Reflejar las coordenadas X de los keypoints
      let codoIzqX = width - codoIzq.x;
      let codoDerX = width - codoDer.x;
      let munecaIzqX = width - munecaIzq.x;
      let munecaDerX = width - munecaDer.x;

      // PRINCESA: Mano derecha arriba
      if (
        munecaDer.confidence > 0.5 &&
        codoDer.confidence > 0.5 &&
        munecaDer.y < codoDer.y
      ) {
        image(corona, codoDerX - 290, codoDer.y - 365, 130, 60);
        image(vestido, codoDerX - 500, codoDer.y - 200, 700, 800);

      // CABALLERO: Mano izquierda arriba
      } else if (
        munecaIzq.confidence > 0.5 &&
        codoIzq.confidence > 0.5 &&
        munecaIzq.y < codoIzq.y
      ) {
        image(armadura, codoIzqX - 0, codoIzq.y - 205, 500, 500);
        image(espada, munecaIzqX - 120, munecaIzq.y - 320, 200, 450);

      // MAGO: Mano derecha abajo
      } else if (
        munecaDer.confidence > 0.5 &&
        codoDer.confidence > 0.5 &&
        munecaDer.y > codoDer.y + 100
      ) {
        image(sombrero, codoDerX - 345, codoDer.y - 460, 220, 170);
        image(cetro, munecaDerX - 25, munecaDer.y - 500, 200, 600);

      // MONSTRUO: Mano izquierda abajo
      } else if (
        munecaIzq.confidence > 0.5 &&
        codoIzq.confidence > 0.5 &&
        munecaIzq.y > codoIzq.y + 100
      ) {
        image(alas, codoIzqX - 150, codoIzq.y - 400, 700, 550);
        image(fuego, munecaIzqX - 200, munecaIzq.y - 240, 250, 250);
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}