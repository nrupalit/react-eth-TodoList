import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'
import NewContract from '../abis/NewContract.json';


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
    
    const todoListData = NewContract.networks[networkId]
    const todoList = new web3.eth.Contract(NewContract.abi, todoListData.address)
    this.setState({ todoList })
    const taskCount = await todoList.methods.notNumber().call()
    console.log(taskCount);
  }


  constructor(props) {
    super(props)
    this.state = {
      todoList: {},
      account: ''
    }
  }

  render() {
    return (
      <div>
        Hello World
      </div>
    );
  }
}

export default App;
