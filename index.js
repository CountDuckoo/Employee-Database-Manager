const mysql = require('mysql2/promise');
const inquirer = require('inquirer');

let db;

//main screen has: view all employees, add employee, update employee role, view all roles, add role, view
//all departments, add department, and quit (and maybe update employee managers, view employees by manager,
//view employees by department, delete each of these, view total utilized budget of a department)

//views should display a table with the values, then prompt the questions again
//adding should prompt for the name of the thing for any of them
// for role, should prompt salary and department (list)
// for employee, need first and last name, role from list, and manager from list, including none
const mainPromptChoices = ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles',
'Add Role', 'View All Departments', 'Add Department', 'Quit'];

async function getEmployeeData(){
    console.log("get employee data");
    const results = await db.query('SELECT emp.id, emp.first_name, emp.last_name, title, name AS department, salary, concat(man.first_name," ",man.last_name) AS manager'
    +' FROM employees AS emp JOIN roles ON emp.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT OUTER JOIN employees AS man ON emp.manager_id = man.id');
    const employeeList = results[0];
    console.log(employeeList);
    return employeeList;
}

async function getRoleData(){
    console.log("get role data");
    const results = await db.query('SELECT roles.id, title, name AS department, salary FROM roles JOIN departments ON roles.department_id = departments.id');
    const roleList = results[0];
    console.log(roleList);
    return roleList;
}

async function getDepartmentData(){
    console.log("get department data");
    const results = await db.query('SELECT id, name FROM departments');
    const departmentList = results[0];
    console.log(departmentList);
    return departmentList;
}

function displayTable(data){
    console.table(data);
}

async function addEmployee(){
    console.log("add employee");
    const namesResponse = await inquirer.prompt([{type: 'input', message: "What is the Employee's first name?", name: 'first', validate: (answer)=>{
            if (answer.trim().length<1 || answer.trim().length>30){
                return "Name is too long or 0 length."
            }
            return true;
        }
    }, {type: 'input', message: "What is the Employee's last name?", name: 'last', validate: (answer)=>{
            if (answer.trim().length<1 || answer.trim().length>30){
                return "Name is too long or 0 length."
            }
            return true;
        }
    }]);
    const roles = (await db.query('SELECT id, title FROM roles'))[0];
    const roleTitles = roles.map((role) => role.title);
    const roleResponse = await inquirer.prompt({type:'list', message: "What is the Employee's Role?", name: 'role', choices: roleTitles});
    const chosenRole = roles.find(x => x.title===roleResponse.role).id;
    const employees = (await db.query('SELECT id, concat(first_name," ",last_name) AS full_name FROM employees'))[0];
    const employeeNames = employees.map((employee)=> employee.full_name);
    employeeNames.push("None");
    const employeeResponse = await inquirer.prompt({type:'list', message: "Who is the Employee's Manager?", name: 'manager', choices: employeeNames});
    let managerId=null;
    if(employeeResponse.manager!="None"){
        // findIndex in employeeNames where it matches, which should be the same index in employees
        managerId = employees.find(x=> x.full_name===employeeResponse.manager).id;
    }
    await db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', 
        [namesResponse.first.trim(), namesResponse.last.trim(), chosenRole, managerId]);
    console.log(`Added employee ${namesResponse.first.trim()} ${namesResponse.last.trim()}`);
}

async function updateEmployeeRole(){
    console.log("update employee role");
    // select employee
    const employees = (await db.query('SELECT id, concat(first_name," ",last_name) AS full_name FROM employees'))[0];
    const employeeNames = employees.map((employee)=> employee.full_name);
    const employeeResponse = await inquirer.prompt({type:'list', message: "Which Employee's role do you want to update?", name: 'employee', choices: employeeNames});
    const chosenEmployee = employees.find(x=> x.full_name===employeeResponse.employee).id;
    console.log(chosenEmployee);
    // then select role
    const roles = (await db.query('SELECT id, title FROM roles'))[0];
    const roleTitles = roles.map((role) => role.title);
    const roleResponse = await inquirer.prompt({type:'list', message: "What role do you want to assign the selected employee?", name: 'role', choices: roleTitles});
    const chosenRole = roles.find(x => x.title===roleResponse.role).id;
    // then update id
    await db.query('UPDATE employees SET role_id = ? WHERE id = ?', [chosenRole, chosenEmployee]);
    console.log('Employee role updated.');
}

async function addRole(){
    console.log("add role");
    const titleSalaryResponse = await inquirer.prompt([{type: 'input', message: 'What is the title of the Role?', name: 'role', validate: (answer)=>{
            if (answer.trim().length<1 || answer.trim().length>30){
                return "Title is too long or 0 length."
            }
            return true;
        }
    }, {type: 'input', message: 'What is the salary of the Role?', name: 'salary', validate: (answer)=>{
            if (isNaN(answer)){
                return "Please enter a number.";
            }
            return true;
        }
    }]);
    const departments = (await db.query('SELECT id, name FROM departments'))[0];
    const departmentNames = departments.map((department)=> department.name);
    const deptResponse = await inquirer.prompt({type:'list', message: 'Which department is the Role in?', name: 'department', choices: departmentNames});
    const chosenDepartment = departments.find(x => x.name===deptResponse.department).id;
    await db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [titleSalaryResponse.role.trim(), titleSalaryResponse.salary, chosenDepartment]);
    console.log(`Added role ${titleSalaryResponse.role.trim()}`);
}

async function addDepartment(){
    console.log("add department");
    const response = await inquirer.prompt({type: 'input', message: 'What is the name of the Department?', name: 'department', validate: (answer)=>{
            if (answer.trim().length<1 || answer.trim().length>30){
                return "Name is too long or 0 length."
            }
            return true;
        }
    });
    await db.query('INSERT INTO departments (name) VALUES (?)', [response.department.trim()]);
    console.log(`Added department ${response.department.trim()}`);
}

async function mainPrompt() {
    response = await inquirer.prompt({type: 'list', message: 'What would you like to do?', name: 'mainPrompt',
    choices: mainPromptChoices});
    
    switch(response.mainPrompt){
        case 'View All Employees':
            const employeeData = await getEmployeeData();
            if (employeeData){
                displayTable(employeeData);
            } else {
                console.log('No data to display, or error in getting data');
            }
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'View All Roles':
            const roleData = await getRoleData();
            if (roleData){
                displayTable(roleData);
            } else {
                console.log('No data to display, or error in getting data');
            }
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'View All Departments':
            const departmentData = await getDepartmentData();
            if(departmentData){
                displayTable(departmentData);
            } else {
                console.log('No data to display, or error in getting data');
            }
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Quit':
            // end the program
            return;
    }
    // repeat the initial prompt
    await mainPrompt();
}

async function mainProgram(){
    db = await mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password: 'password',
            database: 'employees_db'
        },
    );
    // display the fancy logo thing, then...
    await mainPrompt();
    await db.end();
}

mainProgram();