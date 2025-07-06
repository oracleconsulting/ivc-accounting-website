'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Clock,
  HardDrive,
  Activity,
  Shield,
  Archive
} from 'lucide-react';

interface DatabaseStats {
  totalTables: number;
  totalRecords: number;
  databaseSize: string;
  lastBackup: string;
  connectionStatus: 'healthy' | 'warning' | 'error';
  activeConnections: number;
}

interface BackupInfo {
  id: string;
  filename: string;
  size: string;
  created_at: string;
  status: 'completed' | 'failed' | 'in_progress';
  type: 'manual' | 'automated';
}

interface TableInfo {
  name: string;
  recordCount: number;
  size: string;
  lastModified: string;
  status: 'healthy' | 'needs_optimization' | 'error';
}

export default function DatabaseManagement() {
  const [stats, setStats] = useState<DatabaseStats>({
    totalTables: 0,
    totalRecords: 0,
    databaseSize: '0 MB',
    lastBackup: 'Never',
    connectionStatus: 'healthy',
    activeConnections: 0
  });
  
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'backups' | 'tables' | 'maintenance'>('overview');
  const [loading, setLoading] = useState(false);
  const [backupInProgress, setBackupInProgress] = useState(false);

  useEffect(() => {
    loadDatabaseStats();
    loadBackups();
    loadTables();
  }, []);

  const loadDatabaseStats = async () => {
    try {
      const response = await fetch('/api/admin/database/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to load database stats:', error);
    }
  };

  const loadBackups = async () => {
    try {
      const response = await fetch('/api/admin/database/backups');
      if (response.ok) {
        const data = await response.json();
        setBackups(data);
      }
    } catch (error) {
      console.error('Failed to load backups:', error);
    }
  };

  const loadTables = async () => {
    try {
      const response = await fetch('/api/admin/database/tables');
      if (response.ok) {
        const data = await response.json();
        setTables(data);
      }
    } catch (error) {
      console.error('Failed to load tables:', error);
    }
  };

  const createBackup = async () => {
    setBackupInProgress(true);
    try {
      const response = await fetch('/api/admin/database/backup', { method: 'POST' });
      if (response.ok) {
        await loadBackups();
        await loadDatabaseStats();
      }
    } catch (error) {
      console.error('Failed to create backup:', error);
    } finally {
      setBackupInProgress(false);
    }
  };

  const downloadBackup = async (backupId: string) => {
    try {
      const response = await fetch(`/api/admin/database/backup/${backupId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${backupId}.sql`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download backup:', error);
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup?')) return;
    
    try {
      const response = await fetch(`/api/admin/database/backup/${backupId}`, { method: 'DELETE' });
      if (response.ok) {
        await loadBackups();
      }
    } catch (error) {
      console.error('Failed to delete backup:', error);
    }
  };

  const optimizeTables = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/database/optimize', { method: 'POST' });
      if (response.ok) {
        await loadTables();
        await loadDatabaseStats();
      }
    } catch (error) {
      console.error('Failed to optimize tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'warning':
      case 'needs_optimization':
        return 'text-yellow-600 bg-yellow-100';
      case 'error':
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'warning':
      case 'needs_optimization':
        return <AlertCircle className="w-4 h-4" />;
      case 'error':
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      case 'in_progress':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Database Management</h1>
          <p className="text-gray-600 mt-1">Monitor, backup, and maintain your database</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={createBackup} 
            disabled={backupInProgress}
            variant="outline"
          >
            <Archive className={`mr-2 h-4 w-4 ${backupInProgress ? 'animate-spin' : ''}`} />
            {backupInProgress ? 'Creating Backup...' : 'Create Backup'}
          </Button>
          <Button onClick={optimizeTables} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Optimize Tables
          </Button>
        </div>
      </div>

      {/* Database Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Tables</p>
              <p className="text-2xl font-bold">{stats.totalTables}</p>
            </div>
            <Database className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Records</p>
              <p className="text-2xl font-bold">{stats.totalRecords.toLocaleString()}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Database Size</p>
              <p className="text-2xl font-bold">{stats.databaseSize}</p>
            </div>
            <HardDrive className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Connection Status</p>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(stats.connectionStatus)}>
                  {getStatusIcon(stats.connectionStatus)}
                  {stats.connectionStatus}
                </Badge>
              </div>
            </div>
            <Shield className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          <Eye className="mr-2 h-4 w-4" />
          Overview
        </Button>
        <Button
          variant={activeTab === 'backups' ? 'default' : 'outline'}
          onClick={() => setActiveTab('backups')}
        >
          <Archive className="mr-2 h-4 w-4" />
          Backups
        </Button>
        <Button
          variant={activeTab === 'tables' ? 'default' : 'outline'}
          onClick={() => setActiveTab('tables')}
        >
          <Database className="mr-2 h-4 w-4" />
          Tables
        </Button>
        <Button
          variant={activeTab === 'maintenance' ? 'default' : 'outline'}
          onClick={() => setActiveTab('maintenance')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Maintenance
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Database Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Last Backup</p>
                <p className="font-medium">{stats.lastBackup}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Connections</p>
                <p className="font-medium">{stats.activeConnections}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {backups.slice(0, 5).map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{backup.filename}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(backup.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge className={getStatusColor(backup.status)}>
                    {getStatusIcon(backup.status)}
                    {backup.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'backups' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Backup History</h3>
            <Button onClick={loadBackups} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{backup.filename}</p>
                    <Badge className={getStatusColor(backup.status)}>
                      {getStatusIcon(backup.status)}
                      {backup.status}
                    </Badge>
                    <Badge variant="outline">{backup.type}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(backup.created_at).toLocaleString()} • {backup.size}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => downloadBackup(backup.id)}
                    variant="outline"
                    size="sm"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    onClick={() => deleteBackup(backup.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
            
            {backups.length === 0 && (
              <p className="text-center text-gray-500 py-8">No backups found</p>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'tables' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Database Tables</h3>
          <div className="space-y-3">
            {tables.map((table) => (
              <div key={table.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-medium">{table.name}</p>
                    <Badge className={getStatusColor(table.status)}>
                      {getStatusIcon(table.status)}
                      {table.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {table.recordCount.toLocaleString()} records • {table.size} • 
                    Last modified: {new Date(table.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Database Maintenance</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Optimize Tables</h4>
                <p className="text-blue-700 text-sm mb-3">
                  Optimize database tables to improve performance and reclaim storage space.
                </p>
                <Button onClick={optimizeTables} disabled={loading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Optimizing...' : 'Run Optimization'}
                </Button>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Create Backup</h4>
                <p className="text-green-700 text-sm mb-3">
                  Create a manual backup of your database for safekeeping.
                </p>
                <Button 
                  onClick={createBackup} 
                  disabled={backupInProgress}
                  variant="outline"
                >
                  <Archive className={`mr-2 h-4 w-4 ${backupInProgress ? 'animate-spin' : ''}`} />
                  {backupInProgress ? 'Creating Backup...' : 'Create Backup'}
                </Button>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Database Health Check</h4>
                <p className="text-yellow-700 text-sm mb-3">
                  Run a comprehensive health check on your database.
                </p>
                <Button variant="outline">
                  <Shield className="mr-2 h-4 w-4" />
                  Run Health Check
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 