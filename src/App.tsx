/* eslint-disable import/no-anonymous-default-export */
import * as BABYLON from '@babylonjs/core/Legacy/legacy';
import { PlayGround } from "containers/PlayGround"; // uses above component in same directory
import 'babylonjs-loaders';

let box: { position: { y: number; }; rotation: { y: number; }; } | undefined;

const onSceneReady = (scene: any) => {
  // SportLight
  var sportLight = new BABYLON.SpotLight("spot", new BABYLON.Vector3(0, 30, 0), new BABYLON.Vector3(0, -1, 0), 17, 1, scene);
  sportLight.diffuse = new BABYLON.Color3(1, 1, 1);
  sportLight.specular = new BABYLON.Color3(0, 0, 0);
  sportLight.intensity = 10;

  // Camera
  var camera = new BABYLON.ArcRotateCamera("Camera", -20, 4, 100, BABYLON.Vector3.Zero(), scene);
  
  camera.lowerBetaLimit = 0.1;
  camera.upperBetaLimit = (Math.PI / 2) * 0.9;
  camera.lowerRadiusLimit = 30;
  camera.upperRadiusLimit = 150;
  camera.attachControl(canvas);

  /**
   * @description 그라운드 하단에 Grid Texture 배치
   */
  // 그리드 텍스쳐를 배치할 새로운 그라운드를 생성합니다.
  const ground = BABYLON.Mesh.CreateGround("Grid", 5000, 5000, 1, scene, false);
  // 새로운 텍스쳐를 지정합니다.
  const materialGrid = new BABYLON.StandardMaterial("GridTexture", scene);
  // 텍스쳐 파일을 불러옵니다.
  const texture = new BABYLON.Texture("textures/grid_ground.png", scene);
  // 불러온 Texture에서 알파값 여부입니다. 해당 옵션 사용 시 투명도 및 빛반사를 사용할 수 있습니다.
  texture.hasAlpha = true;
  // uScale과 vScale은 각 방향에 타일 수를 정합니다. (5.0 => 5칸)
  texture.uScale = 250.0;
  texture.vScale = 250.0;
  // materialGrid에 불러온 Texture를 상속합니다.
  materialGrid.diffuseTexture = texture;
  ground.material = materialGrid;
  // 그라운드에 포지션 값을 지정합니다. (default: 0)
  ground.position.y = 0;

  // Model

  var assetsManager = new BABYLON.AssetsManager(scene);
	var meshTask = assetsManager.addMeshTask("ask", "", "https://dl.dropbox.com/s/04qek2etw5bbkzc/", "tree.babylon");

  meshTask.onSuccess = function (task) {
    task.loadedMeshes[0].position = BABYLON.Vector3.Zero();
  }

  assetsManager.load();

  // Skybox
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;

  var Axis = function(size: number) {
    var axisX = BABYLON.Mesh.CreateLines("axisX", [ 
       new BABYLON.Vector3(-size, 0, 0),
       new BABYLON.Vector3(-size, 0, 0),
       BABYLON.Vector3.Zero(), 
       new BABYLON.Vector3(size, 0, 0), 
       new BABYLON.Vector3(size, 0, 0), 
    ], scene);
    
    axisX.color = new BABYLON.Color3(1, 0, 0);

    var axisZ = BABYLON.Mesh.CreateLines("axisZ", [
       new BABYLON.Vector3(0, 0, -size),
       new BABYLON.Vector3(0, 0, -size), 
       BABYLON.Vector3.Zero(), 
       new BABYLON.Vector3(0, 0, size), 
       new BABYLON.Vector3(0, 0, size), 
    ], scene);
    
    axisZ.color = new BABYLON.Color3(0, 0, 1);
 };
 Axis(250);

  return scene;
};

const onRender = (scene: any) => {
  if (box !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();

    const rpm = 10;
    box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
  }
};

export default () => (
  <div>
    <PlayGround antialias onSceneReady={onSceneReady} onRender={onRender} id="my-canvas" />
  </div>
);

function canvas(canvas: any) {
  throw new Error("Function not implemented.");
}

