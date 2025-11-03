import fetch from 'node-fetch';

/**
 * CODING EXERCISE: Add Retry Logic
 * 
 * The getUserByEmail() method occasionally times out when calling the Administration API.
 * Your task: Add retry logic with exponential backoff for transient failures.
 * 
 * Requirements:
 * 1. Retry failed requests up to 3 times
 * 2. Use exponential backoff: 100ms, 200ms, 400ms
 * 3. Only retry on 5xx errors or network timeouts
 * 4. Do NOT retry on 4xx errors (client errors like 404)
 * 5. Log each retry attempt using console.log()
 * 6. BONUS: Add a 2-second timeout per request attempt
 */

export interface UserInfo {
    userId: string;
    username: string;
    userEmail: string;
}

interface UserProfile {
    userId: string;
    firstName: string;
    lastName: string;
    fullName: string | null;
    emailAddressPrimary: string;
}

export class UserService {
    /**
     * Lookup user information by email address
     * Currently has NO retry logic - fails on first error
     */
    static async getUserByEmail(email: string): Promise<UserInfo | null> {
        const url = `https://api.example.com/users/${encodeURIComponent(email)}`;
        
        console.log(`Calling ${url}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer mock-token',
                'Content-Type': 'application/json',
            },
        });

        console.log(`Response status: ${response.status}`);

        if (response.status >= 200 && response.status < 300) {
            const userData = await response.json() as UserProfile;
            const fullName = userData.fullName || `${userData.firstName} ${userData.lastName}`.trim();

            return {
                userId: userData.userId,
                username: fullName,
                userEmail: userData.emailAddressPrimary,
            };
        } else if (response.status === 404) {
            console.log(`User not found for email: ${email}`);
            return null;
        } else {
            throw new Error(`API error: ${response.status}`);
        }
    }
}

// ============================================
// TODO: YOUR IMPLEMENTATION HERE
// ============================================

/**
 * Helper function to retry an async operation with exponential backoff
 * 
 * @param operation - The async function to retry
 * @param maxAttempts - Maximum number of attempts (default: 3)
 * @param baseDelayMs - Initial delay in milliseconds (default: 100)
 * @returns The result of the operation
 * @throws The last error if all retries fail
 */
async function retryWithBackoff<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelayMs: number = 100
): Promise<T> {
    // TODO: Implement retry logic here
    throw new Error('Not implemented');
}

/**
 * Helper function to create a promise that rejects after a timeout
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    // TODO: Implement timeout logic here (BONUS)
    throw new Error('Not implemented');
}
 
