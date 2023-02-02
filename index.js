let shapes = [];
let newshapes = [];
function setup() {
  createCanvas(1024, 1024);
  colorMode(HSB);
  newshapes.push(new Octagon([0, 0], width/2, h))
}

let s = 1;
let h = 0;
function draw() {
  const translation = [(width+mouseX*2)/4, (height+mouseY*2)/4]
  translate(...translation)
  s *= mouseIsPressed ? (mouseButton === LEFT ? 12/11 : 11/12) : 1.001;
  scale(s);
  background(0);
  
  // Draw shapes
  strokeWeight(12/s)
  shapes.forEach(t=>t.draw());
  newshapes.forEach(t=>t.draw());
  
  // Check for bounds
  shapes = shapes.filter(a=>
    a.isInBounds(-translation[0]/s, -translation[1]/s, width*2/s, height*2/s)
  )
  
  // Generate new shapes
  if (newshapes.length > 0 && newshapes[0].radius*s > 300 && shapes.length < 8**3) {
    let seeds = newshapes.filter(a=>
      a.isInBounds(-translation[0]/s, -translation[1]/s, width*2/s, height*2/s)
    );
    if (seeds.length <= 0) return;
    shapes = [...shapes, ...seeds];
    h+=30; h%=255;
    newshapes = seeds.flatMap(t=>t.nextShapes(h)).filter(a=>
      a.isInBounds(-translation[0]/s, -translation[1]/s, width*2/s, height*2/s)
    );
  }
}

class Octagon {
  constructor(c, r, h) {
    this.center = c;
    this.radius = r;
    this.vertices = Array.from({length: 8}, (_,n)=>n*PI/4)
      .map(i=>[this.center[0]+r*Math.cos(i), this.center[1]+r*Math.sin(i)]);
    this.hue = h;
  }
  
  draw() {
    stroke(this.hue, 255, 255)
    noFill()
    beginShape()
    this.vertices.forEach(v=>vertex(...v))
    endShape(CLOSE)
  }
  
  isInBounds(x,y,w,h) {
    return this.vertices.some(p=>p[0]>x&&p[0]<x+h&&p[1]>y&&p[1]<y+h);
  }
  
  nextShapes(h) {
    return this.vertices.map(v=>new Octagon(v, this.radius/2, h));
  }
}