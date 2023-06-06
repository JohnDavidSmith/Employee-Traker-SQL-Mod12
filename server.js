
const inquirer = require('inquirer');
const employee_db = require('./queries.js');

const config = {
  host: 'localhost',
  user: 'root',
  password: 'June-2023',
  database: 'employee_db',
};

async function startApp() {
  const db = new employee_db(config);
  await db.connect();

  const options = [
    'View all departments',
    'View all roles',
    'View all employees',
    'Add a department',
    'Add a role',
    'Add an employee',
    'Update an employee role',
    'Exit',
  ];

  while (true) {
    const { action } = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: options,
    });

    switch (action) {
      case options[0]:
        await viewAllDepartments(db);
        break;
      case options[1]:
        await viewAllRoles(db);
        break;
      case options[2]:
        await viewAllEmployees(db);
        break;
      case options[3]:
        await addDepartment(db);
        break;
      case options[4]:
        await addRole(db);
        break;
      case options[5]:
        await addEmployee(db);
        break;
      case options[6]:
        await updateEmployeeRole(db);
        break;
      case options[7]:
        await db.disconnect();
        console.log('Exiting the application...');
        return;
    }
  }
}

async function viewAllDepartments(db) {
  const departments = await db.getAllDepartments();

  // Define the column headers
  const headers = ['ID', 'Department'];

  // Create an array of arrays containing the data rows
  const rows = departments.map((department) => [department.id, department.name]);

  printTable(headers, rows);
}

async function viewAllRoles(db) {
  const roles = await db.getAllRoles();

  // Define the column headers
  const headers = ['ID', 'Title', 'Salary', 'Department'];

  // Create an array of arrays containing the data rows
  const rows = roles.map((role) => [role.id, role.title, role.salary, role.department]);

  printTable(headers, rows);
}

async function viewAllEmployees(db) {
  const employees = await db.getAllEmployees();

  // Define the column headers
  const headers = ['ID', 'First Name', 'Last Name', 'Role', 'Department', 'Salary', 'Manager'];

  // Create an array of arrays containing the data rows
  const rows = employees.map((employee) => [
    employee.id,
    employee.first_name,
    employee.last_name,
    employee.role,
    employee.department,
    employee.salary,
    employee.manager,
  ]);

  printTable(headers, rows);
}

// Rest of the code...

function padString(str, width) {
  const padding = width - str.length;
  return padding > 0 ? str + ' '.repeat(padding) : str;
}

function printTable(headers, rows) {
  // Calculate the maximum width for each column
  const columnWidths = headers.map((header, index) => {
    const maxLength = Math.max(header.length, ...rows.map((row) => String(row[index]).length));
    return maxLength + 2; // Add padding
  });

  // Generate the horizontal line separator
  const separator = columnWidths.map((width) => '-'.repeat(width)).join('-+-');

  // Print the table headers
  console.log(headers.map((header, index) => padString(header, columnWidths[index])).join(' | '));

  // Print the separator
  console.log(separator);

  // Print the rows
  rows.forEach((row) => {
    console.log(row.map((cell, index) => padString(cell, columnWidths[index])).join(' | '));
  });
}

startApp();
