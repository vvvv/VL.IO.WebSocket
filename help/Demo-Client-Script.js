window.addEventListener("load", () => {

    const form = document.getElementById("Form")
    const x = document.getElementById("x")
    const y = document.getElementById("y")

    var socket = null

    try{
        socket = new WebSocket('ws://127.0.0.1:4444');
        socket.onopen = function(event) {
            console.log('WebSocket connectioned');
            sendData()
        }
        socket.onerror = function(error) {
            console.error('WebSocket error: ' + error);
        }
        socket.onmessage = function(message){
            const data = JSON.parse(message.data)
            x.value = data[0]
            y.value = data[1]
        }
        socket.onclose = function()
        {
            socket.send("Closing");
        }
    }
    catch{
        console.log ("Can't connect")
    }

    function sendData()
    {
        const message = serialize(form)

        try {
            socket.send(message);
        }
        catch (error){
            console.log (error)
        }
    }

    form.addEventListener("input", sendData);
});

function serialize(obj)
{   
    var data = {}
    var formData = new FormData(obj)
    for (var key of formData.keys()) {
        var value = formData.get(key)
        value = key == "Size" ? parseFloat(value) : value
        value = key == "Color" ? HexToArray(value) : value 
        data[key] = value
    }
    return JSON.stringify(data)
}

function HexToArray (hex)
{
    const tempHex = hex.replace('#', '')
    const color=[
        parseInt(tempHex.substring(0, 2), 16)/255,
        parseInt(tempHex.substring(2, 4), 16)/255,
        parseInt(tempHex.substring(4, 6), 16)/255,
        1
    ]
    return color
}