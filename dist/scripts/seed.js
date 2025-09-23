"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Lesson_1 = __importDefault(require("../models/Lesson"));
const Settings_1 = __importDefault(require("../models/Settings"));
dotenv_1.default.config();
const seedLessons = [
    {
        title: 'Getting Started with AI Freelancing',
        summary: 'Learn how to use AI tools to enhance your freelancing career and increase your earning potential.',
        contentMD: `# Getting Started with AI Freelancing

## Introduction
Artificial Intelligence is revolutionizing the freelance economy. By learning to work with AI tools, you can offer more valuable services, work more efficiently, and command higher rates.

## Key AI Tools for Freelancers

### 1. Content Creation Tools
- **ChatGPT**: For writing, brainstorming, and content planning
- **Jasper**: For marketing copy and long-form content
- **Copy.ai**: For social media posts and ad copy

### 2. Design and Visual Tools
- **Midjourney**: For creating stunning images and artwork
- **DALL-E**: For generating custom illustrations
- **Canva AI**: For quick design tasks and templates

### 3. Productivity Tools
- **Notion AI**: For project management and documentation
- **Grammarly**: For writing improvement
- **Otter.ai**: For meeting transcription and notes

## How to Start

1. **Choose Your Niche**: Focus on one area where AI can add value
2. **Learn the Tools**: Master 2-3 AI tools in your chosen niche
3. **Practice**: Create sample projects to build your portfolio
4. **Market Yourself**: Update your profiles to highlight AI skills
5. **Start Small**: Take on smaller projects to build experience

## Pricing Your AI-Enhanced Services

- **Research Market Rates**: See what others charge for similar services
- **Factor in AI Costs**: Include subscription costs in your pricing
- **Value-Based Pricing**: Charge based on the value you provide, not time spent
- **Start 20-30% Higher**: AI skills justify premium pricing

## Common Mistakes to Avoid

- Don't rely entirely on AI - your expertise is still crucial
- Always review and edit AI-generated content
- Be transparent about AI usage with clients
- Keep learning as AI tools evolve rapidly

## Next Steps

1. Sign up for 2-3 AI tools in your niche
2. Create 5 sample projects for your portfolio
3. Update your freelancer profiles
4. Start applying for AI-related projects

Remember: AI is a tool to enhance your skills, not replace your expertise.`,
        estMinutes: 7,
        tags: ['AI', 'Freelancing', 'Tools', 'Career'],
        category: 'AI Freelancing',
        quiz: [
            {
                question: 'What is the first step to start AI freelancing?',
                options: [
                    'Learn all AI tools available',
                    'Choose your niche and focus area',
                    'Start charging premium rates immediately',
                    'Buy expensive AI subscriptions'
                ],
                correctAnswer: 1,
                explanation: 'Choosing a niche helps you focus your learning and become an expert in a specific area where AI can add value.'
            },
            {
                question: 'How should you price AI-enhanced services?',
                options: [
                    'Same as regular services',
                    '20-30% higher than regular services',
                    '50% lower to attract clients',
                    'Based only on AI tool costs'
                ],
                correctAnswer: 1,
                explanation: 'AI skills justify premium pricing, but 20-30% higher is a reasonable starting point that reflects the added value.'
            },
            {
                question: 'What is a common mistake when using AI for freelancing?',
                options: [
                    'Using multiple AI tools',
                    'Relying entirely on AI without human expertise',
                    'Charging premium rates',
                    'Learning new tools regularly'
                ],
                correctAnswer: 1,
                explanation: 'AI should enhance your skills, not replace your expertise. Always review and add your professional touch to AI-generated work.'
            }
        ],
        adSlots: [
            {
                position: 'mid-lesson',
                required: true,
                coinReward: 10
            },
            {
                position: 'post-quiz',
                required: true,
                coinReward: 15
            }
        ],
        isPublished: true
    },
    {
        title: 'Social Media Content Creation Mastery',
        summary: 'Master the art of creating engaging social media content that drives engagement and builds your brand.',
        contentMD: `# Social Media Content Creation Mastery

## The Power of Social Media Content

Social media content creation is one of the most in-demand skills today. With over 4.8 billion social media users worldwide, there's massive opportunity for content creators.

## Content Types That Work

### 1. Educational Content
- How-to tutorials
- Industry tips and insights
- Behind-the-scenes content
- Problem-solving posts

### 2. Entertaining Content
- Memes and humor
- Trending challenges
- User-generated content
- Interactive polls and questions

### 3. Inspirational Content
- Success stories
- Motivational quotes
- Personal journeys
- Community highlights

## Platform-Specific Strategies

### Instagram
- **Feed Posts**: High-quality visuals with engaging captions
- **Stories**: Behind-the-scenes and quick tips
- **Reels**: Short-form video content
- **IGTV**: Longer educational content

### TikTok
- **Trending Sounds**: Use popular audio to increase reach
- **Quick Tutorials**: 15-60 second how-to videos
- **Challenges**: Participate in trending challenges
- **Educational Series**: Break down complex topics

### LinkedIn
- **Professional Insights**: Industry knowledge and experience
- **Career Tips**: Job search and career development
- **Company Updates**: Behind-the-scenes of your business
- **Thought Leadership**: Share your unique perspectives

## Content Creation Process

### 1. Planning
- **Content Calendar**: Plan posts 2-4 weeks in advance
- **Theme Days**: Consistent content themes (e.g., #MotivationMonday)
- **Trend Research**: Stay updated with platform trends
- **Audience Analysis**: Understand what your audience wants

### 2. Creation
- **Batch Content**: Create multiple posts in one session
- **Repurpose Content**: Adapt one piece for multiple platforms
- **Quality Over Quantity**: Better to post less frequently with high quality
- **Brand Consistency**: Maintain consistent voice and visual style

### 3. Optimization
- **Hashtag Research**: Use relevant, trending hashtags
- **Posting Times**: Find when your audience is most active
- **Engagement**: Respond to comments and messages quickly
- **Analytics**: Track performance and adjust strategy

## Tools for Content Creation

### Design Tools
- **Canva**: Easy-to-use design platform
- **Adobe Creative Suite**: Professional design tools
- **Figma**: Collaborative design tool
- **Unsplash/Pexels**: Free stock photos

### Video Tools
- **CapCut**: Mobile video editing
- **InShot**: Quick video editing
- **DaVinci Resolve**: Free professional video editing
- **Loom**: Screen recording and quick videos

### Scheduling Tools
- **Buffer**: Cross-platform scheduling
- **Hootsuite**: Comprehensive social media management
- **Later**: Visual content calendar
- **Sprout Social**: Advanced analytics and scheduling

## Monetization Strategies

### 1. Sponsored Content
- Partner with brands in your niche
- Create authentic, valuable content
- Disclose partnerships transparently
- Build long-term relationships

### 2. Affiliate Marketing
- Promote products you genuinely use
- Share discount codes and links
- Focus on high-converting products
- Track performance and optimize

### 3. Digital Products
- Create online courses
- Sell templates and presets
- Offer consulting services
- Develop apps or tools

### 4. Community Building
- Create paid communities
- Offer exclusive content
- Host virtual events
- Provide personalized advice

## Common Mistakes to Avoid

- **Inconsistent Posting**: Regular posting builds audience trust
- **Ignoring Analytics**: Data helps improve your strategy
- **Copying Others**: Find your unique voice and style
- **Selling Too Much**: Focus on value first, sales second
- **Ignoring Comments**: Engagement builds community

## Building Your Personal Brand

### 1. Define Your Niche
- Choose a specific area of expertise
- Become known for something specific
- Share your unique perspective
- Build authority in your field

### 2. Tell Your Story
- Share your journey and experiences
- Be authentic and vulnerable
- Connect with your audience emotionally
- Show both successes and struggles

### 3. Provide Value
- Educate your audience
- Solve their problems
- Share actionable tips
- Be generous with your knowledge

## Next Steps

1. **Choose Your Platforms**: Focus on 2-3 platforms initially
2. **Define Your Niche**: Pick a specific area of expertise
3. **Create Content Calendar**: Plan your first month of content
4. **Start Creating**: Begin with simple, valuable content
5. **Engage Actively**: Respond to comments and build relationships

Remember: Consistency and authenticity are key to social media success. Start small, stay consistent, and always focus on providing value to your audience.`,
        estMinutes: 8,
        tags: ['Social Media', 'Content Creation', 'Marketing', 'Branding'],
        category: 'Content Creation',
        quiz: [
            {
                question: 'What is the most important factor for social media success?',
                options: [
                    'Posting multiple times per day',
                    'Using the most expensive tools',
                    'Consistency and authenticity',
                    'Having a large budget'
                ],
                correctAnswer: 2,
                explanation: 'Consistency builds audience trust and authenticity helps you connect with your audience on a deeper level.'
            },
            {
                question: 'How many platforms should you focus on when starting?',
                options: [
                    'All available platforms',
                    '2-3 platforms initially',
                    'Only one platform',
                    'As many as possible'
                ],
                correctAnswer: 1,
                explanation: 'Focusing on 2-3 platforms allows you to create quality content and build a strong presence without spreading yourself too thin.'
            },
            {
                question: 'What should be your primary focus when creating content?',
                options: [
                    'Selling products immediately',
                    'Getting viral content',
                    'Providing value to your audience',
                    'Using trending hashtags'
                ],
                correctAnswer: 2,
                explanation: 'Providing value builds trust and loyalty, which leads to better engagement and long-term success.'
            }
        ],
        adSlots: [
            {
                position: 'mid-lesson',
                required: true,
                coinReward: 10
            },
            {
                position: 'post-quiz',
                required: true,
                coinReward: 15
            }
        ],
        isPublished: true
    },
    {
        title: 'Social Commerce: Selling Through Social Media',
        summary: 'Learn how to turn your social media presence into a sales machine with proven social commerce strategies.',
        contentMD: `# Social Commerce: Selling Through Social Media

## What is Social Commerce?

Social commerce is the process of selling products or services directly through social media platforms. It combines social media marketing with e-commerce to create a seamless shopping experience.

## Why Social Commerce Works

### 1. Trust and Social Proof
- People trust recommendations from friends and influencers
- Social proof through likes, comments, and shares
- User-generated content builds credibility
- Community-driven purchasing decisions

### 2. Convenience
- No need to leave the social platform
- One-click purchasing
- Mobile-optimized experience
- Integrated payment systems

### 3. Discovery
- Algorithm-driven product discovery
- Visual-first shopping experience
- Personalized recommendations
- Trending product features

## Platform-Specific Strategies

### Instagram Shopping
- **Product Tags**: Tag products in posts and stories
- **Shopping Stickers**: Use in stories for quick purchases
- **IGTV Shopping**: Longer-form product demonstrations
- **Live Shopping**: Real-time product showcases

### Facebook Marketplace
- **Local Selling**: Connect with nearby customers
- **Group Selling**: Leverage Facebook groups
- **Event Promotion**: Use events to showcase products
- **Messenger Integration**: Direct customer communication

### TikTok Shop
- **Product Links**: Add shopping links to videos
- **Live Shopping**: Real-time product demonstrations
- **Creator Partnerships**: Collaborate with influencers
- **Trending Products**: Leverage viral trends

### Pinterest Shopping
- **Product Pins**: Rich pins with pricing and availability
- **Shopping Lists**: Curated product collections
- **Visual Search**: Let users find products by image
- **Seasonal Campaigns**: Align with shopping seasons

## Building Your Social Commerce Strategy

### 1. Choose Your Products
- **High Visual Appeal**: Products that look great in photos/videos
- **Clear Value Proposition**: Easy to understand benefits
- **Appropriate Price Point**: Match your audience's budget
- **Easy to Ship**: Consider logistics and shipping costs

### 2. Create Compelling Content
- **Product Photography**: High-quality, lifestyle images
- **User-Generated Content**: Encourage customer photos
- **Behind-the-Scenes**: Show your process and story
- **Educational Content**: Teach how to use your products

### 3. Optimize for Each Platform
- **Instagram**: Focus on aesthetics and lifestyle
- **TikTok**: Create entertaining, educational content
- **Pinterest**: Optimize for search and discovery
- **Facebook**: Leverage community and groups

## Content Types That Convert

### 1. Product Demonstrations
- Show products in action
- Highlight key features and benefits
- Address common objections
- Create urgency with limited-time offers

### 2. Customer Testimonials
- Share real customer experiences
- Include photos and videos from customers
- Highlight specific benefits and results
- Build social proof and credibility

### 3. Behind-the-Scenes Content
- Show your creation process
- Introduce your team and values
- Share your story and mission
- Build emotional connection

### 4. Educational Content
- Teach how to use your products
- Share tips and tricks
- Answer common questions
- Position yourself as an expert

## Conversion Optimization

### 1. Clear Call-to-Actions
- Use action-oriented language
- Make buttons and links prominent
- Create urgency with time-sensitive offers
- Test different CTA variations

### 2. Streamlined Checkout
- Minimize steps in the buying process
- Offer multiple payment options
- Save customer information for future purchases
- Provide clear shipping and return information

### 3. Social Proof
- Display customer reviews and ratings
- Show sales numbers and popularity
- Feature user-generated content
- Highlight media mentions and awards

### 4. Mobile Optimization
- Ensure fast loading times
- Optimize for mobile screens
- Use large, easy-to-tap buttons
- Test on various devices

## Building Your Audience

### 1. Consistent Branding
- Use consistent colors, fonts, and style
- Develop a recognizable voice and tone
- Create a cohesive visual identity
- Maintain brand consistency across platforms

### 2. Engage Actively
- Respond to comments and messages quickly
- Ask questions to encourage interaction
- Share user-generated content
- Host live Q&A sessions

### 3. Provide Value
- Share helpful tips and advice
- Create educational content
- Offer exclusive discounts and deals
- Build a community around your brand

### 4. Collaborate
- Partner with micro-influencers
- Cross-promote with complementary brands
- Participate in industry events
- Join relevant communities and groups

## Measuring Success

### Key Metrics to Track
- **Engagement Rate**: Likes, comments, shares per post
- **Click-Through Rate**: Clicks on product links
- **Conversion Rate**: Visitors who make a purchase
- **Average Order Value**: Revenue per transaction
- **Customer Lifetime Value**: Total value of a customer

### Tools for Analytics
- **Platform Analytics**: Native insights from each platform
- **Google Analytics**: Track website traffic and conversions
- **Social Media Management Tools**: Buffer, Hootsuite, Sprout Social
- **E-commerce Analytics**: Shopify, WooCommerce, BigCommerce

## Common Mistakes to Avoid

- **Selling Too Hard**: Focus on value and relationship building
- **Ignoring Mobile**: Most social commerce happens on mobile
- **Poor Product Photos**: Invest in high-quality visuals
- **Inconsistent Posting**: Regular content builds trust
- **Not Engaging**: Respond to comments and messages
- **Ignoring Analytics**: Use data to improve your strategy

## Getting Started

1. **Choose Your Platform**: Start with one platform you know well
2. **Select Your Products**: Pick 3-5 products to start with
3. **Create Content Calendar**: Plan your posts and promotions
4. **Set Up Analytics**: Track your performance from day one
5. **Engage Actively**: Build relationships with your audience
6. **Iterate and Improve**: Use data to refine your strategy

Remember: Social commerce is about building relationships first, selling second. Focus on providing value and building trust, and the sales will follow naturally.`,
        estMinutes: 9,
        tags: ['Social Commerce', 'E-commerce', 'Social Media', 'Sales'],
        category: 'Social Commerce',
        quiz: [
            {
                question: 'What is the most important factor in social commerce success?',
                options: [
                    'Having the lowest prices',
                    'Building relationships and trust first',
                    'Posting multiple times per day',
                    'Using all available platforms'
                ],
                correctAnswer: 1,
                explanation: 'Social commerce is about building relationships first, selling second. Trust and relationships drive sales more than anything else.'
            },
            {
                question: 'Which type of content typically converts best in social commerce?',
                options: [
                    'Product photos only',
                    'Educational and value-driven content',
                    'Promotional posts only',
                    'Random personal posts'
                ],
                correctAnswer: 1,
                explanation: 'Educational content builds trust and positions you as an expert, making people more likely to buy from you.'
            },
            {
                question: 'What should you focus on when starting social commerce?',
                options: [
                    'All social media platforms at once',
                    'One platform you know well',
                    'Only paid advertising',
                    'Viral content only'
                ],
                correctAnswer: 1,
                explanation: 'Starting with one platform allows you to master it before expanding, leading to better results and less overwhelm.'
            }
        ],
        adSlots: [
            {
                position: 'mid-lesson',
                required: true,
                coinReward: 10
            },
            {
                position: 'post-quiz',
                required: true,
                coinReward: 15
            }
        ],
        isPublished: true
    },
    {
        title: 'Digital Products: Create and Sell Online',
        summary: 'Learn how to create and sell digital products like ebooks, courses, and templates for passive income.',
        contentMD: `# Digital Products: Create and Sell Online

## What are Digital Products?

Digital products are intangible goods that can be created once and sold repeatedly without additional production costs. They offer excellent profit margins and can generate passive income.

## Types of Digital Products

### 1. Educational Content
- **Online Courses**: Comprehensive learning programs
- **E-books**: Written guides and tutorials
- **Webinars**: Live or recorded presentations
- **Tutorials**: Step-by-step video guides

### 2. Creative Assets
- **Templates**: Design templates for various purposes
- **Graphics**: Stock photos, illustrations, icons
- **Fonts**: Custom typefaces and lettering
- **Music**: Background music and sound effects

### 3. Software and Tools
- **Mobile Apps**: Games, utilities, productivity tools
- **Web Applications**: SaaS products and tools
- **Plugins**: Extensions for existing platforms
- **Scripts**: Automation and utility scripts

### 4. Membership Content
- **Exclusive Communities**: Paid access groups
- **Premium Content**: Behind-the-scenes access
- **Coaching Programs**: Personalized guidance
- **Mastermind Groups**: Peer learning communities

## Why Digital Products Work

### 1. Scalability
- Create once, sell unlimited times
- No inventory management
- Automated delivery
- Global reach without shipping

### 2. High Profit Margins
- No physical production costs
- Minimal ongoing expenses
- High-value pricing potential
- Recurring revenue opportunities

### 3. Passive Income
- Automated sales and delivery
- Works while you sleep
- Multiple income streams
- Location independence

## Choosing Your Digital Product

### 1. Identify Your Expertise
- What skills do you have?
- What problems can you solve?
- What knowledge can you share?
- What experiences can you teach?

### 2. Research Market Demand
- Use Google Trends and keyword research
- Check competitor products and pricing
- Survey your audience
- Look for gaps in the market

### 3. Validate Your Idea
- Create a simple version first
- Test with a small audience
- Gather feedback and iterate
- Refine before full launch

## Creating Your Digital Product

### 1. Planning Phase
- **Define Learning Outcomes**: What will customers achieve?
- **Create Content Outline**: Structure your content logically
- **Set Timeline**: Break down creation into manageable tasks
- **Gather Resources**: Collect materials and references

### 2. Content Creation
- **Start with Quality**: Invest in good equipment and software
- **Be Consistent**: Maintain consistent style and quality
- **Keep It Practical**: Focus on actionable, useful content
- **Test Everything**: Ensure all links and downloads work

### 3. Packaging and Delivery
- **Professional Presentation**: Use good design and branding
- **Clear Instructions**: Make it easy for customers to use
- **Multiple Formats**: Offer various file types when possible
- **Support Materials**: Include bonuses and resources

## Pricing Your Digital Products

### 1. Value-Based Pricing
- Price based on the value you provide
- Consider the time and money customers save
- Factor in the transformation you offer
- Research competitor pricing

### 2. Pricing Strategies
- **Low-Ticket Items**: $5-50 for templates, guides
- **Mid-Ticket Items**: $50-500 for courses, ebooks
- **High-Ticket Items**: $500+ for coaching, masterminds
- **Tiered Pricing**: Multiple price points for different needs

### 3. Testing and Optimization
- Start with a reasonable price
- A/B test different price points
- Monitor conversion rates
- Adjust based on feedback and sales

## Sales and Marketing

### 1. Build Your Audience
- Create valuable free content
- Engage on social media
- Build an email list
- Collaborate with others

### 2. Content Marketing
- Write blog posts about your topic
- Create free resources and tools
- Share behind-the-scenes content
- Provide value before asking for sales

### 3. Launch Strategy
- **Pre-Launch**: Build anticipation and email list
- **Launch Week**: Intensive promotion and engagement
- **Post-Launch**: Continue marketing and gather feedback
- **Evergreen**: Ongoing marketing and optimization

## Platforms for Selling

### 1. Your Own Website
- **Shopify**: Easy e-commerce setup
- **WooCommerce**: WordPress-based solution
- **Gumroad**: Simple digital product platform
- **SendOwl**: Digital product focused

### 2. Marketplaces
- **Etsy**: Great for creative digital products
- **Creative Market**: Design-focused marketplace
- **Udemy**: Online course platform
- **Skillshare**: Creative learning platform

### 3. Course Platforms
- **Teachable**: Comprehensive course platform
- **Thinkific**: User-friendly course creation
- **Kajabi**: All-in-one marketing platform
- **Podia**: Simple course and community platform

## Customer Support and Success

### 1. Clear Instructions
- Provide step-by-step guides
- Include troubleshooting tips
- Offer multiple contact methods
- Create FAQ sections

### 2. Regular Updates
- Keep content current and relevant
- Add new features and bonuses
- Respond to customer feedback
- Improve based on usage data

### 3. Community Building
- Create customer-only groups
- Host regular Q&A sessions
- Share exclusive content
- Encourage user-generated content

## Scaling Your Digital Product Business

### 1. Create Product Suites
- Develop related products
- Cross-sell and upsell
- Create bundles and packages
- Build a product ecosystem

### 2. Automate Processes
- Use email marketing automation
- Set up automated delivery
- Create self-service support
- Implement affiliate programs

### 3. Expand Your Reach
- Translate content for global markets
- Partner with influencers
- Create licensing opportunities
- Develop white-label versions

## Common Mistakes to Avoid

- **Perfectionism**: Launch before it's perfect
- **No Market Research**: Validate demand first
- **Poor Quality**: Invest in good production
- **No Marketing Plan**: Create before you build
- **Ignoring Feedback**: Listen to your customers
- **No Support System**: Help customers succeed

## Getting Started

1. **Choose Your Niche**: Pick something you're passionate about
2. **Research the Market**: Validate demand and competition
3. **Create a Simple Product**: Start with something basic
4. **Test with Your Network**: Get feedback from friends/family
5. **Launch and Iterate**: Improve based on real feedback
6. **Scale Gradually**: Add more products and features over time

Remember: The best digital products solve real problems for real people. Focus on providing genuine value, and the sales will follow naturally.`,
        estMinutes: 10,
        tags: ['Digital Products', 'Passive Income', 'Online Business', 'E-commerce'],
        category: 'Digital Products',
        quiz: [
            {
                question: 'What is the main advantage of digital products?',
                options: [
                    'They are always free to create',
                    'They can be sold unlimited times without additional production costs',
                    'They require no marketing',
                    'They sell themselves automatically'
                ],
                correctAnswer: 1,
                explanation: 'Digital products can be created once and sold repeatedly, making them highly scalable and profitable.'
            },
            {
                question: 'What should you do before creating a digital product?',
                options: [
                    'Start creating immediately',
                    'Research market demand and validate your idea',
                    'Copy what others are doing',
                    'Focus only on high-ticket items'
                ],
                correctAnswer: 1,
                explanation: 'Market research and validation help ensure there is demand for your product before you invest time creating it.'
            },
            {
                question: 'What is the best pricing strategy for digital products?',
                options: [
                    'Always price as low as possible',
                    'Price based on the value you provide',
                    'Copy competitor prices exactly',
                    'Price based only on creation time'
                ],
                correctAnswer: 1,
                explanation: 'Value-based pricing considers the transformation and benefits you provide, not just the time it took to create.'
            }
        ],
        adSlots: [
            {
                position: 'mid-lesson',
                required: true,
                coinReward: 10
            },
            {
                position: 'post-quiz',
                required: true,
                coinReward: 15
            }
        ],
        isPublished: true
    },
    {
        title: 'Affiliate Marketing Basics',
        summary: 'Learn how to earn commissions by promoting other people\'s products and services through affiliate marketing.',
        contentMD: `# Affiliate Marketing Basics

## What is Affiliate Marketing?

Affiliate marketing is a performance-based marketing strategy where you earn commissions by promoting other people's products or services. You get paid when someone makes a purchase through your unique affiliate link.

## How Affiliate Marketing Works

### 1. The Process
- **Merchant**: Creates a product or service
- **Affiliate Network**: Connects merchants with affiliates
- **Affiliate (You)**: Promotes the product to your audience
- **Customer**: Makes a purchase through your link
- **Commission**: You earn a percentage of the sale

### 2. Key Players
- **Merchants**: Companies selling products/services
- **Affiliate Networks**: Platforms that connect merchants and affiliates
- **Affiliates**: Marketers who promote products
- **Customers**: People who buy through affiliate links

## Types of Affiliate Marketing

### 1. Content-Based
- **Blog Posts**: Write reviews and tutorials
- **YouTube Videos**: Create product demonstrations
- **Social Media**: Share recommendations
- **Email Marketing**: Send product recommendations

### 2. Search-Based
- **SEO Content**: Optimize for search engines
- **Google Ads**: Pay-per-click advertising
- **Comparison Sites**: Compare different products
- **Review Sites**: Detailed product reviews

### 3. Social Media
- **Instagram**: Visual product showcases
- **TikTok**: Short-form product videos
- **Facebook**: Community recommendations
- **Pinterest**: Visual discovery and inspiration

## Getting Started with Affiliate Marketing

### 1. Choose Your Niche
- **Pick Something You're Passionate About**: Easier to create authentic content
- **Research Market Size**: Ensure there's enough demand
- **Check Competition**: See what others are doing
- **Identify Problems**: Find pain points you can address

### 2. Build Your Platform
- **Website/Blog**: Your home base for content
- **Email List**: Direct communication with audience
- **Social Media**: Reach and engage your audience
- **YouTube Channel**: Video content and tutorials

### 3. Find Affiliate Programs
- **Direct Programs**: Apply directly with companies
- **Affiliate Networks**: Join platforms like ShareASale, CJ Affiliate
- **Amazon Associates**: Start with the largest program
- **Niche-Specific**: Look for programs in your industry

## Choosing the Right Products

### 1. Relevance
- **Match Your Audience**: Products your audience actually wants
- **Align with Your Brand**: Consistent with your values
- **Quality Products**: Only promote things you believe in
- **Good Reputation**: Research company and product reviews

### 2. Commission Structure
- **Percentage-Based**: Earn a % of each sale
- **Fixed Amount**: Earn a set amount per sale
- **Recurring Commissions**: Earn on subscription renewals
- **Tiered Commissions**: Higher rates for more sales

### 3. Conversion Potential
- **High-Converting Products**: Products that sell well
- **Reasonable Prices**: Not too expensive for your audience
- **Clear Value Proposition**: Easy to understand benefits
- **Good Sales Pages**: Well-designed product pages

## Creating Effective Affiliate Content

### 1. Honest Reviews
- **Use the Product**: Actually try what you're promoting
- **Share Real Experience**: Be honest about pros and cons
- **Include Screenshots**: Show the product in action
- **Update Regularly**: Keep reviews current

### 2. Tutorial Content
- **How-To Guides**: Teach people how to use products
- **Step-by-Step Instructions**: Make it easy to follow
- **Video Demonstrations**: Show products in action
- **Troubleshooting**: Help with common problems

### 3. Comparison Content
- **Product Comparisons**: Compare similar products
- **Feature Breakdowns**: Highlight key differences
- **Price Analysis**: Show value for money
- **Recommendation Matrix**: Help people choose

## Building Trust and Credibility

### 1. Transparency
- **Disclose Affiliate Relationships**: Always mention when you earn commissions
- **Be Honest**: Share both positive and negative experiences
- **Admit Mistakes**: Own up to wrong recommendations
- **Update Content**: Keep information current

### 2. Value-First Approach
- **Educate First**: Provide value before promoting
- **Solve Problems**: Address real pain points
- **Build Relationships**: Connect with your audience
- **Be Consistent**: Regular, helpful content

### 3. Social Proof
- **Share Results**: Show how products helped you
- **Customer Testimonials**: Include user experiences
- **Case Studies**: Detailed success stories
- **Community Engagement**: Respond to comments and questions

## Legal and Ethical Considerations

### 1. Disclosure Requirements
- **FTC Guidelines**: Must disclose affiliate relationships
- **Clear Language**: Use simple, obvious disclosure
- **Prominent Placement**: Make disclosures visible
- **Consistent Application**: Disclose on all platforms

### 2. Ethical Practices
- **Only Promote Quality**: Don't promote bad products for money
- **Honest Reviews**: Share real experiences, not fake ones
- **Respect Privacy**: Don't spam or harass people
- **Follow Platform Rules**: Abide by terms of service

## Tracking and Optimization

### 1. Analytics Tools
- **Google Analytics**: Track website traffic and conversions
- **Affiliate Dashboards**: Monitor clicks and sales
- **UTM Parameters**: Track specific campaigns
- **Heat Mapping**: See how users interact with content

### 2. Key Metrics
- **Click-Through Rate**: Percentage of people who click your links
- **Conversion Rate**: Percentage who make a purchase
- **Average Order Value**: Revenue per transaction
- **Return on Investment**: Profit vs. time/money invested

### 3. Optimization Strategies
- **A/B Testing**: Test different headlines, images, calls-to-action
- **Content Updates**: Refresh old content regularly
- **Link Placement**: Test different positions for affiliate links
- **Audience Feedback**: Listen to comments and questions

## Scaling Your Affiliate Business

### 1. Diversify Your Income
- **Multiple Programs**: Don't rely on just one affiliate program
- **Different Product Types**: Mix physical and digital products
- **Various Price Points**: Promote both low and high-ticket items
- **Recurring Revenue**: Focus on subscription-based products

### 2. Build Your Authority
- **Consistent Content**: Regular, valuable content builds trust
- **Expertise Development**: Become known as an expert in your niche
- **Community Building**: Create engaged, loyal followers
- **Networking**: Connect with other affiliates and industry leaders

### 3. Automate and Systematize
- **Content Templates**: Create reusable content frameworks
- **Email Sequences**: Automated follow-up campaigns
- **Social Media Scheduling**: Plan and schedule posts
- **Analytics Dashboards**: Monitor performance automatically

## Common Mistakes to Avoid

- **Promoting Everything**: Focus on relevant, quality products
- **No Disclosure**: Always disclose affiliate relationships
- **Spammy Content**: Focus on value, not just sales
- **Ignoring Analytics**: Use data to improve performance
- **No Strategy**: Plan your content and promotion approach
- **Impatience**: Building trust and sales takes time

## Getting Started

1. **Choose Your Niche**: Pick something you're passionate about
2. **Build Your Platform**: Create a website and social media presence
3. **Find Affiliate Programs**: Research and apply to relevant programs
4. **Create Valuable Content**: Focus on helping your audience
5. **Track and Optimize**: Monitor performance and improve
6. **Scale Gradually**: Add more products and strategies over time

Remember: Successful affiliate marketing is about building trust and providing value. Focus on genuinely helping your audience, and the commissions will follow naturally.`,
        estMinutes: 8,
        tags: ['Affiliate Marketing', 'Passive Income', 'Marketing', 'E-commerce'],
        category: 'Affiliate Basics',
        quiz: [
            {
                question: 'What is the most important factor in successful affiliate marketing?',
                options: [
                    'Promoting as many products as possible',
                    'Building trust and providing value to your audience',
                    'Using the highest commission products',
                    'Posting affiliate links everywhere'
                ],
                correctAnswer: 1,
                explanation: 'Building trust through valuable content is the foundation of successful affiliate marketing. People buy from those they trust.'
            },
            {
                question: 'What must you always do when promoting affiliate products?',
                options: [
                    'Only promote expensive products',
                    'Disclose your affiliate relationships',
                    'Post links on every social media platform',
                    'Use only positive language'
                ],
                correctAnswer: 1,
                explanation: 'FTC guidelines require clear disclosure of affiliate relationships. This builds trust and is legally required.'
            },
            {
                question: 'What should you focus on when choosing affiliate products?',
                options: [
                    'Highest commission rates only',
                    'Products that are relevant to your audience and that you believe in',
                    'Products with the most marketing materials',
                    'Products from the biggest companies'
                ],
                correctAnswer: 1,
                explanation: 'Choose products that match your audience\'s needs and that you genuinely believe in. This leads to better conversions and maintains your credibility.'
            }
        ],
        adSlots: [
            {
                position: 'mid-lesson',
                required: true,
                coinReward: 10
            },
            {
                position: 'post-quiz',
                required: true,
                coinReward: 15
            }
        ],
        isPublished: true
    }
];
const seedSettings = {
    minPayoutUsd: 5,
    payoutCooldownHours: 48,
    maxDailyEarnUsd: 0.5,
    safetyMargin: 0.6,
    eCPM_USD: 1.5,
    impressionsToday: 0,
    appPepper: 'learn_earn_app_pepper_2024',
    emulatorPayouts: false,
    coinToUsdRate: 0.001
};
async function seedDatabase() {
    try {
        // Connect to MongoDB
        const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/learn_earn';
        await mongoose_1.default.connect(mongoUrl);
        console.log('Connected to MongoDB');
        // Clear existing data
        await Lesson_1.default.deleteMany({});
        await Settings_1.default.deleteMany({});
        console.log('Cleared existing data');
        // Seed lessons
        await Lesson_1.default.insertMany(seedLessons);
        console.log(`Seeded ${seedLessons.length} lessons`);
        // Seed settings
        await Settings_1.default.create(seedSettings);
        console.log('Seeded settings');
        console.log('Database seeded successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}
seedDatabase();
//# sourceMappingURL=seed.js.map