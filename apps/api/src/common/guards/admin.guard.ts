import {
    Injectable,
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { prisma } from '@repo/database';

@Injectable()
export class AdminGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user?.email) {
            throw new ForbiddenException('User not authenticated');
        }

        // Check if user is in Admin table
        const admin = await prisma.admin.findUnique({
            where: { email: user.email },
        });

        if (!admin) {
            throw new ForbiddenException('Access denied. Admin privileges required.');
        }

        return true;
    }
}
