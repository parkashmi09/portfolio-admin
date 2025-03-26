
import React from 'react';
import AdminNav from './AdminNav';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminNav />
      
      <main className="flex-1 lg:ml-64 p-6">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
