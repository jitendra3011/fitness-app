
import { UserProfileClient } from '@/components/admin/user-profile-client';
import { mockUsers } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const user = mockUsers.find(u => u.id === params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight">
          User Profile: {user.fullName}
        </h1>
        <p className="text-muted-foreground">
          View user details and their submitted fitness test results.
        </p>
      </div>

      <UserProfileClient user={user} />
    </div>
  );
}
