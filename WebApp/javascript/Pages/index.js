import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

import Profiles from './Profiles';

const BackIcon = (props) => (
  <Icon {...props} name='arrow-back'/>
);

const Navigation = () => {
  const [activeProfile, setActiveProfile] = useState();

  const renderBackAction = () => (
    <TopNavigationAction
      icon={BackIcon}
      onPress={() => setActiveProfile(undefined)}
    />
  );

  const renderHeader = () => {
    return (
      <TopNavigation
        alignment='center'
        title={activeProfile ? activeProfile : 'Profiles'}
        accessoryLeft={activeProfile ? renderBackAction : undefined}
      />
    )
  }

  const selectPage = () => {
    if (activeProfile) {
      return (
        <Text>
          {activeProfile}
        </Text>
      )
    }
    return (
      <Profiles
        switchProfile={value => setActiveProfile(value)}
      />
    )
  }

  return (
    <View style={{flex: 1}}>
      {renderHeader()}
      {selectPage()}
    </View>
  )
}

export default Navigation;