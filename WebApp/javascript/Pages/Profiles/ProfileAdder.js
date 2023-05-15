import { React, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Input, Select, SelectItem } from '@ui-kitten/components';

import { AddIcon } from '../../components/Icons';
import { storage } from '..';

const ProfileAdder = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [selectedIndex, setSelectedIndex] = useState();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    storage.getCategoryList()
      .then(res => {
        setCategories(res);
      }).catch(err => null);
  }, []);
  
  const onPress = () => {
    if (!(name)) {
      console.warn("A name has not been specified");
      return
    }
    if (!(selectedIndex)) {
      console.warn("A category has not been specified");
      return
    }
    const category = categories[selectedIndex.row]
    onSubmit(name, category);
    setName('');
    setSelectedIndex();
  }

  return (
    <View style={styles.adder}>
      <Input
        placeholder='New Profile'
        value={name}
        onChangeText={newName => setName(newName)}
        style={styles.adderInput}
      />
      <Select
        placeholder='Category'
        value={selectedIndex
          ? categories[selectedIndex.row].name
          : undefined
        }
        selectedIndex={selectedIndex}
        onSelect={index => setSelectedIndex(index)}
      >
        {categories.map(item => (
          <SelectItem
            key={item.id}
            title={item.name}
          />
        ))}
      </Select>
      <Button
        size='small'
        accessoryLeft={AddIcon}
        onPress={onPress}
        style={styles.adderButton}
      >
        Add Profile
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  adder: {
    display: 'flex',
    flexGrow: 1,
    gap: 8
  },
  adderInput: {
    flexGrow: 1
  },
  adderButton: {
    marginTop: 24
  }
});

export default ProfileAdder;