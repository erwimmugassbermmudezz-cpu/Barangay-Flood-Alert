import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { ArrowLeft, Calendar, Filter, Download, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

type FloodLevel = 'SAFE' | 'CAUTION' | 'DANGER' | 'CRITICAL';

interface HistoryEntry {
  id: number;
  water_level_cm: number;
  current_status: FloodLevel;
  created_at: string; // CHANGED: Renamed from last_updated to created_at
  location?: string;
}

const ITEMS_PER_PAGE = 50;

const History = () => {
  const { translations } = useLanguage();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [dateFilter, setDateFilter] = useState<string>('7days');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [lastFetch, setLastFetch] = useState<number>(0);

  useEffect(() => {
    loadInitialData();
    return () => {
      setHistory([]);
    };
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // CHANGE 1: Switched table from 'flood_data' to 'flood_history'
      let query = supabase
        .from('flood_history' as any)
        .select('*', { count: 'exact' })
        // CHANGE 2: Switched order column from 'last_updated' to 'created_at'
        .order('created_at', { ascending: false });

      const { data, error, count } = await query.limit(ITEMS_PER_PAGE);

      if (error) throw error;

      if (data) {
        setHistory(data as unknown as HistoryEntry[]);
        setHasMore(data.length === ITEMS_PER_PAGE);
        setTotalCount(count || 0);
        setLastFetch(Date.now());
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const startIndex = history.length;
      const endIndex = startIndex + ITEMS_PER_PAGE - 1;

      // CHANGE 3: Switched table from 'flood_data' to 'flood_history'
      let query = supabase
        .from('flood_history' as any)
        .select('*')
        // CHANGE 4: Switched order column from 'last_updated' to 'created_at'
        .order('created_at', { ascending: false });

      query = applyFilters(query);

      const { data, error } = await query.range(startIndex, endIndex);

      if (error) throw error;

      if (data) {
        setHistory([...history, ...data as unknown as HistoryEntry[]]);
        setHasMore(data.length === ITEMS_PER_PAGE);
      }
    } catch (error) {
      console.error('Error loading more:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (query: any) => {
    if (dateFilter !== 'all') {
      const now = new Date();
      let startDate = new Date();

      switch (dateFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case '7days':
          startDate.setDate(now.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(now.getDate() - 30);
          break;
      }
      
      // CHANGE 5: Switched timestamp column from 'last_updated' to 'created_at'
      query = query.gte('created_at', startDate.toISOString());
    }

    if (statusFilter !== 'all') {
      query = query.eq('current_status', statusFilter.toUpperCase());
    }

    return query;
  };

  const applyFiltersAndReload = async () => {
    const now = Date.now();
    if (now - lastFetch < 500) {
      return;
    }

    setLoading(true);
    try {
      // CHANGE 6: Switched table from 'flood_data' to 'flood_history'
      let query = supabase
        .from('flood_history' as any)
        .select('*', { count: 'exact' })
        // CHANGE 7: Switched order column from 'last_updated' to 'created_at'
        .order('created_at', { ascending: false });

      query = applyFilters(query);

      const { data, error, count } = await query.limit(ITEMS_PER_PAGE);

      if (error) throw error;

      if (data) {
        setHistory(data as unknown as HistoryEntry[]);
        setHasMore(data.length === ITEMS_PER_PAGE);
        setTotalCount(count || 0);
        setLastFetch(now);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    // CHANGE 8: Switched timestamp column for CSV export
    const csvData = history.slice(0, 1000).map(entry => ({
      timestamp: entry.created_at, // Use created_at
      water_level_cm: entry.water_level_cm,
      status: entry.current_status,
      location: entry.location || 'Bridge Area'
    }));

    const headers = ['Timestamp', 'Water Level (cm)', 'Status', 'Location'];
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => 
        `${row.timestamp},${row.water_level_cm},${row.status},${row.location}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flood-history-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadgeClass = (status: FloodLevel) => {
    switch (status) {
      case 'SAFE':
        return 'bg-status-safe text-white';
      case 'CAUTION':
        return 'bg-status-caution text-white';
      case 'DANGER':
        return 'bg-status-danger text-white';
      case 'CRITICAL':
        return 'bg-status-critical text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const calculateStats = () => {
    if (history.length === 0) return null;

    const waterLevels = history.map(h => h.water_level_cm);
    const highest = Math.max(...waterLevels);
    const average = waterLevels.reduce((a, b) => a + b, 0) / waterLevels.length;
    const alertCount = history.filter(h => 
      h.current_status === 'DANGER' || h.current_status === 'CRITICAL'
    ).length;

    return { highest, average, alertCount };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="glass-float"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Water Level History</h1>
              <p className="text-sm text-muted-foreground">View past flood monitoring data</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadInitialData}
            disabled={loading}
            className="glass-float"
          >
            <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="modern-card text-center">
              <div className="text-2xl font-bold gradient-text">{stats.highest.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-1">Highest (cm)</div>
            </div>
            <div className="modern-card text-center">
              <div className="text-2xl font-bold gradient-text">{stats.average.toFixed(1)}</div>
              <div className="text-xs text-muted-foreground mt-1">Average (cm)</div>
            </div>
            <div className="modern-card text-center">
              <div className="text-2xl font-bold gradient-text">{stats.alertCount}</div>
              <div className="text-xs text-muted-foreground mt-1">Alerts</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="modern-card mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-2 block flex items-center gap-1">
                <Filter className="h-3 w-3" />
                Status Filter
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-input border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Status</option>
                <option value="safe">Safe</option>
                <option value="caution">Caution</option>
                <option value="danger">Danger</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div className="flex gap-2 sm:items-end">
              <Button
                onClick={applyFiltersAndReload}
                disabled={loading}
                className="btn-primary flex-1 sm:flex-none"
              >
                Apply
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={exportToCSV}
                disabled={history.length === 0}
                className="glass-float"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-3">
            Showing {history.length} of {totalCount} entries
            {stats && <span className="ml-2">(Based on loaded data)</span>}
          </div>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {loading && history.length === 0 ? (
            // Loading skeletons
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="modern-card">
                <Skeleton className="h-16 w-full" />
              </div>
            ))
          ) : history.length === 0 ? (
            <div className="modern-card text-center py-12">
              <p className="text-muted-foreground">No history data found</p>
            </div>
          ) : (
            history.map((entry) => (
              <div
                key={entry.id}
                className="modern-card flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getStatusBadgeClass(entry.current_status)}>
                      {entry.current_status}
                    </Badge>
                    <span className="text-sm text-muted-foreground truncate">
                      {entry.location || 'Bridge Area'}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(new Date(entry.created_at), 'MMM dd, yyyy - hh:mm a')}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold gradient-text">
                    {entry.water_level_cm.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">cm</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More Button */}
        {hasMore && history.length > 0 && (
          <div className="mt-6 text-center">
            <Button
              onClick={loadMore}
              disabled={loading}
              className="btn-secondary"
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;