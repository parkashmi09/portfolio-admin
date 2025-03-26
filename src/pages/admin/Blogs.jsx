
import React, { useState, useEffect } from 'react';
import { getData, addItem, updateItem, deleteItem } from '../../utils/dataService';
import FileUploader from '../../components/FileUploader';
import { Plus, Edit, Trash2, Save, X, Loader, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBlog, setCurrentBlog] = useState({
    title: '',
    content: '',
    image: '',
    date: new Date().toISOString().split('T')[0] // Today's date
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await getData('blogs');
      setBlogs(data);
    } catch (error) {
      toast.error('Error fetching blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentBlog(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setCurrentBlog(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditing) {
        await updateItem('blogs', currentBlog.id, currentBlog);
        toast.success('Blog updated successfully');
      } else {
        await addItem('blogs', currentBlog);
        toast.success('Blog added successfully');
      }
      
      resetForm();
      fetchBlogs();
    } catch (error) {
      toast.error(isEditing ? 'Error updating blog' : 'Error adding blog');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setCurrentBlog({
      title: '',
      content: '',
      image: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteItem('blogs', id);
        toast.success('Blog deleted successfully');
        fetchBlogs();
      } catch (error) {
        toast.error('Error deleting blog');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
          <p className="text-gray-500 mt-1">Manage your blog posts</p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth"
        >
          {isFormOpen ? (
            <>
              <X className="h-5 w-5 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Add Blog
            </>
          )}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-smooth p-6 animate-scale-in">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={currentBlog.title}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium text-gray-700">
                  Publication Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={currentBlog.date}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Featured Image
              </label>
              <FileUploader 
                onFileUploaded={handleImageUpload} 
                label="Upload Blog Image"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                name="content"
                value={currentBlog.content}
                onChange={handleInputChange}
                rows={6}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all-smooth"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-primary text-white rounded-lg flex items-center shadow-sm hover:bg-primary/90 transition-all-smooth"
              >
                {isSaving ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    {isEditing ? 'Update' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {blogs.map((blog) => (
          <div 
            key={blog.id} 
            className="bg-white rounded-xl shadow-smooth overflow-hidden hover:shadow-soft transition-all-smooth"
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3">
                <div className="aspect-video md:h-full relative">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{blog.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{formatDate(blog.date)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-all-smooth"
                    >
                      <Edit className="h-5 w-5 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 rounded-lg hover:bg-red-100 transition-all-smooth"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600">
                  {blog.content.length > 200 ? blog.content.substring(0, 200) + '...' : blog.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No blog posts found. Create your first blog post!</p>
        </div>
      )}
    </div>
  );
};

export default Blogs;
