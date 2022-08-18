import type { NextPage } from 'next'
import { useRouter } from 'next/router';
import {Rss} from "react-feather"
import Dock from "../components/dock";
import {getColor, generateColors, generateRadialGradients} from "../services/Color";

const Home: NextPage = () => {
  const router = useRouter();
  
  const host = typeof window !== 'undefined' && window.location.host ? window.location.host : '';

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
      <a href={`https://feeds_${host}`}>
        <Rss size={16} />
      </a>
    </div>
    <Dock />
    {/* <Page post={{content: "# hello \nthis is nice \n```def python(:'dhd'):```", is_file: false, key: "167328949327"} as IPost}/> */}
  </main>
  )
}

export default Home
