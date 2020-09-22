import * as THREE from './three.module.js';


document.addEventListener("keydown", onDocumentKeyDown, false);
document.addEventListener("keyup", onDocumentKeyUp);


var timer = document.querySelector(".timer");
var score = document.querySelector(".hitPoints");

var camera, scene, renderer;
var geometry, material, player;


var foods = [];
var foodRadius = 0.2;

function randomInt(min, max){
    var r = Math.random() - 0.5;
    return Math.floor(-r * min + r * max);
}

var food = new THREE.SphereGeometry(foodRadius);


const init = () => {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	camera.position.z = 1;
	camera.position.y = 1;

	scene = new THREE.Scene();

	geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
	material = new THREE.MeshNormalMaterial();

	player = new THREE.Mesh( geometry, material );
	scene.add( player );

    for(var i = 0; i < 20; i++){
        spawnFood();
//        console.log(randomInt(-10, 10));
    }

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

}
const spawnFood = () => {
             var foodMesh = new THREE.Mesh(food, material);
             foodMesh.position.x = randomInt(0, 10);
             foodMesh.position.z = randomInt(0, 10);
             foods.push(foodMesh);
             scene.add(foodMesh);
 }

init();

var _input = {
    arrowUp: false,
    arrowDown: false,
    arrowLeft: false,
    arrowRight: false
};

var startGame = false;
var gameTime = 20;
var currentTime = 20;

function onDocumentKeyDown(event){
//  When game starts
    if(!startGame){

        currentTime = gameTime;
        setInterval(() => {
            --currentTime;
//            timer.innerText = currentTime;
            timer.innerText = `Time: ${currentTime} seconds`;

            if(currentTime == 0){

                console.log(currentTime);

                if (window.confirm(`Your Final Score Is: ${hitPointsCounter} In ${gameTime} seconds!`))
                {
                    // They clicked Yes
                    location.reload();
                }
                else
                {
                    // They clicked no
                    location.reload();
                }


                startGame = false;
            }

        }, 1000);
    }


    if(event.key == "ArrowUp"){
        _input.arrowUp = true;
            startGame = true;
    }
    if(event.key == "ArrowDown"){
        _input.arrowDown = true;
            startGame = true;
    }
    if(event.key == "ArrowLeft"){
        _input.arrowLeft = true;
            startGame = true;
    }
    if(event.key == "ArrowRight"){
        _input.arrowRight = true;
            startGame = true;
    }

}

function onDocumentKeyUp(event){
    if(event.key == "ArrowUp"){
        _input.arrowUp = false;
    }
    if(event.key == "ArrowDown"){
        _input.arrowDown = false;
    }
    if(event.key == "ArrowLeft"){
        _input.arrowLeft = false;
    }
    if(event.key == "ArrowRight"){
        _input.arrowRight = false;
    }

}

var lastTime = Date.now();

var turnAngle = 30, speed = 0.02;
var camDist = 10;


function lerp(a,b,t){
    return b * t + a * (1 - t);
}

var distWalked = 0;
var hitPointsCounter = 0;



const animate = () => {

    const now = Date.now();
    const deltaTime = now - lastTime;
//    console.log(deltaTime / 1000);
	requestAnimationFrame( animate );
    lastTime = now;


    if(startGame){
        let forward = (_input.arrowDown ? -1 : 0) + (_input.arrowUp ? 1 : 0);
        let sideways = (_input.arrowLeft ? -1 : 0) + (_input.arrowRight ? 1 : 0);

    //	player.rotation.x += 0.01 * forward;
    //	player.rotation.y += 0.02 * sideways;

        player.position.z -= speed * forward;
        distWalked += speed;
        player.position.x += speed * sideways;

        camera.position.x = lerp(camera.position.x, player.position.x, 0.05);
        camera.position.z = lerp(camera.position.z, player.position.z + 2, 0.05);

        if(distWalked > 1){
    //        spawnFood();
        }
        for(var i = 0; i < foods.length; i++){
                var food = foods[i];
    //            console.log(food);
                if(player.position.x <= food.position.x + foodRadius && player.position.x >= food.position.x - foodRadius){
                    if(player.position.z <= food.position.z + foodRadius && player.position.z >= food.position.z - foodRadius){
                        food.position.z = randomInt(0, 10);
                        food.position.x = randomInt(0, 10);
                        hitPointsCounter++;
                        score.innerText = `score: ${hitPointsCounter}`;
                    }
                }
        }

    }
//    console.log(lerp(0, 10, 0.5));

	renderer.render( scene, camera );

}

animate();
