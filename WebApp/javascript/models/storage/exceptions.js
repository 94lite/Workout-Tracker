export class UnimplementedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnimplementedError";
  }
}

export class IDGeneratorMaxTriesError extends Error {
  constructor(message) {
    super(message);
    this.name = "IDGeneratorMaxTriesError";
  }
}

export class DuplicateNameError extends Error {
  constructor(message) {
    super(message);
    this.name = "DuplicateNameError";
  }
}

export class IllegalCharError extends Error {
  constructor(message) {
    super(message);
    this.name = "IllegalCharError";
  }
}

export class ProfileUpdateError extends Error {
  constructor(message) {
    super(message);
    this.name = "ProfileUpdateError";
  }
}

export class ProfileNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = ProfileNotFoundError;
  }
}

export class TaskUpdateError extends Error {
  constructor(message) {
    super(message);
    this.name = "TaskUpdateError";
  }
}

export class TaskNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "TaskNotFoundError";
  }
}

export class CategoryNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "CategoryNotFoundError";
  }
}

export class SubCategoryNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "SubCategoryNotFoundError";
  }
}