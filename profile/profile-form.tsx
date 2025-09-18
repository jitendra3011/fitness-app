
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { profileSchema, type ProfileValues } from '@/lib/schemas';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export function ProfileForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      weight: '',
      height: '',
      age: '',
      location: '',
      state: '',
      village: '',
    },
  });

  function onSubmit(values: ProfileValues) {
    console.log(values);
    toast({
      title: 'Profile Updated',
      description: 'Your information has been saved successfully.',
    });
    router.push('/');
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="text-base">Registered Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
              <p>Alex Johnson</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>alex.j@example.com</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p>123-456-7890</p>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
            <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                    <Input placeholder="70" type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
              control={form.control}
              name="weightPhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight Photo</FormLabel>
                  <FormControl>
                    <Input type="file" {...field} />
                  </FormControl>
                  <FormDescription>Upload a photo for verification.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="height"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                    <Input placeholder="175" type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                    <Input placeholder="28" type="number" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
             <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select your gender" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
             />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
            <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Location (City/Town)</FormLabel>
                <FormControl>
                    <Input placeholder="Sunnyvale" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
                <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                    <Input placeholder="California" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="village"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Village</FormLabel>
                <FormControl>
                    <Input placeholder="Cherry Orchard" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <div className="flex justify-end">
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
