import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const ownerEmail = process.env.OWNER_EMAIL;

const generateOwnerEmailHTML = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background-color: white; border-radius: 10px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #1e40af; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; }
        .info { margin: 10px 0; padding: 10px; background-color: #f0f0f0; border-radius: 5px; }
        .info strong { display: inline-block; width: 120px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Inquiry from Horizon Travel Hub</h1>
        </div>
        <div class="content">
          <p>You have received a new inquiry from your website. Here are the details:</p>
          
          <div class="info">
            <strong>Name:</strong> ${data.name}
          </div>
          
          <div class="info">
            <strong>Email:</strong> ${data.email}
          </div>
          
          <div class="info">
            <strong>Phone:</strong> ${data.phone}
          </div>
          
          <div class="info">
            <strong>Service Needed:</strong> ${data.service}
          </div>
          
          <div class="info">
            <strong>Message:</strong> ${data.message}
          </div>
          
          <p>Please respond to this inquiry as soon as possible.</p>
          
          <p>
            <a href="mailto:${data.email}" class="button">Reply to ${data.name}</a>
          </p>
        </div>
        <div class="footer">
          <p>Horizon Travel Hub - Your Gateway to the World</p>
          <p>Powered by Nodemailer</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const generateUserEmailHTML = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background-color: white; border-radius: 10px; padding: 20px; max-width: 600px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #10b981; color: white; padding: 15px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 20px; }
        .info { margin: 10px 0; padding: 10px; background-color: #f0f0f0; border-radius: 5px; }
        .info strong { display: inline-block; width: 120px; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        .button { display: inline-block; background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Thank You for Your Inquiry!</h1>
        </div>
        <div class="content">
          <p>Dear ${data.name},</p>
          
          <p>Thank you for choosing Horizon Travel Hub! We have received your inquiry and our team will get back to you within 24-48 hours.</p>
          
          <h3>Your Inquiry Details:</h3>
          
          <div class="info">
            <strong>Name:</strong> ${data.name}
          </div>
          
          <div class="info">
            <strong>Email:</strong> ${data.email}
          </div>
          
          <div class="info">
            <strong>Phone:</strong> ${data.phone}
          </div>
          
          <div class="info">
            <strong>Service Needed:</strong> ${data.service}
          </div>
          
          <div class="info">
            <strong>Message:</strong> ${data.message}
          </div>
          
          <p>Our team of travel experts is working on your request and will contact you shortly with personalized assistance.</p>
          
          <p>If you have any urgent questions, please feel free to call us at +91 12345 67890 or email us directly at ${ownerEmail}.</p>
          
          <p>
            <a href="https://horizontravelhub.com" class="button">Visit Our Website</a>
          </p>
        </div>
        <div class="footer">
          <p>Horizon Travel Hub - Your Gateway to the World</p>
          <p>Powered by Nodemailer</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// API endpoint to fetch blog posts from Supabase
app.get('/api/blogs', async (req, res) => {
  try {
    console.log('Attempting to fetch posts from Supabase');
    
    const { data, error } = await supabase
      .from('wordpress_posts')
      .select('*')
      .order('date', { ascending: false });

    console.log('Supabase response data:', data);
    console.log('Supabase response error:', error);

    if (error) {
      console.error('Error fetching blog posts from Supabase:', error);
      return res.status(500).json({ error: 'Failed to fetch blog posts' });
    }

    // Transform data to match frontend format
    const transformedPosts = data.map(post => {
      // Parse category names from JSON string or use default
      let category = 'Travel';
      if (post.category_names) {
        try {
          const categoryNames = JSON.parse(post.category_names.replace(/'/g, '"'));
          if (Array.isArray(categoryNames) && categoryNames.length > 0) {
            category = categoryNames[0];
          }
        } catch (e) {
          console.error('Error parsing category names:', e);
        }
      } else if (post.categories) {
        try {
          const categoryIds = JSON.parse(post.categories.replace(/'/g, '"'));
          if (Array.isArray(categoryIds) && categoryIds.length > 0) {
            category = 'Travel'; // Default if we just have IDs
          }
        } catch (e) {
          console.error('Error parsing categories:', e);
        }
      }

      return {
        id: post.slug || post.id.toString(),
        image: post.featured_image && !post.featured_image.includes('wp-json') ? post.featured_image : `https://picsum.photos/seed/blog${post.id}/800/450`,
        category: category,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        author: post.author_name || 'Horizon Travel Hub Team',
        date: new Date(post.date || post.modified).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        readTime: `${Math.ceil((post.content || '').length / 200)} min read`
      };
    });

    res.status(200).json(transformedPosts);
  } catch (error) {
    console.error('Error in /api/blogs endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint to fetch a single blog post by slug or id
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    console.log('Fetching post with slug:', slug);
    
    // First try to find by slug
    let { data, error } = await supabase
      .from('wordpress_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    // If not found by slug, try to find by id
    if (error || !data) {
      console.log('Not found by slug, trying by id');
      const numericId = parseInt(slug);
      if (!isNaN(numericId)) {
        const idResult = await supabase
          .from('wordpress_posts')
          .select('*')
          .eq('id', numericId)
          .single();
        data = idResult.data;
        error = idResult.error;
      }
    }

    if (error || !data) {
      console.error('Error fetching blog post from Supabase:', error);
      return res.status(404).json({ error: 'Blog post not found' });
    }

    console.log('Found post:', data.title);

    // Transform data to match frontend format
    let category = 'Travel';
    if (data.category_names) {
      try {
        const categoryNames = JSON.parse(data.category_names.replace(/'/g, '"'));
        if (Array.isArray(categoryNames) && categoryNames.length > 0) {
          category = categoryNames[0];
        }
      } catch (e) {
        console.error('Error parsing category names:', e);
      }
    } else if (data.categories) {
      try {
        const categoryIds = JSON.parse(data.categories.replace(/'/g, '"'));
        if (Array.isArray(categoryIds) && categoryIds.length > 0) {
          category = 'Travel'; // Default if we just have IDs
        }
      } catch (e) {
        console.error('Error parsing categories:', e);
      }
    }

    const transformedPost = {
      id: data.slug || data.id.toString(),
      image: data.featured_image && !data.featured_image.includes('wp-json') ? data.featured_image : `https://picsum.photos/seed/blog${data.id}/800/450`,
      category: category,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      author: data.author_name || 'Horizon Travel Hub Team',
      date: new Date(data.date || data.modified).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      readTime: `${Math.ceil((data.content || '').length / 200)} min read`
    };

    res.status(200).json(transformedPost);
  } catch (error) {
    console.error('Error in /api/blogs/:slug endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    const mailOptionsToOwner = {
      from: process.env.SMTP_USER,
      to: ownerEmail,
      subject: `New Inquiry from ${name} - Horizon Travel Hub`,
      html: generateOwnerEmailHTML({ name, email, phone, service, message }),
    };

    const mailOptionsToUser = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Thank You for Your Inquiry - Horizon Travel Hub',
      html: generateUserEmailHTML({ name, email, phone, service, message }),
    };

    await transporter.sendMail(mailOptionsToOwner);
    await transporter.sendMail(mailOptionsToUser);

    res.status(200).json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).json({ error: 'Failed to send emails' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Horizon Travel Hub API server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});