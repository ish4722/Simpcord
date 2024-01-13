import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import io from "socket.io-client"

// Components
import Navigation from './components/Navigation'
import Servers from './components/Servers'
import Channels from './components/Channels'
import Messages from './components/Messages'

// ABIs
import Dappcord from './abis/Dappcord.json'

// Config
import config from './config.json';

// Socket
// const socket = io('http://localhost:3000', { transports: ['websocket'] });
//const socket = io('http://localhost:3030');
const socket = io('https://discord-server-pgya.onrender.com');

function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)

  const [dappcord, setDappcord] = useState(null)
  const [channels, setChannels] = useState([])

  const [currentChannel, setCurrentChannel] = useState(null)
  const [messages, setMessages] = useState([])

  async function LoadBlockchainData (){

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider)

    const network = await provider.getNetwork()

    // const dappcord = new ethers.Contract(config[network.chainId].DiscordApp.address, Dappcord, provider)
    const dappcord = new ethers.Contract("0x9750096a3ef8b187073ceaf5e4f370ffc9994265", Dappcord, provider)
    setDappcord(dappcord)

    const totalChannels = await dappcord.totalChannels()
    const channels = []

    for (var i = 1; i <= totalChannels; i++) {
      const channel = await dappcord.getChannel(i)
      channels.push(channel)
    }
    setChannels(channels)

    window.ethereum.on('accountsChanged', async () => {
      window.location.reload()
    })
  }

  useEffect(() => {

    LoadBlockchainData();
    // --> https://socket.io/how-to/use-with-react-hooks

    socket.on("connect", () => {
      socket.emit('get messages')
    })

    socket.on('new message', (messages) => {
      setMessages(messages)
    })

    socket.on('get messages', (messages) => {
      setMessages(messages)
    })

    return () => {
      socket.off('connect')
      socket.off('new message')
      socket.off('get messages')
    }
  }, [])

useEffect(()=>{
  if(account != null && channels.length == 0){
    setTimeout(LoadBlockchainData,10000);
  }
})

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />

      <main>
        <Servers />

        <Channels
          provider={provider}
          account={account}
          dappcord={dappcord}
          channels={channels}
          currentChannel={currentChannel}
          setCurrentChannel={setCurrentChannel}
        />

        <Messages account={account} messages={messages} currentChannel={currentChannel} />
      </main>
    </div>
  );
}

export default App;
