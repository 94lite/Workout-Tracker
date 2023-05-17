import AsyncStorage from '@react-native-async-storage/async-storage';
import IStorage, { Profile, Task, Category, SubCategory, Label, Date } from '..';
import uuid from 'react-native-uuid';
import {
  CategoryDoesNotExistError,
  DuplicateNameError,
  IDGeneratorMaxTriesError,
  IllegalCharError,
  ProfileNotFoundError
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

@Categories

@SubCategories
*/

export async function getAllKeys() {
  return await AsyncStorage.getAllKeys();
}

export async function deleteAllKeys() {
  const keys = await getAllKeys();
  return await AsyncStorage.multiRemove(keys);
}

export default class StorageAsyncStorage extends IStorage {
  constructor(params, onReady) {
    super(params, onReady);
    this.storageType = 'AsyncStorage';
    // return value: Profile[]
    this.memoProfiles = undefined;
    // profileID, return value: Profile
    this.memoProfile = [undefined, undefined];
    // profileID, return value: Task[]
    this.memoTasks = [undefined, undefined];
    // taskID, return value: Task
    this.memoTask = undefined;
    // return value: Category[]
    this.memoCategories = undefined;
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // S T O R A G E
  // _________________________

  async start() {
    await this.getCategoryList();
    return true;
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
          this.memoProfiles = [];
          for (var i = 0; i < parsedProfiles.length; i++) {
            const profile = parsedProfiles[i];
            profile.Category = await this.getCategory(profile.Category);
            this.memoProfiles.push(new Profile(this, profile));
          }
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

  async __getProfile(profileID) {
    if (profileID === this.memoProfile[0]) {
      return this.memoProfile[1];
    };
    const profiles = await this.getProfilesList();
    for (var i = 0; i < profiles.length; i++) {
      if (profileID === profiles[i].id) {
        this.memoProfile = [profileID, profiles[i]];
        return profiles[i]
      }
    }
    throw new ProfileNotFoundError(profileID);
  }

  getProfile(profileID) {
    return this.__getProfile(profileID);
  }

  async __addProfile(name, category) {
    // validate category is defined and exists
    await this.getCategory(category.id);
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
    newProfile.Category = category;
    const profileProfile = new Profile(this, newProfile);
    profiles.push(profileProfile);
    this.memoProfiles = profiles;
    return profileProfile;
  }

  addProfile(name, category) {
    return this.__addProfile(name, category);
  }

  async __updateProfile(profile, updateProps) {
    const profiles = await this.getProfilesList();
    const updater = [];
    profiles.forEach(profile => {
      updater.push({
        ID: profile.id,
        Name: profile.name,
        Category: profile.category.id
      });
    });
    await AsyncStorage.setItem('@Profiles', JSON.stringify(updater));
  }

  updateProfile(profile, updateProps) {
    return this.__updateProfile(profile, updateProps);
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // T A S K
  // _________________________

  async __getTaskList(profileID) {
    if (this.memoTasks[0] !== profileID) {
      const tasks = await AsyncStorage.getItem('@Tasks');
      if (tasks !== null) {
        try {
          const parsedTasks = JSON.parse(tasks);
          this.memoTasks = [profileID, []];
          if (profileID in tasks) {
            for (var i = 0; i < parsedTasks.length; i++) {
              const task = parsedTasks[i];
              task.SubCategory = await this.getSubCategory(task.SubCategory);
              task.Dates = task.Dates.map(date => new Date(date.Year, date.Month, date.Day));
              for (var j = 0; j < task.Labels.length; j++) {
                task.Label[j] = await this.getLabel(task.Label[j]);
              }
              this.memoTasks[1].push(new Task(this, task));
            }
          }
        } catch (err) {
          this.memoTasks = [profileID, []];
        }
      } else {
        this.memoTasks = [profileID, []];
      }
    }
    return this.memoTasks[1]
  }

  getTaskList(profileID) {
    return this.__getTaskList(profileID);
  }

  async getTask(taskID) {}

  getTask(taskID) {}

  async __addTask(profileID, name, subcategory, description, values, labels) {}

  addTask(profileID, name, subcategory, description, values, labels) {}

  async __updateTask(task, updateProps) {}

  updateTask(task, updateProps) {}

  async __deleteTask(taskID) {}

  deleteTask(taskID) {}

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
      if (!categoryNames.includes("work")) {
        this.memoCategories.push(new Category({ ID: "work", Name: "work" }));
      }
      if (!categoryNames.includes("gym")) {
        this.memoCategories.push(new Category({ ID: "gym", Name: "gym" }));
      }
    }
    return this.memoCategories;
  }

  getCategoryList() {
    return this.__getCategoryList()
  }

  async __getCategory(categoryID) {
    const categories = await this.getCategoryList();
    for (var i = 0; i < categories.length; i++) {
      if (categoryID === categories[i].id) {
        return categories[i]
      }
    }
    throw new CategoryDoesNotExistError(categoryID);
  }

  getCategory(categoryID) {
    return this.__getCategory(categoryID);
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
    id = uuid.v4();
  }
  return id
}

// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// S U B C A T E G O R Y
// _________________________

// ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
// L A B E L
// _________________________