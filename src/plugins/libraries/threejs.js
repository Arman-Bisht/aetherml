/**
 * Three.js Integration Plugin
 */
export function renderThreeJs(props) {
  const propsObj = Object.create(null);
  props.forEach(p => {
    const key = p.key.replace(':', '');
    propsObj[key] = p.value;
  });

  const spin = propsObj.spin === 'true';
  const containerId = `threejs-${Math.random().toString(36).substr(2, 9)}`;

  const html = `<div id="${containerId}" style="width: 100%; height: 400px;"></div>`;

  const script = `
(function() {
  const container = document.getElementById('${containerId}');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0x60a5fa, wireframe: true });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  
  camera.position.z = 5;
  
  function animate() {
    requestAnimationFrame(animate);
    ${spin ? `cube.rotation.x += 0.01;\n    cube.rotation.y += 0.01;` : ''}
    renderer.render(scene, camera);
  }
  animate();
})();
  `.trim();

  return { html, script };
}
