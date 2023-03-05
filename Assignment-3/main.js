let time = 0.0;

function init() {
  var canvas = document.getElementById("webgl-canvas");
  gl = canvas.getContext("webgl2");
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  cube = new Cube (gl);
  requestAnimationFrame(render);
}

function render(now){
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  now *= 0.001;
  deltaTime = now - time ;
  time = now;

  cube.render();
  requestAnimationFrame(render);
}

window.onload = init;