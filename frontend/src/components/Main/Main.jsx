import { useEtherBalance, useEthers, Goerli, useConfig } from '@usedapp/core'
import {Card, Button, Tabs} from "antd";
import { sliceAddress } from '../../utils';
import Request from '../Request/Request';
import Deposit from '../Deposit/Deposit';



const Main = () => {
    const { account, deactivate, activateBrowserWallet, chainId, library } = useEthers();
    const config = useConfig();

    const items = [
        {
          key: '1',
          label: 'Request',
          children: <Request account={account} />,
        },
        {
          key: '2',
          label: 'Deposit',
          children: <Deposit account={account} />,
        }
      ];
    return ( <div>
        <div className='nav'>
          <div>
            <h2>Bestia Faucet</h2>
          </div>
          <div>
            <div>
              {account ? (
                <>
                  <Button type='primary' style={{marginRight:10}}>{sliceAddress(account)}</Button>
                  <Button type='primary' danger onClick={() => deactivate()} >Disconnect Wallet</Button>
                </>
                
              ):(
                <Button type='primary' onClick={() => activateBrowserWallet()} >Connect Wallet</Button>
              )}
            </div>
            
          </div>
        </div>
        <div className='page-container'>
          {account?chainId && !config.readOnlyUrls[chainId]?(
            <div style={{minHeight:"80vh", display:"flex", justifyContent:"center", alignItems:"center"}}>
                <Card style={{width: 400}}>
                    <h2 style={{textAlign:"center"}}>Connect your Wallet. Use Sepolia Eth Network</h2>  
                </ Card>
            </div>
          ):(
            <div>
                <Tabs 
                className='tab' 
                tabBarStyle={{border: "none",borderColor:"transparent",
                color:"white"}} 
                tabBarGutter={30} 
                defaultActiveKey="1" 
                type='card' 
                centered 
                items={items} />
            </div>
          ):(
            <div style={{minHeight:"80vh", display:"flex", justifyContent:"center", alignItems:"center"}}>
              <Card style={{width: 400}}>
              <h2 style={{textAlign:"center"}}>Connect your Wallet. Use Goerli Eth Network</h2>  
            </ Card>
            </div>
            
          )}
            
        </div>
      </div> );
}
 
export default Main;