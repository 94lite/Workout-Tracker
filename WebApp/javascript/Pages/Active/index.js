import React from 'react';
import { SafeAreaView, Text, View, StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Button, Divider, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

import { BackIcon } from '../../components/Icons';
import Task from './task';

const Active = ({ route, navigation }) => {
  const { profile } = route.params;

  const renderHeader = () => {
    return (
      <TopNavigation
        alignment='center'
        title={profile}
        subtitle='Active Profile'
        accessoryLeft={BackAction}
      />
    )
  }
  const BackAction = () => (
    <TopNavigationAction icon={BackIcon} onPress={navigateBack}/>
  );
  const navigateBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderHeader()}
      <Divider />
      <View style={styles.container}>
        <GestureHandlerRootView style={styles.content}>
          <Task />
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