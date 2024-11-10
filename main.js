import * as THREE from 'three';

let mvx = 0;
let mvy = 0;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const spotLight = new THREE.SpotLight( 0xffffff ,100);
const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, .05 );

const geometrye = new THREE.SphereGeometry(2,7,7);
const geometryc = new THREE.SphereGeometry(2.1,7,7);
const geometrym = new THREE.SphereGeometry(.1,5,5);
const geometrys = new THREE.SphereGeometry(-50,4,4);

const texturee = new THREE.TextureLoader().load( "2k_earth_daymap.png" );
const texturec = new THREE.TextureLoader().load( "2k_earth_clouds.png" );
const texturem = new THREE.TextureLoader().load( "2k_moon.png" );
const textures = new THREE.TextureLoader().load( "2k_stars_milky_way.png" );

texturee.magFilter = THREE.NearestFilter
texturec.magFilter = THREE.NearestFilter
texturem.magFilter = THREE.NearestFilter
textures.magFilter = THREE.NearestFilter
texturec.wrapS = THREE.RepeatWrapping

spotLight.position.set( 10, 0, 0 );

const materialc = new THREE.MeshStandardMaterial({map:texturec,alphaMap:texturec,transparent:true});
const materiale = new THREE.MeshStandardMaterial({map:texturee});
const materialm = new THREE.MeshStandardMaterial({map:texturem});
const materials = new THREE.MeshStandardMaterial({map:textures,lightMap:textures,lightMapIntensity:5});

const earth = new THREE.Mesh( geometrye, materiale );
const clouds = new THREE.Mesh( geometryc, materialc );
const moon = new THREE.Mesh( geometrym, materialm );
const stars = new THREE.Mesh( geometrys, materials );

document.body.appendChild( renderer.domElement );

renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );

scene.add( earth );
scene.add( clouds );
scene.add( moon );
scene.add( stars );
scene.add( spotLight );
scene.add( light )

camera.position.z = 7;
moon.position.x = 4

addEventListener("resize",(event) => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
});

addEventListener("mousemove", (event) => {
    if (event.buttons){
        mvx = event.movementX;
        mvy = event.movementY;
    }
});

function lerp(a, b, alpha) {
    return a+alpha*(b-a);
}

function rotatePointXYZ(point, origin, rad) {
    // Define origin and point axis values
    let ox = origin[0];
    let oy = origin[1];
    let oz = origin[2];

    let px = point.x - ox;
    let py = point.y - oy;
    let pz = point.z - oz;
    // rotation on x, y, z
    let tx = rad[0];
    let ty = rad[1];
    let tz = rad[2];
    // The transformation matrices.
    let rx = [Math.cos(tx),Math.sin(tx),0,-Math.sin(tx),Math.cos(tx),0,0,0,1];
    let ry = [Math.cos(ty),0,-Math.sin(ty),0,1,0,Math.sin(ty),0,Math.cos(ty)];
    let rz = [1,0,0,0,Math.cos(tz),Math.sin(tz),0,-Math.sin(tz),Math.cos(tz)];
    // Matrix mutiplication
    let rotatedX = [(rx[0] * px + rx[1] * py + rx[2] * pz), (rx[3] * px + rx[4] * py + rx[5] * pz), (rx[6] * px + rx[7] * py + rx[8] * pz)];
    px = rotatedX[0];
    py = rotatedX[1];
    pz = rotatedX[2];
    let rotatedY = [(ry[0] * px + ry[1] * py + ry[2] * pz), (ry[3] * px + ry[4] * py + ry[5] * pz), (ry[6] * px + ry[7] * py + ry[8] * pz)];
    px = rotatedY[0];
    py = rotatedY[1];
    pz = rotatedY[2];
    let rotatedZ = [(rz[0] * px + rz[1] * py + rz[2] * pz), (rz[3] * px + rz[4] * py + rz[5] * pz), (rz[6] * px + rz[7] * py + rz[8] * pz)];
    px = rotatedZ[0];
    py = rotatedZ[1];
    pz = rotatedZ[2];
    return new THREE.Vector3(px,py,pz)
}

function animate() {
    let r = rotatePointXYZ(moon.position,[0,0,0],[-.01,.02,.0])
    let r2 = rotatePointXYZ(camera.position,[0,0,0],[0,mvx*.01,mvy*.01])
    
    moon.position.x = r.x
    moon.position.y = r.y
    moon.position.z = r.z
    moon.rotation.y -= 0.005;
    
    earth.rotation.y -= 0.005;
    clouds.rotation.y -= 0.005;
    texturec.offset.x += 0.0005;
    
    camera.position.y = r2.y
    camera.position.x = r2.x
    camera.position.z = r2.z
    camera.lookAt(0,0,0)
    
    mvx = lerp(mvx,0,.1);
    mvy = lerp(mvy,0,.1);
    
    renderer.render( scene, camera );
}