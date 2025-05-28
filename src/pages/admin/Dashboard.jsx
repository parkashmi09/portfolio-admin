import React, { useState, useEffect } from 'react';
import { getData } from '../../utils/dataService';
import { servicesApi, blogsApi, heroApi } from '../../utils/apiService';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  FileText, 
  ShoppingBag, 
  MessageSquare, 
  Image, 
  Star,
  ArrowUpRight,
  Layout
} from 'lucide-react';

const StatCard = ({ title, count, icon: Icon, linkTo, color }) => {
  return (
    <Link 
      to={linkTo} 
      className="bg-white rounded-xl shadow-smooth p-6 hover-scale"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{count}</h3>
        </div>
        <div 
          className={`p-3 rounded-lg ${color}`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm text-gray-600 hover:underline">
        <span>View all</span>
        <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
      </div>
    </Link>
  );
};

const RecentActivity = ({ items, type }) => {
  let getTitle, getDate, getImage;

  switch (type) {
    case 'contacts':
      getTitle = item => item.name;
      getDate = item => new Date(item.date).toLocaleDateString();
      getImage = () => null;
      break;
    case 'blogs':
      getTitle = item => item.title;
      getDate = item => new Date(item.date).toLocaleDateString();
      getImage = item => item.image;
      break;
    case 'reviews':
      getTitle = item => `${item.name} - ${item.company}`;
      getDate = () => 'Rating: ★'.repeat(5);
      getImage = item => item.image;
      break;
    default:
      getTitle = item => item.title;
      getDate = () => '';
      getImage = item => item.image;
  }

  return (
    <div className="bg-white rounded-xl shadow-smooth p-6">
      <h2 className="text-lg font-semibold mb-4">Recent {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-all-smooth">
            {getImage(item) && (
              <img 
                src={getImage(item)} 
                alt={getTitle(item)} 
                className="w-10 h-10 rounded-lg object-cover mr-3" 
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{getTitle(item)}</p>
              <p className="text-xs text-gray-500">{getDate(item)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    services: [],
    blogs: [],
    products: [],
    contacts: [],
    logos: [],
    reviews: [],
    hero: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data for dashboard stats
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const services = await servicesApi.getAll();
        const blogs = await blogsApi.getAll();
        const products = await getData('products');
        const contacts = await getData('contacts');
        const logos = await getData('logos');
        const reviews = await getData('reviews');
        const hero = await heroApi.getAll();

        setStats({
          services: services || [],
          blogs: blogs || [],
          products: products || [],
          contacts: contacts || [],
          logos: logos || [],
          reviews: reviews || [],
          hero: hero || []
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Hero Slides',
      count: stats.hero.length || 0,
      icon: Layout,
      linkTo: '/admin/hero',
      color: 'bg-indigo-500'
    },
    { 
      title: 'Services', 
      count: stats.services.length || 0, 
      icon: Settings, 
      linkTo: '/admin/services',
      color: 'bg-blue-500'
    },
    { 
      title: 'Blogs', 
      count: stats.blogs.length || 0, 
      icon: FileText, 
      linkTo: '/admin/blogs',
      color: 'bg-green-500'
    },
    { 
      title: 'Products', 
      count: stats.products.length, 
      icon: ShoppingBag, 
      linkTo: '/admin/products',
      color: 'bg-purple-500'
    },
    { 
      title: 'Contact Forms', 
      count: stats.contacts.length, 
      icon: MessageSquare, 
      linkTo: '/admin/contacts',
      color: 'bg-amber-500'
    },
    { 
      title: 'Logos', 
      count: stats.logos.length, 
      icon: Image, 
      linkTo: '/admin/logos',
      color: 'bg-cyan-500'
    },
    { 
      title: 'Reviews', 
      count: stats.reviews.length, 
      icon: Star, 
      linkTo: '/admin/reviews',
      color: 'bg-pink-500'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity items={stats.contacts.slice(0, 5)} type="contacts" />
        <RecentActivity items={stats.blogs.slice(0, 5)} type="blogs" />
      </div>
    </div>
  );
};

export default Dashboard;
