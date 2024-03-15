const inquirer = require("inquirer")
const {printTable} = require("console-table-printer")
const mysql2 = require("mysql2")

// Establishing a connection to the Mysql2 database
const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
    port: 3306
})

db.connect( () => {
    menu()
})

// Function to execute 
// View all departments, roles and employees
// Add a department, role and employee
// Update an employee using inquirer package

function menu() {
    inquirer.prompt([
        {
            type : "list",
            message : "What would you like to do?",
            name : "options",
            choices : ["View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department"]
        }
    ])
    .then(response => {
        if(response.options === 'View All Employees') {
            viewAllEmployees()
        } else if(response.options === 'Add Employee') {
            addEmployee()
        }else if(response.options === 'Update Employee Role') {
            updateEmployeeRole()
        }else if(response.options === 'View All Roles') {
            viewAllRoles()
        }else if(response.options === 'Add Role') {
            addRole()
        }else if(response.options === 'View All Departments') {
            viewAllDepartments()
        }else {
            addDepartment()
        }
    })
}

// Displaying the all the employees 
function viewAllEmployees() {
    db.query(`SELECT employee.id as id, employee.first_name, employee.last_name, title, name as department, salary, CONCAT(managerTable.first_name,' ',managerTable.last_name) as manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee as managerTable
    ON employee.manager_id = managerTable.id;`, (err, employeeData) => {
        printTable(employeeData)
        menu()
    })
}

// Adding a new employee into the 'employee' table
function addEmployee() {
    db.query(`SELECT id as value, title as name FROM role`,
    (err, roleData) => {
        db.query(`SELECT id as value, CONCAT(first_name,' ',last_name) as name FROM employee WHERE manager_id is NULL`,
        (err, managerData) => {
            inquirer.prompt([
                {
                    type : "input",
                    message : "What is your first name?",
                    name : "first_name"
                },
                {
                    type : "input",
                    message : "What is your last name?",
                    name : "last_name"
                },
                {
                    type : "list",
                    message : "What is your title?",
                    name : "title",
                    choices : roleData
                },
                {
                    type : "list",
                    message : "Who is your manager?",
                    name : "manager_id",
                    choices : managerDataData
                }
            ]).then(response => {
                db.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES("${response.first_name}","${response.last_name}","${response.title}","${response.manager_id}")`, (err) => {
                    viewAllEmployees()
                })
            })
        })
    })
}

// Updating the role of the specified employee in the 'employee' table
function updateEmployeeRole() {
    db.query(`SELECT id as value, title as name FROM role`,
    (err, roleData) => {
        db.query(`SELECT id as value, CONCAT(first_name,' ',last_name) as name FROM employee`,
        (err, employeeData) => {
            inquirer.prompt([
                {
                    type : "list",
                    message : "What is the new title for the employee?",
                    name : "role_id",
                    choices : roleData
                },
                {
                    type : "list",
                    message : "Which employee do you want to update his or her title?",
                    name : "employee_id",
                    choices : employeeData
                }
            ]).then(response => {
                db.query(`UPDATE employee SET role_id="${response.role_id}" WHERE ID=${response.employee_id}`, (err) => {
                    viewAllEmployees()
                })
            })
        })
    })
}

// Displaying all the roles in the 'role' table
function viewAllRoles() {
    db.query(`SELECT role.id as id, title, name as department, salary
    FROM role
    LEFT JOIN department
    ON role.department_id = department.id;`, (err, roleData) => {
        printTable(roleData)
        menu()
    })
}

// Adding a new role into the 'role' table
function addRole() {
    db.query(`SELECT id as value, name as name from department`, (err, departmentData) =>{
        db.query(`SELECT id as value, title as name`, (err, roleData) => {
            inquirer.prompt([
                {
                    type : "list",
                    message : "Which department do you want to add new role?",
                    name : "department_id",
                    choices : departmentData
                },
                {
                    type : "input",
                    message : "What is the name of the new role?",
                    name : "role_id"
                },
                {
                    type : "input",
                    message : "What is the salary for this role?",
                    name : "salary"
                }
            ]).then(response => {
                db.query(`INSERT INTO role(title, department_id, salary) VALUES("${response.role_id}",${response.department_id},${response.salary})`, (err) => {
                    viewAllRoles()
                })
            })
        })
    } )
}

// Displaying all the departments in the 'department' table
function viewAllDepartments() {
    db.query(`SELECT * FROM department;`, (err,departmentData) => {
        printTable(departmentData)
        menu()
    })
}

// Adding a new department into the 'department' table
function addDepartment() {
    db.query(`SELECT name FROM department`, (err, departmentData) => {
        inquirer.prompt([
            {
                type : "input",
                message : "What is the name of the department?",
                name : "department_name"
            },
        ]).then(response => {
            db.query(`INSERT INTO department(name) VALUES("${response.department_name}")`, (err) => {
                viewAllDepartments()
            })
        })
   
    })
       
}