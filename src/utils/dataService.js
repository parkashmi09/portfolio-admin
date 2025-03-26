
// Mock data service for demo purposes
// In a real app, this would connect to a backend service

// Initial mock data
let mockData = {
  services: [
    {
      id: 1,
      title: "Web Design",
      description: "Modern and responsive web designs",
      image: "https://placehold.co/600x400",
      icon: "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><path d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/></svg>"
    }
  ],
  blogs: [
    {
      id: 1,
      title: "Design Trends 2023",
      content: "The latest design trends for 2023",
      image: "https://placehold.co/800x600",
      date: "2023-05-10"
    }
  ],
  products: [
    {
      id: 1,
      title: "Product One",
      description: "Amazing product with great features",
      price: 99,
      heroes: ["https://placehold.co/1200x800", "https://placehold.co/1200x800"],
      images: {
        desktop: "https://placehold.co/1200x800",
        mobile: "https://placehold.co/400x800"
      }
    }
  ],
  contacts: [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      source: "Google",
      message: "I'm interested in your services",
      date: "2023-06-15"
    }
  ],
  logos: [
    {
      id: 1,
      name: "Main Logo",
      image: "https://placehold.co/200x100",
      size: "200x100px"
    }
  ],
  reviews: [
    {
      id: 1,
      name: "Jane Smith",
      company: "ABC Corp",
      rating: 5,
      testimonial: "Amazing service and results!",
      image: "https://placehold.co/100x100"
    }
  ]
};

// Helper to generate IDs
const generateId = (collection) => {
  const ids = mockData[collection].map(item => item.id);
  return Math.max(...ids, 0) + 1;
};

// Generic functions to get and update data
export const getData = (collection) => {
  return [...mockData[collection]];
};

export const getItem = (collection, id) => {
  return mockData[collection].find(item => item.id === Number(id));
};

export const addItem = (collection, item) => {
  const newItem = { ...item, id: generateId(collection) };
  mockData[collection] = [...mockData[collection], newItem];
  return newItem;
};

export const updateItem = (collection, id, updates) => {
  mockData[collection] = mockData[collection].map(item => 
    item.id === Number(id) ? { ...item, ...updates } : item
  );
  return getItem(collection, id);
};

export const deleteItem = (collection, id) => {
  mockData[collection] = mockData[collection].filter(
    item => item.id !== Number(id)
  );
};

// File upload simulation
export const uploadFile = (file) => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      // In a real app, this would upload to a server and return a URL
      // For demo purposes, we'll return a placeholder URL
      const url = `https://placehold.co/600x400?text=${file.name}`;
      resolve(url);
    }, 1000);
  });
};

export default {
  getData,
  getItem,
  addItem,
  updateItem,
  deleteItem,
  uploadFile
};
