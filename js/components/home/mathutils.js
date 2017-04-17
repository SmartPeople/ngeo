import geolib from 'geolib';

export function round(ts) {
  return Math.round(ts * 100) / 100;
}

export function extractLast(num, n) {
  return num.toString().slice(n);
}

export function extractLast4(num) {
  return extractLast(num, -4);
}

export function msToKmph(speed) {
  return speed * 3.6;
}

export function getSomeSpeed(filtered, diff1, diff2) {
  let   out         = '--';
  const arrayLength = filtered.length;
  if (arrayLength > 1) {
    const lastPoint    = filtered[diff2];
    const preLastPoint = filtered[diff1];

    out = geolib.getSpeed(
      {
        lat : preLastPoint.coords.latitude, 
        lng : preLastPoint.coords.longitude, 
        time: +new Date(preLastPoint.timestamp)
      },
      {
        lat : lastPoint.coords.latitude, 
        lng : lastPoint.coords.longitude, 
        time: +new Date(lastPoint.timestamp)
      }
    );
    out = (Math.abs(out) > 1000 ? '--' : round(out)) + ' km/h';
  }
  return out;
}


export function getDistance(filtered) {
    let   out      = '--';
    const arrayLength = filtered.length;
    if (arrayLength > 1) {
      const points = filtered.map((point) => {
        return {
          lat : point.coords.latitude, 
          lng : point.coords.longitude,
        }
      });

      out = geolib.getPathLength(points);
    }
    return out + ' m';
  }