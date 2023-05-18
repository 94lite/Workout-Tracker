import AsyncStorage from '@react-native-async-storage/async-storage';
import IStorage, { Profile, Task, Category, SubCategory, Label, Date } from '..';
import uuid from 'react-native-uuid';
import {
  CategoryNotFoundError,
  DuplicateNameError,
  IDGeneratorMaxTriesError,
  IllegalCharError,
  ProfileNotFoundError,
  SubCategoryNotFoundError,
  TaskNotFoundError
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
  ...

@SubCategories <- mapping of category IDs against associated subcategory IDs
  Object:
    - Keys: categoryID, string
    - Values: subCategoryIDs, string[]

@SubCategories.[SubCategoryID]
  ...

@Labels
  ...

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
    // ...                   return value: Profile[]
    this.memoProfiles      = undefined;
    // profileID,            return value: Profile
    this.memoProfile       = [undefined, undefined];
    // profileID,            return value: Task[]
    this.memoTasks         = [undefined, undefined];
    // taskID,               return value: Task
    this.memoTask          = [undefined, undefined];
    // ...                   return value: Category[]
    this.memoCategories    = undefined;
    // categoryID,           return value: SubCategory[]
    this.memoSubCategories = [undefined, undefined];
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
          if (profileID in parsedTasks) {
            for (var i = 0; i < parsedTasks[profileID].length; i++) {
              const taskID = parsedTasks[profileID][i];
              const task = await this.getTask(taskID);
              this.memoTasks[1].push(task);
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

  async __getTask(taskID) {
    if (this.memoTask[0] !== taskID) {
      const task = await AsyncStorage.getItem(`@Tasks.${taskID}`);
      if (task === null) {
        throw new TaskNotFoundError(taskID);
      }
      const parsedTask = JSON.parse(task);
      parsedTask.SubCategory = await this.getSubCategory(parsedTask.SubCategory);
      parsedTask.Dates = parsedTask.Dates.map(date => new Date(date.Year, date.Month, date.Day));
      for (var i = 0; i < parsedTask.Labels.length; i++) {
        parsedTask.Label[j] = await this.getLabel(parsedTask.Label[j]);
      }
      this.memoTask = [taskID, new Task(this, parsedTask)];
    }
    return this.memoTask[1];
  }

  getTask(taskID) {
    return this.__getTask(taskID);
  }

  async __addTask(profileID, name, subcategory, description, values, labels) {}

  addTask(profileID, name, subcategory, description, values, labels) {
    return this.__addTask(profileID, name, subcategory, description, values, labels);
  }

  async __updateTask(task, updateProps) {}

  updateTask(task, updateProps) {
    return this.__updateTask(task, updateProps);
  }

  async __deleteTask(taskID) {}

  deleteTask(taskID) {
    return this.__deleteTask(taskID);
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
    throw new CategoryNotFoundError(categoryID);
  }

  getCategory(categoryID) {
    return this.__getCategory(categoryID);
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // S U B C A T E G O R Y
  // _________________________

  async __getSubCategoryList(categoryID) {}

  getSubCategoryList(categoryID) {
    return this.__getSubCategoryList(categoryID);
  }

  async __getSubCategory(subCategoryID) {
    const subCategory = await AsyncStorage.getItem(`@SubCategories.${subCategoryID}`);
    if (subCategory === null) {
      throw new SubCategoryNotFoundError(subCategoryID);
    }
    const parsedSubCategory = JSON.parse(subCategory);
    parsedSubCategory.ParentCategory = await this.getCategory(parsedSubCategory.ParentCategory);
    return new SubCategory(parsedSubCategory)
  }

  getSubCategory(subCategoryID) {
    return this.__getSubCategory(subCategoryID);
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // L A B E L
  // _________________________
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