const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv'); // Load environment variables from .env file
const nodemailer = require('nodemailer');
const crypto = require('crypto');  
const bcrypt = require('bcrypt');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

dotenv.config(); // Load environment variables
const app = express();

app.use(cors()); // Enable CORS for frontend requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// ✅ Serve static files like HTML/CSS/JS from the "public" folder
app.use(express.static('public')); // ← put this here

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST, // Use environment variable or default to localhost
    port: process.env.PORT, // Ensure this is correct
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, // Use the actual password
    database: process.env.DB_NAME // Ensure this matches your database name 
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1); // Exit if database connection fails
    }
    console.log('✅ Connected to the CarTintingDB database');
});



// Configure the SMTP transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use 'gmail' for Gmail SMTP
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS // Your email password or app password
    },
    tls: {
        rejectUnauthorized: false // Allow self-signed certificates
    }
});

// Function to send an email
function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.EMAIL_USER,  // Sender's email address
        to: to,                       // Recipient's email address
        subject: subject,             // Email subject
        text: text                    // Email body (plain text)
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('❌ Error sending email:', err);
        } else {
            console.log('✅ Email sent:', info.response);
        }
    });
}



// Generate report (GET /admin/reports)
app.get('/admin/reports', (req, res) => {
    const query = `
        SELECT 
            a.AppointmentID,
            u.Name AS ClientName,
            a.TintType AS Service,
            a.Date,
            a.Status
        FROM Appointment a
        INNER JOIN Client c ON a.ClientID = c.ClientID
        INNER JOIN User u ON c.UserID = u.UserID
        ORDER BY a.Date DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error generating report:', err);
            return res.status(500).json({ message: 'Error generating report.' });
        }

        // Convert results to a worksheet
        const worksheet = XLSX.utils.json_to_sheet(results);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Appointments Report');

        // Write the workbook to a file
        const filePath = path.join(__dirname, 'reports', 'appointments_report.xlsx');
        XLSX.writeFile(workbook, filePath);

        // Send the file as a response
        res.download(filePath, 'appointments_report.xlsx', (err) => {
            if (err) {
                console.error('❌ Error sending report:', err);
            }

            // Delete the file after sending it
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('❌ Error deleting report file:', err);
                }
            });
        });
    });
});

// Test email route
app.get('/test-email', (req, res) => {
    const testRecipient = 'sosukeaizen988@gmail.com'; // Replace with your test recipient email
    const subject = 'Test Email from Car Tinting App';
    const text = 'This is a test email to verify the email feature is working correctly.';

    sendEmail(testRecipient, subject, text);

    res.status(200).json({ message: 'Test email sent. Check your inbox!' });
});


// Sign Up Route (POST /users)
app.post('/users', (req, res) => {
    const { Name, Email, Password, Role } = req.body;

    if (!Name || !Email || !Password || !Role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash the password before storing it
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('❌ Error hashing password:', err);
            return res.status(500).json({ message: 'Error hashing password' });
        }

        const query = 'INSERT INTO User (Name, Email, Password, Role) VALUES (?, ?, ?, ?)';
        db.query(query, [Name, Email, hashedPassword, Role], (err, result) => {
            if (err) {
                console.error('❌ Database error:', err);
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ message: 'Email already exists' });
                }
                return res.status(500).json({ message: 'Error adding user', error: err.message });
            }
            
            const userId = result.insertId;
            
            // If the role is 'customer', create a corresponding Client record
            if (Role === 'customer') {
                const clientQuery = 'INSERT INTO Client (UserID) VALUES (?)';
                db.query(clientQuery, [userId], (err) => {
                    if (err) {
                        console.error('❌ Error creating client record:', err);
                        return res.status(500).json({ message: 'Error creating client record' });
                    }
                    res.status(201).json({ message: 'User and client added successfully', userId });
                });
            } else {

            res.status(201).json({ message: 'User added successfully', userId: result.insertId });
            }
        });
    });
});

// Login Route (POST /login)
app.post('/login', (req, res) => {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
        return res.status(400).json({ message: 'Email and Password are required' });
    }

    const query ='SELECT * FROM User WHERE Email = ?';
    db.query(query, [Email], (err, results) => {
        if (err) {
            console.error('❌ Error checking user credentials:', err);
            return res.status(500).json({ message: 'Error checking credentials' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = results[0];
        // Check if the user is an employee
        if (user.Role === 'employee') {
            // Check if the employee already exists in the Employee table
            const checkEmployeeQuery = 'SELECT * FROM Employee WHERE UserID = ?';
            db.query(checkEmployeeQuery, [user.UserID], (err, employeeResults) => {
                if (err) {
                    console.error('❌ Error checking employee:', err);
                    return res.status(500).json({ message: 'Error checking employee.' });
                }

                if (employeeResults.length === 0) {
                    // Add the employee to the Employee table
                    const insertEmployeeQuery = 'INSERT INTO Employee (UserID, AssignedJobs) VALUES (?, ?)';
                    db.query(insertEmployeeQuery, [user.UserID, ''], (err) => {
                        if (err) {
                            console.error('❌ Error adding employee:', err);
                            return res.status(500).json({ message: 'Error adding employee.' });
                        }

                        console.log('✅ Employee added successfully.');
                    });
                }
            });
        }

        // Compare the provided password with the hashed password in the database
        bcrypt.compare(Password, user.Password, (err, isMatch) => {
            if (err) {
                console.error('❌ Error comparing passwords:', err);
                return res.status(500).json({ message: 'Error checking credentials' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            res.status(200).json({ message: 'Login successful', user });
        });
    });
});

// Function to generate a reset token
function generateResetToken() {
    return crypto.randomBytes(20).toString('hex'); // generate a random token
}


// Forgot Password Endpoint
app.post('/forgot-password', (req, res) => {
    const { Name, Email } = req.body;

    if (!Name || !Email) {
        return res.status(400).json({ message: 'Name and Email are required.' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const expirationDate = new Date(Date.now() + 3600000); // Token valid for 1 hour

    const query = `
        INSERT INTO resetpassword (Name, Email, Token, ExpirationDate)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [Name, Email, resetToken, expirationDate], (err) => {
        if (err) {
            console.error('❌ Error generating reset token:', err);
            return res.status(500).json({ message: 'Error generating reset token.' });
        }

        // Send reset email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false, // Allow self-signed certificates
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: Email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Use the following token to reset your password: ${resetToken}`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('❌ Error sending email:', err);
                return res.status(500).json({ message: 'Error sending reset email.' });
            }

            res.status(200).json({ message: 'Password reset email sent successfully.' });
        });
    });
});


// Reset Password Endpoint
app.post('/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const query = `
        SELECT * FROM resetpassword
        WHERE Token = ? AND ExpirationDate > NOW()
    `;

    db.query(query, [token], (err, results) => {
        if (err) {
            console.error('❌ Error verifying reset token:', err);
            return res.status(500).json({ message: 'Error verifying reset token.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired reset token.' });
        }

        const { Email } = results[0];
        const hashedPassword = bcrypt.hashSync(newPassword, 10);

        const updateQuery = `
            UPDATE User
            SET Password = ?
            WHERE Email = ?
        `;

        db.query(updateQuery, [hashedPassword, Email], (err) => {
            if (err) {
                console.error('❌ Error resetting password:', err);
                return res.status(500).json({ message: 'Error resetting password.' });
            }

            // Delete the reset token after successful password reset
            const deleteQuery = `
                DELETE FROM resetpassword
                WHERE Token = ?
            `;

            db.query(deleteQuery, [token], (err) => {
                if (err) {
                    console.error('❌ Error deleting reset token:', err);
                    return res.status(500).json({ message: 'Error deleting reset token.' });
                }

                res.status(200).json({ message: 'Password reset successfully.' });
            });
        });
    });
});

// Function to send reset password email with token
function sendResetEmail(email, resetLink) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or your SMTP provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Car Tinting Business - Password Reset',
        text: `Click the following link to reset your password: ${resetLink}`,
        html: `<p>Click the following link to reset your password:</p>
               <a href="${resetLink}">${resetLink}</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('❌ Error sending email:', error);
        } else {
            console.log('✅ Password reset email sent:', info.response);
        }
    });
}



// Fetch Users Route (GET /users)
app.get('/users', (req, res) => {
    db.query('SELECT * FROM User', (err, results) => {
        if (err) {
            console.error('❌ Error fetching users:', err);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results);
    });
});

// Fetch Clients Route (GET /clients)
app.get('/clients', (req, res) => {
    db.query('SELECT * FROM Client', (err, results) => {
        if (err) {
            console.error('❌ Error fetching clients:', err);
            return res.status(500).json({ message: 'Error fetching clients' });
        }
                res.json(results);
    });
});

// Add Client Route (POST /clients)
app.post('/clients', (req, res) => {
    const { userId, address, phone, paymentDetails } = req.body;

    if (!userId || !address || !phone || !paymentDetails) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO Client (UserID, Address, Phone, PaymentDetails) VALUES (?, ?, ?, ?)';
    db.query(query, [userId, address, phone, paymentDetails], (err) => {
        if (err) {
            console.error('❌ Error adding client:', err);
            return res.status(500).json({ message: 'Error adding client.', error: err.message });
        }

        res.status(201).json({ message: 'Client added successfully!' });
    });
});

app.get('/clients/:userId', (req, res) => {
    const { userId } = req.params;

    const query = 'SELECT * FROM Client WHERE UserID = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching client details:', err);
            return res.status(500).json({ message: 'Error fetching client details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Client record not found' });
        }

        const client = results[0];
        const isComplete = client.Address && client.Phone && client.PaymentDetails;

        res.status(200).json({ isComplete, client });
    });
});




app.post('/schedule-appointment', (req, res) => {
    const { userId, vehicleDetails, tintType, date, time } = req.body;
    const validTintTypes = [
        'Automotive Window Tinting',
        'Standard dyed film',
        'Ceramic tint',
        'Carbon tint',
        'Metalized film',
        'Infrared rejection tint',
        'UV protection film',
        'Privacy tints',
        'Legal limit tinting (by state laws)',
        'Tint Removal',
        'Safe removal of old or bubbling tint films',
        'Custom Tinting',
        'Gradient or decorative tinting',
        'Colored or mirrored tints',
        'Custom logos or designs etched into tint'
    ];


    if (!userId || !vehicleDetails || !tintType || !date || !time) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    if (!validTintTypes.includes(tintType)) {
        return res.status(400).json({ message: 'Invalid tint type.' });
    }
    // First, fetch the ClientID using the UserID
    const getClientQuery = 'SELECT ClientID FROM Client WHERE UserID = ?';
    db.query(getClientQuery, [userId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching ClientID:', err);
            return res.status(500).json({ message: 'Error fetching ClientID.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Client record not found. Please complete your profile.' });
        }

        const clientId = results[0].ClientID;

        // Insert the appointment into the Appointment table
        const insertAppointmentQuery = 'INSERT INTO Appointment (ClientID, VehicleDetails, TintType, Date, Time, Status) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(insertAppointmentQuery, [clientId, vehicleDetails, tintType, date, time, 'Scheduled'], (err, result) => {
            if (err) {
                console.error('❌ Error scheduling appointment:', err);
                return res.status(500).json({ message: 'Error scheduling appointment.' });
            }

            res.status(201).json({ message: 'Appointment scheduled successfully', appointmentId: result.insertId });
        });
    });
});

// Fetch assigned jobs for an employee
app.get(':/jobs', (req, res) => {
    const { userId } = req.params;
    const query = 'SELECT * FROM EmployeeJobs WHERE EmployeeID = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching jobs:', err);
            return res.status(500).json({ message: 'Error fetching jobs' });
        }
        res.json(results);
    });
});

// Fetch appointments for a client
app.get('/appointments/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT a.AppointmentID, a.VehicleDetails, a.TintType, a.Date, a.Time, a.Status
        FROM Appointment a
        INNER JOIN Client c ON a.ClientID = c.ClientID
        WHERE c.UserID = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching appointments:', err);
            return res.status(500).json({ message: 'Error fetching appointments' });
        }

        res.status(200).json(results);
    });
});
app.put('/appointments/:appointmentId', (req, res) => {
    const { appointmentId } = req.params;
    const { Date, Time, Status, TintType } = req.body;

    // Build the query dynamically based on the provided fields
    const fields = [];
    const values = [];

    if (Date) {
        fields.push('Date = ?');
        values.push(Date);
    }
    if (Time) {
        fields.push('Time = ?');
        values.push(Time);
    }
    if (Status) {
        fields.push('Status = ?');
        values.push(Status);
    }
    if (TintType) {
        fields.push('TintType = ?');
        values.push(TintType);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'At least one field is required to update.' });
    }

    values.push(appointmentId);

    const query = `UPDATE Appointment SET ${fields.join(', ')} WHERE AppointmentID = ?`;

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('❌ Error updating appointment:', err);
            return res.status(500).json({ message: 'Error updating appointment.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.status(200).json({ message: 'Appointment updated successfully.' });
    });
});

app.delete('/appointments/:appointmentId', (req, res) => {
    const { appointmentId } = req.params;

    const query = 'DELETE FROM Appointment WHERE AppointmentID = ?';
    db.query(query, [appointmentId], (err, result) => {
        if (err) {
            console.error('❌ Error deleting appointment:', err);
            return res.status(500).json({ message: 'Error deleting appointment.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully.' });
    });
});

// Get all inventory items
app.get('/inventory', (req, res) => {
    const query = 'SELECT * FROM Inventory';
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching inventory:', err.message);
            return res.status(500).json({ message: 'Error fetching inventory' });
        }
        res.status(200).json(results);
    });
});
// Get all services
app.get('/services', (req, res) => {
    const query = 'SELECT * FROM Service';
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching services:', err.message);
            return res.status(500).json({ message: 'Error fetching services' });
        }
        res.status(200).json(results);
    });
});
// Add a new service
app.post('/services', (req, res) => {
    const { Name, Description, Price } = req.body;

    if (!Name || !Description || !Price) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO Service (Name, Description, Price) VALUES (?, ?, ?)';
    db.query(query, [Name, Description, Price], (err) => {
        if (err) {
            console.error('❌ Error adding service:', err);
            return res.status(500).json({ message: 'Error adding service.' });
        }
        res.status(201).json({ message: 'Service added successfully.' });
    });
});
// Update service details
app.put('/services/:id', (req, res) => {
    const { id } = req.params;
    const { Name, Description, Price } = req.body;

    const fields = [];
    const values = [];

    if (Name) {
        fields.push('Name = ?');
        values.push(Name);
    }
    if (Description) {
        fields.push('Description = ?');
        values.push(Description);
    }
    if (Price) {
        fields.push('Price = ?');
        values.push(Price);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'At least one field is required to update.' });
    }

    values.push(id);

    const query = `UPDATE Service SET ${fields.join(', ')} WHERE ServiceID = ?`;
    db.query(query, values, (err, result) => {
        if (err) {
            console.error('❌ Error updating service:', err);
            return res.status(500).json({ message: 'Error updating service.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        res.status(200).json({ message: 'Service updated successfully.' });
    });
});

// Update inventory item
app.put('/inventory/:id', (req, res) => {
    const { id } = req.params; // Use 'id' as the parameter name
    const { Quantity } = req.body;

    if (!Quantity && Quantity !== 0) {
        return res.status(400).json({ message: 'Quantity is required.' });
    }

    const query = 'UPDATE Inventory SET Quantity = ? WHERE ItemID = ?';
    db.query(query, [Quantity, id], (err) => {
        if (err) {
            console.error('❌ Error updating inventory:', err);
            return res.status(500).json({ message: 'Error updating inventory' });
        }
        res.status(200).json({ message: 'Inventory updated successfully' });
    });
});
app.get('/inventory/:id', (req, res) => {
    const { id } = req.params; // Use 'id' as the parameter name
    const query = 'SELECT * FROM Inventory WHERE ItemID = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('❌ Error fetching inventory item:', err);
            return res.status(500).json({ message: 'Error fetching inventory item.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Inventory item not found.' });
        }
        res.status(200).json(results[0]);
    });
});
app.post('/inventory', (req, res) => {
    const { Name, Quantity, Supplier, ReorderLevel } = req.body;

    if (!Name || !Quantity || !Supplier || !ReorderLevel) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO Inventory (Name, Quantity, Supplier, ReorderLevel) VALUES (?, ?, ?, ?)';
    db.query(query, [Name, Quantity, Supplier, ReorderLevel], (err) => {
        if (err) {
            console.error('❌ Error adding inventory item:', err);
            return res.status(500).json({ message: 'Error adding inventory item.' });
        }
        res.status(201).json({ message: 'Inventory item added successfully.' });
    });
});
app.delete('/inventory/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM Inventory WHERE ItemID = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('❌ Error deleting inventory item:', err);
            return res.status(500).json({ message: 'Error deleting inventory item.' });
        }
        res.status(200).json({ message: 'Inventory item deleted successfully.' });
    });
});


app.post('/notifications', (req, res) => {
    const { UserID, Message } = req.body;

    const query = 'INSERT INTO Notification (UserID, Message) VALUES (?, ?)';
    db.query(query, [UserID, Message], (err) => {
        if (err) {
            console.error('❌ Error sending notification:', err);
            return res.status(500).json({ message: 'Error sending notification' });
        }
        res.status(201).json({ message: 'Notification sent successfully' });
    });
});

// Fetch notifications for a user (GET /notifications/:userId)
app.get('/notifications/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT * FROM Notification
        WHERE UserID = ?
        ORDER BY Timestamp DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching notifications:', err);
            return res.status(500).json({ message: 'Error fetching notifications.' });
        }

        res.status(200).json({ notifications: results });
    });
});
// Mark a notification as read (PUT /notifications/:notificationId/read)
app.put('/notifications/:notificationId/read', (req, res) => {
    const { notificationId } = req.params;

    const query = `
        DELETE FROM Notification
        WHERE NotificationID = ?
    `;

    db.query(query, [notificationId], (err, result) => {
        if (err) {
            console.error('❌ Error marking notification as read:', err);
            return res.status(500).json({ message: 'Error marking notification as read.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        res.status(200).json({ message: 'Notification marked as read and removed.' });
    });
});
// Delete a notification (DELETE /notifications/:notificationId)
app.delete('/notifications/:notificationId', (req, res) => {
    const { notificationId } = req.params;

    const query = `
        DELETE FROM Notification
        WHERE NotificationID = ?
    `;

    db.query(query, [notificationId], (err, result) => {
        if (err) {
            console.error('❌ Error deleting notification:', err);
            return res.status(500).json({ message: 'Error deleting notification.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        res.status(200).json({ message: 'Notification deleted successfully.' });
    });
});
// fetch appointments with client and service details
app.get('/appointments', (req, res) => {
    const query = `
        SELECT 
            a.AppointmentID, 
            u.Name AS ClientName, 
            a.TintType AS Service, 
            a.Date, 
            a.Status, 
            e.EmployeeID, 
            eu.Name AS EmployeeName
        FROM Appointment a
        INNER JOIN Client c ON a.ClientID = c.ClientID
        INNER JOIN User u ON c.UserID = u.UserID
        LEFT JOIN Employee e ON a.AssignedEmployeeID = e.EmployeeID
        LEFT JOIN User eu ON e.UserID = eu.UserID
        `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching appointments:', err);
            return res.status(500).json({ message: 'Error fetching appointments' });
        }

        res.status(200).json(results);
    });
});
app.get('/appointments/:userId', (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT a.AppointmentID, a.VehicleDetails, a.TintType, a.Date, a.Time, a.Status
        FROM Appointment a
        WHERE a.ClientID = ?
    `;
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching appointments:', err);
            return res.status(500).json({ message: 'Error fetching appointments' });
        }
        res.json(results);
    });
});
// Update appointment status to 'Paid'
app.put('/appointments/:appointmentId/pay', (req, res) => {
    const { appointmentId } = req.params;

    const query = 'UPDATE Appointment SET Status = ? WHERE AppointmentID = ?';
    const values = ['Paid', appointmentId];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('❌ Error updating appointment status to Paid:', err);
            return res.status(500).json({ message: 'Error updating appointment status.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.status(200).json({ message: 'Appointment status updated to Paid successfully.' });
    });
});



app.post('/schedule-appointment', (req, res) => {
    const { userId, vehicleDetails, tintType, date, time } = req.body;

    const query = 'INSERT INTO Appointment (ClientID, VehicleDetails, TintType, Date, Time, Status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [userId, vehicleDetails, tintType, date, time, 'Scheduled'], (err, result) => {
        if (err) {
            console.error('❌ Error scheduling appointment:', err);
            return res.status(500).json({ message: 'Error scheduling appointment' });
        }
        res.status(201).json({ message: 'Appointment scheduled successfully', appointmentId: result.insertId });
    });
});

app.post('/announcements', (req, res) => {
    const { Message } = req.body;

    const query = 'INSERT INTO Announcements (Message, Date) VALUES (?, NOW())';
    db.query(query, [Message], (err) => {
        if (err) {
            console.error('❌ Error creating announcement:', err);
            return res.status(500).json({ message: 'Error creating announcement' });
        }
        res.status(200).json({ message: 'Announcement created successfully' });
    });
});
// Fetch announcements (GET /announcements)
app.get('/announcements', (req, res) => {
    const query = 'SELECT Message FROM Announcements ORDER BY Date DESC';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching announcements:', err);
            return res.status(500).json({ message: 'Error fetching announcements' });
        }
        res.json(results);
    });
});
// Assign a job to an employee (PUT /appointments/:appointmentId/assign)
app.put('/appointments/:appointmentId/assign', (req, res) => {
    const { appointmentId } = req.params;
    const { employeeId } = req.body;

    if (!employeeId || !appointmentId) {
        return res.status(400).json({ message: 'Employee ID and Appointment ID are required' });
    }

    // Fetch the date and time of the appointment
    const getAppointmentQuery = `
        SELECT Date, Time 
        FROM Appointment 
        WHERE AppointmentID = ?
    `;
    db.query(getAppointmentQuery, [appointmentId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching appointment details:', err);
            return res.status(500).json({ message: 'Error fetching appointment details' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        const { Date, Time } = results[0];
        const jobDetails = `You're assigned this job on ${Date} at ${Time}; `;

        // Update the Appointment table to assign the employee
        const updateAppointmentQuery = `
            UPDATE Appointment 
            SET AssignedEmployeeID = ?, Status = "Assigned" 
            WHERE AppointmentID = ?
        `;
        db.query(updateAppointmentQuery, [employeeId, appointmentId], (err, result) => {
            if (err) {
                console.error('❌ Error assigning job:', err);
                return res.status(500).json({ message: 'Error assigning job' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Appointment not found' });
            }

            // Update the Employee table to add the job to AssignedJobs
            const updateEmployeeQuery = `
                UPDATE Employee 
                SET AssignedJobs = CONCAT(IFNULL(AssignedJobs, ''), ?) 
                WHERE EmployeeID = ?
            `;
            db.query(updateEmployeeQuery, [jobDetails, employeeId], (err) => {
                if (err) {
                    console.error('❌ Error updating employee jobs:', err);
                    return res.status(500).json({ message: 'Error updating employee jobs' });
                }
                

                res.status(200).json({ message: 'Job assigned successfully' });
            });
        });
    });
});

// Fetch employees (GET /employees)
app.get('/employees', (req, res) => {
    const { status } = req.query; // Optional query parameter to filter by status (e.g., "free")
    let query = `
        SELECT e.EmployeeID, u.Name, u.Email, e.AssignedJobs
        FROM Employee e
        INNER JOIN User u ON e.UserID = u.UserID
    `;
    const params = [];

    

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('❌ Error fetching employees:', err);
            return res.status(500).json({ message: 'Error fetching employees' });
        }

        res.status(200).json(results);
    });
});

// Fetch assigned jobs for an employee (GET /employees/:userId/jobs)
app.get('/employees/:userId/jobs', (req, res) => {
    const { userId } = req.params;

    const query = `
        SELECT e.AssignedJobs
        FROM Employee e
        INNER JOIN User u ON e.UserID = u.UserID
        WHERE u.UserID = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('❌ Error fetching assigned jobs:', err);
            return res.status(500).json({ message: 'Error fetching assigned jobs.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No jobs found for this employee.' });
        }

        res.status(200).json(results);
    });
});
// Submit a support ticket (POST /support)
app.post('/support', (req, res) => {
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).json({ message: 'User ID and message are required.' });
    }

    const query = 'INSERT INTO Support (UserID, Message, Status) VALUES (?, ?, ?)';
    db.query(query, [userId, message, 'Open'], (err) => {
        if (err) {
            console.error('❌ Error submitting support ticket:', err);
            return res.status(500).json({ message: 'Error submitting support ticket.' });
        }

        res.status(201).json({ message: 'Support ticket submitted successfully.' });
    });
});
// Fetch all support tickets (GET /support)
app.get('/support', (req, res) => {
    const query = `
        SELECT s.TicketID, u.Name AS UserName, u.Email, s.Message, s.Status, s.Timestamp
        FROM Support s
        INNER JOIN User u ON s.UserID = u.UserID
        ORDER BY s.Timestamp DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching support tickets:', err);
            return res.status(500).json({ message: 'Error fetching support tickets.' });
        }

        res.status(200).json(results);
    });
});
// Update support ticket status (PUT /support/:ticketId)
app.put('/support/:ticketId', (req, res) => {
    const { ticketId } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    const query = 'UPDATE Support SET Status = ? WHERE TicketID = ?';
    db.query(query, [status, ticketId], (err, result) => {
        if (err) {
            console.error('❌ Error updating support ticket status:', err);
            return res.status(500).json({ message: 'Error updating support ticket status.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Support ticket not found.' });
        }

        res.status(200).json({ message: 'Support ticket status updated successfully.' });
    });
});
// Contact Us Route (POST /contact-us)
app.post('/contact-us', (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Fetch the admin email from the database
    const query = 'SELECT Email FROM User WHERE Role = "admin" LIMIT 1';
    db.query(query, (err, results) => {
        if (err) {
            console.error('❌ Error fetching admin email:', err);
            return res.status(500).json({ message: 'Error fetching admin email.' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Admin email not found.' });
        }

        const adminEmail = results[0].Email;

        // Send the email to the admin
        const subject = `Contact Us Form Submission from ${name}`;
        const text = `You have received a new message from the Contact Us form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;

        sendEmail(adminEmail, subject, text);

        res.status(200).json({ message: 'Your message has been sent successfully!' });
    });
});
//payment processing endpoint
app.post('/process-payment', (req, res) => {
    const { AppointmentID, Amount, Method, TransactionStatus } = req.body;

    // Validate required fields
    if (!AppointmentID || !Amount || !Method || !TransactionStatus) {
        return res.status(400).json({ message: 'All payment fields are required.' });
    }

    const validMethods = ['PayPal', 'Visa', 'MasterCard'];
    const validStatuses = ['Pending', 'Completed', 'Failed'];

    // Validate payment method and transaction status
    if (!validMethods.includes(Method)) {
        return res.status(400).json({ message: 'Invalid payment method.' });
    }
    if (!validStatuses.includes(TransactionStatus)) {
        return res.status(400).json({ message: 'Invalid transaction status.' });
    }

    const query = `
        INSERT INTO Payment (AppointmentID, Amount, Method, TransactionStatus)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [AppointmentID, Amount, Method, TransactionStatus], (err, result) => {
        if (err) {
            console.error('❌ Error processing payment:', err);
            return res.status(500).json({ message: 'Error processing payment.' });
        }

        res.status(201).json({ message: 'Payment processed successfully.', PaymentID: result.insertId });
    });
});
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Car Tinting API',
        endpoints: {
            login: '/login',
            users: '/users',
            scheduleAppointment: '/schedule-appointment',
            forgotPassword: '/forgot-password',
            resetPassword: '/reset-password',
            clients: '/clients',
            employees: ':userId/jobs', // Fetch jobs for a specific employee
            appointments: ':userId/appointments', // Fetch appointments for a specific client
            announcements: '/announcements', // Fetch all announcements
            items: '/inventory', // Get all inventory items
            services: '/services', // Get all services
        },
    });
});
// Serve the Reset Password page
app.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'resetPassword.html'));
});
// Redirect to the frontend's reset password page
app.get('/reset-password', (req, res) => {
    res.redirect('http://localhost:3001/resetPassword.html'); // Replace with your frontend's URL
});

app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true
}));


// Start the server
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});