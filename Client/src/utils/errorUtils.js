/**
 * Converts backend error messages into user-friendly versions
 * @param {Error|string} error - The error object or message
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyError = (error) => {
    const errorMap = {
        'Unauthorized- No token provided': 'Your session has expired. Please log in again.',
        'Unauthorized- Invalid token': 'Your session has expired. Please log in again.',
        'User not found': 'Account not found. Please check your credentials.',
        'User does not exist': 'Invalid username or password.',
        'Invalid credentials': 'Invalid username or password.',
        'Passwords do not match': 'Passwords do not match. Please try again.',
        'User already exists': 'This username is already taken. Please choose another.',
        'Internal server error': 'Something went wrong. Please try again later.',
        'Internal Server Error': 'Something went wrong. Please try again later.',
        'Error sending message': 'Could not send your message. Please try again.',
        'Error fetching messages': 'Could not load messages. Please refresh the page.',
        'Error fetching conversations': 'Could not load conversations. Please refresh the page.',
        'Conversation not found': 'Unable to find this conversation.',
        'File size too large (Max 2MB)': 'File is too large. Maximum size is 2MB.',
        'All fields are required': 'Please fill in all required fields.',
        'Password must be at least 6 characters long': 'Password must be at least 6 characters long.',
    };

    // Extract message from error object or use error directly
    const message = error?.message || error || 'An unexpected error occurred';

    // Return mapped message or original if no mapping exists
    return errorMap[message] || message;
};
