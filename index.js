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

function viewAllEmployees() {
    db.query(`SELECT employee.id as id, employee.first_name, employee.last_name, title, name as department, salary, CONCAT(managerTable.first_name,' ',managerTable.last_name) as manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON role.department_id = department.id
    LEFT JOIN employee as managerTable
    ON employee.manager_id = managerTable.id;`, (err,data) => {
        printTable(data)
        menu()
    })
}

function addEmployee() {

}

function updateEmployeeRole() {

}

function viewAllRoles() {
    
}

function addRole() {
    
}

function viewAllDepartments() {
    
}

function addDepartment() {
    
}