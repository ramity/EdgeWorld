serverUrl = "wss://echo.websocket.org";

if (window.MozWebSocket) {
  socket = new MozWebSocket(serverUrl);
} else if (window.WebSocket) {
  socket = new WebSocket(serverUrl);
}

socket.onopen = function(msg) {
  console.log('connected');
};

socket.onmessage = function(msg) {
  var response;
  response = JSON.parse(msg.data);
  console.log("Data: " + response.data);
  switch (response.action)
  {
    case "statusMsg":
      return statusMsg(response.data);
    case "clientConnected":
      return clientConnected(response.data);
    case "clientDisconnected":
      return clientDisconnected(response.data);
    case "clientActivity":
      return clientActivity(response.data);
    case "serverInfo":
      return refreshServerinfo(response.data);
  }
};

socket.onclose = function(msg) {
  console.log('disconnected');
};

socket.onmessage = function(msg) {
  var response;
  response = JSON.parse(msg.data);
  switch (response.action) {
    case "statusMsg":
      return statusMsg(response.data);
    case "clientConnected":
      return clientConnected(response.data);
    case "clientDisconnected":
      return clientDisconnected(response.data);
    case "clientActivity":
      return clientActivity(response.data);
    case "serverInfo":
      return refreshServerinfo(response.data);
  }
};

socket.onclose = function(msg) {
  console.log("disconnected");
};

statusMsg = function(msgData) {
  switch (msgData.type) {
    case "info":
      console.log("info " + msgData.text);
      break;
    case "warning":
      console.log("warning " + msgData.text);
      break;
  }
}

clientConnected = function(data) {
  console.log(data.ip + ":" + data.port, data.port);
};

clientDisconnected = function(data) {
  console.log(data.port);
};

refreshServerinfo = function(serverinfo) {
  var ip, port, _ref, _results;
  console.log(serverinfo.clientCount);
  console.log(serverinfo.maxClients);
  console.log(serverinfo.maxConnectionsPerIp);
  console.log(serverinfo.maxRequetsPerMinute);
  _ref = serverinfo.clients;
  _results = [];
  for (port in _ref) {
    ip = _ref[port];
    _results.push(ip + ':' + port, port);
  }
  return _results;
};

return clientActivity = function(port) {
  console.log("clientActivity " + port);
};
