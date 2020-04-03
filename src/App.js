import React, { useState, useEffect } from "react";
import axios from "axios";
import {Select, Button} from '@material-ui/core';


const App = () => {
  const [count, setCount] = useState(0);
  const [card, setCard] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [printable, setPrintable] = useState(false);
  const [printer, setPrinter] = useState(undefined);
  const [printerList, setPrinterList] = useState([]);
 
  const backend = process.env.REACT_APP_BACKEND_URL;

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
    }
  }, [card]);

  const increaseCount = () => setCount(Math.min(16, count + 1));
  const decreaseCount = () => setCount(Math.max(0, count - 1));

  return (
    <div>
      <p>
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
      </p>
      <p>
        <Button
          onClick={() => getCard(count)}
          disabled={count === 14 || loading}
          variant="outlined"
        >
          Activate
      )}
      </p>
      <img src={imageUrl} alt={card ? card.name : "no card"} />
    </div>
  );
};

export default App;
