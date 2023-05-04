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

export class TaskUpdateError extends Error {
  constructor(message) {
    super(message);
    this.name = "TaskUpdateError";
  }
}

export class CategoryDoesNotExistError extends Error {
  constructor(message) {
    super(message);
    this.name = "CategoryDoesNotExistError";
  }
}