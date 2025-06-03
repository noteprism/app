import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { error } from '@sveltejs/kit';

const prisma = new PrismaClient();

/**
 * Hash a password using PBKDF2
 */
function hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(salt + ':' + derivedKey.toString('hex'));
        });
    });
}

/**
 * Verify a password against a hash
 */
function verifyPassword(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const [salt, key] = hash.split(':');
        crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(key === derivedKey.toString('hex'));
        });
    });
}

/**
 * Create a new user account
 */
export async function createUser(email: string, password: string) {
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw error(400, 'Email already registered');
    }

    const passwordHash = await hashPassword(password);
    
    return prisma.user.create({
        data: {
            email,
            passwordHash
        }
    });
}

/**
 * Authenticate a user and return user data
 */
export async function authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { email },
        include: { theme: true }
    });

    if (!user) {
        throw error(401, 'Invalid email or password');
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
        throw error(401, 'Invalid email or password');
    }

    // Don't return the password hash
    const { passwordHash: _, ...userData } = user;
    return userData;
}

/**
 * Update a user's theme preferences
 */
export async function updateUserTheme(userId: string, theme: { hue: number; chroma: number; tone: number; darkMode: boolean }) {
    return prisma.userTheme.upsert({
        where: { userId },
        update: theme,
        create: {
            userId,
            ...theme
        }
    });
}

/**
 * Get a user's theme preferences
 */
export async function getUserTheme(userId: string) {
    return prisma.userTheme.findUnique({
        where: { userId }
    });
} 