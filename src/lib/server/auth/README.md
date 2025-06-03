# Authentication System

A secure authentication system for Noteprism that handles user accounts and theme preferences.

## Features

✅ Implemented:
- User registration with email/password
- Secure password hashing using PBKDF2
- Session-based authentication
- Theme preference persistence
- PostgreSQL user storage

⏳ Next Steps:
- Password reset flow
- Email verification
- OAuth providers (Google, GitHub)
- Session management (logout, multiple devices)
- Rate limiting
- Two-factor authentication

## Database Schema

### User Model
```prisma
model User {
    id            String      @id @default(cuid())
    email         String      @unique
    passwordHash  String
    createdAt     DateTime    @default(now())
    updatedAt     DateTime    @updatedAt
    theme         UserTheme?
}
```

### UserTheme Model
```prisma
model UserTheme {
    id        String   @id @default(cuid())
    userId    String   @unique
    user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
    hue       Float
    chroma    Float
    tone      Float
    darkMode  Boolean  @default(false)
    updatedAt DateTime @updatedAt
}
```

## API Routes

### Authentication
- `POST /auth/register` - Create new user account
- `POST /auth/login` - Authenticate user
- `GET /auth/logout` - End user session

### Theme Preferences
- `GET /api/theme/:userId` - Get user theme
- `PUT /api/theme/:userId` - Update user theme

## Security Features

1. **Password Security**
   - PBKDF2 hashing with salt
   - Minimum 8 character requirement
   - Secure password storage

2. **Session Management**
   - HTTP-only cookies
   - Secure session tokens
   - CSRF protection

3. **Data Protection**
   - Input validation
   - SQL injection prevention via Prisma
   - XSS protection

## Usage Examples

### User Registration
```typescript
import { createUser } from '$lib/server/auth';

const user = await createUser('user@example.com', 'password123');
```

### User Authentication
```typescript
import { authenticateUser } from '$lib/server/auth';

const user = await authenticateUser('user@example.com', 'password123');
```

### Theme Management
```typescript
import { updateUserTheme, getUserTheme } from '$lib/server/auth';

// Save theme
await updateUserTheme(userId, {
    hue: 190,
    chroma: 70,
    tone: 65,
    darkMode: false
});

// Load theme
const theme = await getUserTheme(userId);
```

## Proposed Tests

### Authentication Tests
- Test user registration with valid/invalid data
- Test login with correct/incorrect credentials
- Test password hashing and verification
- Test session management
- Test concurrent sessions

### Theme Tests
- Test theme preference saving
- Test theme loading
- Test theme updates
- Test theme deletion on user deletion

### Security Tests
- Test password requirements
- Test rate limiting
- Test session token security
- Test CSRF protection
- Test XSS prevention 