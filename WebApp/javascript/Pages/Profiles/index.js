import { React, useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet } from 'react-native';
import { Divider, Menu, MenuItem, Modal, TopNavigation, TopNavigationAction } from '@ui-kitten/components';

import { AddIcon, ForwardIcon } from '../../components/Icons';
import ProfileAdder from './ProfileAdder';

import { storage } from '..';

const Profiles = ({ navigation }) => {
  // react state management
  const [profiles, setProfiles] = useState([]);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    storage.getProfilesList().then(res => {
      setProfiles(res);
    });
  }, [])

  const switchProfile = profile => {
    navigation.navigate('Active', {
      profile: profile.name
    })
  }
  
  const addProfile = (name, category) => {
    storage.addProfile(name, category)
      .then(res => {
        console.log("visible state is updating");
        setVisible(false)
      })
      .catch(err => console.warn(err));
  }

  const renderHeader = () => {
    return (
      <TopNavigation
        alignment='center'
        title='Profiles'
        accessoryRight={NewEntryAction}
      />
    )
  }
  const NewEntryAction = () => (
    <TopNavigationAction icon={AddIcon} onPress={() => setVisible(true)}/>
  );

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
              title={item.name}
              accessoryRight={ForwardIcon}
            />
          ))}
        </Menu>
      </View>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
        style={styles.modal}
      >
        <ProfileAdder
          onSubmit={(name, category) => addProfile(name, category)}
        />
      </Modal>
    </SafeAreaView>
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
  modal: {
    color: '#fff',
    flexGrow: 1,
    flexDirection: 'row',
    padding: 32
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
});

export default Profiles;