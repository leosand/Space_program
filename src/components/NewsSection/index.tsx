import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { enUS } from 'date-fns/locale';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description: string;
  imageUrl?: string;
}

const NEWS_SOURCES = [
  {
    name: 'Space Flight News',
    url: 'https://api.spaceflightnewsapi.net/v4/articles',
    limit: 6
  },
  // Note: Ces sources nécessiteraient des API keys ou des parsers RSS spécifiques
  // {
  //   name: 'NASA',
  //   url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss'
  // },
  // {
  //   name: 'ESA',
  //   url: 'https://www.esa.int/rssfeed/Our_Activities/Space_News'
  // }
];

const NewsSection: React.FC = () => {
  const { data: news, isLoading, error } = useQuery<NewsItem[]>({
    queryKey: ['spaceNews'],
    queryFn: async () => {
      const response = await axios.get(`${NEWS_SOURCES[0].url}?limit=${NEWS_SOURCES[0].limit}`);
      return response.data.results.map((item: any) => ({
        title: item.title,
        link: item.url,
        pubDate: item.published_at,
        source: item.news_site,
        description: item.summary,
        imageUrl: item.image_url
      }));
    },
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="flex justify-between items-center pt-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center text-red-600">
        Unable to load latest space news. Please try again later.
        <button 
          onClick={() => window.location.reload()}
          className="block mx-auto mt-2 text-sm text-red-500 hover:text-red-700 underline"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news?.map((item) => (
          <article
            key={item.link}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            {item.imageUrl && (
              <div className="relative h-48 overflow-hidden group">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
                  {item.source}
                </div>
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline decoration-blue-500 decoration-2"
                >
                  {item.title}
                </a>
              </h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {item.description}
              </p>
              <div className="flex justify-between items-center text-sm border-t pt-3 mt-3">
                <time 
                  dateTime={item.pubDate}
                  className="text-gray-500 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formatDistanceToNow(new Date(item.pubDate), {
                    addSuffix: true,
                    locale: enUS
                  })}
                </time>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center group"
                >
                  Read more
                  <svg 
                    className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
      
      <div className="text-center">
        <a
          href="https://www.spaceflightnewsapi.net"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group"
        >
          View All Space News
          <svg 
            className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default NewsSection; 