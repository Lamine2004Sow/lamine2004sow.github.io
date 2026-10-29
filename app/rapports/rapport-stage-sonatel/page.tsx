import { Redirect } from '@/ui/Redirect';

export const metadata = { robots: { index: false } };

export default function OldReport() {
  return <Redirect to="/projets/sonatel-ftth/" />;
}
