import { React, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon, Input, Menu, MenuItem } from '@ui-kitten/components';

const ForwardIcon = props => (
  <Icon {...props} name='arrow-ios-forward'/>
);

const AddIcon = props => (
  <Icon {...props} name='plus-outline'/>
)

const Profiles = ({ switchProfile }) => {
  const [profiles, setProfiles] = useState([]);

  const addProfile = value => {
    const cp = [...profiles];
    cp.push(value);
    setProfiles(cp);
  }

  return (
    <View style={styles.container}>
      <Menu
        onSelect={i => {
          console.log(i);
          console.log(profiles[i]);
          switchProfile(profiles[i.row]);
        }}
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