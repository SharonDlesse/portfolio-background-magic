
import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import Dashboard from './Dashboard';
import Layout from '@/components/Layout';

const Admin = () => {
  return (
    <Layout>
      <AdminLayout>
        <Dashboard />
      </AdminLayout>
    </Layout>
  );
};

export default Admin;
