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
      storage.getProfile(profile.id).then(profile2 => {
        profile2.updateName("new name").then(res => {
          storage.getProfile(profile.id).then(profile3 => {
            console.warn(profile3.id, profile3.name, profile3.category);
          });
        });
      });
    });
  })
});

export default Navigation;