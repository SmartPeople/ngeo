import { Socket } from '../vendors/phoenix';
import { objectToSize } from '../utils/mathutils';
import { Settings } from "./settings";

export class ConnectionService {

  channel;
  connTime      = 0;
  channelName   = 'geo:data';
  url           = Settings.dataUrl;
  lastStatus    = '';
  pingDelay     = 0;
  pingTimestamp = + new Date();

  traffic = {
    "inbound"  : 0,
    "outbound" : 0
  }

  constructor(userName, userToken) {

    this.userName = userName;
    this.socket = new Socket(this.url, {
      params: {token: userToken},
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    });
    this.socket.onOpen( ev => console.log("OPEN", ev));
    this.socket.onError( ev => console.log("ERROR", ev));
    this.socket.onClose( e => console.log("CLOSE", e));
  }

  connect() {
    this.socket.connect();
    this.channel = this.socket.channel(this.channelName, {});
    this.channel.join()
      .receive("ignore", () => { alert("auth error")
        this.lastStatus = "Auth error!";
      })
      .receive("ok", () => {
        this.lastStatus = "OK!";
        this.connTime = +new Date();
        this.sendPing();
      });
    this.channel.onError(e => {
      this.lastStatus = "Something wrong!";
      this.connTime = 0;
    });
    this.channel.onClose(e => {
      this.lastStatus = "Channel closed!";
      this.connTime = 0;
    });
    this.channel.on("geo:new", msg => {
      this.traffic.inbound += objectToSize(msg);
      console.log(msg);
    });
    this.channel.on("geo:ping", msg => {
      this.pingDelay = (+ new Date()) - this.pingTimestamp;
      this.traffic.inbound += objectToSize(msg);
      this.sendPing();
    });
  }

  wrapMessage(data) {
    return { user: this.userName, body: data };
  }

  push(data) {
    this.pushData("geo:new", data);
  }

  getQueueLength() {
    return this.socket.sendBuffer.length;
  }

  getConnectionStatus() {
    return this.socket.connectionState();
  }

  getPingDelay() {
    return this.pingDelay;
  }

  getLastStatus() {
    return this.lastStatus;
  }

  getTraffic() {
    return this.traffic;
  }

  getConnTime() {
    return this.connTime;
  }


  getInfo() {
    return {
      url          : this.url,
      queue_length : this.getQueueLength(),
      status       : this.getConnectionStatus(),
      ping_number  : this.getPingDelay(),
      last_state   : this.getLastStatus(),
      traffic      : this.getTraffic(),
      connTime     : this.getConnTime()
    }
  }

  sendPing() {
    if(this.socket.isConnected()) {
      var tHandler = setTimeout(() => {
        this.pingTimestamp = + new Date();
        this.pushData("geo:ping", {});
        clearTimeout(tHandler);
      }, 1000);
      
    }
  }

  pushData(msg, data) {
    const out         = this.wrapMessage(data);
    this.traffic.outbound += objectToSize(out);
    this.channel.push(msg, out);
  }


}