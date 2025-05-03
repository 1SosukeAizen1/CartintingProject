# CartintingProject
Overview
The Car Tinting Project is a comprehensive web application designed to manage car tinting services. It includes functionalities for inventory management, appointment scheduling, support ticket handling, employee task management, and customer interactions.

Features
Inventory Management: Add, update, and delete items in the inventory.
Service Management: Manage the list of services offered, including adding and updating service details.
Appointment Scheduling: Allow clients to schedule appointments for car tinting services with details such as tint type and vehicle information.
Employee Management: Assign tasks to employees and track their progress.
Support Tickets: Submit and manage support tickets for customer issues.
Announcements: Post and retrieve announcements for employees and clients.
Payment Processing: Handle payments for services and track transaction statuses.
API Endpoints
The backend provides the following RESTful API endpoints:

General Endpoints
GET /: Welcome message and API overview.
User Management
POST /login: User login.
POST /forgot-password: Initiate password recovery.
POST /reset-password: Reset user password.
Inventory
GET /inventory: Retrieve all inventory items.
GET /inventory/:id: Retrieve a specific inventory item.
POST /inventory: Add a new inventory item.
PUT /inventory/:id: Update an inventory item's details.
DELETE /inventory/:id: Delete an inventory item.
Appointments
GET /appointments/:userId: Retrieve a user's appointments.
PUT /appointments/:appointmentId/pay: Mark an appointment as paid.
PUT /appointments/:appointmentId/assign: Assign an appointment to an employee.
POST /appointments: Schedule a new appointment.
DELETE /appointments/:appointmentId: Cancel an appointment.
Employees
GET /employees/:userId/jobs: Retrieve assigned jobs for an employee.
Support
POST /support: Submit a new support ticket.
GET /support: Retrieve all support tickets.
PUT /support/:ticketId: Update support ticket status.
Announcements
GET /announcements: Retrieve all announcements.
Payments
POST /process-payment: Process a payment for an appointment.
Database
The application uses a MySQL database with the following tables:

Inventory: Stores details about inventory items.
Service: Stores details about services offered.
Support: Tracks support tickets submitted by users.
Employee: Tracks employee details and assigned jobs.
Appointment: Stores appointment details for clients.
Technologies Used
Frontend: HTML, CSS, JavaScript
Backend: Node.js, Express.js
Database: MySQL
Other Tools: Nodemailer (email handling), XLSX (Excel report generation), dotenv (environment variable management)

git clone https://github.com/1SosukeAizen1/CartintingProject.git

npm install

DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password

npm start


Contributing
Feel free to fork this repository and contribute by submitting pull requests. For major changes, please open an issue first to discuss what you would like to change.

