import Student from '../models/studentModel.js';

export class StudentService {
  static async createStudent(studentData) {
    return Student.create(studentData);
  }

  static async getStudent(curp) {
    return Student.getById(curp);
  }

  static async updateStudent(curp, updateData) {
    return Student.updateById(curp, updateData);
  }

  static async deleteStudent(curp) {
    return Student.delete(curp);
  }
}