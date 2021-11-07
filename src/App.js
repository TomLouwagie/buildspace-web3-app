// Import the useEffect and useState hooks!
import { useEffect, useState } from 'react';
import './App.css';

// Constants
const TEST_GIFS = [
	'https://media.giphy.com/media/Cwl1WYPYSmIus/giphy.gif',
	'https://media.giphy.com/media/lPG2GDoq8demMUntts/giphy.gif'
]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');

          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  // If wallet not connected then render button to connect wallet
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  // If wallet connected then render GIFs
  const renderConnectedContainer = () => (
    <div className="connected-container">
    <input
      type="text"
      placeholder="Enter gif link!"
      value={inputValue}
      onChange={onInputChange}
    />
    <button className="cta-button submit-gif-button" onClick={sendGif}>
      Submit
    </button>
    <div className="gif-grid">
      {/* Map through gifList instead of TEST_GIFS */}
      {gifList.map((gif) => (
        <div className="gif-item" key={gif}>
          <img src={gif} alt={gif} />
        </div>
      ))} 
    </div>
  </div>
);

  // UseEffects
  useEffect(() => {
    window.addEventListener('load', async (event) => {
      await checkIfWalletIsConnected();
    });
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      
      // Call Solana program here.

      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">Pigeon GIF page</p>
          <p className="sub-text">
            View your pigeons in the metaverse ✨
          </p>
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
      </div>
    </div>
  );
};

export default App;
