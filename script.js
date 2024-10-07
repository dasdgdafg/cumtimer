const urlParams = new URLSearchParams(window.location.search);
const streamer = urlParams.get('streamer');

function reconnect() {
  const exampleSocket = new WebSocket(
    "wss://pomf.tv/websocket/"
  );
  
  exampleSocket.onopen = (event) => {
    exampleSocket.send('{"roomId":"' + streamer + '","userId":"0","apikey":"Guest","action":"connect"}');
  };
  
  exampleSocket.onmessage = async (event) => {
    d = JSON.parse(event.data)
    if (d.type == 'message') {
      await checkMessage(d.message.trim())
    }
  };
  
  exampleSocket.onclose = async (event) => {
    await new Promise(r => setTimeout(r, 10000));
    reconnect();
  };
}

async function checkMessage(message) {
  if (message == "!start" && start == null) {
    start = Date.now();
  } else if (message == "!cum") {
    //savedTimes.push(Date.now());
    var delta = Date.now() - start; // milliseconds elapsed since start
    formatted = "💦 " + new Date(delta).toISOString().substr(11, 8); // convert to hh:mm:ss
    savedTimes.push(formatted);
  } else if (message == "!uncum") {
    savedTimes.pop();
  }
}

reconnect();

var start = null;
var savedTimes = [];

setInterval(function() {
  if (start == null) {
    return;
  }
  var delta = Date.now() - start; // milliseconds elapsed since start
  formatted = new Date(delta).toISOString().substr(11, 8); // convert to hh:mm:ss
  text = formatted + "\n" + savedTimes.join("\n");
  document.getElementById("main").innerText = text;
}, 1000);
