THREE.Photosphere = function (domEl, image, options) {
	options = options || {};

	var camera, controls, scene, renderer, sphere;

	var webglSupport = (function(){ 
		try { 
			var canvas = document.createElement( 'canvas' ); 
			return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))); 
		} catch(e) { 
			return false; 
		} 
	})();

	init();
	render();

	function init () {
		// http://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
		camera = new THREE.PerspectiveCamera(options.view || 75, domEl.offsetWidth / domEl.offsetHeight, 1, 1000);
		camera.position.x = options.x || 0.1;
		camera.position.y = options.y || 0;
		/*

		camera.lookAt(new THREE.Vector3(1,0,0));
		camera.up = new THREE.Vector3(1,0,-1);
		*/
		controls = new THREE.OrbitControls(camera);
		controls.noPan = true;
		controls.noZoom = false; 
		controls.autoRotate = true;
		controls.autoRotateSpeed = options.speed || 0.5;
		controls.addEventListener('change', render);
		controls.minDistance = 1;
		controls.maxDistance = Infinity;
		scene = new THREE.Scene();

		var texture = THREE.ImageUtils.loadTexture(image);
		texture.minFilter = THREE.LinearFilter;

		var phongMaterial = new THREE.MeshPhongMaterial({ 
			ambient: 0x555555, 
			color: 0x555555, 
			specular: 0xffffff, 
			shininess: 100, 
			shading: THREE.SmoothShading, 
			map: texture 
		});
		// var basicMaterial = new THREE.MeshBasicMaterial( { color: 0x786e54, opacity: 0.6, wireframe: true } );
	
		sphere = new THREE.Mesh(
			new THREE.SphereGeometry(100, 20, 20)
		);
		sphere.material = phongMaterial;

		/*sphere.material = basicMaterial;*/

		sphere.scale.x = -1;
		scene.add(sphere);
		/*var material = new THREE.MeshBasicMaterial({
		    wireframe: true,
		    color: 'blue'
		});*/
		

		var loader = new THREE.JSONLoader();
	    loader.load('json/e.json', function(geometry, material) {
	        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
	        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
	        scene.add(mesh);
	    });
	    loader.load('json/c.json', function(geometry, material) {
	        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
	        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
	        scene.add(mesh);
	    });
	    loader.load('json/a.json', function(geometry, material) {
	        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
	        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
	        scene.add(mesh);
	    });
	    loader.load('json/dash.json', function(geometry, material) {
	        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
	        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
	        scene.add(mesh);
	    });
	    loader.load('json/two.json', function(geometry, material) {
	        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
	        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.6;
	        scene.add(mesh);
	    });
	    loader.load('json/cm.json', function(geometry, material) {
	        mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial(material));
	        mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
	        scene.add(mesh);
	    });
		  // lights

		light = new THREE.DirectionalLight( 0xffffff );
		light.position.set( 1, 1, 1 );
		scene.add( light );

		light = new THREE.DirectionalLight( 0xff9800 );
		light.position.set( -1, -1, -1 );
		scene.add( light );

		light = new THREE.DirectionalLight( 0x00ff00 );
		light.position.set( 1, 1, 1 );
		scene.add( light );

		light = new THREE.DirectionalLight( 0x0000ff );
		light.position.set( 1, 0, 0 );
		scene.add( light );

		light = new THREE.AmbientLight( 0x222222 );
		scene.add( light );

		renderer = webglSupport ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);		

		domEl.appendChild(renderer.domElement);

		domEl.addEventListener('mousewheel', onMouseWheel, false);
		domEl.addEventListener('DOMMouseScroll', onMouseWheel, false);

		animate();
	}

	function render () {
		renderer.render(scene, camera);
	}

	function animate () {
		requestAnimationFrame(animate);
		controls.update();
	}

	function onMouseWheel (evt) {
		evt.preventDefault();
			
		if (evt.wheelDeltaY) { // WebKit
			camera.fov -= evt.wheelDeltaY * 0.05;
		} else if (evt.wheelDelta) { 	// Opera / IE9
			camera.fov -= evt.wheelDelta * 0.05;
		} else if (evt.detail) { // Firefox
			camera.fov += evt.detail * 1.0;
		}
		camera.fov = Math.max(20, Math.min(100, camera.fov));
		camera.updateProjectionMatrix();
	}

	function resize () {
		camera.aspect = domEl.offsetWidth / domEl.offsetHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(domEl.offsetWidth, domEl.offsetHeight);
		render();
	}

	// http://stackoverflow.com/questions/21548247/clean-up-threejs-webgl-contexts
	function remove () {
		scene.remove(sphere);
		while (domEl.firstChild) {
			domEl.removeChild(domEl.firstChild);
		}
	}

	return {
		resize: resize,
		remove: remove
	}
};