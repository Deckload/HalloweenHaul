import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { faChevronRight, faChevronLeft, faCircle, faCheckCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './App.css';

import Footer from './components/footer';
import Header from './components/header';
import { setPublicKeySetter, login } from './components/login';

function App() {
  const [publicKey, setPublicKey] = useState(null);
  const [haulName, setHaulName] = useState(null);
  const [haulImg, setHaulImg] = useState(null);

	const [candy, setCandy] = useState([
	]);

  const [postUrl, setPostUrl] = useState(null);
  const [count, setCount] = useState(null);

  const [inputValue, setInputValue] = useState('');

	const handleAddButtonClick = () => {
		const newItem = {
			itemName: inputValue,
			quantity: 1,
		};

		const newItems = [...candy, newItem];

		setCandy(newItems);
		setInputValue('');
	};

	const handleQuantityIncrease = (index) => {
		const newItems = [...candy];

		newItems[index].quantity++;

		setCandy(newItems);
	};

	const handleQuantityDecrease = (index) => {
		const newItems = [...candy];

		newItems[index].quantity--;

		setCandy(newItems);
	};


  setPublicKeySetter(setPublicKey);
  useEffect(() => {
    if (publicKey) {
      axios.post("/setPublicKey", { publicKey: publicKey }).then(console.log("publicKey sent to backend"));
    }
  }, [publicKey]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("hello world!");
      const res = await axios.post("/postImage", {haulImg:haulImg,haulName:haulName,candy:candy,publicKey: publicKey })
        .then((res) => {
          if (res.status === 200) { return res.data }
        });
      setPostUrl(res.postUrl);
  }

  return (<BrowserRouter basename="/">
    <div className="App">
      <header className="App-header">

        <Header />

        {postUrl == null && count == null ? <>

          {
            publicKey ?
              <p style={{ fontSize: "small" }}>You are {publicKey}</p> :
              <><button className="button" onClick={login}>Login with DESO</button><br /></>
          }
        <input type="Haul Name" value={haulName} style={{width: "500px",height:"50px"}} onChange={(e) => { setHaulName(e.target.value) }}/>
        <input type="file" style={{width: "500px",height:"100px",fontSize:"30px"}} onChange={()=>(e) => { setHaulImg(e.target.value) }}/>
          <div className='app-background'>
			<div className='main-container'>
        <div className='add-item-box'>
					<input value={inputValue} onChange={(event) => setInputValue(event.target.value)} className='add-item-input' placeholder='Add an item...' />
					<FontAwesomeIcon icon={faPlus} onClick={() => handleAddButtonClick()} />
				</div>
				<div className='item-list'>
					{candy.map((item, index) => (
						<div className='item-container'>
							<div className='item-name'>
                  {item.itemName}
							</div>
							<div className='quantity'>
								<button>
									<FontAwesomeIcon icon={faChevronLeft} onClick={() => handleQuantityDecrease(index)} />
								</button>
								<span> {item.quantity} </span>
								<button>
									<FontAwesomeIcon icon={faChevronRight} onClick={() => handleQuantityIncrease(index)} />
								</button>
							</div>
						</div>
					))}
				</div>
        </div>
		</div>
    
    <input type="submit" value="SEND" onClick={handleSubmit}className="button" disabled={publicKey ? false : true} style={publicKey ? {} : { backgroundColor: 'grey', color: 'black' }} />


          <Footer />
        </> : <>
          <a href={postUrl} target="_blank" rel="noreferrer"><button className="button">Look at your haul</button></a>
          <br />
          <button className="button" onClick={() => { window.location.reload() }}>Return</button>
        </>
        }
      </header>
    </div ></BrowserRouter>
  );
}

export default App;
