"use client"
import BreadCrumb from '@/components/breadcrumb';
import { UserClient } from '@/components/tables/user-tables/client';
import { users } from '@/constants/data';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
const breadcrumbItems = [{ title: 'Account', link: '/dashboard/account' }];
export default function page() {
  const { user, isLoaded } = useUser();
  const [name, setName] = useState(user?.fullName || '');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const file = new File([image], image.name);
      await user?.setProfileImage({ file });
      setImage(null); // Reset image state after upload
    }
  };

  const handleSave = async () => {
    if (name) {
      await user?.update({ firstName: name.split(' ')[0], lastName: name.split(' ').slice(1).join(' ') });
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        {/* <UserClient data={users} /> */}
        <div className="">
      <div className="bg-white rounded-lg  p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
        <div className="flex items-center mb-4">
          <Avatar className="h-16 w-16 rounded-full mr-4">
            <AvatarImage src={user?.imageUrl || '/default-avatar.png'} alt={user?.fullName || ''} />
            <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <input type="file" id="file-upload" className="hidden" onChange={handleImageChange} />
            <label htmlFor="file-upload">
              <Button  className="ml-2">Choose File</Button>
            </label>
            <Button onClick={handleUpload} className="ml-2" disabled={!image}>Update Image</Button>
            {/* <Button onClick={() => setImage(null)} className="ml-2">Remove</Button> */}
            <p className="text-sm text-gray-500 mt-1">We support PNGs, JPEGs under 5MB</p>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Change Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Primary Email Address</label>
          <Input value={user?.primaryEmailAddress?.emailAddress || ''} readOnly />
        </div>
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
      </div>
    </>
  );
}
