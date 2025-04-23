let video, bodyPose, poses = [];
let armadura, espada, corona, vestido, sombrero, hechizo, alas, fuego;

function preload() {
  armadura = loadImage("assets/armadura.png");
  espada = loadImage("assets/espada.png");
  corona = loadImage("assets/corona.png");
  vestido = loadImage("assets/vestido.png");
  sombrero = loadImage("assets/sombrero.png");
  cetro = loadImage("assets/cetro.png");
  alas = loadImage("assets/alas.png");
  fuego = loadImage("assets/fuego.png");

  bodyPose = ml5.bodyPose({ flipped: true });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO, { flipped: true });
  video.size(width, height);
  video.hide();

  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  image(video, 0, 0, width, height);

  if (poses.length > 0) {
    let pose = poses[0].keypoints;

    if (pose.length >= 11) {
      let codoIzq = pose[7];
      let codoDer = pose[8];
      let munecaIzq = pose[9];
      let munecaDer = pose[10];

      // PRINCESA: Mano derecha arriba
      if (
        munecaDer.confidence > 0.5 &&
        codoDer.confidence > 0.5 &&
        munecaDer.y < codoDer.y
      ) {
        image(corona, codoDer.x - 80, codoDer.y - 150, 150, 100);
        image(vestido, codoDer.x - 100, codoDer.y, 200, 300);

      // CABALLERO: Mano izquierda arriba
      } else if (
        munecaIzq.confidence > 0.5 &&
        codoIzq.confidence > 0.5 &&
        munecaIzq.y < codoIzq.y
      ) {
        image(armadura, codoIzq.x - 150, codoIzq.y - 200, 300, 300);
        image(espada, munecaIzq.x - 50, munecaIzq.y - 100, 100, 200);

      // MAGO: Mano derecha abajo
      } else if (
        munecaDer.confidence > 0.5 &&
        codoDer.confidence > 0.5 &&
        munecaDer.y > codoDer.y + 100
      ) {
        image(sombrero, codoDer.x - 100, codoDer.y - 200, 200, 150);
        image(cetro, munecaDer.x - 50, munecaDer.y - 50, 100, 100);

      // MONSTRUO: Mano izquierda abajo
      } else if (
        munecaIzq.confidence > 0.5 &&
        codoIzq.confidence > 0.5 &&
        munecaIzq.y > codoIzq.y + 100
      ) {
        image(alas, codoIzq.x - 200, codoIzq.y - 150, 400, 300);
        image(fuego, munecaIzq.x - 50, munecaIzq.y - 50, 100, 100);
      }
    }
  }
}
