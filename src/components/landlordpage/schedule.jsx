const cron = require('node-cron');
const nodemailer = require('nodemailer');


const fetchTenants = async () => {
    try {
        const response = await fetch("http://localhost/php/tenants.php");
        if (!response.ok) {
            throw new Error('Failed to fetch tenants');
        }
        const data = await response.json();
        setTenant(data);
    } catch (error) {
        console.error("Error fetching tenants:", error);
        setError("Failed to load tenants.");
    }
};

  const calculateDueDate = (occupationDate) => {
    const dueDate = new Date(occupationDate);
    dueDate.setMonth(dueDate.getMonth() + 1);
    return dueDate;
  };
  
  // 2. Schedule Email Sending
  const scheduleEmails = () => {
    cron.schedule('0 0 * * *', async () => {
      try {
        const tenants = await fetchTenants();
        tenants.forEach((tenant) => {
          const dueDate = calculateDueDate(tenant.occupation_date);
          const currentDate = new Date();
          const fiveDaysBeforeDueDate = new Date(dueDate);
          fiveDaysBeforeDueDate.setDate(dueDate.getDate() - 5);
          const fiveDaysAfterDueDate = new Date(dueDate);
          fiveDaysAfterDueDate.setDate(dueDate.getDate() + 5);
  
          if (
            currentDate.getTime() >= fiveDaysBeforeDueDate.getTime() &&
            currentDate.getTime() <= fiveDaysAfterDueDate.getTime()
          ) {
            sendReminderEmail(tenant.email, dueDate);
          }
        });
      } catch (error) {
        console.error('Error scheduling emails:', error);
      }
    });
  };
  
  // 3. Send Reminder Emails
  const sendReminderEmail = (email, dueDate) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });
  
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Rent Payment Reminder',
      text: `Dear tenant,\n\nYour rent payment is due on ${dueDate.toDateString()}. Please make the payment before the due date.\n\nBest regards,\nYour Landlord`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  };
  
  // Call the function to start scheduling emails
  scheduleEmails();