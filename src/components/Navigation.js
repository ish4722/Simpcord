import { ethers } from 'ethers'
import { useEffect } from 'react'

const Navigation = ({ account, setAccount }) => {
  
  const connectHandler = async () => {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if( chainId != "0xaa36a7"){
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
      });
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    } else {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    }
  }


  useEffect(()=>{
    if(account == null){
      connectHandler();
    }
  },[]);


  return (
    <nav>
      <div className='nav__brand'>
        <img className="logos" src="./logo.png" />
        {""}
        <h1>AP_Discord</h1>
      </div>

      {account ? (
        <button
          type="button"
          className='nav__connect'
        >
          {account.slice(0, 6) + '...' + account.slice(38, 42)}
        </button>
      ) : (
        <button
          type="button"
          className='nav__connect'
          onClick={connectHandler}
        >
          Connect
        </button>
      )}
    </nav>
  );
}

export default Navigation;