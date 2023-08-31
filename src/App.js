import React, { useState, useEffect } from "react";
import axios from "axios";
import {MenuItem, Select, Button} from '@material-ui/core';


const App = () => {
  const [count, setCount] = useState(0);
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [printable, setPrintable] = useState(false);
  const [printer, setPrinter] = useState(undefined);
  const [printerList, setPrinterList] = useState([]);

  const backend = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const getPrinters = async () => {
      let printers = await axios.get(backend + "printers", {
        headers: { "Access-Control-Allow-Origin": "*" }
      });
      setPrinterList(printers.data);
    };
    getPrinters();

  }, []);
  const getCard = async c => {
    setLoading(true);
    const result = await axios.get(backend + "card/" + c, {
      headers: { "Access-Control-Allow-Origin": "*" }
    });
    setCard(result.data);
  };

  useEffect(() => {
    if (card.scryfallId) {
      setImageUrl(backend + "picture/" + card.scryfallId);
      setLoading(false);
      setPrintable(true);
    }
  }, [card]);

  const print = card => {
    axios.get(backend + "print/" + card.scryfallId, {
      params: { printer: printer },
      headers: { "Access-Control-Allow-Origin": "*" }
    });
    setPrintable(false);
  };

  const increaseCount = () => setCount(Math.min(16, count + 1));
  const decreaseCount = () => setCount(Math.max(0, count - 1));

  const handlePrinterChange = event => {
    console.log(event.target);
    setPrinter(event.target.value);
  }

  return (
    <div>
      <div>
       {printerList.length > 0 && (
        <Select
          onChange={handlePrinterChange}
          label={'"Select printer"'}
          value={printer || ''}
        >
          {printerList.map(i => (
            <MenuItem key={i.name} value={i.name}>
              {i.name}
            </MenuItem>
          ))}
        </Select>
      )}
      </div>
      <div>
        <Button onClick={() => decreaseCount()}
          disabled={count < 1 || loading}
          variant="outlined"

        >
          -
        </Button>
        &nbsp;&nbsp;&nbsp;{count}&nbsp;&nbsp;&nbsp;
        <Button
          onClick={() => increaseCount()}
          disabled={count > 15 || loading}
          variant="outlined"
        >
          +
        </Button>
      </div>
      <div>
        <Button
          onClick={() => getCard(count)}
          disabled={count === 14 || loading}
          variant="outlined"
        >
          Activate
        </Button>
        {printer && (
        <Button onClick={() => print(card)}
        disabled={!printable}
        variant="outlined"
        >
          Print
        </Button>
      )}
      </div>
      <img src={imageUrl} alt={card ? card.name : "no card"} />
    </div>
  );
};

export default App;
