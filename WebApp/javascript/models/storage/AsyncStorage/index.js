import IStorage, { Profile, Task } from "..";

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

export default class AsyncStorage extends IStorage {
  constructor(params) {
    this.storageType = "AsyncStorage";
    this.memoProfiles = [undefined, undefined];
    this.memoProfile = [undefined, undefined];
    this.memoTasks = [undefined, undefined];
    this.memoTask = [undefined, undefined];
  }
  
  getProfile(profileID) {}

  addProfile(name, category) {
    // validate name is defined and is unique
    // validate category is defined and exists
    // generate a unique profileID
    // add new profile to @Profiles
    return new Promise((resolve, reject) => {})
  }
}