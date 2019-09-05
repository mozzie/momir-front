import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [printable, setPrintable] = useState(false);
  const [printer, setPrinter] = useState(undefined);
  const [printerList, setPrinterList] = useState([]);

  const backend = process.env.REACT_APP_BACKEND_URL
  useEffect(() => {
    const getPrinters = async () => {
    let printers = await axios.get(backend + "printers", {headers: {'Access-Control-Allow-Origin': '*'}})
    setPrinterList(printers.data);
    }
    getPrinters();
  }
  , [])
  const getCard = async (c) => {
    setLoading(true);
    const result = await axios.get(backend + "card/" + c, {headers: {'Access-Control-Allow-Origin': '*'}})
    setCard(result.data);
  }

  useEffect(() =>{
    if(card.scryfallId) {
    setImageUrl(backend + "picture/" + card.scryfallId);
    setLoading(false);
    setPrintable(true);
    }
  }, [card])

  const print = (card) => {
    axios.get(backend + "print/" + card.scryfallId, {params: {'printer': printer}, headers: {'Access-Control-Allow-Origin': '*'}})
    setPrintable(false);
  }

  const handlePrinterChange = event => {
    setPrinter(event.target.value);
  }
  return (
    <div>
    <p>
    <select disabled={printerList.length===0} onChange={handlePrinterChange} value={printer}>
    <option key="none" value="">None</option>
    {printerList.map(i => <option key={i.name} value={i.name}>{i.name}</option>)}
    </select>
    </p>
    <p>
    <button onClick={() => setCount(count - 1)} disabled={count < 1 || loading}>
      -
    </button>
      {count}
      <button onClick={() => setCount(count + 1)} disabled={count > 15 || loading}>
        +
      </button>
      <button onClick={() => getCard(count)} disabled={count === 14 || loading}>
        Activate
      </button>
      <button onClick={() => print(card)} disabled={!printable || !printer}>
        Print
      </button>
      </p>
      <img src={imageUrl} alt={card ? card.name : "no card"}/>
    </div>
  );
}

export default App
