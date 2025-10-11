// WordPress API configuration
const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://your-wordpress-site.com/wp-json/wp/v2';

// WordPress Post types
export interface WordPressPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  featured_media: number;
  author: number;
  categories: number[];
  tags: number[];
  _links: {
    'wp:featuredmedia'?: Array<{
      href: string;
    }>;
  };
}

export interface WordPressMedia {
  id: number;
  source_url: string;
  alt_text: string;
  title: {
    rendered: string;
  };
  media_details: {
    width: number;
    height: number;
    sizes: {
      [key: string]: {
        source_url: string;
        width: number;
        height: number;
      };
    };
  };
}

// Fetch all posts
export async function getAllPosts(): Promise<WordPressPost[]> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/posts?_embed=wp:featuredmedia&per_page=100&status=publish`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

// Fetch posts with pagination
export async function getPosts(page: number = 1, perPage: number = 10): Promise<{
  posts: WordPressPost[];
  totalPosts: number;
  totalPages: number;
}> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/posts?_embed=wp:featuredmedia&page=${page}&per_page=${perPage}&status=publish`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    const totalPosts = parseInt(response.headers.get('X-WP-Total') || '0');
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '0');
    
    return {
      posts,
      totalPosts,
      totalPages
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      posts: [],
      totalPosts: 0,
      totalPages: 0
    };
  }
}

// Fetch single post by slug
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/posts?slug=${slug}&_embed=wp:featuredmedia`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    return posts.length > 0 ? posts[0] : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

// Fetch featured media
export async function getFeaturedMedia(mediaId: number): Promise<WordPressMedia | null> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/media/${mediaId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const media = await response.json();
    return media;
  } catch (error) {
    console.error('Error fetching media:', error);
    return null;
  }
}

// Get featured image URL from embedded data
export function getFeaturedImageUrl(post: WordPressPost, size: string = 'medium_large'): string | null {
  if (post._embedded?.['wp:featuredmedia']?.[0]) {
    const media = post._embedded['wp:featuredmedia'][0];
    
    // Try to get specific size, fallback to source_url
    if (media.media_details?.sizes?.[size]) {
      return media.media_details.sizes[size].source_url;
    }
    
    return media.source_url || null;
  }
  
  return null;
}

// Clean and format excerpt
export function cleanExcerpt(excerpt: string): string {
  return excerpt
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\[&hellip;\]/g, '...') // Replace WordPress ellipsis
    .trim();
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}