(function() {
  var canvas = document.getElementById('container');
  var THREE = require('three');
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 100);
  var renderer = new THREE.WebGLRenderer({
    canvas : canvas,
    antialias : true
  });

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

  // var grid = new THREE.GridHelper(10, 10);
  // grid.rotation.x = Math.PI / 2;
  // grid.position.z = -0.49;
  // scene.add(grid);

  var fs = require('fs');
  var map = JSON.parse(fs.readFileSync('./map.json', 'utf8'));

  for(z in map)
  {
    //defaults
    color = "0xffffff";
    receiveShadow = true;
    castShadow = true;

    if(map[z].hasOwnProperty('size'))
    {
      geometry = new THREE.BoxGeometry(
        map[z].size.w,
        map[z].size.h,
        map[z].size.d
      );
    }
    else
    {
      throw new Error("Size is not defined for map obect " + z);
    }

    if(map[z].hasOwnProperty('options'))
    {
      if(map[z].options.hasOwnProperty('color'))
      {
        color = map[z].options.color;
      }
      else
      {
        console.log('color not specificed for map object ' + z);
      }

      if(map[z].options.hasOwnProperty('receiveShadow'))
      {
        receiveShadow = map[z].options.receiveShadow;
      }
      else
      {
        console.log('receiveShadow not specificed for map object ' + z);
      }

      if(map[z].options.hasOwnProperty('castShadow'))
      {
        castShadow = map[z].options.castShadow;
      }
      else
      {
        console.log('castShadow not specificed for map object ' + z);
      }
    }

    temp = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({color: color})
    );

    if(map[z].hasOwnProperty('position'))
    {
      temp.position.set(
        map[z].position.x,
        map[z].position.y,
        map[z].position.z
      );
    }
    else
    {
      throw new Error("Position is not defined for map obect " + z);
    }

    temp.castShadow = castShadow;
    temp.receiveShadow = receiveShadow;
    scene.add(temp);
  }

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

    if(enableRotate == 0 || enableRotate == 1)
    {
      if(rotationDirection == 'CCW')
      {
        if(rotationStep < 15)
        {
          character.rotateZ(rotateSpeed);
          rotationStep++;
        }
        else
        {
          rotationStep = 0;
          enableRotate++;

          degrees = Math.round(character.rotation.z * (180 / Math.PI));
          character.rotation.z = degrees * (Math.PI / 180);

          console.log(degrees, character.position.x, character.position.y);

          enableMovement = true;

          if(facing - 1 >= 0)
          {
            facing--;
          }
          else
          {
            facing = 3;
          }
        }
      }
      else if(rotationDirection == 'CW')
      {
        if(rotationStep < 15)
        {
          character.rotateZ(-rotateSpeed);
          rotationStep++;
        }
        else
        {
          rotationStep = 0;
          enableRotate++;

          degrees = Math.round(character.rotation.z * (180 / Math.PI));
          character.rotation.z = degrees * (Math.PI / 180);

          console.log(degrees, character.position.x, character.position.y);

          enableMovement = true;

          if(facing + 1 < faces.length)
          {
            facing++;
          }
          else
          {
            facing = 0;
          }
        }
      }
    }

  	renderer.render(scene, camera);
  }

  render();

  window.addEventListener('resize', function()
  {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  var kd = require('keydrown');

  var moveSpeed = 0.05;
  var rotateSpeed = Math.PI / 30;
  var movePercision = 2;
  var enableRotate = 2;
  var rotationDirection = '';
  var rotationStep = 0;
  var facing = 0;
  var faces = ['N', 'E', 'S', 'W'];
  var enableMovement = true;

  kd.Q.down(function()
  {
    if(enableRotate == 2)
    {
      rotationDirection = 'CCW';
      enableRotate = 0;
      enableMovement = false;
    }
  });
  kd.Q.up(function()
  {
    if(enableRotate == 0)
      enableRotate++;
  });
  kd.E.down(function()
  {
    if(enableRotate == 2)
    {
      rotationDirection = 'CW';
      enableRotate = 0;
      enableMovement = false;
    }
  });
  kd.E.up(function()
  {
    if(enableRotate == 0)
      enableRotate++;
  });

  kd.W.down(function(){move('W');});
  kd.A.down(function(){move('A');});
  kd.S.down(function(){move('S');});
  kd.D.down(function(){move('D');});

  kd.SHIFT.down(function()
  {
    moveSpeed = 0.1;
  });
  kd.SHIFT.up(function()
  {
    moveSpeed = 0.05;
  });
  kd.run(function()
  {
    kd.tick();
  });

  function move(moveDirection)
  {
    if(enableMovement)
    {
      x = parseFloat(character.position.x.toFixed(movePercision));
      y = parseFloat(character.position.y.toFixed(movePercision));

      if(facing == 0)
      {
        if(moveDirection == 'W')
          y += moveSpeed;
        else if(moveDirection == 'A')
          x -= moveSpeed;
        else if(moveDirection == 'S')
          y -= moveSpeed;
        else if(moveDirection == 'D')
          x += moveSpeed;
      }
      else if(facing == 1)
      {
        if(moveDirection == 'W')
          x += moveSpeed;
        else if(moveDirection == 'A')
          y += moveSpeed;
        else if(moveDirection == 'S')
          x -= moveSpeed;
        else if(moveDirection == 'D')
          y -= moveSpeed;
      }
      else if(facing == 2)
      {
        if(moveDirection == 'W')
          y -= moveSpeed;
        else if(moveDirection == 'A')
          x += moveSpeed;
        else if(moveDirection == 'S')
          y += moveSpeed;
        else if(moveDirection == 'D')
          x -= moveSpeed;
      }
      else if(facing == 3)
      {
        if(moveDirection == 'W')
          x -= moveSpeed;
        else if(moveDirection == 'A')
          y -= moveSpeed;
        else if(moveDirection == 'S')
          x += moveSpeed;
        else if(moveDirection == 'D')
          y += moveSpeed;
      }

      cw = character.scale.x;
      ch = character.scale.y;

      cx = x - (cw / 2);
      cy = y - (ch / 2);

      //innocent until proven guilty
      for(z in map)
      {
        mw = map[z].size.w;
        mh = map[z].size.h;
        mx = map[z].position.x - (mw / 2);
        my = map[z].position.y - (mh / 2);

        if(cx < mx + mw && cx + cw > mx && cy < my + mh && cy + ch > my)
          return false;
      }

      cx += (cw / 2);
      cy += (ch / 2);

      character.position.x = parseFloat(cx.toFixed(movePercision));
      character.position.y = parseFloat(cy.toFixed(movePercision));
    }
    else
    {
      return false;
    }
  }
})();
