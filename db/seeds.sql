-- Insert sample departments
INSERT INTO department (id, name)
VALUES
  (1, 'Sales'),
  (2, 'Marketing'),
  (3, 'Finance');

-- Insert sample roles
INSERT INTO role (id, title, salary, department_id)
VALUES
  (1, 'Salesperson', 50000, 1),
  (2, 'Marketing Manager', 60000, 2),
  (3, 'Finance Analyst', 70000, 3);

-- Insert sample employees
INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES
  (1, 'John', 'Doe', 1, NULL),
  (2, 'Jane', 'Smith', 2, NULL),
  (3, 'Michael', 'Johnson', 3, NULL);