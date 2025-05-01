CREATE DATABASE CarTintingDB;
USE CarTintingDB;

CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50),
    Email VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
    Role VARCHAR(50) CHECK (Role IN ('admin', 'employee', 'customer'))
);

CREATE TABLE Client (
    ClientID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Address VARCHAR(100),
    Phone VARCHAR(15),
    PaymentDetails TEXT,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);


CREATE TABLE Employee (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    AssignedJobs TEXT,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Appointment (
    AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT,
    VehicleDetails VARCHAR(100),
    TintType VARCHAR(50),
    Date DATE,
    Time TIME,
    Status VARCHAR(30),
    FOREIGN KEY (ClientID) REFERENCES Client(ClientID)
);

CREATE TABLE Service (
    ServiceID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50),
    Description TEXT,
    Price DECIMAL(10,2) CHECK (Price >= 0)
);

CREATE TABLE Orders (
    OrderID INT AUTO_INCREMENT PRIMARY KEY,
    ClientID INT,
    ServiceID INT,
    Status VARCHAR(50),
    PaymentStatus VARCHAR(30),
    FOREIGN KEY (ClientID) REFERENCES Client(ClientID),
    FOREIGN KEY (ServiceID) REFERENCES Service(ServiceID)
);

CREATE TABLE Payment (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each payment
    AppointmentID INT NOT NULL,               -- Link payment to an appointment
    Amount DECIMAL(10, 2) CHECK (Amount >= 0),-- Payment amount (must be non-negative)
    Method ENUM('PayPal', 'Visa', 'MasterCard') NOT NULL, -- Payment method choices
    TransactionStatus ENUM('Pending', 'Completed', 'Failed') NOT NULL, -- Status of the transaction
    PaymentDate DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp of the payment
    FOREIGN KEY (AppointmentID) REFERENCES Appointment(AppointmentID) -- Link to Appointment table
);

CREATE TABLE Inventory (
    ItemID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50),
    Quantity INT CHECK (Quantity >= 0),
    Supplier VARCHAR(50),
    ReorderLevel INT CHECK (ReorderLevel >= 0)
);

CREATE TABLE Notification (
    NotificationID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Message TEXT,
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

CREATE TABLE Support (
    TicketID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Message TEXT,
    Status VARCHAR(30),
    Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);
CREATE TABLE resetpassword (
    ID INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for each record
    Name VARCHAR(255) NOT NULL,              -- Username of the user
    Email VARCHAR(255) NOT NULL,             -- Email of the user
    Token VARCHAR(255) NOT NULL,              -- Reset token (e.g., 32-byte hex string)
    ExpirationDate DATETIME NOT NULL        -- Expiration date and time for the token
);

CREATE TABLE Announcements (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Message TEXT NOT NULL,
    Date DATETIME NOT NULL
);