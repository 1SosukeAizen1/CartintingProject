// Toggle between Sign Up, Login, and Forgot Password forms
document.getElementById('showLoginBtn').addEventListener('click', function () {
    document.getElementById('signUpFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'block';
    document.getElementById('forgetPasswordFormContainer').style.display = 'none';
});

document.getElementById('showSignUpBtn').addEventListener('click', function () {
    document.getElementById('signUpFormContainer').style.display = 'block';
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('forgetPasswordFormContainer').style.display = 'none';
});

document.getElementById('showForgetPasswordBtn').addEventListener('click', function () {
    document.getElementById('signUpFormContainer').style.display = 'none';
    document.getElementById('loginFormContainer').style.display = 'none';
    document.getElementById('forgetPasswordFormContainer').style.display = 'block';
});

// Handle Sign Up Form submission
document.getElementById('userForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const Name = document.getElementById('name').value.trim();
    const Email = document.getElementById('email').value.trim();
    const Password = document.getElementById('password').value.trim();
    const Role = document.getElementById('role').value;

    const user = { Name, Email, Password, Role };
    const message = document.getElementById('responseMessage');
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const formElements = event.target.elements;

    if (!Name || !Email || !Password || !Role) {
        showMessage('Please fill out all fields.', 'red');
        return;
    } 

    try {
        // Disable form elements while submitting
        for (let element of formElements) {
            element.disabled = true;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error adding user.');
        }

        showMessage('User added successfully!', 'green');

        // Add delay before resetting the form to show success message
        setTimeout(() => {
            document.getElementById('userForm').reset();
        }, 1500); // Delay of 1.5 seconds before resetting
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message || 'Error adding user. Please try again later.', 'red');
    } finally {
        // Re-enable form elements and reset button
        for (let element of formElements) {
            element.disabled = false;
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Add New User';
    }
});

// Handle Login Form submission
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const Email = document.getElementById('loginEmail').value.trim();
    const Password = document.getElementById('loginPassword').value.trim();
    const message = document.getElementById('responseMessage');

    if (!Email || !Password) {
        showMessage('Please fill out all fields.', 'red');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email, Password })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Invalid email or password.');
        }

        const data = await response.json();
        localStorage.setItem('userId', data.user.UserID); // Store userId in localStorage
        localStorage.setItem('userRole', data.user.Role); // Store userRole in localStorage
        if (data.user.Role === 'customer') {
            // Check if client details are complete
            const clientResponse = await fetch(`http://localhost:3001/clients/${data.user.UserID}`);
            const clientData = await clientResponse.json();

            if (!clientData.isComplete) {
                // Redirect to profile completion form
                window.location.href = './addClient.html';
                return;
            }
        }
        showMessage('Login successful! Redirecting...', 'green');

        // Redirect based on role
        if (data.user.Role === 'admin') {
            window.location.href = './adminDashboard.html';
        } else if (data.user.Role === 'employee') {
            window.location.href = './employeeDashboard.html';
        } else if (data.user.Role === 'customer') {
            window.location.href = './clientDashboard.html';
        }
    } catch (error) {
        console.error('Error:', error);
        message.textContent = error.message || 'Error logging in. Please try again later.';
        message.style.color = 'red';
    }
});

// Handle Forgot Password Form submission
document.getElementById('forgetPasswordForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const Name = document.getElementById('forgetPasswordUsername').value.trim();
    const Email = document.getElementById('forgetPasswordEmail').value.trim();
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const formElements = event.target.elements;

    if (!Name || !Email) {
        alert('Please enter both your username and email.');
        return;
    }

    try {
        // Disable form elements while submitting
        for (let element of formElements) {
            element.disabled = true;
        }
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const response = await fetch('http://localhost:3001/forgot-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Name, Email }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error sending reset link.');
        }

        alert('Password reset link sent! Redirecting to reset password page...');
        // Redirect to resetPassword.html
        window.location.href = 'resetPassword.html';
    } catch (error) {
        console.error('Error:', error);
        alert(error.message || 'Error sending reset link. Please try again later.');
    } finally {
        // Re-enable form elements and reset button
        for (let element of formElements) {
            element.disabled = false;
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Reset Password';
    }
});

// Fetch and display existing users
document.getElementById('fetchUsersBtn').addEventListener('click', async function () {
    const userList = document.getElementById('userList');
    const fetchBtn = document.getElementById('fetchUsersBtn');

    userList.innerHTML = ''; // Clear existing list
    fetchBtn.disabled = true;
    fetchBtn.textContent = 'Loading...';

    try {
        const response = await fetch('http://localhost:3001/users');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        const users = await response.json();

        if (users.length > 0) {
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = ` Name: ${user.Name}, Email: ${user.Email}, Role: ${user.Role}`;
                userList.appendChild(li);
            });
        } else {
            userList.innerHTML = '<li>No users found.</li>';
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        showMessage('Error fetching users. Please try again later.', 'red');
    } finally {
        fetchBtn.disabled = false;
        fetchBtn.textContent = 'Existing Users';
    }
});
// Function to process payment
async function processPayment(appointmentId, amount, method, transactionStatus) {
    try {
        const response = await fetch('http://localhost:3001/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                AppointmentID: appointmentId,
                Amount: amount,
                Method: method,
                TransactionStatus: transactionStatus,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Payment processed successfully. Payment ID: ' + data.PaymentID);
        } else {
            alert('Error processing payment: ' + data.message);
        }
    } catch (error) {
        console.error('❌ Error processing payment:', error);
        alert('An error occurred while processing the payment.');
    }
}


// Utility function to display messages
function showMessage(text, color) {
    const message = document.getElementById('responseMessage');

    try {
        message.textContent = text;
        message.style.color = color;
        message.scrollIntoView({ behavior: 'smooth' });

        setTimeout(() => {
            message.textContent = '';
        }, 4000);
    } catch (error) {
        console.error('Error displaying message:', error);
    }
}



function hideAllSections() {
    // Hide all tables
    document.getElementById('adminDataContainer').classList.add('hidden');
    document.getElementById('inventoryDataContainer').classList.add('hidden');
    document.getElementById('servicesDataContainer').classList.add('hidden');
    document.getElementById('appointmentsDataContainer').classList.add('hidden');

    // Hide all forms
    document.getElementById('addInventorySection').classList.add('hidden');
    document.getElementById('updateInventorySection').classList.add('hidden');
    document.getElementById('updateAppointmentSection').classList.add('hidden');
}