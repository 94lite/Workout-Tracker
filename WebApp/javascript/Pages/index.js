import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StorageAsyncStorage, { deleteAllKeys } from '../models/storage/AsyncStorage';

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

export const storage = new StorageAsyncStorage();

deleteAllKeys().then(res => {
  storage.getCategoryList().then(categories => {
    const category = categories[0];
    storage.addProfile("first profile", category).then(profile => {
      console.warn(profile.id, profile.name);
    });
  })
});

export default Navigation;