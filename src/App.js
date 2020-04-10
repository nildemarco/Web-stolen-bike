import React, { useState, useEffect } from 'react';
import logo from './logoPolice.png';
import './App.css';

const App = () => {

  const [bikes, setBike] = useState('')
  const [busqueda, setBusqueda] = useState({
    searchText: '',
    dateFrom: '',
    dateTo: '',
  })

  const buscarBikes = () => {
    fetch(`https://bikewise.org/api/v2/incidents?page=1&per_page=50&incident_type=theft&proximity_square=100`)
      .then(res => res.json())
      .then(data => setBike(data))
  }

  useEffect(buscarBikes, [])

  const crearFecha = (date) => {
    if (bikes) {
      let dateBike = new Date(date)
      return dateBike.toDateString()
    }
  }

  const crearUrl = () => {
    let url = new URL(`https://bikewise.org:443/api/v2/incidents`)
    url.search = new URLSearchParams({
      query: busqueda.searchText,
      occurred_before: busqueda.dateTo,
      occurred_after: busqueda.dateFrom,
      incident_type: 'theft'
    })
    console.log(url)
    return url
  }

  const handleChange = e => {
    if (e.target.name === 'searchText') {
    setBusqueda({ ...busqueda, [e.target.name]: e.target.value })
    }
    else {
      setBusqueda({ ...busqueda, [e.target.name]: Date.parse(e.target.value)})
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    
    fetch(crearUrl())
    .then(res => res.json())
    .then(data => setBike(data))
  }
  console.log(bikes)
  console.log(busqueda)
  return (
    <div>
      <nav>
        <img className="img-nav" alt="Logo police" src={logo} />
        <div>
          <h1>Police Departament of Berlin</h1>
          <h5>Stolen Bikes</h5>
        </div>
      </nav>
      <form onSubmit={handleSubmit}>
        <input type='text' name='searchText' value={busqueda.searchText} placeholder="Search case descriptions" onChange={handleChange} />
        <input type='date' name='dateFrom' vale={busqueda.dateFrom} placeholder="From" onChange={handleChange} />
        <input type='date' name='dateTo' value={busqueda.dateTo} placeholder="To" onChange={handleChange} />
        <input type='submit' value='Find case' />
      </form>
      <div className="container-cases-number">
        {bikes ? <h6>Cases: {bikes.incidents.length}</h6> : ''}
      </div>
      <div className="container-card">
        {bikes &&
          <>
            {
              bikes.incidents.map(bike => {
                return (
                  <div className='card' key={bike.id}>
                    <div className='container-img'>
                      {bike.media.image_url ?
                        <img alt={bike.title} src={bike.media.image_url} /> :
                        <span>Imagen no disponible</span>
                      }
                    </div>
                    <div className="container-details">
                      <h4>{bike.title}</h4>
                      <p className='description'>{bike.description}</p>
                      <p>{crearFecha(bike.occurred_at)} - {bike.address}</p>
                    </div>
                  </div>
                )
              })
            }
          </>

        }
      </div>
    </div>
  );
}

export default App;
