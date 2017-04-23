import { Socket } from '../vendors/phoenix';

export class ConnectionService {

  channel;
  channelName = 'geo:data';
  url         = 'http://localhost:4000/socket';
  // url         = 'http://192.168.99.99:4000/socket';
  // url         = 'http://45.55.196.58:4000/socket';
  lastStatus = '';
  pingDelay = 0;
  pingTimestamp = + new Date();

  constructor(userName) {
    this.userName = userName;
    this.socket = new Socket(this.url, {
      // params: {token: window.userToken}
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    });
    this.socket.onOpen( ev => console.log("OPEN", ev));
    this.socket.onError( ev => console.log("ERROR", ev));
    this.socket.onClose( e => console.log("CLOSE", e));
  }

  connect() {
    this.socket.connect({user_id: this.userName});
    this.channel = this.socket.channel(this.channelName, {});
    this.channel.join()
      .receive("ignore", () => { alert("auth error")
        this.lastStatus = "Auth error!";
      })
      .receive("ok", () => {
        this.lastStatus = "OK!";
        alert("ok");
        this.sendPing();
      });
    this.channel.onError(e => {
      this.lastStatus = "Something wrong!";
    });
    this.channel.onClose(e => {
      this.lastStatus = "Channel closed!";
    });
    this.channel.on("geo:new", msg => {
        console.log(msg);
    });
    this.channel.on("geo:ping", msg => {
        this.pingDelay = (+ new Date()) - this.pingTimestamp;
        this.sendPing();
    });
  }

  wrapMessage(data) {
    return { user: this.userName, body: data };
  }

  push(data) {
    this.channel.push("geo:new", this.wrapMessage(data));
  }

  getQueueLength() {
    return this.sendBuffer.length;
  }

  getConnectionStatus() {
    return this.socket.connectionState();
  }

  getInfo() {
    return {
      url          : this.url,
      queue_length : this.getQueueLength(),
      status       : this.getConnectionStatus(),
      ping_number  : this.pingDelay,
      last_state   : this.lastStatus
    }
  }

  sendPing() {
    if(this.socket.isConnected()) {
      this.pingTimestamp = + new Date();
      this.channel.push("geo:ping", this.wrapMessage({}));
    }
  }


}