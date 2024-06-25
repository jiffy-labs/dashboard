import BreadCrumb from '@/components/breadcrumb';
import ApiKeysTable from '@/components/tables/apikeystable/api-keys-table';

const breadcrumbItems = [{ title: 'API Keys', link: '/dashboard/apikeys' }];
export default function Page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <ApiKeysTable/>
      </div>
    </>
  );
}
