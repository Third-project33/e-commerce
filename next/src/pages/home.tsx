import React from 'react'
import { useRouter } from 'next/router'
const Home = () => {
    const navi = useRouter()
  return (
    <div onClick={()=>  navi.push("/")}>hello</div>
  )
}

export default Home