export class UnimplementedError extends Error {
  constructor(message) {
    super(message);
    this.name = "UnimplementedError";
  }
}

export class DuplicateNameError extends Error {
  constructor(message) {
    super(message);
    this.name = "DuplicateNameError";
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