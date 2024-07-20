import BreadCrumb from '@/components/breadcrumb';
import Metrics from '@/components/tables/metrics/metrics';

const breadcrumbItems = [{ title: 'Metrics', link: '/dashboard/metrics' }];
export default function Page() {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        <Metrics/>
      </div>
    </>
  );
}
