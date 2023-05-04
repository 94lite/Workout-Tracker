import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, Divider, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

import { AddIcon, BackIcon } from '../../components/Icons';
import Task from './Task';

const Active = ({ route, navigation }) => {
  const { profile } = route.params;
  const [tasks, setTasks] = useState([]);

  const renderHeader = () => {
    return (
      <TopNavigation
        alignment='center'
        title={profile}
        subtitle='Active Profile'
        accessoryLeft={BackAction}
        accessoryRight={NewEntryAction}
      />
    )
  }
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
  );
  const NewEntryAction = () => (
    <TopNavigationAction icon={AddIcon} onPress={() => null}/>
  );
  const navigateBack = () => {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderHeader()}
      <Divider />
      <View style={styles.container}>
        <GestureHandlerRootView style={styles.content}>
          {tasks.map((task, i) => (
            <Task
              key={i}
              name={task.name}
              initial={task.time}
            />
          ))}
        </GestureHandlerRootView>
        <Button size='small'>
          Start
        </Button>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  content: {
    flex: 1
  }
});

export default Active;