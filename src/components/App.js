import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import Navbar from './Navbar.js';
import SocialNetwork from '../abis/SocialNetwork.json';
import Main from "./Main.js";


class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7585")
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    if(SocialNetwork.networks[networkId]){
      const socialNetworkData = SocialNetwork.networks[networkId]
      const socialNetwork = new web3.eth.Contract(SocialNetwork.abi, socialNetworkData.address)
      this.setState({ socialNetwork })
      const postCount = await socialNetwork.methods.postCount().call()
      this.setState({ postCount })
      for (let i = 1; i <= postCount; i++){
        const post = await socialNetwork.methods.posts(i).call()
        this.setState({
          posts: [...this.state.posts, post]
        })
      }
      console.log(this.state.posts);
    } else {
      window.alert('SocialNetwork contract not deployed to detected network')
    }
    
  }


  constructor(props) {
    super(props)
    this.state = {
      socialNetwork: {},
      account: '',
      postCount: 0,
      posts: []
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <Main posts={ this.state.posts } />
      </div>
    );
  }
}

export default App;
