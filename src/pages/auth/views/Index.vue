<template>
  <canvas ref="canvas" width="1024" height="500"></canvas>
  <button @click="saveScene('car')">保存场景</button>
</template>

<script lang="ts">
import * as BABYLON from 'babylonjs'
import { defineComponent } from 'vue'

let scene: BABYLON.Scene
let objectUrl: string = ''

export default defineComponent({
  setup() {
    // const canvas = ref(null)
    // onMounted(() => {
    //   console.log(canvas.value)
    //   return createScene(canvas.value)
    // })
    // return { canvas }
  },

  mounted() {
    this.init()
  },

  methods: {
    init() {
      scene = this.createScene()
      this.createGround(scene)
      const house = this.createHouse(scene) as BABYLON.Mesh
      this.repeatHouse(house)
      this.createCar(scene)
    },

    saveScene(filename: string) {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl)
      }

      let serializedScene = BABYLON.SceneSerializer.Serialize(scene)

      let strScene = JSON.stringify(serializedScene)

      if (filename.toLowerCase().lastIndexOf('.babylon') !== filename.length - 8 || filename.length < 9) {
        filename += '.babylon'
      }

      let blob = new Blob([strScene], { type: 'octet/stream' })

      // turn blob into an object URL; saved as a member, so can be cleaned out later
      objectUrl = (window.webkitURL || window.URL).createObjectURL(blob)

      let link = window.document.createElement('a')
      link.href = objectUrl
      link.download = filename
      let click = document.createEvent('MouseEvents')
      click.initEvent('click', true, false)
      link.dispatchEvent(click)
    },

    createHouse(scene: BABYLON.Scene): BABYLON.Nullable<BABYLON.Mesh> {
      const box = this.createBox(scene)
      const roof = this.createRoof(scene)
      return BABYLON.Mesh.MergeMeshes([box, roof], true, false, undefined, false, true)
    },

    repeatHouse(house: BABYLON.Mesh) {
      const houses = []
      const places = []
      places.push([1, -Math.PI / 16, -6.8, 2.5])
      places.push([2, -Math.PI / 16, -4.5, 3])
      places.push([2, -Math.PI / 16, -1.5, 4])
      places.push([2, -Math.PI / 3, 1.5, 6])
      places.push([2, (15 * Math.PI) / 16, -6.4, -1.5])
      places.push([1, (15 * Math.PI) / 16, -4.1, -1])
      places.push([2, (15 * Math.PI) / 16, -2.1, -0.5])
      places.push([1, (5 * Math.PI) / 4, 0, -1])
      places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3])
      places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5])
      places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7])
      places.push([2, Math.PI / 1.9, 4.75, -1])
      places.push([1, Math.PI / 1.95, 4.5, -3])
      places.push([2, Math.PI / 1.9, 4.75, -5])
      places.push([1, Math.PI / 1.9, 4.75, -7])
      places.push([2, -Math.PI / 3, 5.25, 2])
      places.push([1, -Math.PI / 3, 6, 4])

      for (let i = 0; i < places.length; i++) {
        houses[i] = house.createInstance('house' + i)

        houses[i].rotation.y = places[i][1]
        houses[i].position.x = places[i][2]
        houses[i].position.z = places[i][3]
      }
    },

    createCar(scene: BABYLON.Scene) {
      // car body
      //base
      // const outline = [new BABYLON.Vector3(-0.3, 0, -0.1), new BABYLON.Vector3(0.2, 0, -0.1)]

      // //curved front
      // for (let i = 0; i < 20; i++) {
      //   outline.push(
      //     new BABYLON.Vector3(0.2 * Math.cos((i * Math.PI) / 40), 0, 0.2 * Math.sin((i * Math.PI) / 40) - 0.1),
      //   )
      // }

      // //top
      // outline.push(new BABYLON.Vector3(0, 0, 0.1))
      // outline.push(new BABYLON.Vector3(-0.3, 0, 0.1))

      // //car face UVs
      // const faceUV = []
      // faceUV[0] = new BABYLON.Vector4(0, 0.5, 0.38, 1)
      // faceUV[1] = new BABYLON.Vector4(0, 0, 1, 0.5)
      // faceUV[2] = new BABYLON.Vector4(0.38, 1, 0, 0.5)

      // //car material
      // const carMat = new BABYLON.StandardMaterial('carMat', scene)
      // carMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/car.png', scene)

      // const car = BABYLON.MeshBuilder.ExtrudePolygon('car', { shape: outline, depth: 0.2, faceUV: faceUV, wrap: true })
      // car.material = carMat
      // car.position.y = 0.2
      // car.position.x = -5
      // car.position.z = -5
      // car.rotation.x = -Math.PI / 2
      // // const car = BABYLON.MeshBuilder.ExtrudePolygon('car', { shape: outline, depth: 0.2 }, scene)

      // //wheel face UVs
      // const wheelUV = []
      // wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1)
      // wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5)
      // wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1)

      // //car material
      // const wheelMat = new BABYLON.StandardMaterial('wheelMat', scene)
      // wheelMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/wheel.png', scene)

      // const wheelRB = BABYLON.MeshBuilder.CreateCylinder('wheelRB', { diameter: 0.125, height: 0.05, faceUV: wheelUV })
      // wheelRB.material = wheelMat
      // wheelRB.parent = car
      // wheelRB.position.z = -0.1
      // wheelRB.position.x = -0.2
      // wheelRB.position.y = 0.035

      // const wheelRF = wheelRB.clone('wheelRF')
      // wheelRF.position.x = 0.1

      // const wheelLB = wheelRB.clone('wheelLB')
      // wheelLB.position.y = -0.2 - 0.035

      // const wheelLF = wheelRF.clone('wheelLF')
      // wheelLF.position.y = -0.2 - 0.035
      BABYLON.SceneLoader.ImportMeshAsync('', '/babylonjs/meshes/', 'car.babylon').then(() => {
        const car = scene.getMeshByName('car')
        car.position.x = -3
        car.position.y = 0.2
        car.position.z = -5
        car.rotation.y = Math.PI / 2

        const animCar = new BABYLON.Animation(
          'carAnimation',
          'position.z',
          30,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
        )

        const carKeys = []

        carKeys.push({
          frame: 0,
          value: 0,
        })

        carKeys.push({
          frame: 150,
          value: -2,
        })

        carKeys.push({
          frame: 210,
          value: -5,
        })

        animCar.setKeys(carKeys)

        car.animations = []
        car.animations.push(animCar)

        scene.beginAnimation(car, 0, 210, true)
        const wheelRB = scene.getMeshByName('wheelRB')
        const wheelRF = scene.getMeshByName('wheelRF')
        const wheelLB = scene.getMeshByName('wheelLB')
        const wheelLF = scene.getMeshByName('wheelLF')
        // console.log(wheelRB.animations)
        scene.beginAnimation(wheelRB, 0, 30, true)
        scene.beginAnimation(wheelRF, 0, 30, true)
        scene.beginAnimation(wheelLB, 0, 30, true)
        scene.beginAnimation(wheelLF, 0, 30, true)
      })
      // return car
    },

    createBox(scene: BABYLON.Scene) {
      const faceUV = []
      faceUV[0] = new BABYLON.Vector4(0.5, 0.0, 0.75, 1.0) //rear face
      faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.25, 1.0) //front face
      faceUV[2] = new BABYLON.Vector4(0.25, 0, 0.5, 1.0) //right side
      faceUV[3] = new BABYLON.Vector4(0.75, 0, 1.0, 1.0) //left side
      const box = BABYLON.MeshBuilder.CreateBox('box', { faceUV, wrap: true })
      // const boxMaterial = new BABYLON.StandardMaterial('material', scene)
      // boxMaterial.emissiveColor = new BABYLON.Color3(0, 0.58, 0.86)
      // box.material = boxMaterial
      box.position.y = 0.5
      const boxMat = new BABYLON.StandardMaterial('boxMat', scene)
      boxMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/cubehouse.png', scene)
      box.material = boxMat
      return box
      // box.scaling.x = 0.5
      // box.rotation.y = BABYLON.Tools.ToRadians(45)
    },
    createGround(scene: BABYLON.Scene) {
      const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 20, height: 20 })
      const groundMat = new BABYLON.StandardMaterial('groundMat', scene)
      // groundMat.diffuseColor = new BABYLON.Color3(0, 1, 0)
      groundMat.diffuseTexture = new BABYLON.Texture('https://www.babylonjs-playground.com/textures/floor.png', scene)
      ground.material = groundMat //Place the material property of the ground
      return ground
    },
    createSound(scene: BABYLON.Scene) {
      return new BABYLON.Sound('bounce', 'sounds/bounce.wav', scene)
    },
    createRoof(scene: BABYLON.Scene) {
      const roof = BABYLON.MeshBuilder.CreateCylinder('roof', { diameter: 1.3, height: 1.2, tessellation: 3 }, scene)
      roof.scaling.x = 0.75
      roof.rotation.z = Math.PI / 2
      roof.position.y = 1.22
      const roofMat = new BABYLON.StandardMaterial('roofMat', scene)
      roofMat.diffuseTexture = new BABYLON.Texture('https://assets.babylonjs.com/environments/roof.jpg', scene)
      roof.material = roofMat
      return roof
    },
    createScene(): BABYLON.Scene {
      const canvas = this.$refs.canvas as HTMLCanvasElement
      const engine = new BABYLON.Engine(canvas)
      const scene = new BABYLON.Scene(engine)
      const camera = new BABYLON.ArcRotateCamera(
        'camera',
        -Math.PI / 2,
        Math.PI / 2.5,
        15,
        new BABYLON.Vector3(0, 0, 0),
        scene,
      )
      camera.attachControl(canvas, true)
      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene)

      engine.runRenderLoop(function () {
        scene.render()
      })
      // console.log(engine)
      return scene
    },
  },
})
</script>

<style></style>
