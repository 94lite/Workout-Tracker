import React, { useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

const Task = (props) => {
  const childRef = useRef()

  const renderLeftActions = (progress, dragX) => {
    return (
      <Animated.Text>Hello</Animated.Text>
    )
  }

  return (
    <Swipeable
      ref={childRef}
      leftThreshold={20}
      renderLeftActions={renderLeftActions}
      onEnded={() => childRef.current.close()}
    >
      <Text>World</Text>
    </Swipeable>
  )
}

const styles = StyleSheet.create({
  rectButton: {
    flex: 1,
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  actionText: {
    fontWeight: 'bold',
    backgroundColor: 'transparent',
  }
});

export default Task;