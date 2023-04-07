import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  memo
} from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useStopwatch } from 'react-use-precision-timer';

const Stopwatch = forwardRef((props, _ref) => {
  const stopwatch = useStopwatch();
  // passed props
  const { initial } = props;
  // react state management
  const [elapsedTime, setElapsedTime] = useState([0, 0, 0, 0]);
  const started = useRef(false);
  const interval = useRef();
  useEffect(() => {
    setElapsedTime(getTimeSplits());
  }, []);
  useImperativeHandle(_ref, () => ({
    start: () => startOrResume(),
    pause: () => pause()
  }));

  const getTimeSplits = () => {
    var retrievedTime = stopwatch.getElapsedRunningTime();
    if (initial) {
      retrievedTime += initial;
    }
    const hours = Math.floor(retrievedTime / (1000 * 60 * 60));
    const minutes = Math.floor((retrievedTime / (1000 * 60)) % 60);
    const seconds = Math.floor((retrievedTime / 1000) % 60);
    const milliseconds = Math.floor((retrievedTime % 1000) / 10);
    return [ hours, minutes, seconds, milliseconds ]
  }

  const startOrResume = () => {
    interval.current = setInterval(() => {
      setElapsedTime(getTimeSplits());
    }, 50);
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

const Segment = memo(({ value }) => {
  var arrValue = value.toString().split('');
  if (arrValue.length < 2) {
    arrValue.unshift('0');
  }
  return arrValue.map((digit, i) => <Digit key={i} digit={digit}/>)
})

const Digit = memo(({ digit }) => {
  return (
    <View style={styles.digit}>
      <Text style={styles.digitText}>{digit}</Text>
    </View>
  )
})

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