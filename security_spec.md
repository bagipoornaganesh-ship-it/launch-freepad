# Security Specification for 20 DM System

## Data Invariants
1. A **Client** must belong to the authenticated user who created it (`userId == request.auth.uid`).
2. A **Transaction** must belong to the authenticated user who created it (`userId == request.auth.uid`).
3. A **RoadmapDay** must belong to the authenticated user who created it (`userId == request.auth.uid`).
4. Users can only read and write their own data.
5. All IDs must be valid strings and match the regex `^[a-zA-Z0-9_\-]+$`.
6. Timestamps (`createdAt`, `updatedAt`) must be server-validated where applicable.

## The "Dirty Dozen" Payloads (Attacker Strategy)
1. **Identity Spoofing**: Attempt to create a client with `userId` of another user.
2. **Access Violation**: Attempt to read the `clients` collection of another user.
3. **Ghost Fields**: Attempt to add an `isAdmin` field to a `users` document.
4. **State Skip**: Attempt to update a transaction's `amount` to a negative value or extreme size.
5. **ID Poisoning**: Attempt to use a 2MB string as a `clientId`.
6. **Immutable Breach**: Attempt to change the `createdAt` timestamp of a client.
7. **Type Mismatch**: Attempt to set a client's `paymentReceived` to a string instead of boolean.
8. **Relational Orphan**: Attempt to create a transaction without a `userId`.
9. **Bulk Scrape**: Attempt to `list` all clients across all users.
10. **Shadow Update**: Attempt to update a client while injecting a `PII_LEAK` field.
11. **Malicious Enum**: Attempt to set a client's `status` to "SuperAdmin".
12. **Denial of Wallet**: Rapidly create documents with 1MB strings in fields to exhaust quota/budget.

## Test Strategy
- Verify `PERMISSION_DENIED` for all unauthorized path traversals.
- Verify `PERMISSION_DENIED` for data that fails `isValid[Entity]` checks (type, size, keys).
- Verify `auth.uid` matches the resource ownership.
