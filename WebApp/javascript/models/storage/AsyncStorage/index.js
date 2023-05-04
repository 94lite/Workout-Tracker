import AsyncStorage from '@react-native-async-storage/async-storage';
import IStorage, { Profile, Task, Category } from '..';
import { v4 as uuidv4 } from 'uuid';
import {
  CategoryDoesNotExistError,
  DuplicateNameError,
  IDGeneratorMaxTriesError,
  IllegalCharError
} from '../exceptions';

/*
@Profiles <- stores all profile data
  Array of Objects
  Each Object:
    - Property: ID, string
    - Property: Name, string
    - Property: Category, string

@Tasks <- mapping of profile IDs against associated task IDs
  Object:
    - Keys: profileID, string
    - Values: taskIDs, string[]

@Tasks.[TaskID] <- stores details for a specific task
  Object:
    - Property: Name, string
*/

export default class StorageAsyncStorage extends IStorage {
  constructor(params) {
    super(params);
    this.storageType = 'AsyncStorage';
    this.memoProfiles = undefined;
    this.memoProfile = undefined;
    this.memoTasks = undefined;
    this.memoTask = undefined;
    this.memoCategories = undefined;
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // P R O F I L E
  // _________________________

  async __getProfilesList() {
    if (this.memoProfiles === undefined) {
      const profiles = await AsyncStorage.getItem('@Profiles');
      if (profiles !== null) {
        try {
          const parsedProfiles = JSON.parse(profiles);
          this.memoProfiles = parsedProfiles.map(profile => (new Profile(this, profile)));
        } catch (err) {
          this.memoProfiles = [];
        }
      } else {
        this.memoProfiles = [];
      };
    }
    return this.memoProfiles;
  }
  
  getProfilesList() {
    return this.__getProfilesList();
  }

  async __addProfile(name, category) {
    // validate category is defined and exists
    const categories = await this.getCategoryList();
    const categoryNames = categories.map(item => item.name);
    if (!(category.name in categoryNames)) {
      throw new CategoryDoesNotExistError(category.name);
    }
    // adding new profile
    const profiles = await this.getProfilesList();
    const updater = [];
    const ids = {};
    const names = {};
    profiles.forEach(profile => {
      ids[profile.id] = true;
      names[profile.name] = true;
      updater.push({
        ID: profile.id,
        Name: profile.name,
        Category: profile.category.id
      });
    });
    // validate name is defined and is unique
    validateName(name, names);
    // generate a unique profileID
    const newID = generateID(ids);
    const newProfile = {
      ID: newID,
      Name: name,
      Category: category.id
    };
    updater.push(newProfile);
    // add new profile to @Profiles
    try {
      await AsyncStorage.setItem('@Profiles', JSON.stringify(updater));
    } catch (err) {}
    const profileProfile = new Profile(this, newProfile);
    profiles.push(profileProfile);
    this.memoProfiles = profiles;
    return profileProfile;
  }

  addProfile(name, category) {
    return this.__addProfile(name, category);
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // C A T E G O R Y
  // _________________________

  async __getCategoryList() {
    if (this.memoCategories === undefined) {
      const categories = await AsyncStorage.getItem('@Categories');
      if (categories !== null) {
        try {
          const parsedCategories = JSON.parse(categories);
          this.memoCategories = parsedCategories.map(category => (new Category(category)))
        } catch (err) {
          this.memoCategories = [];
        }
      } else {
        this.memoCategories = [];
      }
      const categoryNames = this.memoCategories.map(category => category.name);
      if (!("work" in categoryNames)) {
        this.memoCategories.push(new Category({ ID: "work", Name: "work" }));
      }
      if (!("gym" in categoryNames)) {
        this.memoCategories.push(new Category({ ID: "gym", Name: "gym" }));
      }
    }
    return this.memoCategories;
  }

  getCategoryList() {
    return this.__getCategoryList()
  }
}

const ILLEGAL_CHARS = [
  '.',
  ',',
  '/',
  ':',
  ';'
];

function validateName(name, names) {
  if (name in names) {
    throw new DuplicateNameError(name);
  }
  for (var i = 0; i < name.length; i++) {
    if (ILLEGAL_CHARS.includes(name[i])) {
      throw new IllegalCharError(`Reserved character ('${name[i]}') found in name`);
    }
  }
}

const MAX_GENERATOR_TRIES = 50;

function generateID(existingIDs) {
  let i = 0;
  let id;
  while (id === undefined || (id in existingIDs)) {
    if (i >= MAX_GENERATOR_TRIES) {
      throw new IDGeneratorMaxTriesError(`Failed to generate ID within ${MAX_GENERATOR_TRIES} tries`)
    }
    i++;
    id = uuidv4();
  }
  return id
}