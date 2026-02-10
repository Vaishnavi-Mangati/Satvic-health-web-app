import React from 'react'
import { useLocation } from 'react-router-dom'
import { getBodyType } from '../utils/getBodyType';

const Recommendations = () => {

    const location = useLocation();
    const {vataScore, pittaScore, kaphaScore} = location.state()
    const bodyType = getBodyType(vataScore, pittaScore, kaphaScore)

    const data = getBodyType[bodyType]

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <Section title='Diet' items/>
    </div>
  )
}

export default Recommendations
