import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profiles from './Profiles';

const { Navigator, Screen } = createStackNavigator();

const Navigation = () => {
  return (
    <Navigator screenOptions={{headerShown: false}}>
      <Screen name='Profiles' component={Profiles}/>
    </Navigator>
  )
}

export default Navigation;