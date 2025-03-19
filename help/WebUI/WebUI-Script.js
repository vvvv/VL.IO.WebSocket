window.addEventListener("load", () => {

    var socket = null
	var isHovered = false
	
	var message={}

    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

    // Listener for elements that track hover state
    const hoverElements = Array.from(document.querySelectorAll('[data-hover]'))
    hoverElements.forEach(item => {
        item.addEventListener('mouseenter', () => {
			if (!isHovered)
			{
				isHovered = true
				message.Hovered = isHovered
				sendData()
			}
        })
        item.addEventListener('mouseleave', () => {
			if (isHovered)
			{
				isHovered = false
				message.Hovered = isHovered
				sendData()
			}
        })
    });

    // Listener for interactive elements 
    const activeElements = Array.from(document.querySelectorAll('[data-key]'))
    activeElements.forEach(item => {
		if (item.tagName == "A")
		{
			item.addEventListener('click', ()=>{
			setProperty(item)
            sendData()
			})
		}
		else
		{
			item.addEventListener('input', ()=>{
				setProperty(item)
				sendData()
			})
		}

    })

    // Connect to WebSocket Server
    try{
        socket = new WebSocket('ws://127.0.0.1:4444');
        socket.onopen = function() {
            console.log('WebSocket connectioned');
            sendInitialData(activeElements)
        }
        socket.onmessage = function(message){
            const data = JSON.parse(message.data)
            if (data.hasOwnProperty("notification"))
            {
                showToast(data.notification)
            }
        }
        socket.onerror = function(error) {
            console.error('WebSocket error: ' + error);
        }
        socket.onclose = function()
        {
            socket.send("Closing");
        }
    }
    catch{
        console.log ("Can't connect")
    }

    function sendInitialData(items)
    {
        items.forEach(item => {
            if (item.dataset.init !== undefined)
            {
                setProperty(item)
            } 
        })
		message.Hovered = isHovered;
		sendData()
    }

    function showToast(data)
    {
        const title = toastLiveExample.getElementsByClassName('me-auto')[0]
        const body = toastLiveExample.getElementsByClassName('toast-body')[0]
        title.textContent = data.title
        body.textContent = data.content
        toastBootstrap.show()
    }

	function setProperty(item)
	{
		const value = item.dataset.value ? item.dataset.value : item.value
		const floatValue = parseFloat(value)
		const valueToSend = !isNaN(floatValue) ? floatValue : value  
		message[item.dataset.key] = valueToSend
	}
	
	function sendData()
	{
		console.log (message)
		socket.send (JSON.stringify(message))
	}


});