import { React, useState } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Button, Divider, Input, Menu, MenuItem, TopNavigation } from '@ui-kitten/components';

import { AddIcon, ForwardIcon } from '../../components/Icons';

const Profiles = ({ navigation }) => {
  const [profiles, setProfiles] = useState([]);

  const addProfile = value => {
    const cp = [...profiles];
    cp.push(value);
    setProfiles(cp);
  }

  const switchProfile = profile => {
    navigation.navigate('Active', {
      profile
    })
  }

  const renderHeader = () => {
    return (
      <TopNavigation
        alignment='center'
        title='Profiles'
      />
    )
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      {renderHeader()}
      <Divider />
      <View style={styles.container}>
        <Menu
          onSelect={i => switchProfile(profiles[i.row])}
          style={styles.menu}
        >
          {profiles.map((item, i) => (
            <MenuItem
              key={i}
              title={item}
              accessoryRight={ForwardIcon}
            />
          ))}
        </Menu>
        <ProfileAdder
          onSubmit={value => addProfile(value)}
        />
      </View>
    </SafeAreaView>
  )
}

const ProfileAdder = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  
  const onPress = () => {
    onSubmit(value);
    setValue('');
  }

  return (
    <View style={styles.adder}>
      <Input
        placeholder='New Profile'
        value={value}
        onChangeText={nextValue => setValue(nextValue)}
        style={styles.adderInput}
        onSubmitEditing={onPress}
      />
      <Button
        size='small'
        accessoryLeft={AddIcon}
        onPress={onPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  menu: {
    flex: 1
  },
  icon: {
    width: 32,
    height: 32,
  },
  adder: {
    display: 'flex',
    flexDirection: 'row',
  },
  adderInput: {
    flexGrow: 1
  }
});

export default Profiles;