import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Profiles from './Profiles';
import Active from './Active';

const { Navigator, Screen } = createStackNavigator();

const Navigation = () => {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name='Profiles' component={Profiles}/>
      <Screen name='Active' component={Active}/>
    </Navigator>
  )
}

export default Navigation;