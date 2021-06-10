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
        if (window.ethereum) { //check if Metamask is installed
          try {
              const address = await ethereum.request({ method: 'eth_accounts' }); //connect Metamask
              const obj = {
                      connectedStatus: true,
                      status: "",
                      address: address
                  }
                  return obj;
               
          } catch (error) {
              return {
                  connectedStatus: false,
                  status: "🦊 Connect to Metamask using the button on the top right."
              }
          }
          
    } else {
          return {
              connectedStatus: false,
              status: "🦊 You must install Metamask into your browser: https://metamask.io/download.html"
          }
        } 
      },
  
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = await ethereum.request({ method: 'eth_accounts' });
      console.log(App.account);
    },
  
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const ariContract = await $.getJSON('ARIContract.json')
      App.contracts.ariContract = TruffleContract(ariContract)
      App.contracts.ariContract.setProvider(window.ethereum)
  
      // Hydrate the smart contract with values from the blockchain
      App.ariContract = await App.contracts.ariContract.deployed()

      console.log(App.ariContract)
    },
  
    render: async () => {
      // Prevent double render
    //   if (App.loading) {
    //     return
    //   }
  
      // Update app loading state
      App.setLoading(true)
  
      // Render Account
      $('#account').html(App.account)
  
      // Render Tasks
      //await App.renderTasks()
  
      // Update loading state
      App.setLoading(false)
    },
  
    renderHouse: async (houseId) => {
      // Load the total task count from the blockchain
      const ariCount = await App.ariContract.getARICount(houseId)
      const count = ariCount.toNumber()
      console.log(count)
      const $ariTemplate = $('.AriTemplate')
      for (var i = 0; i < count; i++) {
        // Fetch the task data from the blockchain
        const houseAri = await App.ariContract.houseArikeyMap(houseId,i)
        console.log(houseAri)
        const currentAri = await App.ariContract.houseAriMap(houseId,houseAri)
        const fromDate = currentAri.from_date
        const toDate = currentAri.to_date
        const price = currentAri.price
        const available = currentAri.available
        const block_timestamp = currentAri.block_timestamp
        const modifying_entity = currentAri.modifying_entity

        var startDate = new Date(fromDate.toNumber() * 1000);
        var endDate = new Date(toDate.toNumber() * 1000);

        // Create the html for the task
        const $newariTemplate = $ariTemplate.clone()
        $newariTemplate.find('.fromDate').html(startDate.getDate()+"/"+startDate.getMonth()+"/"+startDate.getFullYear())
        $newariTemplate.find('.toDate').html(endDate.getDate()+"/"+endDate.getMonth()+"/"+endDate.getFullYear())
        $newariTemplate.find('.price').html(price.toString())
        $newariTemplate.find('.available').html(available)
        if(block_timestamp != 0)
            $newariTemplate.find('.block_timestamp').html(new Date(block_timestamp.toNumber() * 1000))
        else
            $newariTemplate.find('.block_timestamp').html(0)
        $newariTemplate.find('.modifyingEntity').html(modifying_entity)

        $('#ariList').append($newariTemplate)
  
        // Show the task
        App.setLoading(false)
        $newariTemplate.show()
      }
    },
  
    searchHouse: async () => {
      App.setLoading(true)
      const content = $('#houseId').val()
      await App.renderHouse(content)
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
      const ariList = $('#ariList')
      if (boolean) {
        loader.show()
        ariList.show()
      } else {
        loader.hide()
        ariList.show()
        content.show()
      }
    }
  }
  
  $(() => {
    $(window).load(() => {
      App.listen(process.env.PORT || 5000);
      App.load()
    })
  })
