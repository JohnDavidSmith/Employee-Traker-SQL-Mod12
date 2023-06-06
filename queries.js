
const mysql = require('mysql2/promise');
const util = require('util');

class employee_db {
  constructor(config) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    this.connection = await util.promisify(mysql.createConnection)(this.config);
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }

  async getAllDepartments() {
    // Perform SQL query to get all departments
    const query = 'SELECT * FROM department';
    const [rows] = await this.connection.query(query);
    return rows;
  }

  async getAllRoles() {
    // Perform SQL query to get all roles
    const query = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id
  `;
  const [rows] = await this.connection.query(query);
  return rows;
  }

  async getAllEmployees() {
    // Perform SQL query to get all employees
    const query = `
    SELECT
      employee.id,
      employee.first_name,
      employee.last_name,
      role.title AS role,
      department.name AS department,
      role.salary,
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    INNER JOIN role ON employee.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `;
  const [rows] = await this.connection.query(query);
  return rows;
  }

  async addDepartment(name) {
    // Perform SQL query to add a department
    const query = 'INSERT INTO department (name) VALUES (?)';
  const [result] = await this.connection.query(query, [name]);
  return result.insertId;
  }

  async addRole(title, salary, departmentId) {
    // Perform SQL query to add a role
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    const [result] = await this.connection.query(query, [title, salary, departmentId]);
    return result.insertId; 
  }

  async addEmployee(firstName, lastName, roleId, managerId) {
    // Perform SQL query to add an employee
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
    const [result] = await this.connection.query(query, [firstName, lastName, roleId, managerId]);
    return result.insertId;
  }

  async updateEmployeeRole(employeeId, roleId) {
    // Perform SQL query to update an employee's role
    const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
    const [result] = await this.connection.query(query, [roleId, employeeId]);
    return result.affectedRows > 0;
  }
}

module.exports = employee_db;

