import { AmbientLight, DirectionalLight, Light } from 'three'

const Lights: Light[] = [

  new AmbientLight(0xF0F0F0, 0.9),
  new DirectionalLight(0xFFFFFF, 0.6)

]

export default Lights
