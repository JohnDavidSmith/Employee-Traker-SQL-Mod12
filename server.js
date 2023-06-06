
const inquirer = require('inquirer');
const employee_db = require('./queries.js');
const consoleTable = require('console.table');

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

  console.table(departments);
}

async function viewAllRoles(db) {
  const roles = await db.getAllRoles();

  console.table(roles);
}

async function viewAllEmployees(db) {
  const employees = await db.getAllEmployees();

  console.table(employees);
}

async function addDepartment(db) {
    const { departmentName } = await inquirer.prompt({
      name: 'departmentName',
      type: 'input',
      message: 'Enter the name of the department:',
    });
  
    // Add the department to the database
    await db.addDepartment(departmentName);
  
    console.log('Department added successfully.');
  }

  async function addRole(db) {
    const departments = await db.getAllDepartments();
  
    const roleData = await inquirer.prompt([
      {
        name: 'title',
        type: 'input',
        message: 'Enter the title of the role:',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'Enter the salary for the role:',
        validate: (input) => {
          if (!isNaN(input) && parseFloat(input) >= 0) {
            return true;
          }
          return 'Please enter a valid salary (a non-negative number).';
        },
      },
      {
        name: 'departmentId',
        type: 'list',
        message: 'Select the department for the role:',
        choices: departments.map((department) => ({
          name: department.name,
          value: department.id,
        })),
      },
    ]);
  
    // Add the role to the database
    await db.addRole(roleData.title, roleData.salary, roleData.departmentId);
  
    console.log('Role added successfully.');
  }

  async function addEmployee(db) {
    const roles = await db.getAllRoles();
    const employees = await db.getAllEmployees();
  
    const employeeData = await inquirer.prompt([
      {
        name: 'firstName',
        type: 'input',
        message: "Enter the employee's first name:",
      },
      {
        name: 'lastName',
        type: 'input',
        message: "Enter the employee's last name:",
      },
      {
        name: 'roleId',
        type: 'list',
        message: "Select the employee's role:",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
      {
        name: 'managerId',
        type: 'list',
        message: "Select the employee's manager:",
        choices: [
          { name: 'None', value: null },
          ...employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        ],
      },
    ]);
  
    // Add the employee to the database
    await db.addEmployee(
      employeeData.firstName,
      employeeData.lastName,
      employeeData.roleId,
      employeeData.managerId
    );
  
    console.log('Employee added successfully.');
  }
  
  async function updateEmployeeRole(db) {
    const employees = await db.getAllEmployees();
    const roles = await db.getAllRoles();
  
    const employeeData = await inquirer.prompt([
      {
        name: 'employeeId',
        type: 'list',
        message: 'Select the employee whose role you want to update:',
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      },
      {
        name: 'roleId',
        type: 'list',
        message: 'Select the new role for the employee:',
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      },
    ]);
  
    // Update the employee's role in the database
    await db.updateEmployeeRole(employeeData.employeeId, employeeData.roleId);
  
    console.log('Employee role updated successfully.');
  }

startApp();
