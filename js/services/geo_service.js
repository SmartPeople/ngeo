
import BackgroundGeolocation from "react-native-background-geolocation";

export const EVENT_TYPE = {
  "POSITION_MSG"      : 0,
  "ERROR_MSG"         : 1,
  "MOTION_CHANGE_MSG" : 2,
  "ACTIVITY_CHANGE"   : 3,
  "PROVIDER_CHANGE"   : 4,
  "START"             : 5
};

export class GeoService {

  config = {
    desiredAccuracy  : 0,
    stationaryRadius : 25,
    distanceFilter   : 10,
    stopTimeout      : 1,
    debug            : true,
    logLevel         : BackgroundGeolocation.LOG_LEVEL_VERBOSE,
    stopOnTerminate  : true,
    startOnBoot      : false,
    preventSuspend   : true,
    heartbeatInterval: 10
  }

  constructor() {
    BackgroundGeolocation.configure(this.config);
  }

  lPos            = (location) => this.setPostionToState(location)

  lError          = (error) => this.addMsgToState(error, EVENT_TYPE.ERROR_MSG)

  lMotionChange   = (msg) => this.addMsgToState(msg, EVENT_TYPE.MOTION_CHANGE_MSG)

  lActivityChange = (msg) => this.addMsgToState({message: 'activity change:'+msg}, EVENT_TYPE.ACTIVITY_CHANGE)

  lProviderChange = (msg) => this.addMsgToState(msg, EVENT_TYPE.PROVIDER_CHANGE)

  mount() {
    BackgroundGeolocation.on('location', this.lPos);
    BackgroundGeolocation.on('error', this.lError);
    BackgroundGeolocation.on('motionchange', this.lMotionChange);
    BackgroundGeolocation.on('activitychange', this.lActivityChange);
    BackgroundGeolocation.on('providerchange', this.lProviderChange);
  }

  unmount() {
    BackgroundGeolocation.un('location', this.lPos);
    BackgroundGeolocation.un('error', this.lError);
    BackgroundGeolocation.un('motionchange', this.lMotionChange);
    BackgroundGeolocation.un('activitychange', this.lActivityChange);
    BackgroundGeolocation.un('providerchange', this.lProviderChange);
  }

  static start() {
    BackgroundGeolocation.start(() => console.log("- Start success"));
  }

  static stop() {
    BackgroundGeolocation.stop(() => console.log("- Stop success"));
  }

  setPostionToState;
  addMsgToState;

  onPosition(callback) {
    this.setPostionToState = callback;
  }

  onOtherMessage(callback) {
    this.addMsgToState = callback;
  }

}