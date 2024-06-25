// 'use client';
// import { Button } from '@/components/ui/button';
// import { DataTable } from '@/components/ui/data-table';
// import { Heading } from '@/components/ui/heading';
// import { Separator } from '@/components/ui/separator';
// // import { User } from '@/constants/data';
// import { Log } from '@/components/types';
// import { Plus } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { columns } from './columns';
// import { columnsnew } from './columnsnew';
// import { DataTable2 } from '@/components/ui/data-table2';
// interface ProductsClientProps {
//   data: Log[];
// }

// export const UserClient: React.FC<ProductsClientProps> = ({ data }) => {
//   const router = useRouter();

//   return (
//     <>
//       <div className="flex items-start justify-between">
//         <Heading
//           title={`Users (${data.length})`}
//           description="Manage users (Client side table functionalities.)"
//         />
//         <Button
//           className="text-xs md:text-sm"
//           onClick={() => router.push(`/dashboard/user/new`)}
//         >
//           <Plus className="mr-2 h-4 w-4" /> Add New
//         </Button>
//       </div>
//       <Separator />
//       <DataTable2 searchKey="name" columns={columnsnew} data={data} />
//     </>
//   );
// };
