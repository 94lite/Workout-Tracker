import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useStopwatch } from 'react-use-precision-timer';

const Stopwatch = forwardRef((props, _ref) => {
  const stopwatch = useStopwatch();
  // react state management
  const [elapsedTime, setElapsedTime] = useState([ 0, 0, 0, 0 ]);
  const started = useRef(false);
  const interval = useRef();
  useImperativeHandle(_ref, () => ({
    start: () => startOrResume(),
    pause: () => pause()
  }));

  const startOrResume = () => {
    interval.current = setInterval(() => {
      const retrievedTime = stopwatch.getElapsedRunningTime();
      const hours = Math.floor(retrievedTime / (1000 * 60 * 60));
      const minutes = Math.floor((retrievedTime / (1000 * 60)) % 60);
      const seconds = Math.floor((retrievedTime / 1000) % 60);
      const milliseconds = Math.floor((retrievedTime % 1000) / 10);
      setElapsedTime([ hours, minutes, seconds, milliseconds ]);
    }, 20);
    if (started.current) {
      stopwatch.resume();
    } else {
      started.current = true;
      stopwatch.start();
    }
  };
  const pause = () => {
    clearInterval(interval.current);
    stopwatch.pause();
  };
  
  const [ hours, minutes, seconds, milliseconds ] = elapsedTime;
  return (
    <View style={styles.flex}>
      <Segment value={hours} />
      <Digit digit=':'/>
      <Segment value={minutes} />
      <Digit digit=':'/>
      <Segment value={seconds} />
      <Digit digit=':'/>
      <Segment value={milliseconds} />
    </View>
  )
});

const Segment = ({ value }) => {
  var arrValue = value.toString().split('');
  if (arrValue.length < 2) {
    arrValue.unshift('0');
  }
  return arrValue.map((digit, i) => <Digit key={i} digit={digit}/>)
}

const Digit = ({ digit }) => {
  return (
    <View style={styles.digit}>
      <Text style={styles.digitText}>{digit}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  flex: {
    display: 'flex',
    flexDirection: 'row'
  },
  digit: {
    width: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  digitText: {
    color: '#fff'
  }
})

export default Stopwatch;