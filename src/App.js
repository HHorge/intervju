import './App.css';
import { useState, useEffect } from 'react'

const App = () => {
  const [value, setValue] = useState("")
  const [locations, setLocations] = useState([])
  const [info, setInfo] = useState(null)
  const [clickedIndex, setClickedIndex] = useState(-1);
  
  useEffect(() => {
    const debounce = setTimeout(() => {
      const url = `https://ws.geonorge.no/stedsnavn/v1/navn?sok=${value}&fuzzy=true&utkoordsys=4258&treffPerSide=20&side=1`
      return fetch(url).then(res => res.json()).then(data => {
        setLocations(data["navn"])
        console.log(locations)
      })
    }, 300);
    setClickedIndex(-1);
    setInfo(null)

    return () => clearTimeout(debounce);
  }, [value]);


  const displayInfo = (location) => {
    setInfo(<div>
      <h4> Fylke: </h4><span>{location["fylker"][0]["fylkesnavn"]}</span>
      <h4> Kommune: </h4><span>{location["kommuner"][0]["kommunenavn"]}</span>
      <h4> Koordinater: </h4>
      <ul>
        <li>
          {location["representasjonspunkt"]["nord"]}
        </li>
        <li>
          {location["representasjonspunkt"]["øst"]}
        </li>
      </ul>
    </div>)
  }
  const handleListClick = (location, index) => {
    displayInfo(location);
    setClickedIndex(index);
  };


  const displayLocation = (location, index) => {

    return (
      <li
        className={`location ${index === clickedIndex ? "location--clicked" : ""}`}
        onClick={() => handleListClick(location, index)}
      >
        <div className='list-title'>{location["skrivemåte"]}</div>
        <div>{location["navneobjekttype"]}</div>
      </li>
    );
  };

  return (
    <>

      <input type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Søk her"></input>
      <div>{value}</div>
      <div className="wrapper">
        <ul className='locations-list'>{locations.map((location, index) => displayLocation(location, index))}</ul>
        {info && info}
      </div>

    </>
  )
}

export default App;
