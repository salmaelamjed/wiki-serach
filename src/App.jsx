import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const App = () => {
  const [term, setTerm] = useState(''); 
  const [results, setResults] = useState([]); // State to store the API results

  useEffect(() => {
    const searchAPI = async () => {
      try {
        const response = await axios.get("https://en.wikipedia.org/w/api.php", {
          params: {
            action: "query", 
            format: "json",
            list: "search", 
            srsearch: term, // Pass the search term entered by the user
            origin: "*", 
          },
        });
        setResults(response.data.query.search); // Store the results in state
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (!results.length && term) {
      const debounceTimeout = setTimeout(() => {
        searchAPI(); 
      }, 1000); 
      return () => clearTimeout(debounceTimeout);
    }
    
  }, [term,results.length]); // Dependency array to re-run the effect when `term` updates

  return (
    <div className="container mt-5 p-4 bg-light rounded shadow">
      <h2 className="text-center mb-4 text-primary">Wikipedia Search</h2>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="fw-bold text-secondary">Search Input</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter search query"
            className="border border-primary shadow-sm"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </Form.Group>
      </Form>

      {/* Display the results if they exist */}
      <div className="mt-4">
        <h4 className="text-secondary">Search Results:</h4>
        {results.length > 0 ? (
          <ul className="list-group">
            {results.map((result) => (
              <li key={result.pageid} className="list-group-item">
                <a
                  href={`https://en.wikipedia.org/?curid=${result.pageid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none text-primary"
                >
                  <h5 className="fw-bold">{result.title}</h5>
                </a>
                <p className="text-muted">{result.snippet.replace(/(<([^>]+)>)/gi, '')}...</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No results found. Start typing to search.</p>
        )}
      </div>
    </div>
  );
};

export default App;
