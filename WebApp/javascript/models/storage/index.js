import {
  UnimplementedError,
  DuplicateNameError,
  ProfileUpdateError,
  TaskUpdateError
} from "./exceptions"

export default class IStorage {
  constructor(params, onReady) {
    this.ready = undefined;
    this.start().then(res => {
      this.ready = res;
      if (onReady !== undefined) {
        onReady(this.ready);
      }
    });
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // S T O R A G E
  // _________________________

  async start() {
    /*
    called when storage is created
    reserved function to call preprocess steps if the storage
    used requires start up processes
    returns:
      - boolean
    */
    throw new UnimplementedError("'start' is not implemented");
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // P R O F I L E
  // _________________________

  getProfilesList() {
    /*
    returns:
      - Profile[]
    */
    throw new UnimplementedError("'getProfilesList' is not implemented");
  }

  getProfile(profileID) {
    /*
    params:
      - profileID: string
    returns:
      - Profile
    */
    throw new UnimplementedError("'getProfile' is not implemented");
  }

  addProfile(name, category) {
    /*
    params:
      - name: string
      - category: Category
    returns:
      - profile: Profile
    */
    throw new UnimplementedError("'addProfile' is not implemented");
  }

  updateProfile(profile, updateProps) {
    /*
    params:
      - profile: Profile
      - updateProps: string[], array of fields that are being updated used for updating specific values
    returns:
      - profileID: string
    */
    throw new UnimplementedError("'updateProfile' is not implemented");
  }

  deleteProfile(profileID) {
    /*
    Deletes all associated tasks along with the profile.
    Associated tasks are all deleted first.
    If there is an error while deleting a task then the profile does not get deleted.
    params:
      - profileID: string
    */
    throw new UnimplementedError("'deleteProfile' is not implemented");
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // T A S K
  // _________________________

  getTaskList(profileID) {
    /*
    If profileID is not defined then all tasks are returned
    params:
      - profileID: string, optional
    returns:
      - Task[]
    */
    throw new UnimplementedError("'getTaskList' is not implemented");
  }

  getTask(taskID) {
    /*
    params:
      - taskID: string
    returns:
      - Task
    */
    throw new UnimplementedError("'getTask' is not implemented");
  }

  addTask(profileID, name, subcategory, description, values, labels) {
    /*
    params:
      - profileID: string, profile to associate the new task with
      - name: string
      - subcategory: SubCategory
      - description: string, optional
      - values: generic[], (optional - based on subcategory requirements)
      - labels: Label[], optional
    returns:
      - taskID: string
    */
    throw new UnimplementedError("'addTask' is not implemented");
  }

  updateTask(task, updateProps) {
    /*
    params:
      - task: Task
      - updateProps: string[], array of fields that are being updated used for updating specific values
    returns:
      - taskID: string
    */
    throw new UnimplementedError("'updateTask' is not implemented");
   }

  deleteTask(taskID) {
    /*
    params:
      - taskID: string
    */
    throw new UnimplementedError("'deleteTask' is not implemented");
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // C A T E G O R Y
  // _________________________

  getCategoryList() {
    /*
    returns:
      - Category[]
    */
    throw new UnimplementedError("'getCategoryList' is not implemented");
  }

  getCategory(categoryID) {
    /*
    params:
      - categoryID: string
    returns:
      - Category
    */
    throw new UnimplementedError("'getCategory' is not implemented");
  }

  addCategory() {
    throw new UnimplementedError("'addCategory' is not implemented");
  }

  deleteCategory() {
    throw new UnimplementedError("'deleteCategory' is not implemented");
  }

  groupProfilesByCategory() {
    throw new UnimplementedError("'groupProfilesByCategory' is not implemented");
  }


  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // S U B C A T E G O R Y
  // _________________________

  getSubCategoryList(categoryID) {
    /*
    params:
      - categoryID: string
    returns:
      - SubCategory[]
    */
    throw new UnimplementedError("'getSubCategoryList' is not implemented");
  }

  getSubCatgory(subCategoryID) {
    /*
    params:
      - subCategoryID: string
    returns:
      - SubCategory
    */
    throw new UnimplementedError("'getSubCatgory' is not implemented");
  }

  addSubCategory() {
    throw new UnimplementedError("'addSubCategory' is not implemented");
  }

  deleteSubCategory() {
    throw new UnimplementedError("'deleteSubCategory' is not implemented");
  }

  groupTasksBySubCategory() {
    throw new UnimplementedError("'groupTasksBySubCategory' is not implemented");
  }

  // ‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  // L A B E L
  // _________________________

  addLabel() {
    throw new UnimplementedError("'addLabel' is not implemented");
  }

  updateLabel() {
    throw new UnimplementedError("'updateLabel' is not implemented");
  }

  deleteLabel() {
    throw new UnimplementedError("'deleteLabel' is not implemented");
  }

  groupTasksByLabel() {
    throw new UnimplementedError("'groupTasksByLabel' is not implemented");
  }
}

export class Profile {
  constructor(storage, params) {
    this.storage = storage;
    this.id = params.ID;
    this.name = params.Name;
    this.category = params.Category; // type: Category
  }

  async updateName(newName) {
    // validate newName is defined and is unique
    const valid = await this.validateNewName(newName);
    if (!valid) {
      throw new DuplicateNameError(newName);
    }
    const prev = this.name;
    this.name = newName;
    try {
      await this.storage.updateProfile(this, ['Name']);
    } catch (err) {
      this.name = prev;
      throw new ProfileUpdateError(`Failed to update profile name: [${err.name}] ${err.message}`);
    }
  }

  async updateCategory(category) {
    // validate category is defined and exists
    const prev = this.category;
    this.category = category;
    try {
      await this.storage.updateProfile(this, ['Category']);
    } catch (err) {
      this.category = prev;
      throw new ProfileUpdateError(`Failed to update profile category: [${err.name}] ${err.message}`);
    }
  }

  async validateNewName(newName) {
    const profiles = await this.storage.getProfilesList();
    const names = profiles.map(profile => profile.name);
    return !names.includes(newName);
  }
}

export class Task {
  constructor(storage, params) {
    this.storage = storage;
    this.id = params.ID;
    this.profileID = params.ProfileID;
    this.subcategory = params.SubCategory; // type: SubCategory
    this.name = params.Name;
    this.description = params.Description;
    this.time = params.Time;
    this.values = params.Values;
    this.dates = params.Dates; // type: Date[]
    this.labels = params.Labels; // type: Label[]
  }

  async updateProp(Field, newValue) {
    const field = Field.toLowerCase();
    const prev = this[field];
    this[field] = newValue;
    try {
      await this.storage.updateTask(this, [Field]);
    } catch (err) {
      this[field] = prev;
      throw new TaskUpdateError(`Failed to update task ${field}: [${err.name}] ${err.message}`);
    }
  }

  async updateName(newName) {
    // validate newName is defined and is unique under profile
    const valid = await this.validateNewName(newName);
    if (!valid) {
      throw new DuplicateNameError(newName);
    }
    await this.updateProp("Name", newName);
  }

  async updateDescription(text) {
    await this.updateProp("Description", text);
  }

  async updateSubCategory(subcategory) {
    // validate subcategory is defined and exists
    await this.updateProp("SubCategory", subcategory);
  }

  async setProperty(prop, value) {
    // this.values[prop] = value;
    // update storage entry
  }

  async addDate(date) {
    const updater = [...this.dates];
    updater.push(date);
    await this.updateProp("Dates")
  }

  async addLabel() {
    // this.labels
    // update storage entry
  }

  async deleteLabel() {
    // this.labels
    // update storage entry
  }

  async validateNewName(newName) {
    const tasks = await this.storage.getTaskList(this.profileID);
    const names = tasks.map(task => task.name);
    return !names.includes(newName);
  }
}

export class Category {
  // READ ONLY
  constructor(params) {
    this.id = params.ID;
    this.name = params.Name;
  }
}

export class SubCategory {
  // READ ONLY
  constructor(params) {
    this.id = params.ID;
    this.parentCategory = params.ParentCategory; // type: Category
    this.name = params.Name;
    this.properties = params.Properties;
  }
}

export class Label {
  constructor(storage, ID, Name, Color) {
    this.storage = storage;
    this.id = ID;
    this.name = Name;
    this.color = Color; // string, hex representation
  }

  async changeColor(newColor) {
    const prev = this.color;
    this.color = newColor;
    try {
      await this.storage.updateLabel(this, ["Color"]);
    } catch (err) {
      this.color = prev;
      throw new TaskUpdateError(`Failed tup update task ${field}: [${err.name}] ${err.message}`);
    }
  }
}

export class Date {
  // READ ONLY
  constructor(Year, Month, Day) {
    this.year = Year; // int
    this.month = Month; // int
    this.day = Day; // int
  }
}
