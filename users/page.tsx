
import { UsersClient } from '@/components/admin/users-client';
import { mockUsers } from '@/lib/data';

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-8">
       <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          User Management
        </h1>
        <p className="text-muted-foreground">
          Browse and manage user profiles and activities.
        </p>
      </div>
      <UsersClient users={mockUsers} />
    </div>
  );
}
