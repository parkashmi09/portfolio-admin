
import React, { useState, useEffect } from 'react';
import { getData, addItem, updateItem, deleteItem } from '../../utils/dataService';
import FileUploader from '../../components/FileUploader';
import { Plus, Edit, Trash2, Save, X, Loader, Star, StarOff } from 'lucide-react';
import { toast } from 'sonner';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentReview, setCurrentReview] = useState({
    name: '',
    company: '',
    rating: 5,
    testimonial: '',
    image: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getData('reviews');
      setReviews(data);
    } catch (error) {
      toast.error('Error fetching reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentReview(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (url) => {
    setCurrentReview(prev => ({ ...prev, image: url }));
  };

  const handleRatingChange = (rating) => {
    setCurrentReview(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isEditing) {
        await updateItem('reviews', currentReview.id, currentReview);
        toast.success('Review updated successfully');
      } else {
        await addItem('reviews', currentReview);
        toast.success('Review added successfully');
      }
      
      resetForm();
      fetchReviews();
    } catch (error) {
      toast.error(isEditing ? 'Error updating review' : 'Error adding review');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setCurrentReview({
      name: '',
      company: '',
      rating: 5,
      testimonial: '',
      image: ''
    });
    setIsEditing(false);
    setIsFormOpen(false);
  };

  const handleEdit = (review) => {
    setCurrentReview(review);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteItem('reviews', id);
        toast.success('Review deleted successfully');
        fetchReviews();
      } catch (error) {
        toast.error('Error deleting review');
      }
    }
  };

  const StarRating = ({ rating, onChange, interactive = false }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => interactive && onChange(star)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'
            }`}
            disabled={!interactive}
          >
            {star <= rating ? (
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            ) : (
              <StarOff className="h-6 w-6 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
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
          <h1 className="text-2xl font-bold tracking-tight">Client Reviews</h1>
          <p className="text-gray-500 mt-1">Manage testimonials and reviews</p>
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
              Add Review
            </>
          )}
        </button>
      </div>

      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-smooth p-6 animate-scale-in">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Review' : 'Add New Review'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Client Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={currentReview.name}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-gray-700">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={currentReview.company}
                  onChange={handleInputChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Rating
              </label>
              <StarRating 
                rating={currentReview.rating} 
                onChange={handleRatingChange} 
                interactive={true} 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="testimonial" className="text-sm font-medium text-gray-700">
                Testimonial
              </label>
              <textarea
                id="testimonial"
                name="testimonial"
                value={currentReview.testimonial}
                onChange={handleInputChange}
                rows={4}
                className="block w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Client Photo
              </label>
              <FileUploader 
                onFileUploaded={handleImageUpload} 
                label="Upload Client Photo"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-white rounded-xl shadow-smooth p-6 hover-scale"
          >
            <div className="flex justify-between">
              <div className="flex items-center space-x-4">
                {review.image ? (
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-xl font-semibold text-gray-500">
                      {review.name.charAt(0)}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.company}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-all-smooth"
                >
                  <Edit className="h-5 w-5 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="p-2 rounded-lg hover:bg-red-100 transition-all-smooth"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </button>
              </div>
            </div>
            
            <div className="mt-4">
              <StarRating rating={review.rating} />
            </div>
            
            <div className="mt-4 text-gray-600 italic">
              "{review.testimonial}"
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">No reviews found. Add your first client review!</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
