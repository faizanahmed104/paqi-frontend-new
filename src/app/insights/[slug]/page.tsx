import { notFound } from 'next/navigation';
import Navbar from '@/components/common/navbar';
import Footer from '@/components/common/footer';
import { insightsData } from '../data/InsightsData';
import AccessRequest from '@/components/AccessRequest';

export default function InsightDetails({ params }: any) {
  const post = insightsData.find((p) => p?.slug === params?.slug);

  if (!post) return notFound();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Top border + Navbar */}
      <div className="border-t border-gray-900">
        <Navbar variant="white" />
      </div>

      {/* Article wrapper */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 ">
        {/* Kicker / Category */}
        <div className="text-xs font-semibold tracking-[0.16em] uppercase text-gray-500 mb-2">
          Stories
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-serif font-semibold leading-tight mb-3">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="text-xs sm:text-sm text-gray-500 mb-8 space-x-1">
          <span>{post.date}</span>
          {post.author && (
            <>
              <span>•</span>
              <span>{post.author}</span>
            </>
          )}
        </div>

        {/* Hero Image + (optional) share column */}
        <section className="relative mb-12">
          <div className="w-full bg-gray-50 border border-gray-200">
            <img
              src={post.img}
              alt={post.title}
              className="w-full h-[500px] object-cover"
            />
          </div>
        </section>

        <h2 className="my-5 text-2xl sm:text-3xl font-serif font-semibold leading-tight">
          About this report
        </h2>

        {/* Content */}
        <section
          className="prose prose-lg max-w-none text-gray-800 leading-relaxed mb-20"
          // content is trusted HTML from InsightsData
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <h2 className="my-5 text-2xl sm:text-3xl font-serif font-semibold leading-tight">
          Executive Summary
        </h2>
        <h2 className="my-5 text-2xl sm:text-3xl font-serif font-semibold leading-tight">
          References
        </h2>

        <div className="mt-5 flex justify-center">
          <AccessRequest slug={post.slug} title={post.title} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
