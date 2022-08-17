import type { NextPage } from 'next'
import Dock from "../components/dock";
import {getColor, generateColors, generateRadialGradients} from "../services/Color";

const Home: NextPage = () => {
  
  // base color
  const color = getColor(); 
  
  // get the color for the radial gradient
  const colors = generateColors(6, color); 
  
  // generate the radial gradient
  const proprieties = generateRadialGradients(6, colors); 
  return (
    <main>
    <div className="nav">
      <div className="pfp" style={{"backgroundImage": proprieties.join(","), "backgroundColor": colors[0]}}>
      </div>
      <h1>
        sponge
      </h1>
    </div>
    <Dock />
    {/* <Page post={{content: "# hello \nthis is nice \n```def python(:'dhd'):```", is_file: false, key: "167328949327"} as IPost}/> */}
  </main>
  )
}

export default Home
