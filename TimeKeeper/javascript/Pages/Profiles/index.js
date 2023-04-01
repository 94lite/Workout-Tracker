import { React, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Input, Menu, MenuItem } from '@ui-kitten/components';

const Profiles = () => {
  const [selectedIndex, setSelectedIndex] = useState();
  const [value, setValue] = useState('');

  return (
    <View style={styles.container}>
      <Menu
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
        style={styles.menu}
      >
        <MenuItem title='Users' />
        <MenuItem title='Orders' />
        <MenuItem title='Transactions' />
      </Menu>
      <Input
        placeholder='New Profile'
        value={value}
        onChangeText={nextValue => setValue(nextValue)}
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
});

export default Profiles;