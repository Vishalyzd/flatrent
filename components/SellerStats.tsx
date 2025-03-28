import { useEffect, useState } from 'react';
import { userService } from '@/lib/firebase/db';
import { useAuth } from '@/contexts/auth-context';

interface SellerStats {
  totalProperties: number;
  activeListings: number;
  pendingApprovals: number;
}

export function SellerStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<SellerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const sellerStats = await userService.getSellerStats(user.id);
        setStats(sellerStats);
      } catch (err) {
        console.error('Error fetching seller stats:', err);
        setError('Failed to load seller statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.id]);

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading stats...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-lg bg-primary/5 p-4 text-center">
        <div className="text-2xl font-bold text-primary">{stats.totalProperties}</div>
        <div className="text-sm text-muted-foreground">Total Properties</div>
      </div>
      <div className="rounded-lg bg-primary/5 p-4 text-center">
        <div className="text-2xl font-bold text-primary">{stats.activeListings}</div>
        <div className="text-sm text-muted-foreground">Active Listings</div>
      </div>
      <div className="rounded-lg bg-primary/5 p-4 text-center">
        <div className="text-2xl font-bold text-primary">{stats.pendingApprovals}</div>
        <div className="text-sm text-muted-foreground">Pending Approvals</div>
      </div>
    </div>
  );
} 