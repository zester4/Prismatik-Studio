import React, { ReactElement } from 'react';

const blogPosts = [
    {
        title: "Mastering the Art of the Prompt: 5 Tips for Better AI Images",
        author: "Prismatik Team",
        date: "November 26, 2023",
        excerpt: "The quality of your AI-generated content is directly tied to the quality of your prompt. We're breaking down five essential tips to help you move from simple descriptions to powerful, evocative prompts that deliver stunning results every time.",
        imageUrl: "https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?q=80&w=800&auto=format&fit=crop",
        href: "#",
    },
    {
        title: "New Feature: Export Your Stories as Video",
        author: "Prismatik Team",
        date: "November 22, 2023",
        excerpt: "We're thrilled to announce a highly requested feature! You can now export your creations from the Story Generator into a dynamic video, complete with cross-fades and on-screen text. Bring your narratives to life in a whole new way.",
        imageUrl: "https://images.unsplash.com/photo-1516245834210-c4c1427873AB?q=80&w=800&auto=format&fit=crop",
        href: "#",
    },
    {
        title: "Case Study: How a Small Bakery Launched a Campaign with Prismatik",
        author: "Jane Doe",
        date: "November 18, 2023",
        excerpt: "Discover how 'The Gilded Crust' bakery used Prismatik Studio to design a new logo, create a stunning social media ad campaign, and write blog posts for their website—all in a single weekend and without a marketing agency.",
        imageUrl: "https://images.unsplash.com/photo-1568254183919-78a4f43a2b53?q=80&w=800&auto=format&fit=crop",
        href: "#",
    },
    {
        title: "A/B Testing with the Ad Creator: A Practical Guide",
        author: "John Smith",
        date: "November 15, 2023",
        excerpt: "Find out what resonates with your audience. This guide walks you through using the Ad Creator to generate multiple ad variants with different tones, visuals, and CTAs to run effective A/B tests and maximize your conversions.",
        imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop",
        href: "#",
    },
    {
        title: "Behind the Pixels: A Deep Dive into the Story Generator's 'Character Lock'",
        author: "Prismatik Team",
        date: "November 11, 2023",
        excerpt: "One of our most popular features is Character Lock. In this technical deep-dive, we explore how we use multi-modal AI to analyze an input image and ensure your character's appearance remains consistent across every scene.",
        imageUrl: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=800&auto=format&fit=crop",
        href: "#",
    },
    {
        title: "The Future is Creative: Why Generative AI is Your Next Co-Pilot",
        author: "John Smith",
        date: "November 08, 2023",
        excerpt: "Generative AI isn't here to replace creators; it's here to augment them. We explore the collaborative future of human-AI creativity and how tools like Prismatik Studio can unlock unprecedented levels of productivity and innovation.",
        imageUrl: "https://images.unsplash.com/photo-1677756119517-756a188d2d94?q=80&w=800&auto=format&fit=crop",
        href: "#",
    },
];

const BlogPostCard: React.FC<typeof blogPosts[0]> = ({ title, author, date, excerpt, imageUrl, href }) => (
    <a href={href} className="block group bg-white rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-6">
            <p className="text-sm text-brand-wheat-600">{date} &bull; By {author}</p>
            <h3 className="mt-2 text-xl font-bold text-brand-wheat-900 group-hover:text-brand-teal-600 transition-colors">{title}</h3>
            <p className="mt-3 text-brand-wheat-700 leading-relaxed line-clamp-3">{excerpt}</p>
            <span className="mt-4 inline-block font-semibold text-brand-teal-500">
                Read More <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
            </span>
        </div>
    </a>
);

export default function Blog(): ReactElement {
  return (
    <div className="bg-brand-wheat-50">
        <div className="container mx-auto px-4 sm:px-6 py-24">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-wheat-900">The Prismatik Blog</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-wheat-700">
                    Your source for product updates, creative tutorials, AI insights, and inspiring stories from our community of creators.
                </p>
            </div>
            
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post, index) => (
                    // FIX: Pass props individually instead of spreading to avoid type error with 'key' prop.
                    <BlogPostCard
                        key={index}
                        title={post.title}
                        author={post.author}
                        date={post.date}
                        excerpt={post.excerpt}
                        imageUrl={post.imageUrl}
                        href={post.href}
                    />
                ))}
            </div>
        </div>
    </div>
  );
}
