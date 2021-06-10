App = {
    loading: false,
    contracts: {},
  
    load: async () => {
      await App.loadWeb3()
      await App.loadAccount()
      await App.loadContract()
      await App.render()
    },
  
    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
    loadWeb3: async () => {
      if (typeof web3 !== 'undefined') {
        App.web3Provider = web3.currentProvider
        web3 = new Web3(web3.currentProvider)
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const ariContract = await $.getJSON('ARIContract.json')
      App.contracts.ariContract = TruffleContract(ariContract)
      App.contracts.ariContract.setProvider(App.web3Provider)
  
      // Hydrate the smart contract with values from the blockchain
      App.ariContract = await App.contracts.ARIContract.deployed()
    },
  
    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      await App.renderTasks()
  
      // Update loading state
      App.setLoading(false)
    },
  
    renderTasks: async () => {
      // Load the total task count from the blockchain
      const ariCount = 1
      const $ariTemplate = $('.AriTemplate')
  
      // Render out each task with a new task template
      for (var i = 1; i <= ariCount; i++) {
        // Fetch the task data from the blockchain
        const houseAri = await App.ariContract.houseArikeyMap(1)[1]
        const currentAri = await App.ariContract.houseAriMap[1][houseAri]
        const fromDate = currentAri.from_date()
        const toDate = currentAri.to_date()
        const price = currentAri.price()
        const available = currentAri.available()
        const block_timestamp = currentAri.block_timestamp()
        const modifying_entity = currentAri.modifying_entity()
  
        // Create the html for the task
        const $newariTemplate = $ariTemplate.clone()
        $newariTemplate.find('.fromDate').html(fromDate)
        $newariTemplate.find('.toDate').html(toDate)
        $newariTemplate.find('.price').html(price)
        $newariTemplate.find('.available').html(available)
        $newariTemplate.find('.modified').html(block_timestamp)
        $newariTemplate.find('.modifyingEntity').html(modifying_entity)

  
        // Show the task
        $newTaskTemplate.show()
      }
    },
  
    searchHouse: async () => {
      App.setLoading(true)
      const content = $('#houseId').val()
      await App.todoList.createTask(content)
      window.location.reload()
    },
  
    toggleCompleted: async (e) => {
      App.setLoading(true)
      const taskId = e.target.name
      await App.todoList.toggleCompleted(taskId)
      window.location.reload()
    },
  
    setLoading: (boolean) => {
      App.loading = boolean
      const loader = $('#loader')
      const content = $('#content')
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })