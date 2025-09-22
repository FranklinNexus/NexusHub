
/**
 * @file src/services/authService.ts
 * @description 处理认证相关核心逻辑，使用Prisma与数据库交互。
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../database/db';

export const registerUser = async (email: string, password: string) => {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
        },
    });

    return newUser;
};

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !await bcrypt.compare(password, user.password)) {
        throw new Error('Invalid email or password.');
    }

    // @ts-ignore
    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // @ts-ignore
    const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    // 在实际生产中，你可能会将 refresh token 存储在数据库中以进行撤销
    // await prisma.user.update({ where: { id: user.id }, data: { refreshToken: refreshToken }});

    return { accessToken, refreshToken, userId: user.id, email: user.email };
};

