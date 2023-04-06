import React, { useState, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { ListItem, Icon } from '@ui-kitten/components';

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

const Task = (props) => {
  // passed props
  const { name } = props;
  // react state management
  const [active, setActive] = useState(false);
  const [time, setTime] = useState();
  const childRef = useRef();

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    return (
      <RectButton style={styles.hidden}>
        <AnimatedIcon
          name='arrow-right'
          fill='#fff'
          style={[
            styles.actionIcon,
            { transform: [{ translateX: trans }] }
          ]}
        />
      </RectButton>
    )
  }

  const startStopwatch = () => {
    setActive(true);
    childRef.current.close();
  }

  const renderStopwatch = () => {
    if (!active) {
      return null
    }
    return (
      <Text>Hello</Text>
    )
  }

  return (
    <Swipeable
      ref={childRef}
      overshootLeft={false}
      renderLeftActions={renderLeftActions}
      onEnded={startStopwatch}
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
    width: 30,
    marginHorizontal: 10
  },
  hidden: {
    backgroundColor: 'rgb(51, 102, 255)',
    display: 'flex',
    justifyContent: 'center'
  }
});

export default Task;