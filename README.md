# Employee-Database-Manager [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

A simple project using MySQL to create a database of employee information, and inquirer to interact with it from the command line.

## Table of Contents
- [Employee-Database-Manager ](#employee-database-manager-)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [License](#license)
  - [Contributing](#contributing)
  - [Questions](#questions)

## Installation

To install this project, you need Node.js to run it in the command line, and either GitBash or a ZIP extracter to download it. You need Node Package Manager to install the dependencies. You also need mysql set up on your computer.

## Usage

To run this project, download it, either by cloning the repository or by downloading a ZIP of it and extracting it. Then use the command line to navigate to the folder it is in. First, type 'npm i' to install the dependencies, which might take a moment. You will need to run the schema and seed files, either by opening MySQL and entering 'source db/schema.sql' and 'source db/seeds.sql', or by typing 'mysql -uroot -ppassword < db/schema.sql' and 'mysql -uroot -ppassword < db/seeds.sql' into the command line, substituting in your MySQL username and password for root and password as necessary.

Once the database is set up and seeded, you can start the program by entering 'node index.js'. You are provided options for viewing and adding employees, roles, and departments, as well as editing the role of an employee, and an option to exit the program. You can navigate these with the arrow keys and enter. When adding any of the above, you will need to type in one or more values. Names and titles must be between 1 and 30 characters long. When adding a role, you will have a list of departments to choose from. When adding an employee, you will have a list of roles, as well as a list of employees to have as the new employee's manager (or none). When editing an employee's role, you will have a list of employee's to choose which one to change, then a list of roles to have them put in.

[Demonstration Video](https://drive.google.com/file/d/1sKf2VojLvRSmNclFMrvoJwWTywpsB6Zr/view)

## License

This project is covered under the MIT License.

[Link to License Page](/LICENSE)

## Contributing

Feel free to contribute to this project by cloning it and making a fork. You can contact me at the email address listed below if you wish to merge the fork into the main branch.

## Questions

If you have any questions, you can reach me at one of these place(s):  

GitHub: [CountDuckoo](github.com/CountDuckoo)

Email: [countsuperc@gmail.com](mailto:countsuperc@gmail.com)



