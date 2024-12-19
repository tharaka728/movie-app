<?php
require_once(__DIR__ . '/vendor/autoload.php');

// Admin email addresses
$admin_emails = ['prabhath.senadheera@ebeyonds.com', 'dumidu.kodithuwakku@ebeyonds.com '];

// File path to save the JSON data
$file_path = 'data.json';


if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $first_name = isset($_POST["first-name"]) ? htmlspecialchars(trim($_POST["first-name"])) : '';
    $last_name = isset($_POST["last-name"]) ? htmlspecialchars(trim($_POST["last-name"])) : '';
    $email = isset($_POST["email"]) ? htmlspecialchars(trim($_POST["email"])) : '';
    $telephone = isset($_POST["telephone"]) ? htmlspecialchars(trim($_POST["telephone"])) : '';
    $message = isset($_POST["message"]) ? htmlspecialchars(trim($_POST["message"])) : '';
    $terms = isset($_POST["terms"]) && $_POST["terms"] === "on";

    
    if (empty($first_name) || empty($last_name) || empty($email) || empty($message)) {
        echo "All required fields must be filled out.";
        exit;
    }

    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Invalid email address.";
        exit;
    }

    
    if (!$terms) {
        echo "You must agree to the terms.";
        exit;
    }

    // Save data to JSON
    $new_data = [
        "first_name" => $first_name,
        "last_name" => $last_name,
        "email" => $email,
        "telephone" => $telephone,
        "message" => $message,
        "terms" => $terms,
        "submitted_at" => date('Y-m-d H:i:s')
    ];

    
    $data_array = file_exists($file_path) ? json_decode(file_get_contents($file_path), true) : [];
    $data_array[] = $new_data;

    // Save updated JSON data
    if (file_put_contents($file_path, json_encode($data_array, JSON_PRETTY_PRINT))) {
        if (sendEmails($first_name, $last_name, $email, $telephone, $message, $admin_emails)) {
            echo "success";
        } else {
            echo "Failed to send email.";
        }
    } else {
        echo "Failed to save data.";
    }
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}

// Function to send emails using 
function sendEmails($first_name, $last_name, $email, $telephone, $message, $admin_emails) {
    $apiKey = '';

    // Configure  client
    $config = Brevo\Client\Configuration::getDefaultConfiguration()->setApiKey('api-key', $apiKey);
    $apiInstance = new Brevo\Client\Api\TransactionalEmailsApi(new GuzzleHttp\Client(), $config);

    // Email content for admin notification
    $admin_email_content = "
    <html>
        <body>
            <h1>New Form Submission</h1>
            <p><strong>Name:</strong> $first_name $last_name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Telephone:</strong> $telephone</p>
            <p><strong>Message:</strong> $message</p>
        </body>
    </html>";

    // Email content for auto-response
    $user_email_content = "
    <html>
        <body>
            <h1>Thank You for Your Submission!</h1>
            <p>Dear $first_name $last_name,</p>
            <p>Thank you for reaching out to us. We have received your submission and will get back to you shortly.</p>
          /*  <p><strong>Summary of Your Submission:</strong></p>
            <p><strong>Name:</strong> $first_name $last_name</p>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Telephone:</strong> $telephone</p>
            <p><strong>Message:</strong> $message</p>
            <p>Best Regards,<br>Team Cinehub</p>*/
        </body>
    </html>";

    // Send admin notification email
    $admin_email = new \Brevo\Client\Model\SendSmtpEmail([
        'subject' => 'New Form Submission',
        'sender' => ['name' => 'moviehub', 'email' => 'tharakaonline28@gmail.com'],
        'to' => array_map(fn($admin_email) => ['email' => $admin_email], $admin_emails),
        'htmlContent' => $admin_email_content,
    ]);

    // Send auto-response email to user
    $user_email = new \Brevo\Client\Model\SendSmtpEmail([
        'subject' => 'Thank You for Your Submission!',
        'sender' => ['name' => 'cinehub', 'email' => 'tharakaonline28@gmail.com'],
        'to' => [['email' => $email, 'name' => "$first_name $last_name"]],
        'htmlContent' => $user_email_content,
    ]);

    try {
        // Send admin email
        $apiInstance->sendTransacEmail($admin_email);

        // Send auto-response email
        $apiInstance->sendTransacEmail($user_email);

        return true;
    } catch (Exception $e) {
        error_log('Exception when sending email: ' . $e->getMessage());
        return false;
    }
}
?>
