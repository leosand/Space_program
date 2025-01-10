import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import NewsSection from '../../components/NewsSection'

const Home: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Space Launch Analytics - Compare and Track Space Launches Worldwide</title>
        <meta name="description" content="Comprehensive space launch data analytics platform. Compare rockets, track launches, and stay updated with the latest space industry statistics." />
        <meta name="keywords" content="space launches, rocket comparison, space industry, launch statistics, SpaceX, NASA, ESA, space news" />
        <meta property="og:title" content="Space Launch Analytics - Launch Data & Comparisons" />
        <meta property="og:description" content="Track and compare space launches, rockets, and industry statistics. Your comprehensive source for space launch analytics." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://spacelaunches.com" />
      </Helmet>

      <div className="space-y-12">
        <section className="text-center py-16 bg-gradient-to-r from-blue-900 to-purple-900 text-white rounded-lg">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Space Launch Analytics
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto px-4">
            Track, compare, and analyze space launches from around the world
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/launches"
              className="btn-primary"
            >
              View Launches
            </Link>
            <Link
              to="/compare"
              className="btn-secondary"
            >
              Compare Rockets
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8">
          <div className="feature-card">
            <h2 className="text-xl font-bold mb-3">Launch Database</h2>
            <p className="text-gray-600 mb-4">
              Access comprehensive data on past, present, and future space launches
            </p>
            <Link to="/launches" className="text-blue-600 hover:text-blue-800">
              Explore Launches →
            </Link>
          </div>

          <div className="feature-card">
            <h2 className="text-xl font-bold mb-3">Statistical Analysis</h2>
            <p className="text-gray-600 mb-4">
              Dive into detailed statistics and trends in the space industry
            </p>
            <Link to="/statistics" className="text-blue-600 hover:text-blue-800">
              View Statistics →
            </Link>
          </div>

          <div className="feature-card">
            <h2 className="text-xl font-bold mb-3">Rocket Comparison</h2>
            <p className="text-gray-600 mb-4">
              Compare specifications and performance of different launch vehicles
            </p>
            <Link to="/compare" className="text-blue-600 hover:text-blue-800">
              Compare Rockets →
            </Link>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Latest Space News</h2>
            <a
              href="https://www.spaceflightnewsapi.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              View All News →
            </a>
          </div>
          <NewsSection />
        </section>

        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-6">Why Choose Our Platform?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="benefit-card">
              <h3 className="font-bold mb-2">Real-Time Updates</h3>
              <p className="text-gray-600">Stay informed with the latest launch information and industry news</p>
            </div>
            <div className="benefit-card">
              <h3 className="font-bold mb-2">Comprehensive Data</h3>
              <p className="text-gray-600">Access detailed information from multiple space agencies and providers</p>
            </div>
            <div className="benefit-card">
              <h3 className="font-bold mb-2">Advanced Analytics</h3>
              <p className="text-gray-600">Analyze trends and patterns in the space industry</p>
            </div>
            <div className="benefit-card">
              <h3 className="font-bold mb-2">Easy Comparison</h3>
              <p className="text-gray-600">Compare different launch vehicles and their capabilities</p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home 