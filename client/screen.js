(function() {
  var canvas = document.getElementById('container');
  var THREE = require('three');
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
  var renderer = new THREE.WebGLRenderer({canvas : canvas, antialias : true});

  renderer.setClearColor(0x2c3e50);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMapEnabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  var cube = new THREE.BoxGeometry(1, 1, 1);
  var material = new THREE.MeshLambertMaterial({color: 0xffffff});
  var character = new THREE.Mesh(cube, material);
  character.position = {x:0,y:0,z:0};
  character.castShadow = true;
  character.receiveShadow = true;

  scene.add(character);
  camera.position.z = 5;
  character.add(camera);

  // var fs = require('fs');
  // var map = JSON.parse(fs.readFileSync('./map.json', 'utf8'));

  floor = new THREE.BoxGeometry(9, 9, 1);
  floorMaterial = new THREE.MeshLambertMaterial({color: 0xe67e22});
  floorMesh = new THREE.Mesh(floor, floorMaterial);
  floorMesh.receiveShadow = true;
  floorMesh.position.z = -1;
  scene.add(floorMesh);

  light = new THREE.PointLight(0xffee88, 1.5, 10);
  light.position.set(0, 0, 1);
  light.castShadow = true;
  scene.add(light);

  helper = new THREE.PointLightHelper( light );
  scene.add( helper );

  light = new THREE.AmbientLight(0x404040);
  scene.add(light);

  function render()
  {
  	requestAnimationFrame(render);

  	renderer.render(scene, camera);
  }

  render();

  window.addEventListener('wheel', function(event)
  {
    var delta;

    if(event.wheelDelta)
    {
      delta = event.wheelDelta;
    }
    else
    {
      delta = -1 * event.deltaY;
    }

    if(delta < 0)
    {
      console.log("DOWN");
    }
    else if (delta > 0)
    {
      console.log("UP");
    }
  });

  window.addEventListener('resize', function()
  {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  var kd = require('keydrown');

  kd.W.down(function(){});
  kd.A.down(function(){});
  kd.S.down(function(){});
  kd.D.down(function(){});

  kd.run(function()
  {
    kd.tick();
  });
})();
