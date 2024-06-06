import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const resources = ['people', 'films', 'starships', 'vehicles', 'species', 'planets'];

const Home = () => {
    const [resource, setResource] = useState('people');
    const [id, setId] = useState('');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFetch = () => {
        axios.get(`https://swapi.dev/api/${resource}/${id}/`)
            .then(response => {
                setData(response.data);
                setError(null);
            })
            .catch(err => {
                setData(null);
                setError('Estos no son los droides que está buscando');
            });
    };

    const handleRouteFetch = () => {
        navigate(`/${id}`);
    };

    return (
        <div>
            <h1>Luke APIwalker</h1>
            <div>
                <select value={resource} onChange={(e) => setResource(e.target.value)}>
                    {resources.map(res => <option key={res} value={res}>{res}</option>)}
                </select>
                <input type="number" value={id} onChange={(e) => setId(e.target.value)} />
                <button onClick={handleFetch}>Fetch</button>
                <button onClick={handleRouteFetch}>Fetch by Route</button>
            </div>
            {error && (
                <div>
                    <p>{error}</p>
                    <img src="https://starwarsblog.starwars.com/wp-content/uploads/2015/11/obi-wan-kenobi_2d620473.jpeg" alt="Obi-Wan Kenobi" style={{width: '200px'}} />
                </div>
            )}
            {data && (
                <div>
                    {Object.keys(data).slice(0, 4).map(key => (
                        <p key={key}><strong>{key}:</strong> {data[key]}</p>
                    ))}
                </div>
            )}
        </div>
    );
};

const PersonDetail = () => {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [homeworld, setHomeworld] = useState('');
    const [error, setError] = useState(null);

    React.useEffect(() => {
        axios.get(`https://swapi.dev/api/people/${id}/`)
            .then(response => {
                setPerson(response.data);
                setError(null);
                return axios.get(response.data.homeworld);
            })
            .then(response => setHomeworld(response.data.name))
            .catch(err => setError('Estos no son los droides que está buscando'));
    }, [id]);

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <img src="https://starwarsblog.starwars.com/wp-content/uploads/2015/11/obi-wan-kenobi_2d620473.jpeg" alt="Obi-Wan Kenobi" style={{width: '200px'}} />
            </div>
        );
    }

    return (
        person && (
            <div>
                <h1>{person.name}</h1>
                <p><strong>Height:</strong> {person.height}</p>
                <p><strong>Mass:</strong> {person.mass}</p>
                <p><strong>Hair Color:</strong> {person.hair_color}</p>
                <p><strong>Homeworld:</strong> {homeworld}</p>
            </div>
        )
    );
};

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/:id" element={<PersonDetail />} />
            </Routes>
        </Router>
    );
}

export default App;