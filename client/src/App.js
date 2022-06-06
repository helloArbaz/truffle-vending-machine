import React, { Component } from 'react'
import SimpleStorageContract from './contracts/SimpleStorage.json'
import getWeb3 from './getWeb3'
import {
  Alert,
  AppBar,
  Box,
  Button,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'

import './App.css'
import { loadWeb3, purchaseItem } from './helper'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      productList: null,
      productMaster: null,
      selectItem: null,
      purchaseInt: false,
    }
    this.connectMetaMask = this.connectMetaMask.bind(this)
    this.connectMetaMask = this.connectMetaMask.bind(this)
    this.loadProductList = this.loadProductList.bind(this)
    this.purchasedClick = this.purchasedClick.bind(this)
  }

  connectMetaMask = async () => {
    let { web3, accounts, contract } = await loadWeb3()
    this.setState({ web3, accounts, contract })
    await this.loadProductList()
  }

  loadProductList = async () => {
    const { web3, accounts, contract } = this.state
    const { methods } = contract
    const { getProduts } = methods
    let response = await getProduts().call()
    this.setState({ productList: response })
    console.log(response, 'response')
  }

  setSelectedItem = (item, index) => {
    this.setState({ selectItem: { ...item, index: index } })
  }

  purchasedClick = async () => {
    const { web3, accounts, contract, selectItem } = this.state
    let response = await purchaseItem(contract, selectItem, accounts)
    this.setState({
      selectItem: null,
      purchaseInt: true,
    })
    await this.loadProductList()
  }

  render() {
    const {
      web3,
      accounts,
      contract,
      productList,
      selectItem,
      purchaseInt,
    } = this.state

    console.log({
      web3,
      accounts,
      contract,
    })

    return (
      <Box>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {`Welcome: ${accounts && accounts[0] ? accounts[0] : 'Guest'}`}
            </Typography>
            <Button
              color="inherit"
              onClick={() => {
                this.connectMetaMask()
              }}
            >
              <AccountBalanceWalletIcon />
            </Button>
          </Toolbar>
        </AppBar>

        {!this.state.web3 && (
          <Box mt={3} color="red" fontSize={30} textAlign="center">
            Please Connect You Wallet
          </Box>
        )}
        <>
          {this.state.web3 && (
            <Box margin={'auto'} width={'35%'} p={2}>
              {
                purchaseInt && <Box mb={2}><Alert severity="success">Collect Your Item.</Alert></Box>
              }
              
              <Box bgcolor={'red'} display="flex" flexDirection={'row'}>
                <Box width={'80%'} bgcolor="#444444" p={2}>
                  <Box bgcolor={'#EEEEEE'} p={1}>
                    <Box borderRadius={1} bgcolor="#FFFFFF" p={1} height="90%">
                      <Box
                        display={'flex'}
                        flexWrap="wrap"
                        justifyContent={'center'}
                      >
                        {productList &&
                          productList.map((value, index) => {
                            return (
                              <Box>
                                <Box
                                  margin={1}
                                  borderRadius={1}
                                  border={'1px solid gray'}
                                  height={70}
                                  width={50}
                                  p={0.5}
                                >
                                  <Box
                                    flexGrow={'initial'}
                                    display={'flex'}
                                    justifyContent="space-between"
                                    flexDirection={'column'}
                                    textAlign="center"
                                  >
                                    <Box mt={1} fontWeight="bold" fontSize={11}>
                                      {value._prdDetails._itemName}
                                    </Box>
                                    <Box mt={2.5}>
                                      <Box
                                        fontSize={8}
                                        color={'green'}
                                        fontWeight="bold"
                                      >
                                        Price: {value._prdDetails._price}
                                      </Box>
                                      <Box
                                        fontSize={8}
                                        color={'red'}
                                        fontWeight="bold"
                                      >
                                        Qty: {value._prdDetails._unit}
                                      </Box>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            )
                          })}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box width={'20%'} bgcolor="red" pl={1} pr={1} pt={3} pb={2}>
                  <Box fontWeight={'bold'} fontSize={12} pt={0} p={1} pl={0}>
                    Select Item
                  </Box>
                  <Box borderRadius={2} bgcolor={'#FFFFFF'}>
                    <Box
                      display={'flex'}
                      flexDirection="column"
                      alignItems={'center'}
                      pt={1}
                      pb={1}
                      height={300}
                      overflow="auto"
                    >
                      {productList &&
                        productList.map((value, index) => {
                          return (
                            <Box
                              borderRadius={1}
                              style={{ cursor: 'pointer' }}
                              margin={0.5}
                              border={'1px solid black'}
                              height={100}
                              width={'50%'}
                              p={1}
                              display="flex"
                              justifyContent={'center'}
                              alignItems="center"
                              onClick={() => {
                                this.setSelectedItem(value, index)
                              }}
                              bgcolor={
                                index === (selectItem && selectItem.index)
                                  ? 'green'
                                  : 'transparent'
                              }
                            >
                              {value._prdDetails._itemName}
                            </Box>
                          )
                        })}
                    </Box>
                  </Box>
                  <Box mt={2}>
                    <Button
                      disabled={!selectItem}
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={() => this.purchasedClick()}
                    >
                      Go
                    </Button>
                  </Box>
                  <Box
                    onClick={() => {
                      this.setState({ purchaseInt: false })
                    }}
                    style={{ cursor: purchaseInt && 'pointer' }}
                    mt={2}
                    borderRadius={1}
                    border="1px solid gray"
                    height={100}
                    textAlign="center"
                    alignItems={'center'}
                    display="flex"
                    justifyContent={'center'}
                    color="white"
                    fontWeight={'bold'}
                    flexDirection="column"
                  >
                    <Box>{`Collect`}</Box>
                    <Box>{` ${purchaseInt ? `[ 1 ]` : ''}`}</Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </>
      </Box>
    )
  }
}

export default App
