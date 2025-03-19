window.addEventListener("load", () => {

    var socket = null
    var lastHoveredState = false

    const toastLiveExample = document.getElementById('liveToast')
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)

    // Listener for elements that track hover state
    const hoverElements = Array.from(document.querySelectorAll('[data-hover]'))
    hoverElements.forEach(item => {
        item.addEventListener('mouseenter', () => {
            sendHover(true)
        })
        item.addEventListener('mouseleave', () => {
            sendHover(false)
        })
    });

    // Listener for interactive elements 
    const activeElements = Array.from(document.querySelectorAll('[data-key]'))
    activeElements.forEach(item => {
        item.addEventListener('click', ()=>{
            sendValue(item)
        })
    });

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
                sendValue(item)
            } 
        });
    }

    function showToast(data)
    {
        const title = toastLiveExample.getElementsByClassName('me-auto')[0]
        const body = toastLiveExample.getElementsByClassName('toast-body')[0]
        title.textContent = data.title
        body.textContent = data.content
        toastBootstrap.show()
    }

    function sendValue(item)
    {
        const value = item.dataset.value ? item.dataset.value : item.value
        socket.send (JSON.stringify ({ [item.dataset.key]: value}))
    }

    function sendHover(hover){
        if (lastHoveredState != hover)
        {
            socket.send (JSON.stringify ({ hovered: hover}))
            lastHoveredState = hover
        }
    }

});