import React, { useState, useRef, useMemo } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ListItem, Icon } from '@ui-kitten/components';

import Stopwatch from '../../components/Stopwatch';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const Task = (props) => {
  // passed props
  const { name, initial } = props;
  // passed functions
  const { triggerDelete } = props;
  // react state management
  const [active, setActive] = useState(false);
  const swipeRef = useRef();
  const stopwatchRef = useRef();

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.hidden}>
        <AnimatedIcon
          name={active ? 'pause-circle' : 'play-circle'}
          fill='#fff'
          style={[
            styles.actionIcon,
            { transform: [{ translateX: trans }] }
          ]}
        />
      </RectButton>
    )
  }

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [-101, -100, -50, 0],
      outputRange: [-1, 0, 0, 20],
    });
    return (
      <RectButton
        onPress={onPress}
        style={styles.hidden}
      >
        <AnimatedIcon
          name={'archive'}
          fill='#fff'
          style={[
            styles.actionIcon,
            { transform: [{ translateX: trans }] }
          ]}
        />
      </RectButton>
    )
  }

  const stopwatchAction = () => {
    swipeRef.current.close();
    if (!active) {
      stopwatchRef.current.start();
    } else {
      stopwatchRef.current.pause();
    }
    setActive(!active);
  }

  const renderStopwatch = useMemo(() => {
    return (
      <Stopwatch
        ref={stopwatchRef}
        initial={initial}
      />
    )
  }, []);

  const onSwipe = direction => {
    if (direction === 'left') {
      stopwatchAction();
    } else {}
  }

  const onPress = () => {
    swipeRef.current.close();
    if (triggerDelete) {
      triggerDelete();
    } else {
      console.warn('triggerDelete is not defined for Task component');
    }
  }

  return (
    <Swipeable
      ref={swipeRef}
      overshootLeft={false}
      overshootRight={false}
      renderLeftActions={renderLeftActions}
      renderRightActions={active ? () => undefined : renderRightActions}
      onSwipeableWillOpen={onSwipe}
    >
      <ListItem
        title={name}
        description='some description'
        style={{ backgroundColor: 'rgba(34, 43, 69, 1) !important' }}
        accessoryRight={renderStopwatch}
      />
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  actionIcon: {
    width: 32,
    marginHorizontal: 16
  },
  hidden: {
    backgroundColor: 'rgb(51, 102, 255)',
    display: 'flex',
    justifyContent: 'center'
  }
});

export default Task;