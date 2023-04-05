import React from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native'
import { Divider, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

import { BackIcon } from '../../components/Icons';

const Active = ({ route, navigation }) => {
  const { profile } = route.params;

  const navigateBack = () => {
    navigation.goBack();
  };

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

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderHeader()}
      <Divider />
      <View style={styles.container}>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  }
});

export default Active;