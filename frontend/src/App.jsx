import './App.css';
import {DAppProvider, Sepolia, Goerli} from "@usedapp/core"
import Main from './components/Main/Main';
import { SEPOLIA_PROVIDER, GOERLI_PROVIDER } from './providers';
function App() {

  const config = {
    readOnlyChainId: Sepolia.chainId,
    readOnlyUrls: {
      [Goerli.chainId]: GOERLI_PROVIDER,
      [Sepolia.chainId]: SEPOLIA_PROVIDER,
    },
    notification:{
      checkInterval: 1000,
      expirationPeriod: 1000
    }
  }
  return (
    <>
      <DAppProvider config={config}>
        <Main />
      </DAppProvider>
    </>
  )
}

export default App
