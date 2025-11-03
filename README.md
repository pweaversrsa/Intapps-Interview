# Coding Exercise: Add Retry Logic to User Service

---

## Background

You're working on a microservice that logs user activities. The service needs to look up user information from an external Administration API to get the user's full name and internal database ID.

Currently, the `getUserByEmail()` method makes a single HTTP request. If the API is temporarily unavailable or slow, the request fails immediately, causing activity logs to be incomplete.

---

## The Problem

The Administration API occasionally experiences transient failures:
- **503 Service Unavailable** during deployments (~30 seconds)
- **502 Bad Gateway** when load balancers restart (~5 seconds)
- **Network timeouts** under high load

These failures are temporary and usually succeed if retried within a few hundred milliseconds.

---

## Your Task

Add retry logic with exponential backoff to make the `getUserByEmail()` method more resilient.

### Requirements

1. **Retry up to 3 times** on failures
2. **Use exponential backoff** between attempts:
   - First retry: wait 100ms
   - Second retry: wait 200ms
   - Third retry: wait 400ms
3. **Only retry on retryable errors:**
   - ✅ Retry: 5xx errors (500, 502, 503, etc.)
   - ✅ Retry: Network errors (timeout, connection refused, etc.)
   - ❌ Don't retry: 4xx errors (400, 404, etc.) - these won't succeed on retry
4. **Log each retry attempt** using `console.log()` with format:
   ```
   Attempt 1 failed: API error: 503, retrying in 100ms
   Attempt 2 failed: API error: 503, retrying in 200ms
   Attempt 3 succeeded
   ```
5. **BONUS:** Add a 2-second timeout per request attempt to prevent hanging

---

## Starting Point

You have a simplified `user.service.simplified.ts` file with:
- `getUserByEmail()` method that makes a single fetch request
- Returns `UserInfo | null` (null for 404 Not Found)
- Throws an error on 5xx status codes
- Two stub helper functions for you to implement:
  - `retryWithBackoff()` - generic retry function
  - `withTimeout()` - timeout wrapper (bonus)

---

## Expected Behavior

### Success on First Attempt
```typescript
await getUserByEmail('john@example.com');
// Console: "Calling https://api.example.com/users/john@example.com"
// Console: "Response status: 200"
// Returns: { userId: "123", username: "John Doe", userEmail: "john@example.com" }
```

### User Not Found (404) - No Retry
```typescript
await getUserByEmail('notfound@example.com');
// Console: "Calling https://api.example.com/users/notfound@example.com"
// Console: "Response status: 404"
// Console: "User not found for email: notfound@example.com"
// Returns: null (no retry attempted)
```

### Transient Failure - Retry Until Success
```typescript
await getUserByEmail('temp-failure@example.com');
// Console: "Calling https://api.example.com/users/temp-failure@example.com"
// Console: "Response status: 503"
// Console: "Attempt 1 failed: API error: 503, retrying in 100ms"
// ... waits 100ms ...
// Console: "Calling https://api.example.com/users/temp-failure@example.com"
// Console: "Response status: 503"
// Console: "Attempt 2 failed: API error: 503, retrying in 200ms"
// ... waits 200ms ...
// Console: "Calling https://api.example.com/users/temp-failure@example.com"
// Console: "Response status: 200"
// Console: "Attempt 3 succeeded"
// Returns: { userId: "456", username: "Temp User", userEmail: "temp-failure@example.com" }
```

### All Retries Exhausted
```typescript
await getUserByEmail('always-failing@example.com');
// Console: "Attempt 1 failed: API error: 500, retrying in 100ms"
// Console: "Attempt 2 failed: API error: 500, retrying in 200ms"
// Console: "Attempt 3 failed: API error: 500, retrying in 400ms"
// Console: "All 3 attempts failed"
// Throws: Error("API error: 500")
```

---

## Evaluation Criteria

- ✅ **Correctness:** Retries only on 5xx/network errors, not 4xx
- ✅ **Exponential backoff:** Delays increase correctly (100ms, 200ms, 400ms)
- ✅ **Logging:** Clear messages at each step
- ✅ **Generic design:** `retryWithBackoff()` is reusable for other operations
- ✅ **Error handling:** Doesn't swallow errors or hide important information
- ✅ **Code quality:** Clean, readable, follows TypeScript conventions
- 🌟 **BONUS:** Timeout per request implemented correctly

---

## Questions to Consider

While implementing, think about:

1. **What happens if the operation succeeds but returns `null`?** Should that trigger a retry?
2. **Should the delay reset if an attempt succeeds partway through?** (e.g., after 2 failures)
3. **How does this affect the overall response time for calling services?** (up to ~700ms of delays)
4. **Would you want different retry strategies for different error types?** (e.g., 502 vs 503)
 
