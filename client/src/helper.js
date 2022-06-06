import getWeb3 from './getWeb3'
import VendingMachine from './contracts/VendingMachine.json'

const loadWeb3 = async () => {
  console.log('sdsdsdsdd', getWeb3)
  try {
    debugger
    const web3 = await getWeb3()
    const accounts = await web3.eth.getAccounts()
    const networkId = await web3.eth.net.getId()
    const deployedNetwork = VendingMachine.networks[networkId]
    const instance = new web3.eth.Contract(
      VendingMachine.abi,
      deployedNetwork && deployedNetwork.address,
    )
    return { web3, accounts, contract: instance }
  } catch (error) {
    console.log(error, 'sdfd')
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    )
  }
}

const purchaseItem = async (contract, setSelectedItem, accounts) => {
  debugger;
  const { methods } = contract
  const { purchaseItem } = methods
  let activeAccount = accounts[0]
  console.log({
    index:setSelectedItem.index,
    setSelectedItem:setSelectedItem._prdDetails._price
  })
  let response = await purchaseItem(setSelectedItem.index,setSelectedItem._prdDetails._price).send({
    from: activeAccount,
  })
  return response;
}

export { loadWeb3, purchaseItem }
